import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext.js';
import { Zap, Send, ShieldCheck, Heart } from 'lucide-react';
import { DiscordIcon } from './DiscordIcon.js';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-[#0b0b12] border-t border-[#232333] text-[#8e8ea0] pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#1f1f2e]">
          {/* Brand Logo & Tagline matching reference */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <img
              src="/assets/anajak_logo.png"
              alt="AnajakSMP"
              className="h-10 w-auto object-contain drop-shadow group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col text-left">
              <span className="font-black text-lg tracking-wider text-white">
                ANAJAK<span className="text-[#FFE600]">SMP</span>
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#7a7a90] uppercase font-bold">
                PLAY • SURVIVE • TOGETHER
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[#a8a8ba]">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <Link to="/ranks" className="hover:text-gold transition-colors">Ranks</Link>
            <Link to="/crate-keys" className="hover:text-gold transition-colors">Crate Keys</Link>
            <Link to="/team" className="hover:text-gold transition-colors">Team</Link>
            <Link to="/socials" className="hover:text-gold transition-colors">Socials</Link>
            <Link to="/support" className="hover:text-gold transition-colors">Support</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy</Link>
          </nav>

          {/* Social Icons matching reference */}
          <div className="flex items-center space-x-3">
            <a
              href={settings?.discord_url || 'https://discord.gg/anajaksmp'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-[#181824] hover:bg-gold hover:text-brand-bg border border-[#28283a] flex items-center justify-center text-[#a8a8ba] transition-all"
              aria-label="Discord"
            >
              <DiscordIcon className="w-4 h-4" />
            </a>
            <a
              href={settings?.telegram_url || 'https://t.me/anajaksmp'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-[#181824] hover:bg-gold hover:text-brand-bg border border-[#28283a] flex items-center justify-center text-[#a8a8ba] transition-all"
              aria-label="Telegram"
            >
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Credits & Cambodia Payment Trust */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#6e6e80] gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p>© 2026 AnajakSMP. All rights reserved.</p>
            <p className="text-[11px] text-[#555566]">
              Not an official Minecraft service. Not approved by or associated with Mojang or Microsoft.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[11px] text-[#7a7a90] font-semibold">Accepted in Cambodia:</span>
            <span className="px-2 py-0.5 rounded bg-[#161622] border border-[#262638] text-[10px] font-bold text-white">
              Bakong KHQR
            </span>
            <span className="px-2 py-0.5 rounded bg-[#161622] border border-[#262638] text-[10px] font-bold text-white">
              ABA PayWay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
