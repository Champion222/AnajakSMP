import React, { useState, useEffect } from 'react';
import { pageSettingsService, SoonPageSettings } from '../../services/pageSettingsService.js';
import {
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Sparkles,
  Key,
  Vote,
  HelpCircle,
  Users,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

interface AdminPagesControlPageProps {
  token: string;
}

export const AdminPagesControlPage: React.FC<AdminPagesControlPageProps> = () => {
  const [settings, setSettings] = useState<SoonPageSettings>(pageSettingsService.getSettings());
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) setSettings(e.detail);
    };
    window.addEventListener('anajaksmp_soon_updated', handleUpdate);
    return () => window.removeEventListener('anajaksmp_soon_updated', handleUpdate);
  }, []);

  const handleToggle = (page: 'keys' | 'vote' | 'help', label: string) => {
    const nextState = !settings[page];
    const updated = pageSettingsService.setPageSoon(page, nextState);
    setSettings(updated);
    setNotification(
      nextState
        ? `Added "SOON" mode to ${label} page. Navbar badge & upcoming teaser are now ACTIVE.`
        : `Removed "SOON" mode from ${label} page. Full page content & purchasing are now OPEN.`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const pages = [
    {
      id: 'keys' as const,
      name: 'Key Page (/crate-keys, /keys)',
      icon: Key,
      isSoon: settings.keys,
      path: '/crate-keys',
      description:
        'When "SOON" is enabled, the Keys page displays the upcoming mystery loot crate teaser with a animated SOON badge in the navbar. When disabled, the full Crate Keys catalog and purchasing are open.',
      soonBadgeColor: 'bg-[#e93b67] text-white',
    },
    {
      id: 'vote' as const,
      name: 'Vote Page (/socials, /vote)',
      icon: Vote,
      isSoon: settings.vote,
      path: '/socials',
      description:
        'When "SOON" is enabled, the Vote page displays a Coming Soon banner and voting rewards countdown in the navbar. When disabled, voting links and instructions are fully accessible.',
      soonBadgeColor: 'bg-[#e93b67] text-white',
    },
    {
      id: 'help' as const,
      name: 'Help / Support Page (/support)',
      icon: HelpCircle,
      isSoon: Boolean(settings.help),
      path: '/support',
      description:
        'When "SOON" is enabled, displays maintenance / upcoming helpdesk view. When disabled, player ticket submission and FAQs are active.',
      soonBadgeColor: 'bg-[#e93b67] text-white',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div>
        <div className="flex items-center space-x-2.5">
          <h1 className="text-2xl font-extrabold text-white">Storefront Page Controls (SOON Mode)</h1>
          <span className="bg-gold/15 text-gold text-xs px-2.5 py-0.5 rounded-full font-bold border border-gold/30">
            Real-time Toggle
          </span>
        </div>
        <p className="text-xs text-text-secondary mt-1">
          Add or remove the "SOON" state for individual pages on http://localhost:5173. Changes immediately update the navbar badges and storefront views.
        </p>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-status-success/15 border border-status-success/30 text-xs text-status-success flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-bold">{notification}</span>
        </div>
      )}

      {/* Pages Grid */}
      <div className="grid grid-cols-1 gap-5">
        {pages.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className={`rounded-2xl border p-6 transition-all duration-200 bg-brand-card shadow-xl ${
                p.isSoon
                  ? 'border-[#e93b67]/50 shadow-[0_4px_25px_rgba(233,59,103,0.15)]'
                  : 'border-brand-border hover:border-gold/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      p.isSoon
                        ? 'bg-[#e93b67]/20 border-[#e93b67]/50 text-[#e93b67]'
                        : 'bg-gold/15 border-gold/30 text-gold'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5 flex-wrap">
                      <h3 className="font-extrabold text-base text-white">{p.name}</h3>
                      {p.isSoon ? (
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-minecraft font-black bg-[#e93b67] text-white shadow-sm flex items-center space-x-1 animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>SOON ACTIVE</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-minecraft font-black bg-status-success text-white shadow-sm flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PAGE ACTIVE / LIVE</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">{p.description}</p>
                  </div>
                </div>

                {/* Toggle Controls */}
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-border">
                  <a
                    href={p.path}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-brand-secondary border border-brand-border text-text-secondary hover:text-white transition-colors text-xs font-bold flex items-center space-x-1"
                    title="View page in storefront"
                  >
                    <span className="hidden md:inline">View Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleToggle(p.id, p.name)}
                    className={`px-4 py-2.5 rounded-xl font-minecraft text-xs font-black tracking-wider uppercase transition-all flex items-center space-x-2 shadow-md cursor-pointer active:scale-95 ${
                      p.isSoon
                        ? 'bg-brand-secondary text-text-primary border border-brand-border hover:bg-brand-card hover:border-gold'
                        : 'bg-[#e93b67] text-white hover:bg-[#d62d59] shadow-[0_4px_14px_rgba(233,59,103,0.4)]'
                    }`}
                  >
                    {p.isSoon ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-gold" />
                        <span>Remove SOON (Open Page)</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-white" />
                        <span>Add "SOON" Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
