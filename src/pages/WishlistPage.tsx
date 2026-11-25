import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { catalogService } from '@/services/catalogService';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import type { ColorVariant, Product, ProductSize } from '@/types';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { calculateDiscountPercent, formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

function WishlistCard({ product }: { product: Product }) {
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const { openQuickShop, openCart } = useUIStore();

  const [selectedColor, setSelectedColor] = useState<ColorVariant>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayImage = selectedColor?.image || product.images[0];
  const discount = product.originalPrice
    ? calculateDiscountPercent(product.originalPrice, product.price)
    : 0;

  const handleMoveToBag = () => {
    if (!selectedSize) {
      setError('Please select a size to move to bag.');
      return;
    }
    setError(null);
    addItem(product, selectedColor, selectedSize, 1);
    toggleWishlist(product.id);
    openCart();
  };

  return (
    <article className="flex flex-col bg-white border border-border rounded-[4px] overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F1EFE4]">
        <Link to={`/product/${product.slug}`} className="block h-full w-full">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-top hover:scale-[1.03] transition-transform duration-500"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={`Remove ${product.name} from wishlist`}
          className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/95 border border-border flex items-center justify-center text-ink hover:text-red-700 hover:border-red-300 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 gap-3">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-ink-secondary">
            {product.category}
          </p>
          <Link
            to={`/product/${product.slug}`}
            className="mt-1 block font-serif text-lg font-medium leading-snug text-ink hover:text-brand-green line-clamp-2"
          >
            {product.name}
          </Link>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-sans text-base font-semibold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="font-sans text-xs text-ink-secondary line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="font-sans text-[11px] font-medium text-brand-secondary">
                  {discount}% off
                </span>
              </>
            )}
          </div>
        </div>

        {/* Inline Variant Selection before Move to Bag */}
        <div className="space-y-2.5 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] text-ink-secondary">Color:</span>
            <div className="flex items-center gap-1.5">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  aria-label={`Select color ${color.name}`}
                  className={cn(
                    'h-4 w-4 rounded-full border border-black/15',
                    selectedColor.name === color.name &&
                      'ring-1 ring-brand-green ring-offset-2 ring-offset-white'
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor={`wl-size-${product.id}`} className="sr-only">
              Select size for {product.name}
            </label>
            <select
              id={`wl-size-${product.id}`}
              value={selectedSize ?? ''}
              onChange={(e) => {
                setSelectedSize((e.target.value as ProductSize) || null);
                setError(null);
              }}
              className="w-full h-9 px-2.5 rounded-[4px] border border-border bg-ivory/40 font-sans text-xs text-ink focus:outline-none focus:border-brand-green"
            >
              <option value="">Select Size</option>
              {product.sizes.map((s) => (
                <option key={s.size} value={s.size} disabled={!s.inStock}>
                  {s.size} {!s.inStock ? '(Out of Stock)' : ''}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="font-sans text-[11px] text-red-700" role="alert">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => openQuickShop(product)}
              className="w-full"
            >
              Quick Shop
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleMoveToBag}
              className="w-full"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move to Bag</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function WishlistPage() {
  const productIds = useWishlistStore((s) => s.productIds);
  const savedProducts = useMemo(() => catalogService.getProductsByIds(productIds), [productIds]);

  return (
    <section className="py-8 sm:py-12 bg-ivory min-h-[70vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="font-serif text-[30px] sm:text-[40px] font-medium leading-[1.1] text-ink">
              Saved Wishlist
            </h1>
            <p className="mt-1.5 font-sans text-sm text-ink-secondary">
              {savedProducts.length} {savedProducts.length === 1 ? 'piece' : 'pieces'} saved for
              your wardrobe
            </p>
          </div>

          {savedProducts.length > 0 && (
            <Button asChild variant="outline" size="md">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          )}
        </div>

        {savedProducts.length === 0 ? (
          <div className="mt-8 bg-white border border-border rounded-[4px] px-6 py-16 text-center">
            <div className="h-14 w-14 mx-auto rounded-full border border-border bg-ivory flex items-center justify-center text-brand-green mb-4">
              <Heart className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
              Your wishlist is currently empty
            </h2>
            <p className="mt-2 mx-auto max-w-md font-sans text-sm text-ink-secondary">
              Tap the heart icon on any salwar suit, kurti, or festive silhouette to curate your
              personal shortlist.
            </p>
            <Button asChild variant="primary" size="lg" className="mt-6">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {savedProducts.map((product) => (
              <WishlistCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
