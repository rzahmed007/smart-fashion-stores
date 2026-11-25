import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Info, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import type { OrderSummary } from '@/types';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { CheckoutOrderSummary } from '@/components/checkout/CheckoutOrderSummary';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

const FREE_SHIPPING_THRESHOLD = 2999;

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  billingLine1?: string;
  billingCity?: string;
  billingPincode?: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBuyNowMode = searchParams.get('mode') === 'buy-now';

  const {
    items: cartItems,
    buyNowItem,
    clearCart,
    clearBuyNowItem,
    setLastOrder,
  } = useCartStore();

  const checkoutItems = isBuyNowMode && buyNowItem ? [buyNowItem] : cartItems;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingLine1, setBillingLine1] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingPincode, setBillingPincode] = useState('');

  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online-demo'>('cod');
  const [notes, setNotes] = useState('');

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittedRef = useRef(false);

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const mrpTotal = checkoutItems.reduce(
    (sum, item) => sum + (item.originalPrice ?? item.price) * item.quantity,
    0
  );
  const catalogDiscount = Math.max(0, mrpTotal - subtotal);

  const couponDiscount =
    appliedCoupon === 'SMART10'
      ? Math.round(subtotal * 0.1)
      : appliedCoupon === 'FESTIVE500' && subtotal >= 4000
        ? 500
        : 0;

  const shippingFee =
    deliveryOption === 'express'
      ? 299
      : subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : 150;

  const total = Math.max(0, subtotal - couponDiscount + shippingFee);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponMessage('Enter SMART10 (10% off) or FESTIVE500 (₹500 off above ₹4,000).');
      return;
    }
    if (code === 'SMART10') {
      setAppliedCoupon('SMART10');
      setCouponMessage('Demo code SMART10 applied for 10% off.');
      return;
    }
    if (code === 'FESTIVE500') {
      if (subtotal < 4000) {
        setCouponMessage('FESTIVE500 requires a subtotal of ₹4,000 or more.');
        return;
      }
      setAppliedCoupon('FESTIVE500');
      setCouponMessage('Demo code FESTIVE500 applied for ₹500 off.');
      return;
    }
    setCouponMessage('Invalid promo code. Try SMART10 or FESTIVE500.');
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      next.fullName = 'Please enter your full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (phone.replace(/\D/g, '').length !== 10) {
      next.phone = 'Please enter a 10-digit mobile number.';
    }
    if (!line1.trim() || line1.trim().length < 5) {
      next.line1 = 'Please enter your street address / house details.';
    }
    if (!city.trim()) {
      next.city = 'City is required.';
    }
    if (!stateName.trim()) {
      next.state = 'State is required.';
    }
    if (pincode.replace(/\D/g, '').length !== 6) {
      next.pincode = 'Enter a valid 6-digit PIN code.';
    }
    if (!sameAsShipping) {
      if (!billingLine1.trim()) next.billingLine1 = 'Billing street address is required.';
      if (!billingCity.trim()) next.billingCity = 'Billing city is required.';
      if (billingPincode.replace(/\D/g, '').length !== 6) {
        next.billingPincode = 'Enter a valid 6-digit billing PIN code.';
      }
    }
    return next;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submittedRef.current || isSubmitting || checkoutItems.length === 0) return;

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    submittedRef.current = true;
    setIsSubmitting(true);

    const orderId = `SFS-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    const order: OrderSummary = {
      orderId,
      createdAt: new Date().toISOString(),
      items: checkoutItems,
      subtotal,
      discount: catalogDiscount,
      couponDiscount,
      couponCode: appliedCoupon ?? undefined,
      shipping: shippingFee,
      total,
      paymentMethod,
      deliveryOption,
      customer: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.replace(/\D/g, ''),
      },
      shippingAddress: {
        line1: line1.trim(),
        line2: line2.trim() || undefined,
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.replace(/\D/g, ''),
      },
      notes: notes.trim() || undefined,
      mode: isBuyNowMode && buyNowItem ? 'buy-now' : 'cart',
      status: 'Confirmed (Demo)',
    };

    setLastOrder(order);

    if (isBuyNowMode && buyNowItem) {
      clearBuyNowItem();
    } else {
      clearCart();
    }

    navigate('/order-success', { state: { order }, replace: true });
  };

  if (checkoutItems.length === 0) {
    return (
      <section className="py-16 bg-ivory min-h-[70vh]">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-lg bg-white border border-border rounded-[4px] p-8 sm:p-12">
            <h1 className="font-serif text-3xl font-medium text-ink">No items to checkout</h1>
            <p className="mt-2 font-sans text-sm text-ink-secondary">
              Add pieces to your shopping bag or select Buy Now on any product to preview the demo
              checkout flow.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild variant="primary">
                <Link to="/shop">Explore Catalog</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/cart">View Bag</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 bg-ivory pb-24 lg:pb-14">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: 'Shopping Bag', to: '/cart' }, { label: 'Demo Checkout' }]}
        />

        {/* Demo Notice Banner */}
        <div className="mb-6 rounded-[4px] border border-brand-green/30 bg-white px-4 py-3 flex items-start gap-3">
          <Info className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
          <div className="font-sans text-xs sm:text-sm text-ink">
            <span className="font-semibold text-brand-green">Interactive Client Demonstration:</span>{' '}
            This single-page guest checkout simulates order placement locally. No real payments are
            processed and no card or UPI credentials are collected.
            {isBuyNowMode && cartItems.length > 0 && (
              <span className="block mt-1 text-xs text-ink-secondary">
                Express Buy Now mode active — your {cartItems.length} existing bag{' '}
                {cartItems.length === 1 ? 'item remains' : 'items remain'} safely saved in your
                shopping bag.
              </span>
            )}
          </div>
        </div>

        <h1 className="font-serif text-[30px] sm:text-[40px] font-medium leading-[1.1] text-ink mb-6">
          Guest Checkout
        </h1>

        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* Contact Information */}
            <div className="bg-white border border-border rounded-[4px] p-5 sm:p-6 space-y-4">
              <h2 className="font-serif text-2xl font-medium text-ink">1. Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="chk-name" className="block font-sans text-xs font-medium text-ink mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="chk-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                  />
                  {errors.fullName && (
                    <p className="mt-1 font-sans text-xs text-red-700">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="chk-email" className="block font-sans text-xs font-medium text-ink mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="chk-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@example.com"
                    className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                  />
                  {errors.email && (
                    <p className="mt-1 font-sans text-xs text-red-700">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="chk-phone" className="block font-sans text-xs font-medium text-ink mb-1.5">
                    Mobile Number (10 digits) *
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9820000000"
                    className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                  />
                  {errors.phone && (
                    <p className="mt-1 font-sans text-xs text-red-700">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-border rounded-[4px] p-5 sm:p-6 space-y-4">
              <h2 className="font-serif text-2xl font-medium text-ink">2. Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="chk-line1" className="block font-sans text-xs font-medium text-ink mb-1.5">
                    Address Line 1 *
                  </label>
                  <input
                    id="chk-line1"
                    type="text"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="Flat / House No., Building, Street"
                    className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                  />
                  {errors.line1 && (
                    <p className="mt-1 font-sans text-xs text-red-700">{errors.line1}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="chk-line2" className="block font-sans text-xs font-medium text-ink mb-1.5">
                    Apartment / Landmark (Optional)
                  </label>
                  <input
                    id="chk-line2"
                    type="text"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="Near Heritage Square"
                    className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div>
                  <label htmlFor="chk-city" className="block font-sans text-xs font-medium text-ink mb-1.5">
                    City *
                  </label>
                  <input
                    id="chk-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                  />
                  {errors.city && (
                    <p className="mt-1 font-sans text-xs text-red-700">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="chk-state" className="block font-sans text-xs font-medium text-ink mb-1.5">
                    State *
                  </label>
                  <input
                    id="chk-state"
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                  />
                  {errors.state && (
                    <p className="mt-1 font-sans text-xs text-red-700">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="chk-pin" className="block font-sans text-xs font-medium text-ink mb-1.5">
                    PIN Code (6 digits) *
                  </label>
                  <input
                    id="chk-pin"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="400001"
                    className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                  />
                  {errors.pincode && (
                    <p className="mt-1 font-sans text-xs text-red-700">{errors.pincode}</p>
                  )}
                </div>
              </div>

              {/* Billing Address Toggle */}
              <div className="pt-2 border-t border-border">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-brand-green"
                  />
                  <span className="font-sans text-sm text-ink">
                    Billing address is the same as shipping address
                  </span>
                </label>

                {!sameAsShipping && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-3">
                      <label htmlFor="chk-bill-line1" className="block font-sans text-xs font-medium text-ink mb-1">
                        Billing Street Address *
                      </label>
                      <input
                        id="chk-bill-line1"
                        type="text"
                        value={billingLine1}
                        onChange={(e) => setBillingLine1(e.target.value)}
                        className="w-full h-10 px-3 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                      />
                      {errors.billingLine1 && (
                        <p className="mt-1 font-sans text-xs text-red-700">{errors.billingLine1}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="chk-bill-city" className="block font-sans text-xs font-medium text-ink mb-1">
                        Billing City *
                      </label>
                      <input
                        id="chk-bill-city"
                        type="text"
                        value={billingCity}
                        onChange={(e) => setBillingCity(e.target.value)}
                        className="w-full h-10 px-3 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                      />
                      {errors.billingCity && (
                        <p className="mt-1 font-sans text-xs text-red-700">{errors.billingCity}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="chk-bill-pin" className="block font-sans text-xs font-medium text-ink mb-1">
                        Billing PIN *
                      </label>
                      <input
                        id="chk-bill-pin"
                        type="text"
                        maxLength={6}
                        value={billingPincode}
                        onChange={(e) => setBillingPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-10 px-3 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                      />
                      {errors.billingPincode && (
                        <p className="mt-1 font-sans text-xs text-red-700">
                          {errors.billingPincode}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-white border border-border rounded-[4px] p-5 sm:p-6 space-y-4">
              <h2 className="font-serif text-2xl font-medium text-ink">3. Delivery Option (Demo)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryOption('standard')}
                  className={cn(
                    'p-4 rounded-[4px] border text-left transition-colors',
                    deliveryOption === 'standard'
                      ? 'border-brand-green bg-ivory/70'
                      : 'border-border bg-white hover:border-brand-muted'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm font-semibold text-ink flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-green" />
                      Standard Dispatch
                    </span>
                    <span className="font-sans text-xs font-semibold text-brand-green">
                      {subtotal >= FREE_SHIPPING_THRESHOLD ? 'Complimentary' : formatPrice(150)}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-xs text-ink-secondary">
                    Pan-India courier coordination (simulated timeline for demo)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryOption('express')}
                  className={cn(
                    'p-4 rounded-[4px] border text-left transition-colors',
                    deliveryOption === 'express'
                      ? 'border-brand-green bg-ivory/70'
                      : 'border-border bg-white hover:border-brand-muted'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm font-semibold text-ink flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-green" />
                      Express Priority
                    </span>
                    <span className="font-sans text-xs font-semibold text-ink">
                      {formatPrice(299)}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-xs text-ink-secondary">
                    Priority atelier packing & dispatch handling (demo option)
                  </p>
                </button>
              </div>
            </div>

            {/* Payment Option & Order Notes */}
            <div className="bg-white border border-border rounded-[4px] p-5 sm:p-6 space-y-4">
              <h2 className="font-serif text-2xl font-medium text-ink">4. Payment Method (Demo)</h2>
              <div className="space-y-3">
                <label
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-[4px] border cursor-pointer transition-colors',
                    paymentMethod === 'cod'
                      ? 'border-brand-green bg-ivory/70'
                      : 'border-border bg-white'
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-brand-green"
                  />
                  <div>
                    <p className="font-sans text-sm font-semibold text-ink">
                      Cash on Delivery (Simulated)
                    </p>
                    <p className="font-sans text-xs text-ink-secondary mt-0.5">
                      Confirm demo order without entering online payment details.
                    </p>
                  </div>
                </label>

                <label
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-[4px] border cursor-pointer transition-colors',
                    paymentMethod === 'online-demo'
                      ? 'border-brand-green bg-ivory/70'
                      : 'border-border bg-white'
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'online-demo'}
                    onChange={() => setPaymentMethod('online-demo')}
                    className="mt-1 accent-brand-green"
                  />
                  <div>
                    <p className="font-sans text-sm font-semibold text-ink flex items-center gap-1.5">
                      <span>Simulated Online Payment (UPI / Razorpay Demo)</span>
                      <ShieldCheck className="w-4 h-4 text-brand-green" />
                    </p>
                    <p className="font-sans text-xs text-ink-secondary mt-0.5">
                      Simulates an instant digital payment confirmation. No card or UPI inputs are
                      requested.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <label htmlFor="chk-notes" className="block font-sans text-xs font-medium text-ink mb-1.5">
                  Order or Tailoring Notes (Optional)
                </label>
                <textarea
                  id="chk-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gift note or delivery instruction..."
                  className="w-full p-3 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <CheckoutOrderSummary
              items={checkoutItems}
              subtotal={subtotal}
              catalogDiscount={catalogDiscount}
              couponCode={couponInput}
              appliedCoupon={appliedCoupon}
              couponDiscount={couponDiscount}
              couponMessage={couponMessage}
              shippingFee={shippingFee}
              total={total}
              isSubmitting={isSubmitting}
              onCouponInputChange={setCouponInput}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={() => {
                setAppliedCoupon(null);
                setCouponInput('');
                setCouponMessage(null);
              }}
            />
          </div>
        </form>
      </div>
    </section>
  );
}
