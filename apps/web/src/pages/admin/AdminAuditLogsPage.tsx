import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { AdminAuditLog } from '@anajaksmp/shared';
import { ShieldAlert, Loader2, Calendar, User, Info } from 'lucide-react';

interface AdminAuditLogsPageProps {
  token: string;
}

export const AdminAuditLogsPage: React.FC<AdminAuditLogsPageProps> = ({ token }) => {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await api.admin.getAuditLogs(token);
        setLogs(res.logs || []);
      } catch (err) {
        console.error('Error loading audit logs', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadLogs();
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Security & Audit Logs</h1>
        <p className="text-xs text-text-secondary mt-1">
          Immutable event log tracking administrative logins, payment verifications, and catalog changes.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
          <p className="text-xs text-text-secondary">Retrieving audit log entries...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center bg-brand-card rounded-2xl border border-brand-border text-xs text-text-muted">
          No audit logs recorded yet.
        </div>
      ) : (
        <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-secondary/80 text-text-muted uppercase font-bold border-b border-brand-border">
                <tr>
                  <th className="p-4">Admin User</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Resource</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-brand-secondary/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center space-x-2">
                      <User className="w-3.5 h-3.5 text-gold" />
                      <span>{log.admin_username}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono px-2 py-0.5 rounded bg-brand-secondary border border-brand-border text-gold font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-text-secondary text-[11px]">
                      {log.resource_type} {log.resource_id ? `(${log.resource_id})` : ''}
                    </td>
                    <td className="p-4 text-text-muted font-mono text-[10px] max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                    <td className="p-4 font-mono text-text-muted text-[10px]">
                      {log.ip_address || '—'}
                    </td>
                    <td className="p-4 text-text-muted text-[10px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
