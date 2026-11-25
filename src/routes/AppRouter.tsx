import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductDetailsPage = lazy(() => import('@/pages/ProductDetailsPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const OrderDetailsPage = lazy(() => import('@/pages/OrderDetailsPage'));
const TrackOrderPage = lazy(() => import('@/pages/TrackOrderPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const PolicyPage = lazy(() => import('@/pages/PolicyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const ROUTE_TITLES: { match: (path: string) => boolean; title: string }[] = [
  { match: (p) => p === '/', title: 'Smart Fashion Stores — Smart Looks for Sharp Women' },
  { match: (p) => p === '/shop', title: 'Shop All Ethnic Wear | Smart Fashion Stores' },
  { match: (p) => p === '/new-arrivals', title: 'New Arrivals | Smart Fashion Stores' },
  { match: (p) => p.startsWith('/category/'), title: 'Collection Category | Smart Fashion Stores' },
  { match: (p) => p.startsWith('/collection/'), title: 'Curated Collection | Smart Fashion Stores' },
  { match: (p) => p.startsWith('/product/'), title: 'Product Details | Smart Fashion Stores' },
  { match: (p) => p === '/search', title: 'Search Catalog | Smart Fashion Stores' },
  { match: (p) => p === '/wishlist', title: 'Saved Wishlist | Smart Fashion Stores' },
  { match: (p) => p === '/cart', title: 'Shopping Bag | Smart Fashion Stores' },
  { match: (p) => p === '/checkout', title: 'Demo Checkout | Smart Fashion Stores' },
  { match: (p) => p === '/order-success', title: 'Order Confirmed (Demo) | Smart Fashion Stores' },
  { match: (p) => p === '/login', title: 'Sign In | Smart Fashion Stores' },
  { match: (p) => p === '/register', title: 'Create Account | Smart Fashion Stores' },
  { match: (p) => p === '/forgot-password', title: 'Reset Password | Smart Fashion Stores' },
  { match: (p) => p === '/account', title: 'My Account | Smart Fashion Stores' },
  { match: (p) => p === '/orders', title: 'My Orders | Smart Fashion Stores' },
  { match: (p) => p.startsWith('/orders/'), title: 'Order Details | Smart Fashion Stores' },
  { match: (p) => p === '/track-order', title: 'Track Order | Smart Fashion Stores' },
  { match: (p) => p === '/about', title: 'About Us | Smart Fashion Stores' },
  { match: (p) => p === '/contact', title: 'Contact Us | Smart Fashion Stores' },
  { match: (p) => p === '/faq', title: 'Frequently Asked Questions | Smart Fashion Stores' },
  { match: (p) => p === '/shipping-policy', title: 'Shipping Policy | Smart Fashion Stores' },
  { match: (p) => p === '/returns-policy', title: 'Returns & Refund Policy | Smart Fashion Stores' },
  { match: (p) => p === '/privacy-policy', title: 'Privacy Policy | Smart Fashion Stores' },
  { match: (p) => p === '/terms', title: 'Terms & Conditions | Smart Fashion Stores' },
];

function RouteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const entry = ROUTE_TITLES.find((r) => r.match(pathname));
    document.title = entry?.title ?? 'Page Not Found | Smart Fashion Stores';
  }, [pathname]);

  return null;
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-ivory">
      <p className="font-serif text-xl text-brand-green tracking-wide">
        Smart Fashion Stores…
      </p>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <RouteEffects />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage mode="shop" />} />
            <Route path="/new-arrivals" element={<ShopPage mode="new-arrivals" />} />
            <Route path="/category/:slug" element={<ShopPage mode="category" />} />
            <Route path="/collection/:slug" element={<ShopPage mode="collection" />} />
            <Route path="/product/:slug" element={<ProductDetailsPage />} />
            <Route path="/search" element={<ShopPage mode="search" />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/shipping-policy" element={<PolicyPage policyKey="shipping-policy" />} />
            <Route path="/returns-policy" element={<PolicyPage policyKey="returns-policy" />} />
            <Route path="/privacy-policy" element={<PolicyPage policyKey="privacy-policy" />} />
            <Route path="/terms" element={<PolicyPage policyKey="terms" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
