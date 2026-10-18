import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { ProductIconBadge } from '../components/ProductIconBadge.js';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Tag,
  AlertCircle,
  User,
  ShieldCheck,
} from 'lucide-react';
import { playMinecraftClick } from '../utils/minecraft-sounds.js';

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
    playMinecraftClick();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 select-none">
      {/* Mazer Style Header Banner */}
      <div className="bg-[#1e1319] border-2 border-[#3b202d] rounded-2xl px-5 py-3.5 flex items-center space-x-3.5 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-[#e93b67] flex items-center justify-center shrink-0 shadow-inner">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="block text-[10px] font-minecraft text-[#ffb4c2] tracking-wider uppercase">
            ORDER CHECKOUT
          </span>
          <h1 className="text-lg sm:text-2xl font-minecraft font-black text-white tracking-wide uppercase">
            SHOPPING CART
          </h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] p-8 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#485963] text-[#FFE600] border-2 border-white/40 flex items-center justify-center mx-auto shadow-md">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-minecraft font-black text-[#131d24]">
            YOUR CART IS EMPTY
          </h2>
          <p className="text-xs sm:text-sm text-[#485963] max-w-sm mx-auto">
            You haven't added any ranks or items to your cart yet. Explore our store to upgrade your adventure!
          </p>
          <div className="pt-2">
            <Link
              to="/ranks"
              onClick={playMinecraftClick}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl font-minecraft font-black text-xs sm:text-sm uppercase bg-[#FFE600] hover:bg-[#ffd700] active:scale-95 text-[#131d24] shadow-md transition-all"
            >
              <span>EXPLORE RANKS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left: Items Table */}
          <div className="lg:col-span-8 rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#b0d5de] border-b border-[#a7ccd6] text-[11px] font-minecraft font-bold uppercase tracking-wider text-[#131d24]">
              <div className="col-span-6">ITEM</div>
              <div className="col-span-2 text-center">PRICE</div>
              <div className="col-span-2 text-center">QUANTITY</div>
              <div className="col-span-2 text-right">TOTAL</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#a7ccd6]/60">
              {items.map(({ product, quantity }) => {
                const isSale = product.sale_price_usd !== null && product.sale_price_usd !== undefined;
                const unitPrice = isSale ? product.sale_price_usd! : product.price_usd;
                const lineTotal = unitPrice * quantity;

                return (
                  <div
                    key={product.id}
                    className="p-4 sm:px-6 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[#c2dee5] hover:bg-[#b8dbe2] transition-colors"
                  >
                    {/* Item Info */}
                    <div className="sm:col-span-6 flex items-center space-x-3.5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/60 bg-[#c5dfe6] flex items-center justify-center shadow-inner">
                        <ProductIconBadge
                          slug={product.slug}
                          categorySlug={product.category?.slug}
                          name={product.name}
                          className="h-14 w-14"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-minecraft font-bold text-sm sm:text-base text-[#131d24] truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-[10px] font-minecraft font-bold bg-[#485963] text-white shadow-2xs">
                            <User className="w-3 h-3 text-[#FFE600]" />
                            <span>{playerUsername || 'Guest Player'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2 sm:text-center text-xs sm:text-sm font-bold text-[#485963]">
                      <span className="sm:hidden text-[#485963] mr-2">Price:</span>
                      {formatPrice(unitPrice)}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="sm:col-span-2 flex items-center sm:justify-center space-x-2">
                      <div className="flex items-center bg-[#f2f9fb] border-2 border-[#89b1ba] rounded-xl p-0.5 shadow-2xs">
                        <button
                          onClick={() => {
                            playMinecraftClick();
                            updateQuantity(product.id, quantity - 1);
                          }}
                          className="p-1 rounded-lg text-[#485963] hover:text-[#131d24] hover:bg-[#c5dfe6] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-minecraft font-bold text-[#131d24]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => {
                            playMinecraftClick();
                            updateQuantity(product.id, quantity + 1);
                          }}
                          className="p-1 rounded-lg text-[#485963] hover:text-[#131d24] hover:bg-[#c5dfe6] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Line Total & Remove */}
                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end space-x-3">
                      <span className="font-black text-sm sm:text-base text-[#131d24]">
                        {formatPrice(lineTotal)}
                      </span>
                      <button
                        onClick={() => {
                          playMinecraftClick();
                          removeItem(product.id);
                        }}
                        className="p-1.5 rounded-xl text-[#e93b67] hover:bg-[#e93b67]/15 transition-colors"
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
            <div className="p-4 bg-[#b0d5de] border-t border-[#a7ccd6] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-[#131d24] font-minecraft font-bold">
                <User className="w-4 h-4 text-[#d99a16] shrink-0" />
                <span>Minecraft Username for delivery:</span>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative flex items-center w-full sm:w-56">
                  <input
                    type="text"
                    placeholder="e.g. _T_Z or Nx4YGzz"
                    value={playerUsername}
                    onChange={(e) => handleUsernameChange(e.target.value.trim())}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f2f9fb] border-2 border-[#89b1ba] text-xs font-medium text-[#131d24] placeholder-[#7d9da7] focus:outline-none focus:border-[#485963] transition-colors"
                  />
                  {playerUsername.trim() && (
                    <div className="absolute right-2 w-6 h-6 rounded-md overflow-hidden bg-[#c5dfe6] border border-white/60 shrink-0">
                      <img
                        src={`https://mc-heads.net/avatar/${playerUsername.trim()}/32`}
                        alt="avatar"
                        className="w-full h-full object-cover pixelated"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/32';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] p-6 space-y-5 shadow-sm">
              <h2 className="text-base font-minecraft font-black text-[#131d24] tracking-wide pb-3 border-b border-[#a7ccd6]">
                ORDER SUMMARY
              </h2>

              {/* Totals */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#485963]">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-[#131d24]">{formatPrice(subtotalUsd)}</span>
                </div>

                {coupon && (
                  <div className="flex items-center justify-between text-[#28a745]">
                    <span className="flex items-center space-x-1 font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Discount ({coupon.code})</span>
                    </span>
                    <span className="font-bold">-{formatPrice(discountUsd)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#a7ccd6] flex items-baseline justify-between">
                  <span className="text-sm font-minecraft font-black text-[#131d24]">TOTAL</span>
                  <span className="text-2xl font-black text-[#131d24]">
                    {formatPrice(totalUsd)}
                  </span>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div className="pt-2 border-t border-[#a7ccd6] space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="COUPON (E.G. ANAJAK10)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#f2f9fb] border-2 border-[#89b1ba] text-xs font-mono text-[#131d24] placeholder-[#7d9da7] uppercase focus:outline-none focus:border-[#485963] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponCodeInput.trim()}
                    className="px-4 py-2 rounded-xl bg-[#485963] hover:bg-[#3b4952] active:scale-95 text-white font-minecraft text-xs transition-colors shadow-sm disabled:opacity-50"
                  >
                    APPLY
                  </button>
                </form>

                {(localCouponError || couponError) && (
                  <p className="text-[11px] text-[#dc3545] flex items-center space-x-1 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    <span>{localCouponError || couponError}</span>
                  </p>
                )}

                {coupon && (
                  <div className="flex items-center justify-between text-[11px] bg-[#d4edda] border border-[#c3e6cb] px-3 py-1.5 rounded-xl text-[#155724] font-medium">
                    <span>Coupon applied!</span>
                    <button
                      onClick={() => {
                        playMinecraftClick();
                        removeCoupon();
                      }}
                      className="text-[#155724] underline ml-2 hover:opacity-80 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => {
                  playMinecraftClick();
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 px-4 rounded-2xl font-minecraft font-black text-xs sm:text-sm uppercase tracking-wider bg-[#FFE600] hover:bg-[#ffd700] active:scale-95 text-[#131d24] shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Guarantee Note */}
              <div className="p-3 rounded-2xl bg-[#9ec4cd]/60 border border-[#89b1ba] flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-[#131d24] shrink-0" />
                <p className="text-[10px] text-[#2c3e50] leading-tight">
                  Instant delivery via Minecraft RCON. Verified with Bakong KHQR & ABA PayWay.
                </p>
              </div>

              {/* Continue Shopping Link */}
              <div className="text-center pt-1">
                <Link
                  to="/ranks"
                  onClick={playMinecraftClick}
                  className="text-xs text-[#485963] hover:text-[#131d24] font-minecraft inline-flex items-center space-x-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>CONTINUE SHOPPING</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
