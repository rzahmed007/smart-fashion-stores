import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { SearchModal } from '@/components/layout/SearchModal';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { QuickShopModal } from '@/components/product/QuickShopModal';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-[4px] focus:bg-brand-green focus:text-white focus:font-sans focus:text-xs focus:font-medium"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
      <WhatsAppButton />
      <SearchModal />
      <CartDrawer />
      <QuickShopModal />
    </div>
  );
}
