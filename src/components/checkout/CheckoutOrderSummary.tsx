import { Tag, X } from 'lucide-react';
import type { CartItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/utils/format';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  catalogDiscount: number;
  couponCode: string;
  appliedCoupon: string | null;
  couponDiscount: number;
  couponMessage: string | null;
  shippingFee: number;
  total: number;
  isSubmitting: boolean;
  onCouponInputChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  catalogDiscount,
  couponCode,
  appliedCoupon,
  couponDiscount,
  couponMessage,
  shippingFee,
  total,
  isSubmitting,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="sticky top-28 bg-white border border-border rounded-[4px] p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="font-serif text-2xl font-medium text-ink">Order Summary</h2>
        <span className="font-sans text-xs text-ink-secondary">
          {items.reduce((sum, i) => sum + i.quantity, 0)} items
        </span>
      </div>

      {/* Items */}
      <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="w-14 aspect-[3/4] shrink-0 rounded-[4px] overflow-hidden bg-[#F1EFE4] border border-border">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm font-medium text-ink line-clamp-1">
                {item.name}
              </p>
              <p className="font-sans text-[11px] text-ink-secondary mt-0.5">
                {item.selectedColor.name} · Size {item.selectedSize} · Qty {item.quantity}
              </p>
              <p className="font-sans text-xs font-semibold text-ink mt-1">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Coupon Code */}
      <div className="pt-3 border-t border-border space-y-2">
        <label
          htmlFor="checkout-coupon"
          className="flex items-center gap-1.5 font-sans text-xs font-medium uppercase tracking-[0.12em] text-ink"
        >
          <Tag className="w-3.5 h-3.5 text-brand-green" />
          <span>Promo Code (Demo: SMART10)</span>
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between px-3 py-2 rounded-[4px] bg-ivory border border-brand-green/30">
            <span className="font-sans text-xs font-medium text-brand-green">
              {appliedCoupon} applied (-{formatPrice(couponDiscount)})
            </span>
            <button
              type="button"
              onClick={onRemoveCoupon}
              aria-label="Remove coupon"
              className="text-ink-secondary hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              id="checkout-coupon"
              type="text"
              value={couponCode}
              onChange={(e) => onCouponInputChange(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 h-10 px-3 rounded-[4px] border border-border bg-ivory/40 font-sans text-xs uppercase tracking-wider text-ink focus:outline-none focus:border-brand-green"
            />
            <Button type="button" variant="outline" size="sm" onClick={onApplyCoupon} className="h-10">
              Apply
            </Button>
          </div>
        )}

        {couponMessage && (
          <p className="font-sans text-[11px] text-ink-secondary">{couponMessage}</p>
        )}
      </div>

      {/* Totals */}
      <div className="pt-3 border-t border-border space-y-2 font-sans text-sm">
        <div className="flex justify-between text-ink-secondary">
          <span>Subtotal</span>
          <span className="text-ink">{formatPrice(subtotal)}</span>
        </div>
        {catalogDiscount > 0 && (
          <div className="flex justify-between text-brand-secondary">
            <span>Catalog Savings</span>
            <span>-{formatPrice(catalogDiscount)}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-brand-secondary">
            <span>Coupon ({appliedCoupon})</span>
            <span>-{formatPrice(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-ink-secondary">
          <span>Delivery</span>
          <span className="text-ink">
            {shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-border text-base font-semibold text-ink">
          <span>Order Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full h-12"
      >
        {isSubmitting ? 'Confirming Demo Order...' : `Place Demo Order · ${formatPrice(total)}`}
      </Button>

      <p className="font-sans text-[11px] text-center text-ink-secondary leading-relaxed">
        Demonstration checkout only. No real payment is charged and no details leave your browser.
      </p>
    </div>
  );
}
