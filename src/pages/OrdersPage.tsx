import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, RotateCcw } from 'lucide-react';
import { useCustomerStore } from '@/store/useCustomerStore';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { catalogService } from '@/services/catalogService';
import type { OrderStatus, OrderSummary } from '@/types';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { AccountLayout } from '@/components/account/AccountLayout';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

type OrderFilterTab = 'all' | 'active' | 'delivered' | 'cancelled';

const ACTIVE_STATUSES: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
];

export default function OrdersPage() {
  const { isAuthenticated, orders } = useCustomerStore();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const [filter, setFilter] = useState<OrderFilterTab>('all');

  const filteredOrders = useMemo(() => {
    switch (filter) {
      case 'active':
        return orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
      case 'delivered':
        return orders.filter((o) => o.status === 'Delivered');
      case 'cancelled':
        return orders.filter((o) => o.status === 'Cancelled');
      case 'all':
      default:
        return orders;
    }
  }, [orders, filter]);

  const handleBuyAgain = (order: OrderSummary) => {
    order.items.forEach((item) => {
      const product = catalogService.getProductBySlug(item.slug);
      if (product) {
        addItem(product, item.selectedColor, item.selectedSize, item.quantity);
      }
    });
    openCart();
  };

  const content = (
    <div className="space-y-6">
      <div className="bg-white border border-border rounded-[4px] p-6">
        <p className="font-sans text-xs uppercase tracking-[0.18em] text-brand-secondary">
          Simulated Order History · Client Demo
        </p>
        <h1 className="mt-1.5 font-serif text-3xl sm:text-4xl font-medium text-ink">
          My Orders
        </h1>
        <p className="mt-1.5 font-sans text-sm text-ink-secondary">
          Includes sample demo records alongside orders placed during your session.
        </p>

        {/* Filter Tabs */}
        <div className="mt-5 flex flex-wrap gap-2">
          {(
            [
              { id: 'all', label: 'All Orders' },
              { id: 'active', label: 'Active Orders' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                'px-3.5 py-2 rounded-[4px] border font-sans text-xs font-medium transition-colors',
                filter === tab.id
                  ? 'bg-brand-green border-brand-green text-white'
                  : 'bg-ivory/50 border-border text-ink hover:border-brand-green'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-border rounded-[4px] px-6 py-14 text-center">
          <div className="h-14 w-14 mx-auto rounded-full border border-border bg-ivory flex items-center justify-center text-brand-green mb-4">
            <Package className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-2xl font-medium text-ink">No orders in this filter</h2>
          <p className="mt-1.5 font-sans text-sm text-ink-secondary">
            Explore our ethnic collections to place a simulated demo order.
          </p>
          <Button asChild variant="primary" size="lg" className="mt-6">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <article
              key={order.orderId}
              className="bg-white border border-border rounded-[4px] overflow-hidden"
            >
              <div className="px-5 py-3.5 bg-ivory/60 border-b border-border flex flex-wrap items-center justify-between gap-3 font-sans text-xs">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <div>
                    <span className="text-ink-secondary uppercase tracking-wider">Order ID: </span>
                    <span className="font-semibold text-ink">{order.orderId}</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary uppercase tracking-wider">Date: </span>
                    <span className="text-ink">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-secondary uppercase tracking-wider">Payment: </span>
                    <span className="text-ink">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Demo)'}
                    </span>
                  </div>
                </div>

                <span
                  className={cn(
                    'px-2.5 py-1 rounded-[2px] font-medium uppercase tracking-[0.1em] text-[11px]',
                    order.status === 'Cancelled'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : order.status === 'Delivered'
                        ? 'bg-brand-green text-white'
                        : 'bg-white text-brand-green border border-brand-green/30'
                  )}
                >
                  {order.status}
                </span>
              </div>

              <div className="p-5 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Link
                      to={`/product/${item.slug}`}
                      className="w-16 aspect-[3/4] shrink-0 overflow-hidden rounded-[4px] bg-[#F1EFE4] border border-border"
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
                        className="font-serif text-lg font-medium text-ink hover:text-brand-green line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="font-sans text-xs text-ink-secondary mt-0.5">
                        Color: {item.selectedColor.name} · Size: {item.selectedSize} · Qty:{' '}
                        {item.quantity}
                      </p>
                    </div>
                    <p className="font-sans text-sm font-semibold text-ink shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}

                <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="font-sans text-sm text-ink">
                    Order Total:{' '}
                    <span className="font-semibold text-base">{formatPrice(order.total)}</span>
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/orders/${order.orderId}`}>View Details</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/track-order?orderId=${order.orderId}`}>Track Order</Link>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleBuyAgain(order)}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Buy Again</span>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className="py-8 sm:py-12 bg-ivory min-h-[75vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: 'My Account', to: '/account' }, { label: 'My Orders' }]}
        />
        {isAuthenticated ? <AccountLayout>{content}</AccountLayout> : content}
      </div>
    </section>
  );
}
