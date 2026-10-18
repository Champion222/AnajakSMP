import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext.js';
import { CartProvider } from './context/CartContext.js';
import { Navbar } from './components/Navbar.js';
import { AnnouncementBanner } from './components/AnnouncementBanner.js';
import { Footer } from './components/Footer.js';
import { GuestCheckoutModal } from './components/GuestCheckoutModal.js';
import { MobileBottomNav } from './components/MobileBottomNav.js';

// Public Pages
import { HomePage } from './pages/HomePage.js';
import { StorePage } from './pages/StorePage.js';
import { CartPage } from './pages/CartPage.js';
import { PaymentPage } from './pages/PaymentPage.js';
import { OrderStatusPage } from './pages/OrderStatusPage.js';
import { SupportPage } from './pages/SupportPage.js';
import { TeamPage } from './pages/TeamPage.js';
import { SocialsPage } from './pages/SocialsPage.js';
import { FunPage } from './pages/FunPage.js';
import { TermsPage, RefundPolicyPage, PrivacyPolicyPage } from './pages/LegalPages.js';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout.js';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminProductsPage } from './pages/admin/AdminProductsPage.js';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage.js';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage.js';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.js';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage.js';
import { AdminTicketsPage } from './pages/admin/AdminTicketsPage.js';

import { AdminUser } from '@anajaksmp/shared';

// Public Layout Wrapper
const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[#E8F6FE] text-[#1e293b] pb-16 md:pb-0">
    <AnnouncementBanner />
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <GuestCheckoutModal />
    <MobileBottomNav />
  </div>
);

// 404 Page
const NotFoundPage: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
    <span className="text-7xl font-extrabold text-gold">404</span>
    <h1 className="text-2xl font-bold text-white">Dimension Not Found</h1>
    <p className="text-xs text-[#8e8ea2] max-w-sm">
      The realm or page you are looking for has been teleported away or does not exist.
    </p>
    <a href="/" className="gold-gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs mt-4">
      Return to Spawn
    </a>
  </div>
);

export const App: React.FC = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('anajaksmp_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('anajaksmp_admin_token') || null;
  });

  const handleLoginSuccess = (user: AdminUser, token: string) => {
    setAdminUser(user);
    setAdminToken(token);
    localStorage.setItem('anajaksmp_admin_user', JSON.stringify(user));
    localStorage.setItem('anajaksmp_admin_token', token);
  };

  const handleLogout = () => {
    setAdminUser(null);
    setAdminToken(null);
    localStorage.removeItem('anajaksmp_admin_user');
    localStorage.removeItem('anajaksmp_admin_token');
  };

  return (
    <BrowserRouter>
      <SettingsProvider>
        <CartProvider>
          <Routes>
            {/* Public Storefront Routes */}
            <Route
              path="/"
              element={
                <StorefrontLayout>
                  <HomePage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/store"
              element={
                <StorefrontLayout>
                  <StorePage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/ranks"
              element={
                <StorefrontLayout>
                  <StorePage initialCategory="ranks" />
                </StorefrontLayout>
              }
            />
            <Route
              path="/crate-keys"
              element={
                <StorefrontLayout>
                  <StorePage initialCategory="crate-keys" />
                </StorefrontLayout>
              }
            />
            <Route
              path="/cart"
              element={
                <StorefrontLayout>
                  <CartPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/checkout/payment/:orderNumber"
              element={
                <StorefrontLayout>
                  <PaymentPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/orders"
              element={
                <StorefrontLayout>
                  <OrderStatusPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/orders/:orderNumber"
              element={
                <StorefrontLayout>
                  <OrderStatusPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/team"
              element={
                <StorefrontLayout>
                  <TeamPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/socials"
              element={
                <StorefrontLayout>
                  <SocialsPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/social-media"
              element={<Navigate to="/socials" replace />}
            />
            <Route
              path="/fun"
              element={
                <StorefrontLayout>
                  <FunPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/support"
              element={
                <StorefrontLayout>
                  <SupportPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/terms"
              element={
                <StorefrontLayout>
                  <TermsPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/refund-policy"
              element={
                <StorefrontLayout>
                  <RefundPolicyPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/privacy-policy"
              element={
                <StorefrontLayout>
                  <PrivacyPolicyPage />
                </StorefrontLayout>
              }
            />

            {/* Admin Control Panel Routes */}
            <Route
              path="/control-panel/login"
              element={<AdminLoginPage onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/admin"
              element={<Navigate to="/control-panel/login" replace />}
            />
            <Route
              path="/admin/login"
              element={<Navigate to="/control-panel/login" replace />}
            />

            <Route
              path="/control-panel"
              element={
                adminToken ? (
                  <AdminLayout adminUser={adminUser} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/control-panel/login" replace />
                )
              }
            >
              <Route index element={<Navigate to="/control-panel/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage token={adminToken!} />} />
              <Route path="products" element={<AdminProductsPage token={adminToken!} />} />
              <Route path="orders" element={<AdminOrdersPage token={adminToken!} />} />
              <Route path="coupons" element={<AdminCouponsPage token={adminToken!} />} />
              <Route path="settings" element={<AdminSettingsPage token={adminToken!} />} />
              <Route path="audit-logs" element={<AdminAuditLogsPage token={adminToken!} />} />
              <Route path="tickets" element={<AdminTicketsPage token={adminToken!} />} />
            </Route>

            {/* Fallback 404 */}
            <Route
              path="*"
              element={
                <StorefrontLayout>
                  <NotFoundPage />
                </StorefrontLayout>
              }
            />
          </Routes>
        </CartProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
};

export default App;
