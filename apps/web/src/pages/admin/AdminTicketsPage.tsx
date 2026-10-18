import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { SupportTicket } from '@anajaksmp/shared';
import { MessageSquare, CheckCircle2, Clock, AlertCircle, Loader2, Edit2, X } from 'lucide-react';

interface AdminTicketsPageProps {
  token: string;
}

export const AdminTicketsPage: React.FC<AdminTicketsPageProps> = ({ token }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newStatus, setNewStatus] = useState<string>('OPEN');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const res = await api.admin.getTickets(token);
      setTickets(res.tickets || []);
    } catch (err) {
      console.error('Error loading tickets', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [token]);

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      setIsUpdating(true);
      await api.admin.updateTicket(token, selectedTicket.id, {
        status: newStatus as any,
        admin_notes: adminNotes,
      });
      setSelectedTicket(null);
      await loadTickets();
    } catch (err: any) {
      alert(err.message || 'Failed to update ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Player Support Tickets</h1>
        <p className="text-xs text-text-secondary mt-1">
          Review customer inquiries, payment verification requests, and deliver assistance.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
          <p className="text-xs text-text-secondary">Loading support tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-12 text-center bg-brand-card rounded-2xl border border-brand-border text-xs text-text-muted">
          No support tickets registered.
        </div>
      ) : (
        <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-secondary/80 text-text-muted uppercase font-bold border-b border-brand-border">
              <tr>
                <th className="p-4">Ticket #</th>
                <th className="p-4">Player</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Order #</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-brand-secondary/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">{t.ticket_number}</td>
                  <td className="p-4">
                    <div className="font-bold text-gold">{t.minecraft_username}</div>
                    <div className="text-[10px] text-text-muted">{t.customer_email}</div>
                  </td>
                  <td className="p-4 font-medium text-white max-w-xs truncate">{t.subject}</td>
                  <td className="p-4 font-mono text-text-secondary">{t.order_number || '—'}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'RESOLVED' || t.status === 'CLOSED'
                          ? 'bg-status-success/15 text-status-success'
                          : 'bg-status-warning/15 text-status-warning'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-text-muted">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedTicket(t);
                        setNewStatus(t.status);
                        setAdminNotes(t.admin_notes || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-brand-secondary border border-brand-border hover:border-gold text-xs font-bold text-text-secondary hover:text-white"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-brand-border bg-brand-secondary flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-gold block">Support Ticket</span>
                <h3 className="font-extrabold text-base text-white">#{selectedTicket.ticket_number}</h3>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTicket} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="space-y-1 bg-brand-secondary p-4 rounded-xl border border-brand-border">
                <span className="text-text-muted text-[10px] uppercase font-bold block">Subject</span>
                <p className="font-bold text-sm text-white">{selectedTicket.subject}</p>
                <span className="text-text-muted text-[10px] uppercase font-bold block pt-2">Message</span>
                <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>

              <div>
                <label className="block uppercase font-bold text-text-secondary mb-1">Ticket Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-bold text-text-secondary mb-1">Staff Internal Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record resolution notes, transaction verification details, etc."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-3 border-t border-brand-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded-xl bg-brand-secondary border border-brand-border text-text-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="gold-gradient-btn px-5 py-2 rounded-xl font-bold"
                >
                  {isUpdating ? 'Updating...' : 'Update Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
