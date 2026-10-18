export interface SoonPageSettings {
  keys: boolean;
  vote: boolean;
  help?: boolean;
}

const STORAGE_KEY = 'anajaksmp_soon_pages';

const DEFAULT_SETTINGS: SoonPageSettings = {
  keys: true, // Keys starts in SOON mode as previously requested
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

  setPageSoon(page: 'keys' | 'vote' | 'help', soon: boolean): SoonPageSettings {
    const current = this.getSettings();
    const updated = { ...current, [page]: soon };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('anajaksmp_soon_updated', { detail: updated }));
    } catch (e) {
      console.warn('Failed to save soon settings', e);
    }
    return updated;
  },

  togglePageSoon(page: 'keys' | 'vote' | 'help'): SoonPageSettings {
    const current = this.getSettings();
    return this.setPageSoon(page, !current[page]);
  },
};
