import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Server,
  User,
  ShoppingBag,
  ExternalLink,
  HelpCircle,
  Search,
  ArrowLeft,
  Check,
} from 'lucide-react';

export const OrderStatusPage: React.FC = () => {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramToken = searchParams.get('token') || '';

  const [inputOrderNumber, setInputOrderNumber] = useState(paramOrderNumber || '');
  const [inputToken, setInputToken] = useState(paramToken || '');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(Boolean(paramOrderNumber && paramToken));
  const [error, setError] = useState<string | null>(null);
  const [showFullDetails, setShowFullDetails] = useState(true);

  const scrollToReceipt = () => {
    setShowFullDetails(true);
    const el = document.getElementById('order-receipt');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchOrder = async (orderNum: string, token: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getOrderStatus(orderNum.trim(), token.trim());
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Order not found or invalid token.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (paramOrderNumber && paramToken) {
      fetchOrder(paramOrderNumber, paramToken);
    }
  }, [paramOrderNumber, paramToken]);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputOrderNumber.trim() || !inputToken.trim()) {
      setError('Please provide both your Order Number and Secret Access Token.');
      return;
    }
    setSearchParams({ token: inputToken.trim() });
    fetchOrder(inputOrderNumber.trim(), inputToken.trim());
  };

  const isCompleted = order && (order.status === 'PAID' || order.status === 'DELIVERED');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* 1. Payment Success Card matching reference image */}
      {isCompleted && (
        <div className="rounded-3xl bg-[#12121c] border border-status-success/30 p-8 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-glow from-status-success/10 via-transparent to-transparent pointer-events-none" />

          {/* Green Checkmark Circle */}
          <div className="w-20 h-20 rounded-full bg-status-success/15 border-2 border-status-success flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(55,214,122,0.3)]">
            <Check className="w-10 h-10 text-status-success stroke-[3]" />
          </div>

          <div className="space-y-2 relative z-10">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              Payment Successful!
            </h1>
            <p className="text-xs sm:text-sm text-[#9e9eb0] max-w-md mx-auto">
              Your purchase has been completed. Thank you for supporting AnajakSMP! Your rank and perks are automatically applied in-game.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <button
              onClick={scrollToReceipt}
              className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs uppercase bg-gold hover:bg-gold-bright text-brand-bg shadow-gold-glow transition-all"
            >
              View Order
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase text-[#9e9eb0] hover:text-white bg-[#1a1a28] hover:bg-[#252538] border border-[#2b2b3e] transition-all flex items-center justify-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      )}

      {/* Lookup Form if not provided or to check another */}
      {(!paramOrderNumber || !paramToken || error) && (
        <div className="p-6 rounded-2xl bg-[#12121c] border border-[#232333] space-y-4">
          <div className="flex items-center space-x-2.5">
            <Search className="w-5 h-5 text-gold" />
            <h2 className="font-extrabold text-lg text-white">Track Your Order Status</h2>
          </div>
          <p className="text-xs text-[#8e8ea2] leading-relaxed">
            Enter the unique Order Number and Secret Access Token received during checkout or in your email receipt.
          </p>
          <form onSubmit={handleLookupSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <input
              type="text"
              placeholder="Order Number (e.g. ASMP-2026-X8F4K)"
              value={inputOrderNumber}
              onChange={(e) => setInputOrderNumber(e.target.value)}
              className="bg-[#1a1a28] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-gold"
              required
            />
            <input
              type="text"
              placeholder="Secret Access Token (64 characters)"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="bg-[#1a1a28] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-gold"
              required
            />
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full gold-gradient-btn py-2.5 rounded-xl font-bold text-xs"
              >
                Track Order
              </button>
            </div>
          </form>
          {error && (
            <div className="p-3 rounded-xl bg-status-error/10 border border-status-error/30 text-xs text-status-error flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
          <p className="text-xs text-[#8e8ea2]">Retrieving secure order details...</p>
        </div>
      )}

      {/* Full Detailed Receipt */}
      {order && (
        <div id="order-receipt" className="rounded-3xl bg-[#12121c] border border-[#232333] overflow-hidden shadow-2xl space-y-6">
          {/* Top Summary Banner */}
          <div className="p-6 bg-[#171724] border-b border-[#232333] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={`https://mc-heads.net/avatar/${order.minecraftUsername}/64`}
                alt={order.minecraftUsername}
                className="w-14 h-14 rounded-xl border border-[#2a2a3e] bg-black/40 image-render-pixelated shadow-md"
                onError={(e) => {
                  (e.target as any).src = 'https://mc-heads.net/avatar/MHF_Steve/64';
                }}
              />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#7a7a90]">
                  Minecraft Account
                </span>
                <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
                  <span>{order.minecraftUsername}</span>
                </h2>
                <span className="text-xs text-[#8e8ea2] font-mono">
                  Order #{order.orderNumber}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7a7a90] block">
                Total Paid
              </span>
              <span className="text-2xl font-extrabold text-gold">
                ${order.totalUsd.toFixed(2)} USD
              </span>
              <span className="text-xs text-[#7a7a90] block font-mono">
                ({order.totalKhr.toLocaleString()} ៛)
              </span>
            </div>
          </div>

          {/* Visual Fulfillment Timeline */}
          <div className="px-6 sm:px-8 py-4">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#7a7a90] mb-6">
              Order Fulfillment Progress
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {/* Step 1: Order Placed */}
              <div className="p-4 rounded-xl bg-[#161622] border border-status-success/40 space-y-2">
                <div className="flex items-center space-x-2 text-status-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-xs">1. Placed</span>
                </div>
                <p className="text-[11px] text-[#8e8ea2]">Order registered</p>
              </div>

              {/* Step 2: Payment Verified */}
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  order.status === 'PAID' || order.status === 'DELIVERED'
                    ? 'bg-[#161622] border-status-success/40 text-status-success'
                    : 'bg-[#161622]/40 border-[#232333] text-[#7a7a90]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {order.status === 'PAID' || order.status === 'DELIVERED' ? (
                    <CheckCircle2 className="w-5 h-5 text-status-success" />
                  ) : (
                    <Clock className="w-5 h-5 text-gold" />
                  )}
                  <span className="font-bold text-xs text-white">2. Payment</span>
                </div>
                <p className="text-[11px] text-[#8e8ea2]">
                  {order.status === 'PAID' || order.status === 'DELIVERED'
                    ? 'Verified by Bank'
                    : 'Awaiting Payment'}
                </p>
              </div>

              {/* Step 3: Minecraft RCON Delivery */}
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  order.fulfillment?.status === 'DELIVERED' || order.status === 'DELIVERED'
                    ? 'bg-[#161622] border-status-success/40'
                    : 'bg-[#161622]/40 border-[#232333]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {order.fulfillment?.status === 'DELIVERED' || order.status === 'DELIVERED' ? (
                    <CheckCircle2 className="w-5 h-5 text-status-success" />
                  ) : (
                    <Server className="w-5 h-5 text-gold" />
                  )}
                  <span className="font-bold text-xs text-white">3. Server RCON</span>
                </div>
                <p className="text-[11px] text-[#8e8ea2]">
                  {order.fulfillment?.status === 'DELIVERED' || order.status === 'DELIVERED'
                    ? 'Dispatched to Server'
                    : 'Queue Pending'}
                </p>
              </div>

              {/* Step 4: Active in-Game */}
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  order.fulfillment?.status === 'DELIVERED' || order.status === 'DELIVERED'
                    ? 'bg-[#161622] border-status-success/40 text-status-success'
                    : 'bg-[#161622]/40 border-[#232333] text-[#7a7a90]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-bold text-xs text-white">4. Complete</span>
                </div>
                <p className="text-[11px] text-[#8e8ea2]">
                  {order.fulfillment?.status === 'DELIVERED' || order.status === 'DELIVERED'
                    ? 'Enjoy your Perks!'
                    : 'Awaiting execution'}
                </p>
              </div>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="p-6 border-t border-[#232333] space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-gold" />
              <span>Purchased Digital Items</span>
            </h3>

            <div className="divide-y divide-[#232333] rounded-2xl bg-[#171724] border border-[#232333] overflow-hidden">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">{item.product_name}</h4>
                    <span className="text-xs text-[#8e8ea2]">
                      Quantity: {item.quantity} × ${item.unit_price_usd.toFixed(2)} USD
                    </span>
                  </div>
                  <span className="font-extrabold text-gold text-sm">
                    ${item.line_total_usd.toFixed(2)} USD
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
