import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Coupon } from '@anajaksmp/shared';
import { Tag, Plus, Edit2, Check, X, Loader2, Percent, DollarSign } from 'lucide-react';

interface AdminCouponsPageProps {
  token: string;
}

export const AdminCouponsPage: React.FC<AdminCouponsPageProps> = ({ token }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrder, setMinOrder] = useState('0');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await api.admin.getCoupons(token);
      setCoupons(res.coupons || []);
    } catch (err) {
      console.error('Error loading coupons', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, [token]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const val = parseFloat(discountValue);
    if (isNaN(val) || val <= 0) {
      setFormError('Please enter a valid discount amount.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.admin.createCoupon(token, {
        code: code.trim().toUpperCase(),
        description: description.trim() || null,
        discount_type: discountType,
        discount_value: val,
        min_order_amount_usd: parseFloat(minOrder) || 0,
        max_discount_usd: maxDiscount ? parseFloat(maxDiscount) : null,
        usage_limit: usageLimit ? parseInt(usageLimit, 10) : null,
        is_active: isActive,
      });

      setIsModalOpen(false);
      setCode('');
      await loadCoupons();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create coupon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await api.admin.updateCoupon(token, coupon.id, { is_active: !coupon.is_active });
      await loadCoupons();
    } catch (err: any) {
      alert(err.message || 'Failed to update coupon');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Promotional Coupons</h1>
          <p className="text-xs text-text-secondary mt-1">
            Create discount codes, configure percentage or fixed value reductions, and set limits.
          </p>
        </div>

        <button
          onClick={() => {
            setCode('');
            setDescription('');
            setDiscountType('PERCENTAGE');
            setDiscountValue('10');
            setMinOrder('0');
            setMaxDiscount('');
            setUsageLimit('100');
            setIsActive(true);
            setFormError(null);
            setIsModalOpen(true);
          }}
          className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-gold-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
          <p className="text-xs text-text-secondary">Loading coupons...</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-secondary/80 text-text-muted uppercase font-bold border-b border-brand-border">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Spend</th>
                <th className="p-4">Used / Limit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-brand-secondary/40 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-extrabold text-white text-sm bg-brand-secondary px-2.5 py-1 rounded border border-brand-border">
                      {c.code}
                    </span>
                    {c.description && <p className="text-[10px] text-text-muted mt-1">{c.description}</p>}
                  </td>
                  <td className="p-4 font-bold text-gold">
                    {c.discount_type === 'PERCENTAGE'
                      ? `${c.discount_value}% OFF`
                      : `$${c.discount_value.toFixed(2)} OFF`}
                  </td>
                  <td className="p-4 text-text-secondary">
                    ${c.min_order_amount_usd.toFixed(2)}
                  </td>
                  <td className="p-4 font-mono text-white">
                    {c.times_used} / {c.usage_limit ?? '∞'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.is_active ? 'bg-status-success/15 text-status-success' : 'bg-status-error/15 text-status-error'
                      }`}
                    >
                      {c.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className="px-3 py-1 rounded-lg bg-brand-secondary border border-brand-border hover:border-gold text-text-secondary hover:text-white"
                    >
                      {c.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-brand-border bg-brand-secondary flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white">Create New Coupon Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-status-error/15 text-status-error">{formError}</div>
              )}

              <div>
                <label className="block uppercase font-bold text-text-secondary mb-1">Coupon Code *</label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white font-mono uppercase focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-text-secondary mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 20% off summer sale promotion"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">Discount Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">Usage Limit</label>
                  <input
                    type="number"
                    placeholder="Unlimited"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-brand-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-brand-secondary border border-brand-border text-text-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gold-gradient-btn px-5 py-2 rounded-xl font-bold"
                >
                  {isSubmitting ? 'Saving...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
