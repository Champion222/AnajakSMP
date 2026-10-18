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
} from 'lucide-react';

export const GuestCheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, items, coupon, clearCart, totalUsd, totalKhr } = useCart();
  const { currency } = useSettings();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
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
        coupon_code: coupon ? coupon.code : null,
        agree_terms: true,
      });

      // Clear cart items on checkout initiation
      clearCart();
      setIsCheckoutOpen(false);

      // Navigate to dedicated payment processing page with secure token
      navigate(
        `/checkout/payment/${res.orderNumber}?token=${encodeURIComponent(res.accessToken)}&method=${paymentMethod}`
      );
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-xl bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-brand-border bg-brand-secondary flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-xl text-white">Guest Checkout</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              No registration required. Enter your details to proceed to payment.
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-text-secondary hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-status-error/10 border border-status-error/30 text-xs text-status-error flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Minecraft Username with live skin avatar preview */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-text-secondary mb-2">
              Minecraft Username <span className="text-status-error">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-brand-secondary border border-brand-border flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                {isUsernameValid ? (
                  <img
                    src={`https://mc-heads.net/avatar/${username.trim()}/64`}
                    alt={username}
                    className="w-10 h-10 rounded image-render-pixelated"
                    onError={(e) => {
                      (e.target as any).src =
                        'https://mc-heads.net/avatar/MHF_Steve/64';
                    }}
                  />
                ) : (
                  <User className="w-6 h-6 text-text-muted" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="e.g. Notch or PlayerName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={16}
                  className="w-full bg-brand-secondary border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-muted focus:outline-none focus:border-gold"
                  required
                />
                <span className="text-[10px] text-text-muted mt-1 block">
                  Double-check your spelling! Rewards are automatically granted to this username in-game.
                </span>
              </div>
            </div>
          </div>

          {/* Customer Email */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-text-secondary mb-1.5">
              Customer Email Address <span className="text-status-error">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-secondary border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-text-muted focus:outline-none focus:border-gold"
                required
              />
            </div>
            <span className="text-[10px] text-text-muted mt-1 block">
              We send your unique Order Reference & Secret Token here for order tracking.
            </span>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-text-secondary mb-2">
              Select Payment Method <span className="text-status-error">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Bakong KHQR */}
              <div
                onClick={() => setPaymentMethod('KHQR')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'KHQR'
                    ? 'bg-gold/10 border-gold shadow-gold-glow'
                    : 'bg-brand-secondary border-brand-border hover:border-brand-border/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-status-error/10 text-status-error">
                    <QrCode className="w-5 h-5 text-status-error" />
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'KHQR' ? 'border-gold bg-gold' : 'border-brand-border'
                    }`}
                  >
                    {paymentMethod === 'KHQR' && <Check className="w-3 h-3 text-brand-bg stroke-[3]" />}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">KHQR (Bakong)</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Scan with ABA, Wing, Acleda, or any bank app
                  </p>
                </div>
              </div>

              {/* ABA PayWay */}
              <div
                onClick={() => setPaymentMethod('ABA_PAYWAY')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'ABA_PAYWAY'
                    ? 'bg-gold/10 border-gold shadow-gold-glow'
                    : 'bg-brand-secondary border-brand-border hover:border-brand-border/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'ABA_PAYWAY' ? 'border-gold bg-gold' : 'border-brand-border'
                    }`}
                  >
                    {paymentMethod === 'ABA_PAYWAY' && <Check className="w-3 h-3 text-brand-bg stroke-[3]" />}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">ABA PayWay</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Direct ABA Mobile / cards checkout
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="pt-2">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 rounded bg-brand-secondary border-brand-border text-gold focus:ring-0"
              />
              <span className="text-xs text-text-secondary leading-relaxed">
                I understand all items are digital in-game entitlements. I agree to the{' '}
                <a href="/terms" target="_blank" className="text-gold underline">
                  Terms of Service
                </a>{' '}
                and acknowledge the{' '}
                <a href="/refund-policy" target="_blank" className="text-gold underline">
                  Refund Policy
                </a>
                .
              </span>
            </label>
          </div>

          {/* Action button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting || !isUsernameValid || !email || !agreeTerms}
              className="w-full gold-gradient-btn py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-gold-glow disabled:opacity-50 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Payment...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Pay {formattedTotal}</span>
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
