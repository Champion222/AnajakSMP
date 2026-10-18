import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { ProductIconBadge } from './ProductIconBadge.js';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotalUsd,
    totalUsd,
    totalKhr,
    coupon,
    discountUsd,
    couponError,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
  } = useCart();

  const { currency } = useSettings();
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    const success = await applyCoupon(couponInput.trim());
    setIsApplyingCoupon(false);
    if (success) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const exchangeRate = 4100;
  const formattedSubtotal =
    currency === 'USD'
      ? `$${subtotalUsd.toFixed(2)}`
      : `${Math.round(subtotalUsd * exchangeRate).toLocaleString()} ៛`;

  const formattedDiscount =
    currency === 'USD'
      ? `-$${discountUsd.toFixed(2)}`
      : `-${Math.round(discountUsd * exchangeRate).toLocaleString()} ៛`;

  const formattedTotal =
    currency === 'USD'
      ? `$${totalUsd.toFixed(2)}`
      : `${totalKhr.toLocaleString()} ៛`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#12121c] border-l border-[#252538] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#232333] flex items-center justify-between bg-[#161624]">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h2 className="font-black text-lg text-white">Your Shopping Cart</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#8e8ea2] hover:text-white rounded-lg hover:bg-[#252538] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-white">Your cart is empty</h3>
                  <p className="text-xs text-[#8e8ea2] max-w-xs mx-auto">
                    Pick a prestigious rank, spawner key crate, or survival bundle to get started!
                  </p>
                </div>
                <Link
                  to="/ranks"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block mt-4 px-5 py-2 rounded-xl bg-gold text-brand-bg font-bold text-xs shadow-gold-glow"
                >
                  Explore Store Catalog
                </Link>
              </div>
            ) : (
              items.map(({ product, quantity }) => {
                const isSale = product.sale_price_usd !== null && product.sale_price_usd !== undefined;
                const price = isSale ? product.sale_price_usd! : product.price_usd;

                return (
                  <div
                    key={product.id}
                    className="flex space-x-3.5 p-3 rounded-xl bg-[#171724] border border-[#262638]"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[#2b2b40] bg-[#1a1a2b]">
                      <ProductIconBadge
                        slug={product.slug}
                        categorySlug={product.category?.slug}
                        name={product.name}
                        className="h-14 w-14"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white line-clamp-1">{product.name}</h4>
                          <span className="text-xs text-gold font-bold">
                            ${price.toFixed(2)} USD
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-[#7e7e92] hover:text-status-error p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity control */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-[#13131d] rounded-lg border border-[#2b2b3e]">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 text-[#8e8ea2] hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-white">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 text-[#8e8ea2] hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs text-[#8e8ea2]">
                          Total: ${(price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#232333] bg-[#161624] space-y-4">
              {/* Coupon Form */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-status-success/10 border border-status-success/30 text-xs">
                    <div className="flex items-center space-x-1.5 text-status-success font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{coupon.code} (Applied)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-white/60 hover:text-white underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. ANAJAK10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#13131d] border border-[#2a2a3e] rounded-lg px-3 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-gold"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="px-3 py-1.5 rounded-lg bg-[#202030] hover:bg-gold text-white hover:text-brand-bg text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {isApplyingCoupon ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-status-error mt-1">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#9e9eb0]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white font-medium">{formattedSubtotal}</span>
                </div>
                {discountUsd > 0 && (
                  <div className="flex justify-between text-status-success">
                    <span>Discount:</span>
                    <span>{formattedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-[#232333]">
                  <span>Total:</span>
                  <span className="text-gold text-xl">{formattedTotal}</span>
                </div>
              </div>

              {/* Checkout Action & Full Cart Page */}
              <div className="space-y-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full gold-gradient-btn py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-gold-glow active:scale-[0.98]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#202030] hover:bg-[#28283e] text-white border border-[#2f2f45] text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>View Full Cart Page</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gold" />
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-[#7a7a90]">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Instant automated delivery via Minecraft RCON.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
