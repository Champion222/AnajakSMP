import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Facebook,
  Youtube,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Server,
  Vote,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';
import { playMinecraftClick } from '../utils/minecraft-sounds.js';

export const SocialsPage: React.FC = () => {
  const { settings, copyServerIp, copiedIp } = useSettings();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const discordUrl = settings?.discord_url || 'https://discord.gg/anajaksmp';
  const telegramUrl = settings?.telegram_url || 'https://t.me/anajaksmp';
  const facebookUrl = settings?.facebook_url || 'https://facebook.com/anajaksmp';

  const copyToClipboard = (text: string, id: string) => {
    playMinecraftClick();
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const platforms = [
    {
      id: 'discord',
      name: 'Discord Community',
      subtitle: 'Primary Voice & Chat Headquarters',
      icon: MessageSquare,
      accentBg: 'bg-[#5865F2]',
      members: '2,500+ Members',
      description: 'The beating heart of AnajakSMP. Join voice channels with friends, trade items in player markets, submit support tickets, and enter weekly rank giveaways.',
      url: discordUrl,
      features: ['24/7 Staff Ticket Support', 'Weekly Nitro & Rank Giveaways', 'Player Marketplace Trading', 'Voice Channels for Survival Claims'],
      buttonText: 'JOIN DISCORD GUILD',
    },
    {
      id: 'telegram',
      name: 'Telegram Alerts',
      subtitle: 'Instant Updates & KHQR Direct Desk',
      icon: Send,
      accentBg: 'bg-[#229ED9]',
      members: '1,200+ Subscribers',
      description: 'Get immediate push notifications when server updates go live, maintenance restarts, and access 1-on-1 payment assistance for ABA PayWay and Bakong KHQR.',
      url: telegramUrl,
      features: ['Instant Server Status Alerts', 'KHQR Payment Slip Verification', 'Admin Announcement Broadcasts', 'Exclusive Telegram Promo Codes'],
      buttonText: 'JOIN TELEGRAM CHANNEL',
    },
    {
      id: 'facebook',
      name: 'Facebook Community',
      subtitle: 'Official Page & Cambodian Players Group',
      icon: Facebook,
      accentBg: 'bg-[#1877F2]',
      members: '5,000+ Followers',
      description: 'Connect with the wider Cambodian Minecraft player base. Share your majestic Angkor builds, survival timelapses, and keep up with seasonal events.',
      url: facebookUrl,
      features: ['Weekly Builder Highlights', 'Cambodian Community Discussions', 'Event Photo Albums', 'Facebook Group Meetups'],
      buttonText: 'FOLLOW ON FACEBOOK',
    },
    {
      id: 'youtube',
      name: 'YouTube & TikTok',
      subtitle: 'Montages, Guides & Server Trailers',
      icon: Youtube,
      accentBg: 'bg-[#FF0000]',
      members: '10K+ Views',
      description: 'Watch cinematic server trailers, tutorial guides on custom plugins, auto-farming walkthroughs, and epic end-crystal PvP tournaments.',
      url: 'https://youtube.com',
      features: ['Server Cinematic Trailers', 'Starter Guides & Claim Tutorials', 'PvP Tournament Highlights', 'Community Build Showcases'],
      buttonText: 'WATCH ON YOUTUBE',
    },
  ];

  const votingSites = [
    {
      id: 'site-a',
      name: 'VOTE LINK A',
      siteName: 'Planet Minecraft',
      reward: '1x Rare Key + 5,000 Coins',
      url: 'https://planetminecraft.com',
    },
    {
      id: 'site-b',
      name: 'VOTE LINK B',
      siteName: 'Minecraft-MP',
      reward: '1x Rare Key + 5,000 Coins',
      url: 'https://minecraft-mp.com',
    },
    {
      id: 'site-c',
      name: 'VOTE LINK C',
      siteName: 'TopG Servers',
      reward: '1x Rare Key + 5,000 Coins',
      url: 'https://topg.org',
    },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* 1. Mazer-Style Top Section: Switch Server + Vote Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Switch Server Card (Green Minecraft Button) */}
        <div className="lg:col-span-4 bg-white/85 backdrop-blur-md border border-[#cbe4f6] rounded-2xl p-5 shadow-sm space-y-3">
          <button
            onClick={copyServerIp}
            className="w-full py-4 px-5 rounded-2xl bg-[#48b354] hover:bg-[#3ea149] text-white font-minecraft shadow-[0_5px_0_#2e7d36] active:translate-y-1 active:shadow-[0_1px_0_#2e7d36] transition-all flex flex-col items-center justify-center text-center group"
          >
            <span className="text-base sm:text-lg font-black tracking-wider flex items-center gap-2">
              <Server className="w-5 h-5" />
              <span>SWITCH SERVER</span>
            </span>
            <span className="text-[11px] opacity-90 tracking-widest uppercase mt-0.5">
              CHANGE SERVER
            </span>
          </button>

          <div className="p-3 bg-[#ebf5fc] rounded-xl border border-[#cbe4f6] text-center space-y-1">
            <span className="text-[11px] text-[#5a7184] font-medium block">Active Realm:</span>
            <span className="font-minecraft text-xs font-black text-[#1a2530]">
              ANAJAK SURVIVAL (SMP-01)
            </span>
            <div className="pt-1 flex items-center justify-center gap-1.5 text-xs text-[#5a7184]">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span className="font-mono">{copiedIp ? 'IP Copied!' : settings?.server_ip || 'play.anajaksmp.xyz'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Vote Links for AnajakSMP (Blue Minecraft Buttons) */}
        <div className="lg:col-span-8 bg-white/85 backdrop-blur-md border border-[#cbe4f6] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2eef8] pb-4">
            <div>
              <h2 className="font-minecraft text-lg sm:text-xl font-black text-[#1a2530] tracking-wide">
                VOTE LINKS FOR ANAJAK-SMP
              </h2>
              <p className="text-xs text-[#5a7184] mt-0.5">
                Vote daily every 24 hours to claim in-game keys, coins, and vote streaks!
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-[#ebf5fc] border border-[#cbe4f6] text-[11px] font-mono text-[#4a6b82] shrink-0">
              🎁 Type your exact in-game name
            </div>
          </div>

          {/* Blue Minecraft Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {votingSites.map((site) => (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noreferrer"
                onClick={playMinecraftClick}
                className="py-4 px-4 rounded-xl bg-[#0092ff] hover:bg-[#0082ea] text-white font-minecraft shadow-[0_5px_0_#006fc4] active:translate-y-1 active:shadow-[0_1px_0_#006fc4] transition-all flex flex-col items-center justify-center text-center group select-none"
              >
                <span className="text-sm font-black tracking-wider flex items-center gap-1.5">
                  <Vote className="w-4 h-4" />
                  <span>{site.name}</span>
                </span>
                <span className="text-[10px] text-white/80 mt-1 font-mono">
                  {site.siteName}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Official Social Networks & Guilds */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#d99a16] block">
            Official Social Networks & Guilds
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1a2530]">
            CONNECT WITH OUR COMMUNITY
          </h2>
          <p className="text-xs sm:text-sm text-[#5a7184]">
            Stay connected with staff and fellow players across all official platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isCopied = copiedLink === platform.id;
            return (
              <div
                key={platform.id}
                className="rounded-2xl bg-white/85 backdrop-blur-md border border-[#cbe4f6] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-12 h-12 rounded-xl ${platform.accentBg} flex items-center justify-center text-white shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#1a2530]">
                          {platform.name}
                        </h3>
                        <p className="text-xs text-[#5a7184]">{platform.subtitle}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-[#ebf5fc] border border-[#cbe4f6] text-[11px] font-bold text-[#4a6b82] font-mono">
                      {platform.members}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5a7184] leading-relaxed">
                    {platform.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#e2eef8]">
                    {platform.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-[#5a7184]">
                        <Sparkles className="w-3.5 h-3.5 text-[#d99a16] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#e2eef8] flex items-center gap-3">
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={playMinecraftClick}
                    className={`flex-1 py-2.5 px-4 rounded-xl ${platform.accentBg} text-white font-minecraft text-xs font-black hover:brightness-110 transition-all flex items-center justify-center space-x-2 shadow-sm`}
                  >
                    <span>{platform.buttonText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => copyToClipboard(platform.url, platform.id)}
                    title="Copy link"
                    className="p-2.5 rounded-xl bg-[#ebf5fc] border border-[#cbe4f6] text-[#5a7184] hover:text-[#1a2530] transition-colors"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
