import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { StoreSettings } from '@anajaksmp/shared';
import { Settings, Save, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface AdminSettingsPageProps {
  token: string;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ token }) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await api.admin.getSettings(token);
        setSettings(data.settings);
      } catch (err: any) {
        setError(err.message || 'Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setIsSaving(true);
      setMessage(null);
      setError(null);
      const res = await api.admin.updateSettings(token, settings);
      setSettings(res.settings);
      setMessage('Store settings updated successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
        <p className="text-xs text-text-secondary">Loading store settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Store Configuration & Settings</h1>
        <p className="text-xs text-text-secondary mt-1">
          Owner-level controls for payments, Minecraft connection, and announcements.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-status-success/15 border border-status-success/30 text-xs text-status-success flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-status-error/15 border border-status-error/30 text-xs text-status-error flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* General Brand Settings */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-4">
          <h2 className="font-bold text-sm text-white uppercase tracking-wider text-gold">
            General & Minecraft Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-bold text-text-secondary mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-text-secondary mb-1">
                Minecraft Server IP Address
              </label>
              <input
                type="text"
                value={settings.server_ip}
                onChange={(e) => setSettings({ ...settings, server_ip: e.target.value })}
                className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-text-secondary mb-1">
                USD to KHR Exchange Rate
              </label>
              <input
                type="number"
                value={settings.exchange_rate_usd_to_khr}
                onChange={(e) =>
                  setSettings({ ...settings, exchange_rate_usd_to_khr: parseFloat(e.target.value) || 4100 })
                }
                className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-text-secondary mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-4">
          <h2 className="font-bold text-sm text-white uppercase tracking-wider text-gold">
            Top Announcement Banner
          </h2>
          <div>
            <label className="block uppercase font-bold text-text-secondary mb-1">
              Banner Announcement Text
            </label>
            <input
              type="text"
              value={settings.announcement_text}
              onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
              className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
            />
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.announcement_active}
              onChange={(e) => setSettings({ ...settings, announcement_active: e.target.checked })}
              className="rounded bg-brand-secondary border-brand-border text-gold"
            />
            <span className="font-bold text-white">Display banner on storefront</span>
          </label>
        </div>

        {/* Payment & Security Toggles */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-4">
          <h2 className="font-bold text-sm text-white uppercase tracking-wider text-gold">
            Payment Gateways & Modes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="p-4 rounded-xl bg-brand-secondary border border-brand-border flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.payment_sandbox_mode}
                onChange={(e) => setSettings({ ...settings, payment_sandbox_mode: e.target.checked })}
                className="rounded bg-brand-secondary border-brand-border text-gold"
              />
              <div>
                <span className="font-bold text-white block">Payment Sandbox Mode</span>
                <span className="text-[10px] text-text-muted">Allow test simulation</span>
              </div>
            </label>

            <label className="p-4 rounded-xl bg-brand-secondary border border-brand-border flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.khqr_enabled}
                onChange={(e) => setSettings({ ...settings, khqr_enabled: e.target.checked })}
                className="rounded bg-brand-secondary border-brand-border text-gold"
              />
              <div>
                <span className="font-bold text-white block">Bakong KHQR</span>
                <span className="text-[10px] text-text-muted">Enable on checkout</span>
              </div>
            </label>

            <label className="p-4 rounded-xl bg-brand-secondary border border-brand-border flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.aba_payway_enabled}
                onChange={(e) => setSettings({ ...settings, aba_payway_enabled: e.target.checked })}
                className="rounded bg-brand-secondary border-brand-border text-gold"
              />
              <div>
                <span className="font-bold text-white block">ABA PayWay</span>
                <span className="text-[10px] text-text-muted">Enable on checkout</span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="gold-gradient-btn px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-gold-glow"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Settings Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
