import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Minus, Plus, X, ArrowUpRight, Check } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import type { ColorVariant, ProductSize } from '@/types';
import { ColorSelector } from '@/components/product/ColorSelector';
import { SizeSelector } from '@/components/product/SizeSelector';
import { Button } from '@/components/ui/Button';
import { calculateDiscountPercent, formatPrice } from '@/utils/format';

export function QuickShopModal() {
  const navigate = useNavigate();
  const { quickShopProduct, closeQuickShop, openCart } = useUIStore();
  const addItem = useCartStore((s) => s.addItem);
  const setBuyNowItem = useCartStore((s) => s.setBuyNowItem);

  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (quickShopProduct) {
      setSelectedColor(quickShopProduct.colors[0] ?? null);
      const firstAvailable = quickShopProduct.sizes.find((s) => s.inStock)?.size ?? null;
      setSelectedSize(firstAvailable);
      setQuantity(1);
      setError(null);
      setAddedFeedback(false);
    }
  }, [quickShopProduct]);

  if (!quickShopProduct) return null;

  const activeColor = selectedColor ?? quickShopProduct.colors[0];
  const displayImage = activeColor?.image || quickShopProduct.images[0];
  const discountPercent = quickShopProduct.originalPrice
    ? calculateDiscountPercent(quickShopProduct.originalPrice, quickShopProduct.price)
    : 0;
  const selectedSizeStock =
    quickShopProduct.sizes.find((s) => s.size === selectedSize)?.stockCount ?? 10;

  const handleAdd = (buyNow = false) => {
    if (!selectedSize) {
      setError('Please select a size before continuing.');
      return;
    }
    if (!activeColor) return;

    setError(null);

    if (buyNow) {
      setBuyNowItem(quickShopProduct, activeColor, selectedSize, quantity);
      closeQuickShop();
      navigate('/checkout?mode=buy-now');
      return;
    }

    addItem(quickShopProduct, activeColor, selectedSize, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      closeQuickShop();
      openCart();
    }, 350);
  };

  return (
    <Dialog.Root open={Boolean(quickShopProduct)} onOpenChange={(open) => !open && closeQuickShop()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px]" />
        <Dialog.Content
          className="fixed z-50 bg-ivory border border-border shadow-xl focus:outline-none
            inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-[6px]
            md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-[780px] md:rounded-[6px]"
        >
          <div className="relative grid grid-cols-1 md:grid-cols-12">
            <Dialog.Close
              aria-label="Close Quick Shop"
              className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white/90 border border-border flex items-center justify-center text-ink hover:border-brand-green hover:text-brand-green transition-colors"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>

            {/* Product Visual */}
            <div className="md:col-span-5 bg-[#F1EFE4] aspect-[3/4] md:aspect-auto md:min-h-[460px] overflow-hidden">
              <img
                src={displayImage}
                alt={quickShopProduct.name}
                className="h-full w-full object-cover object-top"
              />
            </div>

            {/* Product Selection */}
            <div className="md:col-span-7 p-5 sm:p-7 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-brand-secondary">
                    {quickShopProduct.category} · {quickShopProduct.sku}
                  </p>
                  <Dialog.Title className="mt-1 font-serif text-2xl sm:text-[28px] font-medium leading-[1.15] text-ink pr-8">
                    {quickShopProduct.name}
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 font-sans text-xs text-ink-secondary">
                    {quickShopProduct.fabric}
                  </Dialog.Description>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2.5 border-y border-border py-3">
                  <span className="font-sans text-xl font-semibold text-ink">
                    {formatPrice(quickShopProduct.price)}
                  </span>
                  {quickShopProduct.originalPrice && (
                    <span className="font-sans text-sm text-ink-secondary line-through">
                      {formatPrice(quickShopProduct.originalPrice)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="font-sans text-xs font-medium text-brand-secondary">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>

                {/* Color Selector */}
                {activeColor && (
                  <ColorSelector
                    colors={quickShopProduct.colors}
                    selectedColor={activeColor}
                    onSelect={setSelectedColor}
                  />
                )}

                {/* Size Selector */}
                <SizeSelector
                  sizes={quickShopProduct.sizes}
                  selectedSize={selectedSize}
                  onSelect={(size) => {
                    setSelectedSize(size);
                    const stock =
                      quickShopProduct.sizes.find((s) => s.size === size)?.stockCount ?? 10;
                    setQuantity((q) => Math.min(q, Math.max(1, stock)));
                    setError(null);
                  }}
                />

                {/* Quantity */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans text-xs uppercase tracking-[0.12em] text-ink-secondary">
                      Quantity
                    </span>
                    {selectedSize && (
                      <span className="font-sans text-[11px] text-ink-secondary">
                        {selectedSizeStock} available
                      </span>
                    )}
                  </div>
                  <div className="inline-flex items-center border border-border rounded-[4px] bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="h-10 w-10 flex items-center justify-center text-ink hover:bg-ivory transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-sans text-sm font-medium text-ink">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(selectedSizeStock, q + 1))}
                      disabled={quantity >= selectedSizeStock}
                      aria-label="Increase quantity"
                      className="h-10 w-10 flex items-center justify-center text-ink hover:bg-ivory disabled:opacity-40 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="font-sans text-xs font-medium text-red-700" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => handleAdd(false)}
                    className="w-full"
                  >
                    {addedFeedback ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added</span>
                      </>
                    ) : (
                      <span>Add to Bag</span>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={() => handleAdd(true)}
                    className="w-full"
                  >
                    Buy Now
                  </Button>
                </div>

                <Link
                  to={`/product/${quickShopProduct.slug}`}
                  onClick={closeQuickShop}
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-medium uppercase tracking-[0.12em] text-brand-green hover:underline"
                >
                  <span>View Full Product Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
