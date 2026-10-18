import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AdminUser } from '@anajaksmp/shared';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Settings,
  ShieldAlert,
  MessageSquare,
  LogOut,
  Crown,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface AdminLayoutProps {
  adminUser: AdminUser | null;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ adminUser, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/control-panel/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/control-panel/products', icon: Package },
    { label: 'Orders', path: '/control-panel/orders', icon: ShoppingBag },
    { label: 'Coupons', path: '/control-panel/coupons', icon: Tag },
    { label: 'Settings', path: '/control-panel/settings', icon: Settings, roles: ['OWNER'] },
    { label: 'Audit Logs', path: '/control-panel/audit-logs', icon: ShieldAlert, roles: ['OWNER', 'ADMIN'] },
    { label: 'Support Tickets', path: '/control-panel/tickets', icon: MessageSquare },
  ];

  const filteredNav = navItems.filter((item) => {
    if (!item.roles) return true;
    return adminUser && item.roles.includes(adminUser.role);
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-brand-bg flex text-text-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-brand-secondary border-r border-brand-border shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-brand-border flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-deep p-0.5 shadow-gold-glow">
            <div className="w-full h-full bg-brand-card rounded-[10px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-gold" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg text-white">AnajakSMP</span>
            <span className="text-[10px] uppercase font-bold text-gold block">Staff Control Panel</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 flex-1">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  active
                    ? 'bg-gold text-brand-bg shadow-gold-glow'
                    : 'text-text-secondary hover:text-white hover:bg-brand-card'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-brand-bg' : 'text-gold'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-brand-border bg-brand-card/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="font-bold text-xs text-white truncate">{adminUser?.username}</p>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/30">
                {adminUser?.role}
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg bg-brand-secondary border border-brand-border hover:border-status-error hover:text-status-error text-xs font-bold text-text-secondary transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-brand-border bg-brand-secondary/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-text-secondary hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" target="_blank" className="text-xs text-gold hover:underline font-bold flex items-center space-x-1">
              <span>View Storefront</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-text-secondary hidden sm:inline">Signed in as</span>
            <span className="text-xs font-bold text-white">{adminUser?.email}</span>
          </div>
        </header>

        {/* Main Routed Page Content */}
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-sm">
          <div className="w-64 bg-brand-secondary h-full flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base">Staff Control Panel</span>
              <button onClick={() => setSidebarOpen(false)} className="text-text-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-2 flex-1 pt-4">
              {filteredNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                    isActive(item.path) ? 'bg-gold text-brand-bg' : 'text-text-secondary hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              onClick={onLogout}
              className="py-2.5 rounded-lg bg-brand-card border border-brand-border text-xs font-bold text-status-error flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
