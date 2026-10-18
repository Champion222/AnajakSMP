export interface SoonPageSettings {
  keys: boolean;
  vote: boolean;
  help?: boolean;
}

const STORAGE_KEY = 'anajaksmp_soon_pages';
const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

const DEFAULT_SETTINGS: SoonPageSettings = {
  keys: true,
  vote: false,
  help: false,
};

export const pageSettingsService = {
  getSettings(): SoonPageSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse soon settings', e);
    }
    return DEFAULT_SETTINGS;
  },

  async syncFromServer(): Promise<SoonPageSettings> {
    try {
      const res = await fetch(`${API_BASE}/store/page-controls`);
      if (res.ok) {
        const data = await res.json();
        if (data.pages) {
          const merged = { ...DEFAULT_SETTINGS, ...data.pages };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          window.dispatchEvent(new CustomEvent('anajaksmp_soon_updated', { detail: merged }));
          return merged;
        }
      }
    } catch (e) {
      // silent fallback
    }
    return this.getSettings();
  },

  setPageSoon(page: 'keys' | 'vote' | 'help', soon: boolean, adminToken?: string): SoonPageSettings {
    const current = this.getSettings();
    const updated = { ...current, [page]: soon };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('anajaksmp_soon_updated', { detail: updated }));

      const token =
        adminToken ||
        localStorage.getItem('anajaksmp_admin_token') ||
        sessionStorage.getItem('anajaksmp_admin_token');

      if (token) {
        fetch(`${API_BASE}/admin/page-controls`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ page, isSoon: soon }),
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Failed to save soon settings', e);
    }
    return updated;
  },

  togglePageSoon(page: 'keys' | 'vote' | 'help', adminToken?: string): SoonPageSettings {
    const current = this.getSettings();
    return this.setPageSoon(page, !current[page], adminToken);
  },
};

// Initialize server sync on load
if (typeof window !== 'undefined') {
  pageSettingsService.syncFromServer();
}
