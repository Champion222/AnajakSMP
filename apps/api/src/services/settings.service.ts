import { supabase, isSupabaseConfigured, memoryStore } from '../db/supabase.js';
import { StoreSettings } from '@anajaksmp/shared';

export class SettingsService {
  static async getSettings(): Promise<StoreSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('store_settings').select('*').limit(1).single();
      if (!error && data) {
        return data as StoreSettings;
      }
    }
    return memoryStore.settings;
  }

  static async updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    if (isSupabaseConfigured && supabase) {
      const current = await this.getSettings();
      const { data, error } = await supabase
        .from('store_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', current.id)
        .select()
        .single();
      if (error) throw error;
      return data as StoreSettings;
    }

    memoryStore.settings = {
      ...memoryStore.settings,
      ...updates,
    };
    return memoryStore.settings;
  }
}
