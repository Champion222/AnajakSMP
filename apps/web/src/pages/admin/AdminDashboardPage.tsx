import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Server,
  ArrowRight,
  TrendingUp,
  Loader2,
  Calendar,
} from 'lucide-react';

interface AdminDashboardPageProps {
  token: string;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ token }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await api.admin.getDashboard(token);
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, [token]);

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
        <p className="text-xs text-text-secondary">Loading real-time analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Store Analytics Overview</h1>
        <p className="text-xs text-text-secondary mt-1">
          Real-time performance metrics computed from verified database transactions.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Verified Revenue */}
        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-text-muted">
              Verified Revenue
            </span>
            <div className="text-2xl font-extrabold text-gold">
              ${metrics?.totalRevenueUsd?.toFixed(2) ?? '0.00'}
            </div>
            <span className="text-[10px] text-status-success font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Paid & Delivered Only</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Orders Today */}
        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-text-muted">
              Orders Today
            </span>
            <div className="text-2xl font-extrabold text-white">
              {metrics?.ordersToday ?? 0}
            </div>
            <span className="text-[10px] text-text-muted font-medium">Past 24 Hours</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Delivered In-Game */}
        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-text-muted">
              Delivered Orders
            </span>
            <div className="text-2xl font-extrabold text-status-success">
              {metrics?.deliveredOrders ?? 0}
            </div>
            <span className="text-[10px] text-status-success font-medium">RCON Fulfilled</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending & Failed */}
        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-text-muted">
              Pending / Failed
            </span>
            <div className="text-2xl font-extrabold text-status-warning">
              {metrics?.pendingPayments ?? 0} / {metrics?.failedDeliveries ?? 0}
            </div>
            <span className="text-[10px] text-text-muted font-medium">Awaiting or Needs Retry</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-status-warning/10 border border-status-warning/30 text-status-warning flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-xl">
        <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-secondary">
          <h2 className="font-extrabold text-base text-white">Recent Customer Orders</h2>
          <Link
            to="../orders"
            className="text-xs text-gold font-bold flex items-center space-x-1 hover:underline"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-secondary/60 text-text-muted uppercase font-bold border-b border-brand-border">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Minecraft User</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {metrics?.recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted">
                    No orders registered yet. Test with a guest checkout!
                  </td>
                </tr>
              ) : (
                metrics?.recentOrders?.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-brand-secondary/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{ord.order_number}</td>
                    <td className="p-4 font-bold text-gold">{ord.minecraft_username}</td>
                    <td className="p-4 font-extrabold text-white">${ord.total_usd.toFixed(2)}</td>
                    <td className="p-4 font-mono text-text-secondary">{ord.payment_method}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ord.status === 'PAID' || ord.status === 'DELIVERED'
                            ? 'bg-status-success/15 text-status-success border border-status-success/30'
                            : ord.status === 'FAILED'
                            ? 'bg-status-error/15 text-status-error border border-status-error/30'
                            : 'bg-status-warning/15 text-status-warning border border-status-warning/30'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to="../orders"
                        className="text-gold font-bold hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
