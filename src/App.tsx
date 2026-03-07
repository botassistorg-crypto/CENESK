import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { CartProvider } from './context/CartContext';
import { ProductSkeleton } from './components/ui/Skeleton';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Offers = lazy(() => import('./pages/Offers'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const SizeGuide = lazy(() => import('./pages/SizeGuide'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Suspense fallback={<div className="container mx-auto px-4 py-24 grid grid-cols-1 md:grid-cols-3 gap-8"><ProductSkeleton /><ProductSkeleton /><ProductSkeleton /></div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="shop/product/:id" element={<ProductDetails />} />
              <Route path="shop/:category" element={<Shop />} />
              <Route path="offers" element={<Offers />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-confirmation" element={<OrderConfirmation />} />
              <Route path="track-order" element={<TrackOrder />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="return-policy" element={<ReturnPolicy />} />
              <Route path="size-guide" element={<SizeGuide />} />
              <Route path="faq" element={<FAQ />} />
            </Route>
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </Router>
    </CartProvider>
  );
}
