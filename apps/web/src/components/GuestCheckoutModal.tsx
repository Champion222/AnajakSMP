import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { api } from '../services/api.js';
import {
  X,
  User,
  Mail,
  ShieldCheck,
  CreditCard,
  QrCode,
  AlertCircle,
  ArrowRight,
  Loader2,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { playMinecraftClick } from '../utils/minecraft-sounds.js';

export const GuestCheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, items, coupon, clearCart, totalUsd, totalKhr } = useCart();
  const { currency } = useSettings();
  const navigate = useNavigate();

  const [username, setUsername] = useState(() => {
    return localStorage.getItem('anajaksmp_guest_username') || '';
  });
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ABA_PAYWAY' | 'KHQR'>('KHQR');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const validUsernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  const isUsernameValid = validUsernameRegex.test(username.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playMinecraftClick();
    setError(null);

    if (!isUsernameValid) {
      setError('Please enter a valid Minecraft username (3-16 characters, letters, numbers, underscores only).');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address to receive your order receipt.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Refund Policy.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.createCheckout({
        minecraft_username: username.trim(),
        customer_email: email.trim(),
        payment_method: paymentMethod,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        agree_terms: agreeTerms,
        coupon_code: coupon ? coupon.code : undefined,
      });

      // Save username for convenience
      localStorage.setItem('anajaksmp_guest_username', username.trim());

      clearCart();
      setIsCheckoutOpen(false);

      // Route to checkout payment page
      navigate(`/checkout/payment/${res.orderNumber}`, {
        state: {
          secretToken: res.secretToken,
          payment: res.payment,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exchangeRate = 4100;
  const formattedTotal =
    currency === 'USD'
      ? `$${totalUsd.toFixed(2)}`
      : `${totalKhr.toLocaleString()} ៛`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn select-none"
      onClick={() => {
        playMinecraftClick();
        setIsCheckoutOpen(false);
      }}
    >
      <div
        className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl border-2 border-[#cbe4f6] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#7A0222] via-[#A80836] to-[#C71047] p-5 sm:p-6 text-white shrink-0 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-black/30 border border-white/20 flex items-center justify-center text-[#FFE600] shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-minecraft text-[#ffb4c2] tracking-wider uppercase">
                  INSTANT DISPATCH
                </span>
                <h3 className="font-minecraft text-lg sm:text-xl font-black text-white tracking-wide">
                  GUEST CHECKOUT
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                playMinecraftClick();
                setIsCheckoutOpen(false);
              }}
              className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-colors border border-white/15"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#f8d7da] border border-[#f5c6cb] text-xs text-[#721c24] flex items-start space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#dc3545]" />
              <span>{error}</span>
            </div>
          )}

          {/* Minecraft Username with live skin avatar preview */}
          <div>
            <label className="block text-[11px] uppercase font-minecraft font-bold tracking-wider text-[#131d24] mb-1.5">
              Minecraft Username <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#c5dfe6] border border-white/60 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                {isUsernameValid ? (
                  <img
                    src={`https://mc-heads.net/avatar/${username.trim()}/64`}
                    alt={username}
                    className="w-9 h-9 rounded pixelated"
                    onError={(e) => {
                      (e.target as any).src = 'https://mc-heads.net/avatar/Steve/64';
                    }}
                  />
                ) : (
                  <User className="w-5 h-5 text-[#485963]" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="e.g. _T_Z or Nx4YGzz"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim())}
                  maxLength={16}
                  className="w-full bg-[#f2f9fb] border-2 border-[#89b1ba] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#131d24] placeholder-[#7d9da7] focus:outline-none focus:border-[#485963] transition-colors"
                  required
                />
                <span className="text-[10px] text-[#485963] mt-1 block font-medium">
                  Ranks and items are delivered in-game to this exact player username.
                </span>
              </div>
            </div>
          </div>

          {/* Customer Email */}
          <div>
            <label className="block text-[11px] uppercase font-minecraft font-bold tracking-wider text-[#131d24] mb-1.5">
              Customer Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#7d9da7] absolute left-3.5" />
              <input
                type="email"
                placeholder="your.email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f2f9fb] border-2 border-[#89b1ba] rounded-xl pl-10 pr-3.5 py-2 text-xs sm:text-sm text-[#131d24] placeholder-[#7d9da7] focus:outline-none focus:border-[#485963] transition-colors"
                required
              />
            </div>
            <span className="text-[10px] text-[#485963] mt-1 block font-medium">
              We send your Order Receipt and secret verification key to this email.
            </span>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[11px] uppercase font-minecraft font-bold tracking-wider text-[#131d24] mb-2">
              Select Payment Method <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Bakong KHQR */}
              <div
                onClick={() => {
                  playMinecraftClick();
                  setPaymentMethod('KHQR');
                }}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'KHQR'
                    ? 'bg-[#FFE600]/15 border-[#FFE600] shadow-sm'
                    : 'bg-[#f2f9fb] border-[#89b1ba] hover:border-[#485963]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#e93b67]/15 text-[#e93b67]">
                    <QrCode className="w-5 h-5 text-[#e93b67]" />
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'KHQR' ? 'border-[#131d24] bg-[#FFE600]' : 'border-[#89b1ba]'
                    }`}
                  >
                    {paymentMethod === 'KHQR' && <Check className="w-3 h-3 text-[#131d24] stroke-[3]" />}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-minecraft font-bold text-[#131d24]">KHQR (Bakong)</h4>
                  <p className="text-[10px] text-[#485963] mt-0.5 font-medium">
                    Scan with ABA, Wing, Acleda, or any bank app
                  </p>
                </div>
              </div>

              {/* ABA PayWay */}
              <div
                onClick={() => {
                  playMinecraftClick();
                  setPaymentMethod('ABA_PAYWAY');
                }}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'ABA_PAYWAY'
                    ? 'bg-[#FFE600]/15 border-[#FFE600] shadow-sm'
                    : 'bg-[#f2f9fb] border-[#89b1ba] hover:border-[#485963]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#0091EA]/15 text-[#0091EA]">
                    <CreditCard className="w-5 h-5 text-[#0091EA]" />
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'ABA_PAYWAY' ? 'border-[#131d24] bg-[#FFE600]' : 'border-[#89b1ba]'
                    }`}
                  >
                    {paymentMethod === 'ABA_PAYWAY' && <Check className="w-3 h-3 text-[#131d24] stroke-[3]" />}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-minecraft font-bold text-[#131d24]">ABA PayWay</h4>
                  <p className="text-[10px] text-[#485963] mt-0.5 font-medium">
                    Direct ABA Mobile / credit cards
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="pt-1">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-2 border-[#89b1ba] text-[#485963] focus:ring-0"
              />
              <span className="text-[11px] text-[#485963] leading-relaxed">
                I understand perks are digital in-game entitlements. I agree to the{' '}
                <a href="/terms" target="_blank" className="text-[#131d24] font-bold underline">
                  Terms of Service
                </a>{' '}
                and acknowledge the{' '}
                <a href="/refund-policy" target="_blank" className="text-[#131d24] font-bold underline">
                  Refund Policy
                </a>
                .
              </span>
            </label>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !isUsernameValid || !email || !agreeTerms}
              className="w-full bg-[#FFE600] hover:bg-[#ffd700] active:scale-95 text-[#131d24] font-minecraft font-black py-3.5 rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 text-xs sm:text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#131d24]" />
                  <span>PREPARING PAYMENT...</span>
                </>
              ) : (
                <>
                  <span>PROCEED TO PAY {formattedTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestCheckoutModal;
