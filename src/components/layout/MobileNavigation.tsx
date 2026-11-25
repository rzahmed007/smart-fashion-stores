import { NavLink } from 'react-router-dom';
import { Grid2X2, Heart, Home, Search, User } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { cn } from '@/utils/cn';

export function MobileNavigation() {
  const openSearch = useUIStore((s) => s.openSearch);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden bg-ivory/95 backdrop-blur-md border-t border-border"
    >
      <div className="grid grid-cols-5 h-16">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 font-sans text-[10px] tracking-[0.06em] uppercase transition-colors',
              isActive ? 'text-brand-green font-semibold' : 'text-ink-secondary'
            )
          }
        >
          <Home className="w-[18px] h-[18px]" strokeWidth={1.75} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/shop"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 font-sans text-[10px] tracking-[0.06em] uppercase transition-colors',
              isActive ? 'text-brand-green font-semibold' : 'text-ink-secondary'
            )
          }
        >
          <Grid2X2 className="w-[18px] h-[18px]" strokeWidth={1.75} />
          <span>Shop</span>
        </NavLink>

        <button
          type="button"
          onClick={openSearch}
          className="flex flex-col items-center justify-center gap-1 font-sans text-[10px] tracking-[0.06em] uppercase text-ink-secondary hover:text-brand-green"
        >
          <Search className="w-[18px] h-[18px]" strokeWidth={1.75} />
          <span>Search</span>
        </button>

        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            cn(
              'relative flex flex-col items-center justify-center gap-1 font-sans text-[10px] tracking-[0.06em] uppercase transition-colors',
              isActive ? 'text-brand-green font-semibold' : 'text-ink-secondary'
            )
          }
        >
          <div className="relative">
            <Heart className="w-[18px] h-[18px]" strokeWidth={1.75} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-1 rounded-full bg-brand-secondary text-white text-[9px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span>Wishlist</span>
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 font-sans text-[10px] tracking-[0.06em] uppercase transition-colors',
              isActive ? 'text-brand-green font-semibold' : 'text-ink-secondary'
            )
          }
        >
          <User className="w-[18px] h-[18px]" strokeWidth={1.75} />
          <span>Account</span>
        </NavLink>
      </div>
    </nav>
  );
}
