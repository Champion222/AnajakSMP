import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, isSupabaseConfigured, memoryStore } from '../db/supabase.js';
import { AdminRole, AdminUser, AdminAuditLog } from '@anajaksmp/shared';
import { ENV } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';

export interface AdminAuthTokenPayload {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
}

export class AdminAuthService {
  /**
   * Verify admin credentials and issue a signed JWT
   */
  static async login(
    usernameOrEmail: string,
    passwordPlain: string,
    ipAddress?: string
  ): Promise<{ user: AdminUser; token: string } | null> {
    const identifier = usernameOrEmail.trim().toLowerCase();
    let user: AdminUser | null = null;
    let passwordHash = '';

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .or(`email.ilike.${identifier},username.ilike.${identifier}`)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        user = {
          id: data.id,
          email: data.email,
          username: data.username,
          role: data.role as AdminRole,
          is_active: data.is_active,
          last_login_at: data.last_login_at,
          created_at: data.created_at,
        };
        passwordHash = data.password_hash;
      }
    } else {
      user =
        memoryStore.adminUsers.find(
          (u) =>
            (u.email.toLowerCase() === identifier || u.username.toLowerCase() === identifier) &&
            u.is_active
        ) || null;
      if (user) {
        passwordHash = memoryStore.adminPasswordHashes.get(user.email) || '';
      }
    }

    if (!user || !passwordHash) {
      return null;
    }

    // Compare with bcrypt
    const isMatch = await bcrypt.compare(passwordPlain, passwordHash);
    if (!isMatch) {
      return null;
    }

    // Update last login
    const now = new Date().toISOString();
    user.last_login_at = now;
    if (isSupabaseConfigured && supabase) {
      await supabase.from('admin_users').update({ last_login_at: now }).eq('id', user.id);
    }

    // Sign JWT
    const payload: AdminAuthTokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Record login audit log
    await this.logAudit({
      adminId: user.id,
      adminUsername: user.username,
      action: 'ADMIN_LOGIN',
      resourceType: 'AUTH',
      ipAddress,
    });

    return { user, token };
  }

  /**
   * Verify JWT and extract admin payload
   */
  static verifyToken(token: string): AdminAuthTokenPayload | null {
    try {
      return jwt.verify(token, ENV.JWT_SECRET) as AdminAuthTokenPayload;
    } catch {
      return null;
    }
  }

  /**
   * Record sensitive administrative action into audit logs
   */
  static async logAudit(entry: {
    adminId: string;
    adminUsername: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
  }): Promise<void> {
    const log: AdminAuditLog = {
      id: uuidv4(),
      admin_id: entry.adminId,
      admin_username: entry.adminUsername,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId || null,
      details: entry.details || null,
      ip_address: entry.ipAddress || null,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('admin_audit_logs').insert(log);
      } catch {
        // ignore log error
      }
    } else {
      memoryStore.auditLogs.unshift(log);
      if (memoryStore.auditLogs.length > 200) {
        memoryStore.auditLogs.pop();
      }
    }
  }

  /**
   * Retrieve audit logs
   */
  static async getAuditLogs(limit = 50): Promise<AdminAuditLog[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      return (data || []) as AdminAuditLog[];
    }
    return memoryStore.auditLogs.slice(0, limit);
  }
}
