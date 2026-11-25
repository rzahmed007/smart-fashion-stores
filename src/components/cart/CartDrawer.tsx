import { Link, useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Heart, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { catalogService } from '@/services/catalogService';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/utils/format';

export function CartDrawer() {
  const navigate = useNavigate();
  const { isCartOpen, closeCart } = useUIStore();
  const { items, updateQuantity, removeItem } = useCartStore();
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const wishlistIds = useWishlistStore((s) => s.productIds);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const mrpTotal = items.reduce(
    (sum, item) => sum + (item.originalPrice ?? item.price) * item.quantity,
    0
  );
  const discountTotal = Math.max(0, mrpTotal - subtotal);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleMoveToWishlist = (itemId: string, productId: string) => {
    if (!wishlistIds.includes(productId)) {
      toggleWishlist(productId);
    }
    removeItem(itemId);
  };

  return (
    <Dialog.Root open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-ivory border-l border-border shadow-xl focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-white">
            <div>
              <Dialog.Title className="font-serif text-2xl font-medium text-ink">
                Shopping Bag
              </Dialog.Title>
              <Dialog.Description className="font-sans text-xs text-ink-secondary">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close shopping bag"
              className="h-9 w-9 rounded-[4px] border border-border flex items-center justify-center text-ink hover:border-brand-green hover:text-brand-green transition-colors"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="h-14 w-14 rounded-full border border-border bg-white flex items-center justify-center text-brand-green mb-4">
                  <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl font-medium text-ink">Your bag is empty</h3>
                <p className="mt-1.5 max-w-xs font-sans text-sm text-ink-secondary">
                  Explore our handcrafted salwar suits, kurtis, and festive Chanderi silhouettes.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  className="mt-6"
                  onClick={() => {
                    closeCart();
                    navigate('/new-arrivals');
                  }}
                >
                  Explore New Arrivals
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => {
                  const catalogProd = catalogService.getProductBySlug(item.slug);
                  const maxStock =
                    catalogProd?.sizes.find((s) => s.size === item.selectedSize)?.stockCount ??
                    10;
                  return (
                    <li
                      key={item.id}
                      className="flex gap-3.5 bg-white border border-border rounded-[4px] p-3"
                    >
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="w-20 aspect-[3/4] shrink-0 overflow-hidden rounded-[4px] bg-[#F1EFE4]"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-top"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product/${item.slug}`}
                              onClick={closeCart}
                              className="font-serif text-base font-medium leading-snug text-ink hover:text-brand-green line-clamp-2"
                            >
                              {item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              aria-label={`Remove ${item.name}`}
                              className="text-ink-secondary hover:text-ink p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="mt-1 font-sans text-xs text-ink-secondary">
                            {item.selectedColor.name} · Size {item.selectedSize}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center border border-border rounded-[4px]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="h-7 w-7 flex items-center justify-center text-ink hover:bg-ivory"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-sans text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, Math.min(maxStock, item.quantity + 1))
                              }
                              disabled={item.quantity >= maxStock}
                              aria-label="Increase quantity"
                              className="h-7 w-7 flex items-center justify-center text-ink hover:bg-ivory disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-sans text-sm font-semibold text-ink">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleMoveToWishlist(item.id, item.productId)}
                          className="mt-2 inline-flex items-center gap-1 font-sans text-[11px] text-ink-secondary hover:text-brand-green self-start"
                        >
                          <Heart className="w-3 h-3" />
                          <span>Move to Wishlist</span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Summary Footer */}
          {items.length > 0 && (
            <div className="border-t border-border bg-white px-5 py-4 space-y-3">
              <div className="space-y-1.5 text-sm font-sans">
                <div className="flex justify-between text-ink-secondary">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-brand-secondary">
                    <span>Savings</span>
                    <span>-{formatPrice(discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2 font-semibold text-ink text-base">
                  <span>Estimated Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    closeCart();
                    navigate('/cart');
                  }}
                >
                  View Bag
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                >
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
