import { supabase, isSupabaseConfigured, memoryStore } from '../db/supabase.js';
import { SupportTicket, SupportTicketInput } from '@anajaksmp/shared';
import { v4 as uuidv4 } from 'uuid';

export class SupportService {
  private static generateTicketNumber(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `TKT-${random}`;
  }

  static async createTicket(input: SupportTicketInput): Promise<SupportTicket> {
    const ticket: SupportTicket = {
      id: uuidv4(),
      ticket_number: this.generateTicketNumber(),
      order_number: input.order_number || null,
      minecraft_username: input.minecraft_username,
      customer_email: input.customer_email,
      subject: input.subject,
      message: input.message,
      status: 'OPEN',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('support_tickets').insert(ticket).select().single();
      if (error) throw error;
      return data as SupportTicket;
    }

    memoryStore.supportTickets.set(ticket.id, ticket);
    return ticket;
  }

  static async listTickets(): Promise<SupportTicket[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as SupportTicket[];
    }
    return Array.from(memoryStore.supportTickets.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  static async updateTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('support_tickets')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as SupportTicket;
    }

    const ticket = memoryStore.supportTickets.get(id);
    if (!ticket) return null;
    const updated = {
      ...ticket,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    memoryStore.supportTickets.set(id, updated);
    return updated;
  }
}
