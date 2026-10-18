import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { AdminUser } from '@anajaksmp/shared';
import { Crown, Lock, User, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser, token: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      const res = await api.admin.login(usernameOrEmail.trim(), password);
      onLoginSuccess(res.user, res.token);
      navigate('/control-panel/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 relative hero-grid-pattern">
      {/* Gold ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md bg-brand-card border border-brand-border rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-gold to-gold-deep p-0.5 shadow-gold-glow">
            <div className="w-full h-full bg-brand-secondary rounded-[14px] flex items-center justify-center">
              <Crown className="w-8 h-8 text-gold" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Staff Control Panel</h1>
            <p className="text-xs text-text-secondary mt-1">
              Authorized administrator authentication for AnajakSMP.xyz
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-status-error/15 border border-status-error/40 text-xs text-status-error flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase font-bold text-text-secondary mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="admin@anajaksmp.xyz"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full bg-brand-secondary border border-brand-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-text-muted focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block uppercase font-bold text-text-secondary mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-secondary border border-brand-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-text-muted focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full gold-gradient-btn py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-gold-glow disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Control Panel</span>
            )}
          </button>
        </form>

        {/* Security & Default Test Notice */}
        <div className="p-3.5 rounded-xl bg-brand-secondary border border-brand-border text-[11px] text-text-secondary space-y-1 text-center">
          <p className="flex items-center justify-center space-x-1.5 text-gold font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Session & Audit Logging</span>
          </p>
          <p className="text-text-muted">
            Initial Owner Account: <code className="text-white">admin@anajaksmp.xyz</code> / <code className="text-white">AdminAnajak2026!</code>
          </p>
        </div>
      </div>
    </div>
  );
};
