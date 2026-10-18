import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Order, OrderStatus } from '@anajaksmp/shared';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  X,
  ShieldCheck,
  User,
  CreditCard,
  Server,
} from 'lucide-react';

interface AdminOrdersPageProps {
  token: string;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ token }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [manualReason, setManualReason] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.admin.getOrders(token, {
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setOrders(res.orders || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Error loading orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadOrders, 200);
    return () => clearTimeout(timer);
  }, [token, search, statusFilter]);

  const handleRetryFulfillment = async (orderId: string) => {
    try {
      setIsProcessingAction(true);
      setActionMessage(null);
      const res = await api.admin.retryFulfillment(token, orderId);
      setActionMessage(res.message || 'Fulfillment executed');
      await loadOrders();
      if (selectedOrder) {
        const updated = await api.admin.getOrderDetails(token, orderId);
        setSelectedOrder(updated.order);
      }
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleManualVerifyPayment = async (orderId: string) => {
    if (!manualReason || manualReason.trim().length < 5) {
      alert('Please provide an audit reason (min 5 characters) for manual verification.');
      return;
    }

    try {
      setIsProcessingAction(true);
      setActionMessage(null);
      const res = await api.admin.manualVerifyPayment(token, orderId, manualReason.trim());
      setActionMessage(res.message || 'Payment verified');
      setManualReason('');
      await loadOrders();
      if (selectedOrder) {
        const updated = await api.admin.getOrderDetails(token, orderId);
        setSelectedOrder(updated.order);
      }
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Customer Orders Management</h1>
        <p className="text-xs text-text-secondary mt-1">
          Review payments, inspect fulfillment queues, and safely retry server commands.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-secondary p-3.5 rounded-2xl border border-brand-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by order #, username, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-card border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-text-muted">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
          >
            <option value="all">All Statuses ({total})</option>
            <option value="AWAITING_PAYMENT">Awaiting Payment</option>
            <option value="PAID">Paid</option>
            <option value="PROCESSING">Processing</option>
            <option value="DELIVERED">Delivered</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
          <p className="text-xs text-text-secondary">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-brand-card rounded-2xl border border-brand-border text-xs text-text-muted">
          No orders found matching the filter criteria.
        </div>
      ) : (
        <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-secondary/80 text-text-muted uppercase font-bold border-b border-brand-border">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-brand-secondary/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{ord.order_number}</td>
                    <td className="p-4">
                      <div className="font-bold text-gold">{ord.minecraft_username}</div>
                      <div className="text-[10px] text-text-muted truncate max-w-xs">{ord.customer_email}</div>
                    </td>
                    <td className="p-4 font-extrabold text-white">
                      ${ord.total_usd.toFixed(2)} USD
                    </td>
                    <td className="p-4 font-mono text-[10px] text-text-secondary">
                      {ord.payment_method}
                    </td>
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
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setActionMessage(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-brand-secondary border border-brand-border hover:border-gold text-xs font-bold text-text-secondary hover:text-white inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-brand-border bg-brand-secondary flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-gold block">Order Inspection</span>
                <h3 className="font-extrabold text-lg text-white">#{selectedOrder.order_number}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-text-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {actionMessage && (
                <div className="p-3 rounded-xl bg-gold/15 border border-gold/30 text-white font-medium">
                  {actionMessage}
                </div>
              )}

              {/* Customer & Payment details */}
              <div className="grid grid-cols-2 gap-4 bg-brand-secondary p-4 rounded-xl border border-brand-border">
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">Minecraft Username</span>
                  <span className="text-sm font-bold text-gold">{selectedOrder.minecraft_username}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">Customer Email</span>
                  <span className="text-xs text-white truncate block">{selectedOrder.customer_email}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">Total Amount</span>
                  <span className="text-sm font-extrabold text-white">${selectedOrder.total_usd.toFixed(2)} USD</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">Payment Method</span>
                  <span className="text-xs font-mono text-white">{selectedOrder.payment_method}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">Order Status</span>
                  <span className="font-bold text-white uppercase">{selectedOrder.status}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">Secret Access Token</span>
                  <span className="font-mono text-[10px] text-text-muted truncate block">{selectedOrder.access_token}</span>
                </div>
              </div>

              {/* Purchased items */}
              <div>
                <h4 className="font-bold text-white mb-2 uppercase text-[10px] tracking-wider text-text-muted">
                  Purchased Items
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-brand-secondary border border-brand-border flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-white">{item.product_name || item.productName} (x{item.quantity})</p>
                        <p className="text-[10px] text-text-muted font-mono">{item.commands_snapshot?.length || 0} delivery commands</p>
                      </div>
                      <span className="font-bold text-gold">${(item.line_total_usd || item.lineTotalUsd || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions: Retry Fulfillment or Manual Payment Verification */}
              <div className="p-4 rounded-xl bg-brand-secondary border border-brand-border space-y-4">
                <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-text-muted">
                  Administrative Actions
                </h4>

                {/* Fulfillment Retry */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="font-bold text-white">Retry In-Game Delivery</p>
                    <p className="text-[10px] text-text-muted">Dispatch Minecraft RCON commands again.</p>
                  </div>
                  <button
                    onClick={() => handleRetryFulfillment(selectedOrder.id)}
                    disabled={isProcessingAction}
                    className="px-4 py-2 rounded-xl bg-brand-card border border-brand-border hover:border-gold text-xs font-bold text-gold inline-flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Execute RCON</span>
                  </button>
                </div>

                {/* Manual Payment Verification (with mandatory audit reason) */}
                {selectedOrder.status !== 'PAID' && selectedOrder.status !== 'DELIVERED' && (
                  <div className="pt-3 border-t border-brand-border/60 space-y-2">
                    <p className="font-bold text-white">Audited Manual Payment Verification</p>
                    <p className="text-[10px] text-text-muted">
                      Use if customer confirmed payment offline or bank callback was missed. Requires a mandatory audit reason.
                    </p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Audit reason (e.g. Verified via ABA Mobile transaction #12345)"
                        value={manualReason}
                        onChange={(e) => setManualReason(e.target.value)}
                        className="flex-1 bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                      />
                      <button
                        onClick={() => handleManualVerifyPayment(selectedOrder.id)}
                        disabled={isProcessingAction || !manualReason.trim()}
                        className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50"
                      >
                        Verify Payment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
