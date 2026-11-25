import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useUIStore } from '@/store/useUIStore';
import { calculateDiscountPercent, formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

interface ProductCardProps {
  product: Product;
  priorityImage?: boolean;
}

export function ProductCard({ product, priorityImage = false }: ProductCardProps) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const { productIds, toggleWishlist } = useWishlistStore();
  const openQuickShop = useUIStore((s) => s.openQuickShop);

  const isWishlisted = productIds.includes(product.id);
  const activeColor = product.colors[selectedColorIdx] ?? product.colors[0];
  const primaryImage = activeColor?.image || product.images[0];
  const secondaryImage = product.images[1] || product.images[0];
  const discountPercent = product.originalPrice
    ? calculateDiscountPercent(product.originalPrice, product.price)
    : 0;

  return (
    <article className="group flex flex-col bg-surface border border-border rounded-[4px] overflow-hidden transition-colors duration-200 hover:border-brand-muted">
      {/* 3:4 Portrait Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F1EFE4]">
        <Link
          to={`/product/${product.slug}`}
          className="block h-full w-full"
          aria-label={product.name}
        >
          <img
            src={primaryImage}
            alt={product.name}
            loading={priorityImage ? 'eager' : 'lazy'}
            className={cn(
              'h-full w-full object-cover object-top transition-all duration-500',
              secondaryImage !== primaryImage
                ? 'group-hover:opacity-0'
                : 'group-hover:scale-[1.03]'
            )}
          />
          {secondaryImage !== primaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.02]"
            />
          )}
        </Link>

        {/* Top-left editorial badge */}
        {product.badge && (
          <span
            className={cn(
              'absolute top-2.5 left-2.5 px-2.5 py-1 rounded-[2px] font-sans text-[10px] font-medium uppercase tracking-[0.14em]',
              product.badge === 'Best Seller'
                ? 'bg-brand-green text-white'
                : 'bg-ivory/95 text-brand-green border border-border'
            )}
          >
            {product.badge}
          </span>
        )}

        {/* Top-right Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={
            isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
          className={cn(
            'absolute top-2.5 right-2.5 h-8 w-8 rounded-full flex items-center justify-center border transition-colors',
            isWishlisted
              ? 'bg-brand-green border-brand-green text-white'
              : 'bg-white/90 border-border text-ink hover:border-brand-green hover:text-brand-green'
          )}
        >
          <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} aria-hidden="true" />
        </button>

        {/* Quick Shop Bar (desktop hover + subtle always-accessible mobile trigger) */}
        <div className="absolute inset-x-2.5 bottom-2.5 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-200">
          <button
            type="button"
            onClick={() => openQuickShop(product)}
            className="w-full h-9 rounded-[4px] bg-ivory/95 backdrop-blur-sm border border-brand-green/25 text-brand-green hover:bg-brand-green hover:text-white font-sans text-xs font-medium uppercase tracking-[0.12em] flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Quick Shop</span>
          </button>
        </div>
      </div>

      {/* Product Metadata */}
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-4 gap-2.5">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-ink-secondary truncate">
            {product.category}
          </p>
          <Link
            to={`/product/${product.slug}`}
            className="mt-1 block font-serif text-[16px] sm:text-[18px] font-medium leading-[1.28] text-ink hover:text-brand-green transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
        </div>

        <div className="space-y-2.5">
          {/* Available Colors */}
          <div className="flex items-center gap-2">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColorIdx(idx)}
                title={color.name}
                aria-label={`Preview ${color.name}`}
                className={cn(
                  'h-4 w-4 rounded-full border border-black/15 transition-all',
                  selectedColorIdx === idx
                    ? 'ring-1 ring-brand-green ring-offset-2 ring-offset-white'
                    : 'opacity-80 hover:opacity-100'
                )}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            <span className="font-sans text-[11px] text-ink-secondary truncate">
              {activeColor?.name}
            </span>
          </div>

          {/* Price Row */}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-0.5">
            <span className="font-sans text-[15px] sm:text-base font-semibold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="font-sans text-xs text-ink-secondary line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="font-sans text-[11px] font-medium text-brand-secondary">
                  {discountPercent}% off
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
