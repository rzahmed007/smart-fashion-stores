import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Check,
  ChevronDown,
  Heart,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Star,
  Truck,
  ZoomIn,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { catalogService } from '@/services/catalogService';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useUIStore } from '@/store/useUIStore';
import type { ColorVariant, ProductSize } from '@/types';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { ColorSelector } from '@/components/product/ColorSelector';
import { SizeSelector } from '@/components/product/SizeSelector';
import { SizeChartModal } from '@/components/product/SizeChartModal';
import { ProductGrid } from '@/components/product/ProductGrid';
import { calculateDiscountPercent, formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

function AccordionItem({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full py-4 flex items-center justify-between text-left font-sans text-sm font-medium text-ink"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn('w-4 h-4 text-ink-secondary transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="pb-4 font-sans text-sm leading-relaxed text-ink-secondary">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const product = useMemo(
    () => (slug ? catalogService.getProductBySlug(slug) : undefined),
    [slug]
  );

  const addItem = useCartStore((s) => s.addItem);
  const setBuyNowItem = useCartStore((s) => s.setBuyNowItem);
  const addRecentlyViewed = useCartStore((s) => s.addRecentlyViewed);
  const recentlyViewedIds = useCartStore((s) => s.recentlyViewedIds);
  const { productIds: wishlistIds, toggleWishlist } = useWishlistStore();
  const openCart = useUIStore((s) => s.openCart);

  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [quantity, setQuantity] = useState(1);
  const [variantError, setVariantError] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      setSelectedColor(product.colors[0] ?? null);
      const firstInStock = product.sizes.find((s) => s.inStock)?.size ?? null;
      setSelectedSize(firstInStock);
      setActiveImageIdx(0);
      setQuantity(1);
      setVariantError(null);
      setAddedFeedback(false);
      setPincodeStatus(null);
      addRecentlyViewed(product.id);
    }
  }, [product, addRecentlyViewed]);

  if (!product) {
    return (
      <section className="py-20 bg-ivory">
        <div className="mx-auto max-w-container px-4 text-center">
          <h1 className="font-serif text-3xl text-ink">Product Not Found</h1>
          <p className="mt-2 font-sans text-sm text-ink-secondary">
            The garment you are looking for could not be found in our catalog.
          </p>
          <Button asChild variant="primary" className="mt-6">
            <Link to="/shop">Browse All Silhouettes</Link>
          </Button>
        </div>
      </section>
    );
  }

  const galleryImages = useMemo(() => {
    const colorImg = selectedColor?.image;
    const base = [...product.images];
    if (colorImg && !base.includes(colorImg)) {
      return [colorImg, ...base];
    }
    if (colorImg) {
      return [colorImg, ...base.filter((img) => img !== colorImg)];
    }
    return base;
  }, [product.images, selectedColor]);

  const activeImage = galleryImages[activeImageIdx] || galleryImages[0];
  const discountPercent = product.originalPrice
    ? calculateDiscountPercent(product.originalPrice, product.price)
    : 0;
  const isWishlisted = wishlistIds.includes(product.id);

  const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize);
  const availableStock = selectedSizeObj?.stockCount ?? 0;
  const hasAnyStock = product.sizes.some((s) => s.inStock && s.stockCount > 0);

  const relatedProducts = catalogService.getRelatedProducts(product, 4);
  const recentlyViewedProducts = catalogService
    .getProductsByIds(recentlyViewedIds.filter((id) => id !== product.id))
    .slice(0, 4);

  const handleSelectColor = (color: ColorVariant) => {
    setSelectedColor(color);
    setActiveImageIdx(0);
  };

  const handleSelectSize = (size: ProductSize) => {
    setSelectedSize(size);
    setVariantError(null);
    const stock = product.sizes.find((s) => s.size === size)?.stockCount ?? 1;
    setQuantity((q) => Math.min(q, Math.max(1, stock)));
  };

  const handleAddToBag = (buyNow = false) => {
    if (!selectedColor) {
      setVariantError('Please select a color variant.');
      return;
    }
    if (!selectedSize) {
      setVariantError('Please select an available size before continuing.');
      return;
    }
    if (availableStock <= 0) {
      setVariantError('Selected size is currently out of stock.');
      return;
    }

    setVariantError(null);
    if (buyNow) {
      setBuyNowItem(product, selectedColor, selectedSize, quantity);
      navigate('/checkout?mode=buy-now');
      return;
    }

    addItem(product, selectedColor, selectedSize, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => {
      setAddedFeedback(false);
      openCart();
    }, 300);
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.replace(/\D/g, '');
    if (clean.length !== 6) {
      setPincodeStatus({
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code.',
      });
      return;
    }
    setPincodeStatus({
      valid: true,
      message: `Demo Serviceability Confirmed for ${clean} — Dispatch coordination available across India.`,
    });
  };

  const whatsappInquiryUrl = `https://wa.me/919820000000?text=${encodeURIComponent(
    `Hello Smart Fashion Stores, I have a question about ${product.name} (SKU: ${product.sku}).`
  )}`;

  return (
    <div className="bg-ivory pb-24 lg:pb-12">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Breadcrumb
          items={[
            { label: product.category, to: `/category/${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Gallery Column */}
          <div className="lg:col-span-7">
            {/* Mobile Swipeable Gallery */}
            <div className="lg:hidden sfs-swiper rounded-[4px] overflow-hidden border border-border bg-[#F1EFE4]">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                slidesPerView={1}
                className="aspect-[3/4]"
              >
                {galleryImages.map((img, idx) => (
                  <SwiperSlide key={`${img}-${idx}`}>
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="h-full w-full object-cover object-top"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Desktop Thumbnail + Zoomable Gallery */}
            <div className="hidden lg:grid grid-cols-12 gap-4">
              <div className="col-span-2 flex flex-col gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={cn(
                      'aspect-[3/4] overflow-hidden rounded-[4px] border bg-[#F1EFE4] transition-all',
                      activeImageIdx === idx
                        ? 'border-brand-green ring-1 ring-brand-green'
                        : 'border-border opacity-75 hover:opacity-100'
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>

              <div
                className="col-span-10 relative aspect-[3/4] overflow-hidden rounded-[4px] border border-border bg-[#F1EFE4] cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomOrigin({ x, y });
                }}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                          transform: 'scale(1.65)',
                        }
                      : undefined
                  }
                  className="h-full w-full object-cover object-top transition-transform duration-200 ease-out"
                />
                <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-ivory/90 border border-border font-sans text-[11px] text-ink">
                  <ZoomIn className="w-3.5 h-3.5 text-brand-green" />
                  <span>Hover to Zoom</span>
                </span>
              </div>
            </div>
          </div>

          {/* Product Information & Purchase Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans text-xs uppercase tracking-[0.16em] text-brand-secondary">
                  {product.category} · SKU {product.sku}
                </span>
                <div className="flex items-center gap-1 font-sans text-xs text-ink">
                  <Star className="w-3.5 h-3.5 fill-brand-green text-brand-green" />
                  <span className="font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-ink-secondary">({product.reviewCount})</span>
                </div>
              </div>

              <h1 className="mt-2 font-serif text-[28px] sm:text-[36px] font-medium leading-[1.12] text-ink">
                {product.name}
              </h1>
              <p className="mt-1.5 font-sans text-sm text-ink-secondary">
                {product.shortSubtitle}
              </p>

              {/* Price */}
              <div className="mt-4 pb-4 border-b border-border flex flex-wrap items-baseline gap-3">
                <span className="font-sans text-2xl font-semibold text-ink">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="font-sans text-base text-ink-secondary line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="px-2 py-0.5 rounded-[2px] bg-ivory border border-brand-secondary/30 font-sans text-xs font-medium text-brand-secondary">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
                <span className="w-full font-sans text-[11px] text-ink-secondary">
                  Inclusive of all taxes (Demo Pricing)
                </span>
              </div>
            </div>

            <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-ink-secondary">
              {product.description}
            </p>

            {/* Fabric Summary */}
            <div className="px-4 py-3 rounded-[4px] bg-white border border-border flex items-center justify-between gap-4">
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-ink-secondary">
                  Fabric & Craft
                </p>
                <p className="font-sans text-sm font-medium text-ink mt-0.5">{product.fabric}</p>
              </div>
              <span
                className={cn(
                  'px-2.5 py-1 rounded-[4px] font-sans text-[11px] font-medium',
                  hasAnyStock
                    ? 'bg-ivory text-brand-green border border-brand-green/25'
                    : 'bg-red-50 text-red-700 border border-red-200'
                )}
              >
                {selectedSize
                  ? availableStock > 3
                    ? 'In Stock'
                    : availableStock > 0
                      ? `Only ${availableStock} left`
                      : 'Out of Stock'
                  : hasAnyStock
                    ? 'In Stock'
                    : 'Sold Out'}
              </span>
            </div>

            {/* Color Selector */}
            {selectedColor && (
              <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onSelect={handleSelectColor}
              />
            )}

            {/* Size Selector + Size Chart Trigger */}
            <div className="space-y-2">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSizeChartOpen(true)}
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-brand-green hover:underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart & How to Measure</span>
                </button>
              </div>
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelect={handleSelectSize}
              />
            </div>

            {/* Quantity Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs uppercase tracking-[0.12em] text-ink-secondary">
                  Quantity
                </span>
                {selectedSize && (
                  <span className="font-sans text-xs text-ink-secondary">
                    Max {availableStock} available
                  </span>
                )}
              </div>
              <div className="inline-flex items-center border border-border rounded-[4px] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="h-10 w-10 flex items-center justify-center text-ink hover:bg-ivory"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-sans text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(Math.max(1, availableStock), q + 1))}
                  disabled={quantity >= availableStock}
                  aria-label="Increase quantity"
                  className="h-10 w-10 flex items-center justify-center text-ink hover:bg-ivory disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {variantError && (
              <p className="font-sans text-xs font-medium text-red-700" role="alert">
                {variantError}
              </p>
            )}

            {/* Desktop Purchase Buttons */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => handleAddToBag(false)}
                  className="h-12 w-full"
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
                  onClick={() => handleAddToBag(true)}
                  className="h-12 w-full"
                >
                  Buy Now
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => toggleWishlist(product.id)}
                  className="w-full"
                >
                  <Heart
                    className={cn('w-4 h-4', isWishlisted && 'fill-brand-green text-brand-green')}
                  />
                  <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </Button>

                <Button asChild variant="secondary" size="md" className="w-full">
                  <a href={whatsappInquiryUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 text-brand-green" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </Button>
              </div>
            </div>

            {/* Delivery PIN Code Checker */}
            <div className="p-4 rounded-[4px] bg-white border border-border space-y-2.5">
              <label
                htmlFor="pincode-input"
                className="flex items-center gap-1.5 font-sans text-xs font-medium uppercase tracking-[0.12em] text-ink"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-green" />
                <span>Check Delivery Availability</span>
              </label>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  id="pincode-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN code"
                  className="flex-1 h-10 px-3 rounded-[4px] border border-border bg-ivory/40 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                />
                <Button type="submit" variant="outline" size="sm" className="h-10">
                  Check
                </Button>
              </form>
              {pincodeStatus && (
                <p
                  className={cn(
                    'font-sans text-xs',
                    pincodeStatus.valid ? 'text-brand-green' : 'text-red-700'
                  )}
                >
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Product Details Accordion */}
            <div className="border-t border-border">
              <AccordionItem title="Fabric, Care & Craftsmanship" defaultOpen>
                <p>
                  <strong>Material:</strong> {product.fabric}
                </p>
                <p className="mt-1.5">
                  <strong>Occasions:</strong> {product.occasion.join(', ')}
                </p>
                <p className="mt-1.5">
                  <strong>Care:</strong> {product.careInstructions}
                </p>
              </AccordionItem>
              <AccordionItem title="Shipping & Dispatch Support">
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <Truck className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                    <span>
                      Pan-India dispatch coordination and order tracking support (client demo
                      environment; exact courier timelines confirmed upon store launch).
                    </span>
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem title="Returns & Exchange Information">
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <RotateCcw className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                    <span>
                      Size assistance and exchange coordination supported through our customer care
                      desk. Specific return policy windows will reflect finalized client terms.
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                    <span>Quality inspected before dispatch.</span>
                  </p>
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="font-serif text-[28px] sm:text-[34px] font-medium text-ink mb-6">
            You May Also Like
          </h2>
          <ProductGrid products={relatedProducts} />
        </div>

        {/* Recently Viewed */}
        {recentlyViewedProducts.length > 0 && (
          <div className="mt-14 pt-12 border-t border-border">
            <h2 className="font-serif text-[26px] sm:text-[32px] font-medium text-ink mb-6">
              Recently Viewed
            </h2>
            <ProductGrid products={recentlyViewedProducts} />
          </div>
        )}
      </div>

      {/* Sticky Mobile Purchase Bar (sits cleanly above h-16 MobileNavigation) */}
      <div className="fixed inset-x-0 bottom-16 z-30 lg:hidden bg-ivory/95 backdrop-blur-md border-t border-border px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="min-w-0 pr-1">
            <p className="font-sans text-xs font-semibold text-ink truncate">
              {formatPrice(product.price)}
            </p>
            <p className="font-sans text-[10px] text-ink-secondary truncate">
              {selectedSize ? `Size ${selectedSize}` : 'Select size'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => handleAddToBag(false)}
            className="flex-1 h-10 text-xs"
          >
            Add to Bag
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => handleAddToBag(true)}
            className="flex-1 h-10 text-xs"
          >
            Buy Now
          </Button>
        </div>
      </div>

      <SizeChartModal open={sizeChartOpen} onOpenChange={setSizeChartOpen} />
    </div>
  );
}
