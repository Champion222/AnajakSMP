import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Facebook,
  Youtube,
  Video,
  Copy,
  Check,
  ExternalLink,
  Gift,
  Sparkles,
  Users,
  Bell,
  Award,
  Vote,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';
import { playMinecraftClick } from '../utils/minecraft-sounds.js';

export const SocialsPage: React.FC = () => {
  const { settings, serverStatus, copyServerIp, copiedIp } = useSettings();
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
      color: 'from-[#5865F2]/20 via-[#1c1c30] to-[#12121e]',
      borderColor: 'border-[#5865F2]/40 hover:border-[#5865F2]',
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
      color: 'from-[#229ED9]/20 via-[#161c28] to-[#12121e]',
      borderColor: 'border-[#229ED9]/40 hover:border-[#229ED9]',
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
      color: 'from-[#1877F2]/20 via-[#161928] to-[#12121e]',
      borderColor: 'border-[#1877F2]/40 hover:border-[#1877F2]',
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
      color: 'from-[#FF0000]/20 via-[#1c161a] to-[#12121e]',
      borderColor: 'border-[#FF0000]/40 hover:border-[#FF0000]',
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
      id: 'pmc',
      name: 'Planet Minecraft',
      rank: '#1 Minecraft Site',
      reward: '1x Rare Key + 5,000 Coins',
      url: 'https://planetminecraft.com',
    },
    {
      id: 'mcmp',
      name: 'Minecraft-MP',
      rank: 'Global Server List',
      reward: '1x Rare Key + 5,000 Coins',
      url: 'https://minecraft-mp.com',
    },
    {
      id: 'topg',
      name: 'TopG Servers',
      rank: 'Top Rated SMP',
      reward: '1x Rare Key + 5,000 Coins',
      url: 'https://topg.org',
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest font-heading">
          <Users className="w-3.5 h-3.5 text-gold" />
          <span>Official Social Networks & Guilds</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-wide">
          JOIN THE <span className="text-gold">ANAJAKSMP COMMUNITY</span>
        </h1>

        <p className="text-sm sm:text-base text-[#9a9ab0] leading-relaxed">
          Stay connected with staff and fellow survivalists across all platforms. Get instant server updates, participate in giveaways, and receive direct payment support.
        </p>

        {/* Server IP quick badge */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={copyServerIp}
            className="flex items-center space-x-2.5 px-4 py-2 rounded-xl bg-[#14141f] border border-[#262638] hover:border-gold/50 transition-all text-xs font-mono text-white group"
          >
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <span className="text-[#a0a0b6]">Server Address:</span>
            <span className="text-gold font-bold">{settings?.server_ip || 'play.anajaksmp.xyz'}</span>
            <span className="pl-2 border-l border-[#2e2e42] text-[11px] text-[#707086] flex items-center space-x-1 group-hover:text-gold">
              {copiedIp ? (
                <>
                  <Check className="w-3.5 h-3.5 text-status-success" />
                  <span className="text-status-success font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Click to copy</span>
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Primary Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isCopied = copiedLink === platform.id;
          return (
            <div
              key={platform.id}
              className={`rounded-3xl bg-gradient-to-br ${platform.color} border ${platform.borderColor} p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-gold-glow`}
            >
              <div className="space-y-5">
                {/* Platform Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl ${platform.accentBg} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white font-heading">
                        {platform.name}
                      </h3>
                      <p className="text-xs text-[#8e8ea4]">{platform.subtitle}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#161624] border border-[#2b2b40] text-[11px] font-bold text-white/90 font-mono">
                    {platform.members}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#b0b0c6] leading-relaxed">
                  {platform.description}
                </p>

                {/* Feature checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
                  {platform.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-[#c4c4d8]">
                      <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-3 items-center justify-between">
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={playMinecraftClick}
                  className={`flex-1 min-w-[200px] text-center py-3 px-4 rounded-xl ${platform.accentBg} text-white font-heading text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center space-x-2 shadow-md`}
                >
                  <span>{platform.buttonText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => copyToClipboard(platform.url, platform.id)}
                  title="Copy link"
                  className="px-3.5 py-3 rounded-xl bg-[#141420] border border-[#2c2c40] text-[#9090a8] hover:text-white transition-colors"
                >
                  {isCopied ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Server Voting Section */}
      <div className="rounded-3xl bg-gradient-to-r from-[#171725] via-[#1a1a2b] to-[#171725] border border-gold/30 p-8 sm:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-gold/15 text-gold text-xs font-bold font-heading uppercase">
              <Gift className="w-3.5 h-3.5" />
              <span>Free In-Game Rewards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              VOTE DAILY FOR <span className="text-gold">FREE CRATE KEYS & COINS</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#9e9eb4] max-w-2xl">
              Help AnajakSMP climb the Minecraft server charts! Vote on each site every 24 hours to receive automatic keys and economy currency in-game.
            </p>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-[#11111a] border border-[#28283c] text-xs font-mono text-[#a0a0b8] shrink-0">
            <span className="text-gold font-bold block mb-1">🎁 How to claim:</span>
            <span>Type your exact Minecraft username when voting!</span>
          </div>
        </div>

        {/* Voting Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {votingSites.map((site) => (
            <div
              key={site.id}
              className="rounded-2xl bg-[#13131e] border border-[#252538] hover:border-gold/50 p-5 space-y-4 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7e7e94] uppercase tracking-wider font-mono">
                  {site.rank}
                </span>
                <Vote className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
              </div>

              <div>
                <h4 className="text-base font-black text-white font-heading">{site.name}</h4>
                <p className="text-xs text-gold font-semibold mt-1 flex items-center space-x-1">
                  <span>{site.reward}</span>
                </p>
              </div>

              <a
                href={site.url}
                target="_blank"
                rel="noreferrer"
                onClick={playMinecraftClick}
                className="w-full block text-center py-2 px-3 rounded-xl bg-gold text-brand-bg font-heading text-xs font-black hover:brightness-110 transition-all"
              >
                VOTE ON {site.name.toUpperCase()}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
