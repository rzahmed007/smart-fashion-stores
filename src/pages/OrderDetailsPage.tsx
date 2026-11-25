import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Headphones, MapPin, RotateCcw, Truck } from 'lucide-react';
import { useCustomerStore } from '@/store/useCustomerStore';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { catalogService } from '@/services/catalogService';
import { buildOrderTimeline, customerService } from '@/services/customerService';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { AccountLayout } from '@/components/account/AccountLayout';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { isAuthenticated, orders } = useCustomerStore();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  const order = orderId ? customerService.findOrderById(orders, orderId) : undefined;

  if (!order) {
    return (
      <section className="py-16 bg-ivory min-h-[70vh]">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-lg bg-white border border-border rounded-[4px] p-10">
            <h1 className="font-serif text-3xl font-medium text-ink">Order Not Found</h1>
            <p className="mt-2 font-sans text-sm text-ink-secondary">
              We could not find a simulated order matching “{orderId}”. Check your demo order list
              and try again.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild variant="primary">
                <Link to="/orders">View My Orders</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/track-order">Track Order</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const timeline = buildOrderTimeline(order.status);

  const handleBuyAgain = () => {
    order.items.forEach((item) => {
      const product = catalogService.getProductBySlug(item.slug);
      if (product) {
        addItem(product, item.selectedColor, item.selectedSize, item.quantity);
      }
    });
    openCart();
  };

  const body = (
    <div className="space-y-6">
      <div className="bg-white border border-border rounded-[4px] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-brand-secondary">
              Simulated Order Details
            </p>
            <h1 className="mt-1 font-serif text-3xl font-medium text-ink">{order.orderId}</h1>
            <p className="mt-1 font-sans text-xs text-ink-secondary">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              · Status: <strong className="text-brand-green">{order.status}</strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button asChild variant="outline" size="sm">
              <Link to={`/track-order?orderId=${order.orderId}`}>
                <Truck className="w-3.5 h-3.5" />
                <span>Track Order</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/contact">
                <Headphones className="w-3.5 h-3.5" />
                <span>Contact Support</span>
              </Link>
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleBuyAgain}>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Buy Again</span>
            </Button>
          </div>
        </div>

        {/* Status Timeline */}
        <div>
          <h2 className="font-serif text-xl font-medium text-ink mb-4">Order Status Timeline</h2>
          {order.status === 'Cancelled' ? (
            <div className="p-4 rounded-[4px] bg-red-50 border border-red-200 font-sans text-xs text-red-700">
              This simulated order is marked as Cancelled.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {timeline.map((step) => (
                <div
                  key={step.stage}
                  className={cn(
                    'p-3 rounded-[4px] border font-sans text-xs',
                    step.completed
                      ? 'bg-ivory border-brand-green/40 text-ink'
                      : 'bg-white border-border text-ink-secondary'
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2
                      className={cn(
                        'w-3.5 h-3.5 shrink-0',
                        step.completed ? 'text-brand-green' : 'text-border'
                      )}
                    />
                    <span className="font-semibold truncate">{step.label}</span>
                  </div>
                  <p className="text-[11px] leading-snug opacity-85">{step.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ordered Products */}
      <div className="bg-white border border-border rounded-[4px] p-6">
        <h2 className="font-serif text-2xl font-medium text-ink mb-4">Ordered Silhouettes</h2>
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
              <Link
                to={`/product/${item.slug}`}
                className="w-18 aspect-[3/4] shrink-0 overflow-hidden rounded-[4px] bg-[#F1EFE4] border border-border"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover object-top"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.slug}`}
                  className="font-serif text-lg font-medium text-ink hover:text-brand-green"
                >
                  {item.name}
                </Link>
                <p className="font-sans text-xs text-ink-secondary mt-0.5">
                  Color: {item.selectedColor.name} · Size: {item.selectedSize} · Qty:{' '}
                  {item.quantity}
                </p>
                <p className="font-sans text-xs text-ink-secondary mt-0.5">{item.fabric}</p>
              </div>
              <p className="font-sans text-sm font-semibold text-ink shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Breakdown & Delivery Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-[4px] p-6 space-y-2.5 font-sans text-sm">
          <h2 className="font-serif text-2xl font-medium text-ink pb-2 border-b border-border">
            Price Breakdown
          </h2>
          <div className="flex justify-between text-ink-secondary">
            <span>Subtotal</span>
            <span className="text-ink">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-brand-secondary">
              <span>Catalog Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          {order.couponDiscount > 0 && (
            <div className="flex justify-between text-brand-secondary">
              <span>Promo ({order.couponCode})</span>
              <span>-{formatPrice(order.couponDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-ink-secondary">
            <span>Shipping Charges</span>
            <span className="text-ink">
              {order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between pt-2.5 border-t border-border font-semibold text-base text-ink">
            <span>Total Paid (Demo)</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <p className="text-xs text-ink-secondary pt-1">
            Payment Method:{' '}
            {order.paymentMethod === 'cod'
              ? 'Cash on Delivery (Demo)'
              : 'Simulated Online Payment'}
          </p>
        </div>

        <div className="bg-white border border-border rounded-[4px] p-6 space-y-2">
          <h2 className="font-serif text-2xl font-medium text-ink pb-2 border-b border-border flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-green" />
            <span>Demo Delivery Address</span>
          </h2>
          <p className="font-sans text-sm font-semibold text-ink pt-1">
            {order.customer.fullName}
          </p>
          <p className="font-sans text-xs text-ink-secondary leading-relaxed">
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} —{' '}
            {order.shippingAddress.pincode}
          </p>
          <p className="font-sans text-xs text-ink-secondary">
            Phone: +91 {order.customer.phone}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-8 sm:py-12 bg-ivory min-h-[75vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'My Orders', to: '/orders' },
            { label: order.orderId },
          ]}
        />
        {isAuthenticated ? <AccountLayout>{body}</AccountLayout> : body}
      </div>
    </section>
  );
}
