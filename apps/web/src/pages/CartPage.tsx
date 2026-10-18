import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { ProductIconBadge } from '../components/ProductIconBadge.js';
import {
  Crown,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Tag,
  AlertCircle,
  User,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    itemCount,
    subtotalUsd,
    totalUsd,
    discountUsd,
    coupon,
    couponError,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
  } = useCart();

  const { currency } = useSettings();
  const exchangeRate = 4100;

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [localCouponError, setLocalCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [playerUsername, setPlayerUsername] = useState(() => {
    return localStorage.getItem('anajaksmp_guest_username') || '';
  });

  const formatPrice = (usd: number) => {
    if (currency === 'USD') return `$${usd.toFixed(2)}`;
    return `${Math.round(usd * exchangeRate).toLocaleString()} ៛`;
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setLocalCouponError('');
    setIsApplyingCoupon(true);
    try {
      const ok = await applyCoupon(couponCodeInput.trim());
      if (!ok) {
        setLocalCouponError('Invalid coupon code or minimum amount not met');
      } else {
        setCouponCodeInput('');
      }
    } catch {
      setLocalCouponError('Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleUsernameChange = (val: string) => {
    setPlayerUsername(val);
    localStorage.setItem('anajaksmp_guest_username', val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header matching reference image */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
            <Crown className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            Shopping Cart
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#8e8ea2] pl-10">
          Review your items and complete your purchase
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-3xl bg-[#12121c] border border-[#232333] p-8 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
          <p className="text-xs text-[#8e8ea2] max-w-sm mx-auto">
            You haven't added any ranks, crate keys, or bundles yet. Explore our store to upgrade your adventure!
          </p>
          <div className="pt-2">
            <Link
              to="/ranks"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs uppercase bg-gold hover:bg-gold-bright text-brand-bg shadow-gold-glow transition-all"
            >
              <span>Explore Store</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left: Items Table */}
          <div className="lg:col-span-8 rounded-2xl bg-[#12121c] border border-[#232333] overflow-hidden shadow-xl">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#171724] border-b border-[#232333] text-[11px] font-black uppercase tracking-wider text-[#7e7e94]">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#1e1e2c]">
              {items.map(({ product, quantity }) => {
                const isSale = product.sale_price_usd !== null && product.sale_price_usd !== undefined;
                const unitPrice = isSale ? product.sale_price_usd! : product.price_usd;
                const lineTotal = unitPrice * quantity;

                return (
                  <div
                    key={product.id}
                    className="p-4 sm:px-6 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                  >
                    {/* Item Info */}
                    <div className="sm:col-span-6 flex items-center space-x-3.5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#2a2a3e] bg-[#1a1a28] flex items-center justify-center">
                        <ProductIconBadge
                          slug={product.slug}
                          categorySlug={product.category?.slug}
                          name={product.name}
                          className="h-14 w-14"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-white truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#222232] text-gold border border-gold/20">
                            <User className="w-2.5 h-2.5" />
                            <span>{playerUsername || 'Guest Player'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2 sm:text-center text-xs font-semibold text-[#a8a8ba]">
                      <span className="sm:hidden text-[#6d6d80] mr-2">Price:</span>
                      {formatPrice(unitPrice)}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="sm:col-span-2 flex items-center sm:justify-center space-x-2">
                      <div className="flex items-center bg-[#1a1a28] border border-[#2a2a3e] rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 rounded text-[#8e8ea2] hover:text-white hover:bg-[#252538] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 rounded text-[#8e8ea2] hover:text-white hover:bg-[#252538] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Line Total & Remove */}
                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end space-x-3">
                      <span className="font-black text-sm text-white">
                        {formatPrice(lineTotal)}
                      </span>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="p-1.5 rounded-lg text-[#8e8ea2] hover:text-status-error hover:bg-[#252538] transition-colors"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Minecraft Username Quick-Edit Bar */}
            <div className="p-4 bg-[#151522] border-t border-[#232333] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-[#9e9eb2]">
                <User className="w-4 h-4 text-gold shrink-0" />
                <span>Minecraft Username for delivery:</span>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="e.g. Steve or Alex"
                  value={playerUsername}
                  onChange={(e) => handleUsernameChange(e.target.value.trim())}
                  className="px-3 py-1.5 rounded-lg bg-[#1e1e2d] border border-[#2f2f45] text-xs text-white placeholder-[#6a6a80] focus:outline-none focus:border-gold w-full sm:w-44"
                />
              </div>
            </div>
          </div>

          {/* Right Summary Box matching reference image */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl bg-[#12121c] border border-[#232333] p-6 space-y-5 shadow-xl">
              <h2 className="text-base font-black text-white tracking-wide pb-3 border-b border-[#232333]">
                Order Summary
              </h2>

              {/* Totals */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#9e9eb0]">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">{formatPrice(subtotalUsd)}</span>
                </div>

                {coupon && (
                  <div className="flex items-center justify-between text-status-success">
                    <span className="flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Discount ({coupon.code})</span>
                    </span>
                    <span className="font-bold">-{formatPrice(discountUsd)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#232333] flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white">Total</span>
                  <span className="text-xl font-black text-gold">
                    {formatPrice(totalUsd)}
                  </span>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div className="pt-2 border-t border-[#232333] space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Discount code (e.g. ANAJAK10)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#1a1a28] border border-[#2a2a3e] text-xs text-white placeholder-[#6a6a80] uppercase focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponCodeInput.trim()}
                    className="px-4 py-2 rounded-xl bg-[#232336] hover:bg-gold text-white hover:text-brand-bg font-bold text-xs transition-colors border border-[#33334c] disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>

                {(localCouponError || couponError) && (
                  <p className="text-[11px] text-status-error flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{localCouponError || couponError}</span>
                  </p>
                )}

                {coupon && (
                  <div className="flex items-center justify-between text-[11px] bg-status-success/10 border border-status-success/30 px-3 py-1.5 rounded-lg text-status-success">
                    <span>Coupon applied!</span>
                    <button
                      onClick={removeCoupon}
                      className="text-white/60 hover:text-white underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-gold hover:bg-gold-bright text-brand-bg shadow-gold-glow flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Continue Shopping Link */}
              <div className="text-center pt-1">
                <Link
                  to="/ranks"
                  className="text-xs text-[#8e8ea2] hover:text-white inline-flex items-center space-x-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
