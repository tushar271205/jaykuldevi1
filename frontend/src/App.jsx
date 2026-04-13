import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layouts
import GlobalPageLoader from './components/common/GlobalPageLoader';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import AuthPage from './pages/customer/AuthPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderSuccessPage from './pages/customer/OrderSuccessPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import WishlistPage from './pages/customer/WishlistPage';
import ProfilePage from './pages/customer/ProfilePage';
import ReviewPage from './pages/customer/ReviewPage';
import AboutUsPage from './pages/customer/AboutUsPage';
import PrivacyPolicyPage from './pages/customer/PrivacyPolicyPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminRevenue from './pages/admin/AdminRevenue';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminUsers from './pages/admin/AdminUsers';

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>Loading...</p>
      </div>
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
};

// Public layout (navbar + footer)
const PublicLayout = ({ children, showFooter = true }) => (
  <>
    <Navbar />
    <CartDrawer />
    <main className="page-layout">{children}</main>
    {showFooter && <Footer />}
  </>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <GlobalPageLoader />
      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/boys" element={<PublicLayout><ProductsPage category="boys" /></PublicLayout>} />
      <Route path="/girls" element={<PublicLayout><ProductsPage category="girls" /></PublicLayout>} />
      <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
      <Route path="/product/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/about" element={<PublicLayout><AboutUsPage /></PublicLayout>} />
      <Route path="/privacy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />

      {/* Protected Customer Routes */}
      <Route path="/checkout" element={
        <ProtectedRoute>
          <PublicLayout showFooter={false}><CheckoutPage /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/order-success/:orderId" element={
        <ProtectedRoute>
          <PublicLayout><OrderSuccessPage /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/order/:id" element={
        <ProtectedRoute>
          <PublicLayout><OrderDetailPage /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/account/orders" element={
        <ProtectedRoute>
          <PublicLayout><OrdersPage /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/account/profile" element={
        <ProtectedRoute>
          <PublicLayout><ProfilePage /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/wishlist" element={
        <ProtectedRoute>
          <PublicLayout><WishlistPage /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/review/:orderId/:productId" element={
        <ProtectedRoute>
          <PublicLayout><ReviewPage /></PublicLayout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="revenue" element={<AdminRevenue />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={
        <PublicLayout>
          <div className="empty-state" style={{ minHeight: '60vh' }}>
            <div className="empty-state-icon">🔍</div>
            <h1 className="empty-state-title">Page Not Found</h1>
            <p className="empty-state-text">The page you're looking for doesn't exist.</p>
            <a href="/" className="btn btn-primary mt-4">Go Home</a>
          </div>
        </PublicLayout>
      } />
    </Routes>
    </>
  );
}

export default App;
