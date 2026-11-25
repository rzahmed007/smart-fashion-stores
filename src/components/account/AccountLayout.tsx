import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Truck,
  User,
} from 'lucide-react';
import { useCustomerStore } from '@/store/useCustomerStore';
import { cn } from '@/utils/cn';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logoutDemoSession } = useCustomerStore();

  const currentTab = new URLSearchParams(location.search).get('tab');

  const navItems = [
    {
      label: 'Overview',
      to: '/account',
      active: location.pathname === '/account' && !currentTab,
      icon: LayoutDashboard,
    },
    {
      label: 'My Profile',
      to: '/account?tab=profile',
      active: location.pathname === '/account' && currentTab === 'profile',
      icon: User,
    },
    {
      label: 'My Orders',
      to: '/orders',
      active: location.pathname.startsWith('/orders'),
      icon: Package,
    },
    {
      label: 'Saved Addresses',
      to: '/account?tab=addresses',
      active: location.pathname === '/account' && currentTab === 'addresses',
      icon: MapPin,
    },
    {
      label: 'Wishlist',
      to: '/wishlist',
      active: location.pathname === '/wishlist',
      icon: Heart,
    },
    {
      label: 'Track Order',
      to: '/track-order',
      active: location.pathname === '/track-order',
      icon: Truck,
    },
  ];

  const handleLogout = () => {
    logoutDemoSession();
    navigate('/login');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Desktop Sidebar & Mobile Accessible Nav */}
      <aside aria-label="Account navigation" className="lg:col-span-3">
        {/* Mobile Navigation Strip */}
        <div className="lg:hidden space-y-3 mb-2">
          <div className="flex items-center justify-between bg-white border border-border rounded-[4px] px-4 py-3">
            <div>
              <p className="font-serif text-lg font-medium text-ink">{profile.fullName}</p>
              <p className="font-sans text-xs text-ink-secondary">Demo Customer Account</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-border font-sans text-xs text-ink hover:border-brand-green"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={cn(
                    'shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] border font-sans text-xs font-medium whitespace-nowrap transition-colors',
                    item.active
                      ? 'bg-brand-green border-brand-green text-white'
                      : 'bg-white border-border text-ink hover:border-brand-green'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block sticky top-28 bg-white border border-border rounded-[4px] overflow-hidden">
          <div className="p-5 border-b border-border bg-ivory/60">
            <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-brand-secondary">
              Demo Account
            </p>
            <p className="mt-1 font-serif text-xl font-medium text-ink">{profile.fullName}</p>
            <p className="font-sans text-xs text-ink-secondary truncate">{profile.email}</p>
          </div>

          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-[4px] font-sans text-sm transition-colors',
                    item.active
                      ? 'bg-brand-green text-white font-medium'
                      : 'text-ink hover:bg-ivory hover:text-brand-green'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[4px] font-sans text-sm text-ink-secondary hover:bg-red-50 hover:text-red-700 transition-colors mt-2 border-t border-border pt-3"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      <div className="lg:col-span-9 min-w-0">{children}</div>
    </div>
  );
}
