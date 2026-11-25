import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Edit2,
  Heart,
  MapPin,
  Package,
  Plus,
  Sparkles,
  Trash2,
  Truck,
  User,
} from 'lucide-react';
import { useCustomerStore } from '@/store/useCustomerStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { catalogService } from '@/services/catalogService';
import type { SavedAddress } from '@/types';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { AccountLayout } from '@/components/account/AccountLayout';
import { AddressFormModal } from '@/components/account/AddressFormModal';
import { formatPrice } from '@/utils/format';

export default function AccountPage() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const {
    isAuthenticated,
    profile,
    addresses,
    orders,
    loginDemoSession,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useCustomerStore();
  const wishlistIds = useWishlistStore((s) => s.productIds);

  const [editName, setEditName] = useState(profile.fullName);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

  useEffect(() => {
    setEditName(profile.fullName);
    setEditEmail(profile.email);
    setEditPhone(profile.phone);
  }, [profile]);

  if (!isAuthenticated) {
    return (
      <section className="py-12 sm:py-16 bg-ivory min-h-[75vh]">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'My Account' }]} />

          <div className="mx-auto max-w-xl bg-white border border-border rounded-[6px] p-7 sm:p-10 text-center space-y-5">
            <div className="h-14 w-14 mx-auto rounded-full bg-ivory border border-border flex items-center justify-center text-brand-green">
              <User className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-brand-secondary">
                Customer Portal · Client Demo
              </p>
              <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-ink">
                Sign In to Your Account
              </h1>
              <p className="mt-2 font-sans text-sm text-ink-secondary">
                Preview the customer account experience with instant Demo Login, or sign in via the
                customer login page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => loginDemoSession(undefined, true)}
              >
                <Sparkles className="w-4 h-4" />
                <span>Demo Login</span>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Go to Sign In Page</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const savedProducts = catalogService.getProductsByIds(wishlistIds).slice(0, 3);
  const recentOrders = orders.slice(0, 2);

  const handleProfileSave = (e: FormEvent) => {
    e.preventDefault();
    if (editName.trim().length < 2) {
      setProfileError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.trim())) {
      setProfileError('Please enter a valid email address.');
      return;
    }
    if (editPhone.replace(/\D/g, '').length !== 10) {
      setProfileError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setProfileError(null);
    updateProfile({
      fullName: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.replace(/\D/g, ''),
    });
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <section className="py-8 sm:py-12 bg-ivory min-h-[75vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'My Account' }]} />

        <AccountLayout>
          {/* OVERVIEW VIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white border border-border rounded-[4px] p-6">
                <p className="font-sans text-xs uppercase tracking-[0.18em] text-brand-secondary">
                  Account Overview · Demo Session
                </p>
                <h1 className="mt-1.5 font-serif text-3xl sm:text-4xl font-medium text-ink">
                  Namaste, {profile.fullName}
                </h1>
                <p className="mt-1.5 font-sans text-sm text-ink-secondary">
                  Manage your demo profile, inspect simulated order history, and access your saved
                  wardrobe shortlist.
                </p>

                {/* Account Shortcuts */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Link
                    to="/orders"
                    className="p-4 rounded-[4px] border border-border bg-ivory/50 hover:border-brand-green transition-colors"
                  >
                    <Package className="w-5 h-5 text-brand-green mb-2" />
                    <p className="font-sans text-sm font-medium text-ink">My Orders</p>
                    <p className="font-sans text-xs text-ink-secondary">{orders.length} records</p>
                  </Link>
                  <Link
                    to="/account?tab=addresses"
                    className="p-4 rounded-[4px] border border-border bg-ivory/50 hover:border-brand-green transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-brand-green mb-2" />
                    <p className="font-sans text-sm font-medium text-ink">Addresses</p>
                    <p className="font-sans text-xs text-ink-secondary">
                      {addresses.length} saved
                    </p>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="p-4 rounded-[4px] border border-border bg-ivory/50 hover:border-brand-green transition-colors"
                  >
                    <Heart className="w-5 h-5 text-brand-green mb-2" />
                    <p className="font-sans text-sm font-medium text-ink">Wishlist</p>
                    <p className="font-sans text-xs text-ink-secondary">
                      {wishlistIds.length} saved
                    </p>
                  </Link>
                  <Link
                    to="/track-order"
                    className="p-4 rounded-[4px] border border-border bg-ivory/50 hover:border-brand-green transition-colors"
                  >
                    <Truck className="w-5 h-5 text-brand-green mb-2" />
                    <p className="font-sans text-sm font-medium text-ink">Track Order</p>
                    <p className="font-sans text-xs text-ink-secondary">Simulated timeline</p>
                  </Link>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white border border-border rounded-[4px] p-6">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h2 className="font-serif text-2xl font-medium text-ink">Recent Orders</h2>
                  <Link
                    to="/orders"
                    className="inline-flex items-center gap-1 font-sans text-xs font-medium text-brand-green hover:underline"
                  >
                    <span>View All Orders</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="mt-4 space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[4px] border border-border bg-ivory/40"
                    >
                      <div>
                        <p className="font-sans text-sm font-semibold text-ink">
                          {order.orderId}{' '}
                          <span className="ml-2 px-2 py-0.5 rounded-[2px] bg-white border border-border text-[11px] font-medium text-brand-green">
                            {order.status}
                          </span>
                        </p>
                        <p className="mt-1 font-sans text-xs text-ink-secondary">
                          {order.items[0]?.name}
                          {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''} ·{' '}
                          {formatPrice(order.total)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/orders/${order.orderId}`}>View Details</Link>
                        </Button>
                        <Button asChild variant="primary" size="sm">
                          <Link to={`/track-order?orderId=${order.orderId}`}>Track</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Products + Quick Shopping Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-border rounded-[4px] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-2xl font-medium text-ink">Saved Shortlist</h2>
                    <Link to="/wishlist" className="font-sans text-xs text-brand-green hover:underline">
                      Open Wishlist
                    </Link>
                  </div>
                  {savedProducts.length === 0 ? (
                    <p className="font-sans text-sm text-ink-secondary">
                      No pieces saved yet. Explore New Arrivals to build your wishlist.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {savedProducts.map((p) => (
                        <li key={p.id}>
                          <Link
                            to={`/product/${p.slug}`}
                            className="flex items-center gap-3 hover:bg-ivory/60 p-1.5 rounded-[4px] transition-colors"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-12 aspect-[3/4] object-cover object-top rounded-[4px] border border-border"
                            />
                            <div className="min-w-0">
                              <p className="font-serif text-base font-medium text-ink truncate">
                                {p.name}
                              </p>
                              <p className="font-sans text-xs text-brand-green font-semibold">
                                {formatPrice(p.price)}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-white border border-border rounded-[4px] p-6">
                  <h2 className="font-serif text-2xl font-medium text-ink mb-4">
                    Quick Shopping Links
                  </h2>
                  <ul className="divide-y divide-border font-sans text-sm">
                    {[
                      { label: 'Explore New Arrivals', to: '/new-arrivals' },
                      { label: 'Heritage Salwar Suits', to: '/category/salwar-suits' },
                      { label: 'Smart Collection Workwear', to: '/category/smart-collection' },
                      { label: 'Festive & Wedding Wear', to: '/category/festive-wear' },
                    ].map((link) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="py-3 flex items-center justify-between text-ink hover:text-brand-green"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="w-4 h-4 text-brand-green" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE VIEW */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-border rounded-[4px] p-6 sm:p-8 max-w-2xl space-y-5">
              <div>
                <h1 className="font-serif text-3xl font-medium text-ink">My Profile</h1>
                <p className="mt-1 font-sans text-sm text-ink-secondary">
                  Fictional demonstration profile stored locally in your browser.
                </p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label htmlFor="prof-name" className="block font-sans text-xs font-medium text-ink mb-1.5">
                    Customer Name
                  </label>
                  <input
                    id="prof-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="prof-email" className="block font-sans text-xs font-medium text-ink mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="prof-email"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="prof-phone" className="block font-sans text-xs font-medium text-ink mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    id="prof-phone"
                    type="tel"
                    maxLength={10}
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm"
                  />
                </div>

                {profileError && (
                  <p className="font-sans text-xs text-red-700" role="alert">
                    {profileError}
                  </p>
                )}

                {profileSaved && (
                  <div
                    role="status"
                    className="flex items-center gap-2 rounded-[4px] border border-brand-secondary/40 bg-ivory px-3.5 py-2.5 font-sans text-xs text-brand-green"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Demo profile details updated locally.</span>
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg">
                  Save Profile Changes
                </Button>
              </form>
            </div>
          )}

          {/* SAVED ADDRESSES VIEW */}
          {activeTab === 'addresses' && (
            <div className="space-y-5">
              <div className="bg-white border border-border rounded-[4px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-3xl font-medium text-ink">Saved Addresses</h1>
                  <p className="mt-1 font-sans text-sm text-ink-secondary">
                    Manage demo delivery destinations for faster demonstration checkout.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressModalOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Address</span>
                </Button>
              </div>

              {addresses.length === 0 ? (
                <div className="bg-white border border-border rounded-[4px] p-10 text-center">
                  <p className="font-serif text-2xl text-ink">No saved addresses</p>
                  <p className="mt-1 font-sans text-sm text-ink-secondary">
                    Add a demo delivery address to see it listed here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <article
                      key={addr.id}
                      className="bg-white border border-border rounded-[4px] p-5 flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-[4px] bg-ivory border border-border font-sans text-[11px] font-medium uppercase tracking-wider text-ink">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="font-sans text-[11px] font-semibold text-brand-green">
                              Default Address
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-sm font-semibold text-ink">
                          {addr.recipientName}
                        </p>
                        <p className="mt-1 font-sans text-xs text-ink-secondary leading-relaxed">
                          {addr.line1}
                          {addr.line2 ? `, ${addr.line2}` : ''}
                          <br />
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="mt-1.5 font-sans text-xs text-ink-secondary">
                          Phone: +91 {addr.phone}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                        {!addr.isDefault ? (
                          <button
                            type="button"
                            onClick={() => setDefaultAddress(addr.id)}
                            className="font-sans text-xs font-medium text-brand-green hover:underline"
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span className="font-sans text-xs text-ink-secondary">
                            Selected for delivery
                          </span>
                        )}

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAddress(addr);
                              setAddressModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 font-sans text-xs text-ink hover:text-brand-green"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteAddress(addr.id)}
                            className="inline-flex items-center gap-1 font-sans text-xs text-ink-secondary hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <AddressFormModal
                open={addressModalOpen}
                onOpenChange={setAddressModalOpen}
                initialAddress={editingAddress}
                onSave={(data) => {
                  if (editingAddress) {
                    updateAddress(editingAddress.id, data);
                  } else {
                    addAddress(data);
                  }
                }}
              />
            </div>
          )}
        </AccountLayout>
      </div>
    </section>
  );
}
