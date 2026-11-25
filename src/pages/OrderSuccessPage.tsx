import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Truck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import type { OrderSummary } from '@/types';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/utils/format';

export default function OrderSuccessPage() {
  const location = useLocation();
  const lastOrder = useCartStore((s) => s.lastOrder);
  const stateOrder = (location.state as { order?: OrderSummary } | null)?.order;
  const order = stateOrder ?? lastOrder;

  if (!order) {
    return (
      <section className="py-20 bg-ivory min-h-[70vh]">
        <div className="mx-auto max-w-container px-4 text-center">
          <div className="mx-auto max-w-lg bg-white border border-border rounded-[4px] p-10">
            <h1 className="font-serif text-3xl font-medium text-ink">No recent demo order found</h1>
            <p className="mt-2 font-sans text-sm text-ink-secondary">
              Explore our ethnic wear collection and place a simulated demo order through checkout.
            </p>
            <Button asChild variant="primary" size="lg" className="mt-6">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-16 bg-ivory min-h-[75vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl bg-white border border-border rounded-[6px] p-6 sm:p-10 space-y-8">
          {/* Confirmation Header */}
          <div className="text-center border-b border-border pb-7">
            <div className="h-14 w-14 mx-auto rounded-full bg-ivory border border-brand-green/30 flex items-center justify-center text-brand-green mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-secondary">
              Simulated Demo Order Confirmed
            </p>
            <h1 className="mt-2 font-serif text-[32px] sm:text-[42px] font-medium leading-[1.1] text-ink">
              Thank You, {order.customer.fullName}
            </h1>
            <p className="mt-2.5 font-sans text-sm text-ink-secondary">
              Your demonstration order has been recorded locally with ID{' '}
              <span className="font-semibold text-ink">{order.orderId}</span>. No real payment or
              shipment has been initiated.
            </p>
          </div>

          {/* Order Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-ivory border border-border rounded-[4px] p-4 sm:p-5 font-sans text-xs">
            <div>
              <p className="uppercase tracking-[0.12em] text-ink-secondary">Simulated Order ID</p>
              <p className="mt-1 text-sm font-semibold text-brand-green">{order.orderId}</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.12em] text-ink-secondary">Payment Method</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {order.paymentMethod === 'cod'
                  ? 'Cash on Delivery (Demo)'
                  : 'Online Payment (Simulated)'}
              </p>
            </div>
            <div>
              <p className="uppercase tracking-[0.12em] text-ink-secondary">Order Total</p>
              <p className="mt-1 text-sm font-semibold text-ink">{formatPrice(order.total)}</p>
            </div>
          </div>

          {/* Demo Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="border border-border rounded-[4px] p-4 space-y-1.5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-green" />
                <span>Demo Delivery Destination</span>
              </p>
              <p className="font-sans text-sm text-ink pt-1">{order.customer.fullName}</p>
              <p className="font-sans text-xs text-ink-secondary">
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
              </p>
              <p className="font-sans text-xs text-ink-secondary">
                {order.shippingAddress.city}, {order.shippingAddress.state} —{' '}
                {order.shippingAddress.pincode}
              </p>
            </div>

            <div className="border border-border rounded-[4px] p-4 space-y-1.5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-brand-green" />
                <span>Dispatch Mode</span>
              </p>
              <p className="font-sans text-sm text-ink pt-1">
                {order.deliveryOption === 'express'
                  ? 'Express Priority Dispatch (Demo)'
                  : 'Standard Dispatch (Demo)'}
              </p>
              <p className="font-sans text-xs text-ink-secondary">
                Status: {order.status}
              </p>
              {order.notes && (
                <p className="font-sans text-xs text-ink-secondary">Note: {order.notes}</p>
              )}
            </div>
          </div>

          {/* Ordered Products */}
          <div>
            <h2 className="font-serif text-2xl font-medium text-ink mb-4">Ordered Silhouettes</h2>
            <ul className="divide-y divide-border border border-border rounded-[4px]">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 p-4">
                  <div className="w-16 aspect-[3/4] shrink-0 rounded-[4px] overflow-hidden bg-[#F1EFE4] border border-border">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base font-medium text-ink">{item.name}</p>
                    <p className="font-sans text-xs text-ink-secondary mt-0.5">
                      {item.selectedColor.name} · Size {item.selectedSize} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-sans text-sm font-semibold text-ink shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Totals & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="font-sans text-sm text-ink-secondary space-y-0.5">
              <p>
                Subtotal: <span className="text-ink">{formatPrice(order.subtotal)}</span> ·
                Shipping:{' '}
                <span className="text-ink">
                  {order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping)}
                </span>
              </p>
              {order.couponDiscount > 0 && (
                <p className="text-brand-secondary">
                  Promo Savings ({order.couponCode}): -{formatPrice(order.couponDiscount)}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="lg">
                <Link to="/">Back to Home</Link>
              </Button>
              <Button asChild variant="primary" size="lg">
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
