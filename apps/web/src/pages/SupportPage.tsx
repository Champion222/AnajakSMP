import React, { useState } from 'react';
import { api } from '../services/api.js';
import {
  HelpCircle,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CreditCard,
  Zap,
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessTicket(null);

    try {
      setIsSubmitting(true);
      const res = await api.submitTicket({
        minecraft_username: username.trim(),
        customer_email: email.trim(),
        order_number: orderNumber.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      });

      setSuccessTicket(res.ticketNumber);
      setUsername('');
      setEmail('');
      setOrderNumber('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit support ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-gold text-xs uppercase font-extrabold tracking-widest block">
          24/7 Player Assistance
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Customer Support & Help
        </h1>
        <p className="text-sm text-text-secondary">
          Having trouble with payment verification, order delivery, or have a question about perks? Our team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Advice Cards */}
        <div className="space-y-4 md:col-span-1">
          <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-2">
            <Zap className="w-5 h-5 text-gold" />
            <h3 className="font-bold text-sm text-white">Delivery Delayed?</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              If your payment completed but perks have not arrived after 5 minutes, please make sure you were in-game on the server or had logged in at least once.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-2">
            <CreditCard className="w-5 h-5 text-gold" />
            <h3 className="font-bold text-sm text-white">KHQR Troubleshooting</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Ensure you scanned the exact dynamic QR generated for your order. If your bank deducted funds but the page didn't update, include your transaction ID.
            </p>
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-brand-card border border-brand-border shadow-xl">
          <h2 className="text-xl font-bold text-white mb-2">Submit a Support Ticket</h2>
          <p className="text-xs text-text-secondary mb-6">
            Fill in the details below. Our staff responds to tickets within 2 to 6 hours.
          </p>

          {successTicket && (
            <div className="p-4 rounded-xl bg-status-success/15 border border-status-success/40 text-xs text-status-success space-y-1 mb-6">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Ticket #{successTicket} Submitted Successfully!</span>
              </div>
              <p className="text-text-secondary pl-7">
                We have registered your ticket. A staff member will investigate your order and respond via email.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-status-error/15 border border-status-error/40 text-xs text-status-error flex items-start space-x-2 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase font-bold text-text-secondary mb-1">
                  Minecraft Username <span className="text-status-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your in-game username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-brand-secondary border border-brand-border rounded-xl px-4 py-2.5 text-white placeholder-text-muted focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-text-secondary mb-1">
                  Email Address <span className="text-status-error">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-secondary border border-brand-border rounded-xl px-4 py-2.5 text-white placeholder-text-muted focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block uppercase font-bold text-text-secondary mb-1">
                Order Number (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. ASMP-2026-X8F4K"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-brand-secondary border border-brand-border rounded-xl px-4 py-2.5 text-white placeholder-text-muted focus:outline-none focus:border-gold uppercase"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-text-secondary mb-1">
                Subject <span className="text-status-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Brief summary of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-brand-secondary border border-brand-border rounded-xl px-4 py-2.5 text-white placeholder-text-muted focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-text-secondary mb-1">
                Message <span className="text-status-error">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Explain the problem in detail (e.g. transaction receipt, what perk was missing, etc.)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-brand-secondary border border-brand-border rounded-xl px-4 py-2.5 text-white placeholder-text-muted focus:outline-none focus:border-gold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full gold-gradient-btn py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-gold-glow disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Ticket...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Ticket</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
