import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Info, Search, Truck } from 'lucide-react';
import { useCustomerStore } from '@/store/useCustomerStore';
import { buildOrderTimeline, customerService } from '@/services/customerService';
import type { OrderSummary } from '@/types';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orders = useCustomerStore((s) => s.orders);

  const initialId = searchParams.get('orderId') ?? orders[0]?.orderId ?? '';
  const [inputOrderId, setInputOrderId] = useState(initialId);
  const [trackedOrder, setTrackedOrder] = useState<OrderSummary | undefined>(() =>
    initialId ? customerService.findOrderById(orders, initialId) : undefined
  );
  const [searched, setSearched] = useState(Boolean(initialId));

  useEffect(() => {
    const paramId = searchParams.get('orderId');
    if (paramId) {
      setInputOrderId(paramId);
      setTrackedOrder(customerService.findOrderById(orders, paramId));
      setSearched(true);
    }
  }, [searchParams, orders]);

  const handleTrack = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = inputOrderId.trim().toUpperCase();
    setSearchParams(cleaned ? { orderId: cleaned } : {});
    setTrackedOrder(customerService.findOrderById(orders, cleaned));
    setSearched(true);
  };

  const timeline = trackedOrder ? buildOrderTimeline(trackedOrder.status) : [];

  return (
    <section className="py-8 sm:py-12 bg-ivory min-h-[75vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Track Order' }]} />

        <div className="mx-auto max-w-3xl space-y-6">
          <div className="bg-white border border-border rounded-[6px] p-6 sm:p-8 space-y-5">
            <div className="text-center">
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-brand-secondary">
                Simulated Shipment Lookup
              </p>
              <h1 className="mt-2 font-serif text-[32px] sm:text-[40px] font-medium text-ink">
                Track Your Order
              </h1>
              <p className="mt-1.5 font-sans text-sm text-ink-secondary">
                Enter your simulated order ID to inspect its demonstration shipment timeline.
              </p>
            </div>

            <div className="rounded-[4px] border border-brand-green/25 bg-ivory px-4 py-3 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
              <p className="font-sans text-xs text-ink-secondary">
                Clearly labeled simulated tracking data for client demonstration. No external
                courier API is connected.
              </p>
            </div>

            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputOrderId}
                  onChange={(e) => setInputOrderId(e.target.value.toUpperCase())}
                  placeholder="Enter Demo Order ID (e.g. SFS-DEMO-904218)"
                  aria-label="Demo Order ID"
                  className="w-full h-12 pl-10 pr-4 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm uppercase tracking-wide text-ink focus:outline-none focus:border-brand-green"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="h-12 px-8">
                Track Order
              </Button>
            </form>

            {/* Sample IDs */}
            {orders.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-ink-secondary">
                  Sample Demo IDs:
                </span>
                {orders.slice(0, 3).map((o) => (
                  <button
                    key={o.orderId}
                    type="button"
                    onClick={() => {
                      setInputOrderId(o.orderId);
                      setSearchParams({ orderId: o.orderId });
                      setTrackedOrder(o);
                      setSearched(true);
                    }}
                    className="px-2.5 py-1 rounded-[4px] border border-border bg-ivory/60 font-sans text-xs text-brand-green hover:border-brand-green"
                  >
                    {o.orderId}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          {searched && !trackedOrder && (
            <div className="bg-white border border-border rounded-[4px] p-8 text-center">
              <h2 className="font-serif text-2xl font-medium text-ink">Order ID Not Found</h2>
              <p className="mt-1.5 font-sans text-sm text-ink-secondary">
                No demo order matched “{inputOrderId}”. Select one of the sample demo IDs above or
                place a new order at checkout.
              </p>
            </div>
          )}

          {trackedOrder && (
            <div className="bg-white border border-border rounded-[6px] p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-border">
                <div>
                  <p className="font-sans text-xs uppercase tracking-[0.14em] text-ink-secondary">
                    Tracking Reference
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
                    {trackedOrder.orderId}
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-ivory border border-brand-green/30 font-sans text-xs font-semibold text-brand-green">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{trackedOrder.status}</span>
                  </span>
                  <p className="mt-1 font-sans text-xs text-ink-secondary">
                    {trackedOrder.estimatedDeliveryLabel || 'Simulated Estimate: Pending Dispatch'}
                  </p>
                </div>
              </div>

              {/* 6-Stage Shipment Timeline */}
              <div>
                <h3 className="font-serif text-xl font-medium text-ink mb-4">
                  Simulated Shipment Timeline
                </h3>
                {trackedOrder.status === 'Cancelled' ? (
                  <p className="p-4 rounded-[4px] bg-red-50 border border-red-200 font-sans text-sm text-red-700">
                    This demo order was cancelled before dispatch.
                  </p>
                ) : (
                  <ol className="space-y-4">
                    {timeline.map((step, idx) => (
                      <li key={step.stage} className="flex items-start gap-3.5">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              'h-7 w-7 rounded-full border flex items-center justify-center shrink-0',
                              step.completed
                                ? 'bg-brand-green border-brand-green text-white'
                                : 'bg-white border-border text-ink-secondary'
                            )}
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <span className="font-sans text-[11px] font-medium">{idx + 1}</span>
                            )}
                          </div>
                          {idx < timeline.length - 1 && (
                            <div
                              className={cn(
                                'w-px h-6 mt-1',
                                step.completed ? 'bg-brand-green' : 'bg-border'
                              )}
                            />
                          )}
                        </div>
                        <div className="pt-0.5">
                          <p
                            className={cn(
                              'font-sans text-sm',
                              step.completed ? 'font-semibold text-ink' : 'text-ink-secondary'
                            )}
                          >
                            {step.label}
                          </p>
                          <p className="font-sans text-xs text-ink-secondary">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {/* Ordered Products */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-xl font-medium text-ink">Ordered Products</h3>
                  <Link
                    to={`/orders/${trackedOrder.orderId}`}
                    className="font-sans text-xs font-medium text-brand-green hover:underline"
                  >
                    Full Order Details
                  </Link>
                </div>
                <ul className="space-y-3">
                  {trackedOrder.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3.5 p-3 rounded-[4px] border border-border bg-ivory/40"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 aspect-[3/4] object-cover object-top rounded-[4px]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base font-medium text-ink truncate">
                          {item.name}
                        </p>
                        <p className="font-sans text-xs text-ink-secondary">
                          {item.selectedColor.name} · Size {item.selectedSize} · Qty{' '}
                          {item.quantity}
                        </p>
                      </div>
                      <span className="font-sans text-sm font-semibold text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
