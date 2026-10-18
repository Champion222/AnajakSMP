import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext.js';
import { Sparkles, X } from 'lucide-react';

export const AnnouncementBanner: React.FC = () => {
  const { settings } = useSettings();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !settings?.announcement_active || !settings?.announcement_text) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-brand-bg px-4 py-2 font-medium text-xs sm:text-sm flex items-center justify-between shadow-md relative z-50">
      <div className="flex-1 text-center flex items-center justify-center space-x-2">
        <Sparkles className="w-4 h-4 shrink-0 text-brand-bg" />
        <span className="font-semibold">{settings.announcement_text}</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-brand-bg/80 hover:text-brand-bg p-1 rounded transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
