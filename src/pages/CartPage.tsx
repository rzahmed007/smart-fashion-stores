import { Link, useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { catalogService } from '@/services/catalogService';
import type { ProductSize } from '@/types';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/utils/format';

const FREE_SHIPPING_THRESHOLD = 2999;
const STANDARD_SHIPPING_FEE = 150;

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, updateVariant, removeItem } = useCartStore();
  const { productIds: wishlistIds, toggleWishlist } = useWishlistStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const mrpTotal = items.reduce(
    (sum, item) => sum + (item.originalPrice ?? item.price) * item.quantity,
    0
  );
  const discount = Math.max(0, mrpTotal - subtotal);
  const estimatedShipping =
    items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const orderTotal = subtotal + estimatedShipping;

  const handleMoveToWishlist = (itemId: string, productId: string) => {
    if (!wishlistIds.includes(productId)) {
      toggleWishlist(productId);
    }
    removeItem(itemId);
  };

  return (
    <section className="py-8 sm:py-12 bg-ivory min-h-[75vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Shopping Bag' }]} />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="font-serif text-[30px] sm:text-[40px] font-medium leading-[1.1] text-ink">
              Shopping Bag
            </h1>
            <p className="mt-1.5 font-sans text-sm text-ink-secondary">
              {items.reduce((sum, i) => sum + i.quantity, 0)} items selected
            </p>
          </div>
          <Button asChild variant="outline" size="md">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 bg-white border border-border rounded-[4px] px-6 py-16 text-center">
            <div className="h-14 w-14 mx-auto rounded-full border border-border bg-ivory flex items-center justify-center text-brand-green mb-4">
              <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
              Your shopping bag is empty
            </h2>
            <p className="mt-2 mx-auto max-w-md font-sans text-sm text-ink-secondary">
              Discover handcrafted Chanderi salwar suits, tailored Smart Collection sets, and
              everyday kurtis.
            </p>
            <Button asChild variant="primary" size="lg" className="mt-6">
              <Link to="/new-arrivals">Explore New Arrivals</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => {
                const catalogProduct = catalogService.getProductBySlug(item.slug);
                const availableColors = catalogProduct?.colors ?? [item.selectedColor];
                const availableSizes = catalogProduct?.sizes ?? [
                  { size: item.selectedSize, inStock: true, stockCount: 10 },
                ];
                const currentSizeStock =
                  availableSizes.find((s) => s.size === item.selectedSize)?.stockCount ?? 10;

                return (
                  <article
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-5 bg-white border border-border rounded-[4px] p-4 sm:p-5"
                  >
                    <Link
                      to={`/product/${item.slug}`}
                      className="w-28 sm:w-32 aspect-[3/4] shrink-0 overflow-hidden rounded-[4px] bg-[#F1EFE4]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-top"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              to={`/product/${item.slug}`}
                              className="font-serif text-xl font-medium text-ink hover:text-brand-green"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-0.5 font-sans text-xs text-ink-secondary">
                              {item.fabric}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="font-sans text-base font-semibold text-ink">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <p className="font-sans text-xs text-ink-secondary line-through">
                                {formatPrice(item.originalPrice * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Variant Editors */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                          <div>
                            <label
                              htmlFor={`cart-color-${item.id}`}
                              className="block font-sans text-[11px] uppercase tracking-[0.12em] text-ink-secondary mb-1"
                            >
                              Color
                            </label>
                            <select
                              id={`cart-color-${item.id}`}
                              value={item.selectedColor.name}
                              onChange={(e) => {
                                const nextColor = availableColors.find(
                                  (c) => c.name === e.target.value
                                );
                                if (nextColor) {
                                  updateVariant(
                                    item.id,
                                    nextColor,
                                    item.selectedSize,
                                    currentSizeStock
                                  );
                                }
                              }}
                              className="w-full h-9 px-2.5 rounded-[4px] border border-border bg-ivory/40 font-sans text-xs text-ink focus:outline-none focus:border-brand-green"
                            >
                              {availableColors.map((c) => (
                                <option key={c.name} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor={`cart-size-${item.id}`}
                              className="block font-sans text-[11px] uppercase tracking-[0.12em] text-ink-secondary mb-1"
                            >
                              Size
                            </label>
                            <select
                              id={`cart-size-${item.id}`}
                              value={item.selectedSize}
                              onChange={(e) => {
                                const nextSize = e.target.value as ProductSize;
                                const nextStock =
                                  availableSizes.find((s) => s.size === nextSize)?.stockCount ??
                                  10;
                                updateVariant(item.id, item.selectedColor, nextSize, nextStock);
                              }}
                              className="w-full h-9 px-2.5 rounded-[4px] border border-border bg-ivory/40 font-sans text-xs text-ink focus:outline-none focus:border-brand-green"
                            >
                              {availableSizes.map((s) => (
                                <option key={s.size} value={s.size} disabled={!s.inStock}>
                                  {s.size} {!s.inStock ? '(Out of Stock)' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Quantity + Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                        <div className="inline-flex items-center border border-border rounded-[4px] bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="h-8 w-8 flex items-center justify-center text-ink hover:bg-ivory"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center font-sans text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.min(currentSizeStock, item.quantity + 1)
                              )
                            }
                            disabled={item.quantity >= currentSizeStock}
                            aria-label="Increase quantity"
                            className="h-8 w-8 flex items-center justify-center text-ink hover:bg-ivory disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => handleMoveToWishlist(item.id, item.productId)}
                            className="inline-flex items-center gap-1.5 font-sans text-xs text-ink-secondary hover:text-brand-green transition-colors"
                          >
                            <Heart className="w-3.5 h-3.5" />
                            <span>Move to Wishlist</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="inline-flex items-center gap-1.5 font-sans text-xs text-ink-secondary hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Order Summary Column */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 bg-white border border-border rounded-[4px] p-6 space-y-4">
                <h2 className="font-serif text-2xl font-medium text-ink pb-3 border-b border-border">
                  Order Summary
                </h2>

                <div className="space-y-2.5 font-sans text-sm">
                  <div className="flex justify-between text-ink-secondary">
                    <span>Bag Subtotal</span>
                    <span className="text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-brand-secondary">
                      <span>Catalog Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-ink-secondary">
                    <span>Estimated Shipping</span>
                    <span className="text-ink">
                      {estimatedShipping === 0 ? 'Complimentary' : formatPrice(estimatedShipping)}
                    </span>
                  </div>
                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-xs text-ink-secondary bg-ivory px-3 py-2 rounded-[4px] border border-border">
                      Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for complimentary
                      shipping (demo).
                    </p>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border text-base font-semibold text-ink">
                    <span>Estimated Total</span>
                    <span>{formatPrice(orderTotal)}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/checkout')}
                  className="w-full"
                >
                  Proceed to Checkout
                </Button>

                <p className="font-sans text-[11px] text-center text-ink-secondary">
                  Client demonstration storefront · No real payments processed
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
