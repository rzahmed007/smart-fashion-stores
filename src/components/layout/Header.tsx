import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { PRIMARY_NAV_ITEMS, type NavItem } from '@/data/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/utils/cn';

export function Header() {
  const navigate = useNavigate();
  const [activeMega, setActiveMega] = useState<NavItem | null>(null);

  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const {
    openCart,
    openSearch,
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
  } = useUIStore();

  return (
    <header
      className="sticky top-0 z-40 w-full bg-ivory/95 backdrop-blur-md border-b border-border"
      onMouseLeave={() => setActiveMega(null)}
    >
      <AnnouncementBar />

      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-[74px] items-center justify-between gap-4">
          {/* Mobile Left Controls */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              type="button"
              onClick={openMobileMenu}
              aria-label="Open navigation menu"
              className="h-10 w-10 -ml-2 flex items-center justify-center text-ink hover:text-brand-green"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search products"
              className="h-10 w-10 flex items-center justify-center text-ink hover:text-brand-green"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <BrandLogo className="shrink-0" />

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-3.5 xl:gap-6"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setActiveMega(null);
            }}
          >
            {PRIMARY_NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative py-6"
                onMouseEnter={() => setActiveMega(item.hasMegaMenu ? item : null)}
                onFocus={() => setActiveMega(item.hasMegaMenu ? item : null)}
              >
                <NavLink
                  to={item.to}
                  onClick={() => setActiveMega(null)}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-1 font-sans text-[12.5px] xl:text-[14px] font-medium tracking-[0.03em] transition-colors whitespace-nowrap',
                      isActive
                        ? 'text-brand-green underline underline-offset-8 decoration-brand-green decoration-2'
                        : 'text-ink hover:text-brand-green'
                    )
                  }
                >
                  <span>{item.label}</span>
                  {item.hasMegaMenu && (
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 transition-transform duration-200',
                        activeMega?.label === item.label && 'rotate-180'
                      )}
                      aria-hidden="true"
                    />
                  )}
                </NavLink>
              </div>
            ))}
          </nav>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search catalog"
              className="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-[4px] text-ink hover:bg-brand-green/5 hover:text-brand-green transition-colors"
            >
              <Search className="w-[19px] h-[19px]" strokeWidth={1.75} />
            </button>

            <a
              href="https://wa.me/919820000000?text=Hello%20Smart%20Fashion%20Stores%2C%20I%20would%20like%20assistance%20with%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Inquiry"
              title="WhatsApp Inquiry"
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-[4px] text-ink hover:bg-brand-green/5 hover:text-brand-green transition-colors"
            >
              <MessageCircle className="w-[19px] h-[19px]" strokeWidth={1.75} />
            </a>

            <Link
              to="/account"
              aria-label="Customer Account"
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-[4px] text-ink hover:bg-brand-green/5 hover:text-brand-green transition-colors"
            >
              <User className="w-[19px] h-[19px]" strokeWidth={1.75} />
            </Link>

            <Link
              to="/wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-[4px] text-ink hover:bg-brand-green/5 hover:text-brand-green transition-colors"
            >
              <Heart className="w-[19px] h-[19px]" strokeWidth={1.75} />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-brand-secondary text-white font-sans text-[10px] font-medium flex items-center justify-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Shopping bag (${cartCount} items)`}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-[4px] text-ink hover:bg-brand-green/5 hover:text-brand-green transition-colors"
            >
              <ShoppingBag className="w-[19px] h-[19px]" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-brand-green text-white font-sans text-[10px] font-medium flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Mega Menu Dropdown */}
      {activeMega && activeMega.columns && (
        <div className="hidden lg:block absolute inset-x-0 top-full bg-ivory border-b border-border shadow-lg">
          <div className="mx-auto max-w-container px-6 lg:px-8 py-8 grid grid-cols-12 gap-8">
            <div className="col-span-7 grid grid-cols-2 gap-8">
              {activeMega.columns.map((col) => (
                <div key={col.heading}>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-secondary mb-3.5">
                    {col.heading}
                  </p>
                  <ul className="space-y-2.5">
                    {col.links.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          to={sub.to}
                          onClick={() => setActiveMega(null)}
                          className="font-sans text-sm text-ink hover:text-brand-green hover:translate-x-0.5 inline-block transition-all"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {activeMega.featuredImage && (
              <div className="col-span-5">
                <Link
                  to={activeMega.to}
                  onClick={() => setActiveMega(null)}
                  className="group flex items-center gap-5 p-3 bg-white border border-border rounded-[4px] hover:border-brand-green transition-colors"
                >
                  <div className="w-28 aspect-[3/4] shrink-0 overflow-hidden rounded-[4px] bg-[#F1EFE4]">
                    <img
                      src={activeMega.featuredImage}
                      alt={activeMega.featuredTitle || activeMega.label}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-brand-secondary">
                      Featured Edit
                    </span>
                    <h4 className="mt-1 font-serif text-xl font-medium text-ink">
                      {activeMega.featuredTitle}
                    </h4>
                    <p className="mt-1 font-sans text-xs text-ink-secondary">
                      {activeMega.featuredSubtitle}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 font-sans text-xs font-medium uppercase tracking-[0.12em] text-brand-green">
                      Explore Edit <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      <Dialog.Root
        open={isMobileMenuOpen}
        onOpenChange={(open) => !open && closeMobileMenu()}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px] lg:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-[340px] bg-ivory border-r border-border flex flex-col focus:outline-none lg:hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-white">
              <BrandLogo />
              <Dialog.Close
                aria-label="Close navigation menu"
                className="h-9 w-9 rounded-[4px] border border-border flex items-center justify-center text-ink"
              >
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  openSearch();
                }}
                className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-white flex items-center gap-2.5 text-sm text-ink-secondary"
              >
                <Search className="w-4 h-4 text-brand-green" />
                <span>Search kurtis, salwar suits...</span>
              </button>

              <nav aria-label="Mobile navigation">
                <ul className="divide-y divide-border">
                  {PRIMARY_NAV_ITEMS.map((item) => (
                    <li key={item.label} className="py-3">
                      <Link
                        to={item.to}
                        onClick={closeMobileMenu}
                        className="flex items-center justify-between font-serif text-xl font-medium text-ink hover:text-brand-green"
                      >
                        <span>{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-ink-secondary" />
                      </Link>
                      {item.columns && (
                        <ul className="mt-2 pl-3 space-y-1.5 border-l border-border">
                          {item.columns[0].links.map((sub) => (
                            <li key={sub.label}>
                              <Link
                                to={sub.to}
                                onClick={closeMobileMenu}
                                className="font-sans text-xs text-ink-secondary hover:text-brand-green"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="pt-2 border-t border-border space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    navigate('/account');
                  }}
                  className="w-full h-10 px-3 rounded-[4px] border border-border bg-white flex items-center gap-2.5 font-sans text-sm text-ink"
                >
                  <User className="w-4 h-4 text-brand-green" />
                  <span>My Account & Orders</span>
                </button>
                <a
                  href="https://wa.me/919820000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 px-3 rounded-[4px] bg-brand-green text-white flex items-center justify-center gap-2 font-sans text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Styling Help</span>
                </a>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
