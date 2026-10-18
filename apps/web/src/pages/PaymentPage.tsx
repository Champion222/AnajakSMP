import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { api } from '../services/api.js';
import { useSettings } from '../context/SettingsContext.js';
import {
  QrCode,
  CreditCard,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const method = searchParams.get('method') || 'KHQR';
  const navigate = useNavigate();

  const { settings } = useSettings();
  const [orderData, setOrderData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('PENDING');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // 1. Initial Load
  useEffect(() => {
    if (!orderNumber || !token) {
      setError('Order reference or access token missing. Please return to the store.');
      setIsLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        const data = await api.getOrderStatus(orderNumber, token);
        setOrderData(data);
        if (data.status === 'PAID' || data.status === 'DELIVERED') {
          setIsPaid(true);
        }
      } catch (err: any) {
        setError(err.message || 'Unable to retrieve order payment details');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderNumber, token]);

  // 2. Automated status polling every 3.5 seconds
  useEffect(() => {
    if (!orderNumber || !token || isPaid) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.getPaymentStatus(orderNumber, token);
        if (res.paymentStatus === 'COMPLETED' || res.status === 'PAID' || res.status === 'DELIVERED') {
          setIsPaid(true);
          setPaymentStatus('COMPLETED');
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

          // Redirect to status page after 2.5s
          setTimeout(() => {
            navigate(`/orders/${orderNumber}?token=${encodeURIComponent(token)}`);
          }, 2500);
        }
      } catch {
        // silent polling catch
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [orderNumber, token, isPaid, navigate]);

  // 3. Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || isPaid) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaid]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = async () => {
    try {
      setIsSimulating(true);
      await api.simulateSandboxPayment(orderNumber!, token);
      setIsPaid(true);
      setPaymentStatus('COMPLETED');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        navigate(`/orders/${orderNumber}?token=${encodeURIComponent(token)}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
        <p className="text-sm text-text-secondary">Generating secure payment session...</p>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-status-error/10 text-status-error flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Payment Error</h2>
        <p className="text-xs text-text-secondary leading-relaxed">{error}</p>
        <Link to="/store" className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-gold text-brand-bg font-bold text-xs">
          Return to Store
        </Link>
      </div>
    );
  }

  // KHQR payload string (simulated or real Bakong payload)
  const khqrString = `00020101021229200016anajak_smp@aba5204599953038405405${orderData.totalUsd.toFixed(2)}5802KH5915ANAJAK SMP STORE6010PHNOM PENH62150111${orderNumber}6304C8A2`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="rounded-3xl bg-brand-card border border-brand-border overflow-hidden shadow-2xl">
        {/* Header Banner */}
        <div className="p-6 bg-brand-secondary border-b border-brand-border text-center space-y-2 relative">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-card border border-brand-border text-xs text-gold font-mono">
            <span>Order #{orderNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isPaid ? 'Payment Confirmed!' : 'Complete Your Payment'}
          </h1>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            {isPaid
              ? 'Your payment was verified. Dispatched rewards to your Minecraft account!'
              : 'Scan with your banking app or ABA Mobile to complete purchase.'}
          </p>

          {!isPaid && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-brand-card text-xs text-text-secondary">
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span>Expires in:</span>
              <span className="font-mono font-bold text-gold">{formatTimer(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Payment Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {isPaid ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-status-success/15 border-2 border-status-success text-status-success flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">Payment Received!</h2>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                Thank you, <span className="font-bold text-gold">{orderData.minecraftUsername}</span>! We are applying your perks directly in-game. Redirecting to your order status...
              </p>
              <Link
                to={`/orders/${orderNumber}?token=${encodeURIComponent(token)}`}
                className="gold-gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs inline-flex items-center space-x-2"
              >
                <span>View Order Status</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Amount Breakdown Card */}
              <div className="p-4 rounded-2xl bg-brand-secondary border border-brand-border flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold block">
                    Total Amount Due
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-gold">
                      ${orderData.totalUsd.toFixed(2)} USD
                    </span>
                    <span className="text-xs text-text-secondary font-mono">
                      ({orderData.totalKhr.toLocaleString()} ៛)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-text-muted block">Recipient</span>
                  <span className="text-sm font-bold text-white">AnajakSMP Store</span>
                </div>
              </div>

              {/* Payment Method Details */}
              {orderData.paymentMethod === 'KHQR' ? (
                <div className="space-y-6 text-center">
                  {/* QR Box with Bakong branding */}
                  <div className="relative inline-block p-6 rounded-3xl bg-white border-4 border-gold shadow-gold-glow mx-auto">
                    {/* KHQR banner */}
                    <div className="bg-[#E11E26] text-white py-1 px-4 rounded-md font-black text-xs tracking-wider uppercase mb-3 inline-block">
                      KHQR
                    </div>
                    <QRCodeSVG
                      value={khqrString}
                      size={220}
                      level="H"
                      includeMargin={false}
                    />
                    <div className="mt-3 text-[11px] font-bold text-black font-mono">
                      ${orderData.totalUsd.toFixed(2)} USD
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="max-w-md mx-auto space-y-2 text-left bg-brand-secondary p-4 rounded-xl border border-brand-border text-xs text-text-secondary">
                    <p className="font-bold text-white flex items-center space-x-1.5">
                      <QrCode className="w-4 h-4 text-gold" />
                      <span>How to pay with KHQR:</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
                      <li>Open <strong>ABA Mobile</strong>, <strong>Bakong</strong>, or any Cambodian banking app</li>
                      <li>Select <strong>Scan QR</strong> and scan the code above</li>
                      <li>Confirm the total amount and tap Pay</li>
                      <li>This page will automatically update once verified!</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="p-8 rounded-2xl bg-brand-secondary border border-brand-border space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <CreditCard className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">ABA PayWay Checkout</h3>
                      <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
                        Click below to launch the ABA PayWay transaction window to complete checkout.
                      </p>
                    </div>
                    <a
                      href="https://checkout-sandbox.payway.com.kh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 gold-gradient-btn px-6 py-3 rounded-xl font-bold text-xs"
                    >
                      <span>Open ABA PayWay Portal</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Sandbox / Testing Notice & Simulation Button */}
              {settings?.payment_sandbox_mode && (
                <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 space-y-3">
                  <div className="flex items-start space-x-2.5">
                    <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-white">Staging / Sandbox Mode Active</h4>
                      <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                        Merchant credentials are in test mode. You can simulate an instant payment confirmation to test the order completion and in-game Minecraft reward delivery flow.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSimulatePayment}
                    disabled={isSimulating}
                    className="w-full py-2.5 rounded-xl bg-gold text-brand-bg font-extrabold text-xs flex items-center justify-center space-x-2 shadow-sm hover:brightness-105 transition-all"
                  >
                    {isSimulating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Sandbox Payment...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Simulate Verified Payment ($0.00 charged)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Status Polling Indicator */}
              <div className="flex items-center justify-center space-x-2 text-xs text-text-muted">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />
                <span>Listening for payment confirmation...</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
