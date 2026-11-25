import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductDetailsPage = lazy(() => import('@/pages/ProductDetailsPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'));
const ComingSoonRoutePage = lazy(() => import('@/pages/ComingSoonRoutePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

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
            <Route path="/account" element={<ComingSoonRoutePage title="My Account" />} />
            <Route path="/orders" element={<ComingSoonRoutePage title="My Orders" />} />
            <Route path="/track-order" element={<ComingSoonRoutePage title="Track Order" />} />
            <Route path="/about" element={<ComingSoonRoutePage title="About Smart Fashion Stores" />} />
            <Route path="/contact" element={<ComingSoonRoutePage title="Contact Us" />} />
            <Route path="/shipping-policy" element={<ComingSoonRoutePage title="Shipping Policy" />} />
            <Route path="/returns-policy" element={<ComingSoonRoutePage title="Returns & Refund Policy" />} />
            <Route path="/privacy-policy" element={<ComingSoonRoutePage title="Privacy Policy" />} />
            <Route path="/terms" element={<ComingSoonRoutePage title="Terms & Conditions" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
