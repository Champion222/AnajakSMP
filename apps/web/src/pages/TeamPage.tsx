import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Crown,
  Wrench,
  Hammer,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  Award,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { playMinecraftClick } from '../utils/minecraft-sounds.js';

interface StaffMember {
  id: string;
  ign: string;
  nickname: string;
  role: string;
  roleColor: string;
  category: 'leadership' | 'development' | 'building' | 'moderation';
  skinUsername: string;
  bio: string;
  favoriteItem: string;
  languages: string[];
  discordTag: string;
  since: string;
  isOnline?: boolean;
}

const staffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    ign: 'Anajak_King',
    nickname: 'King Anajak',
    role: '[OWNER]',
    roleColor: 'bg-red-950/80 text-red-400 border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.3)]',
    category: 'leadership',
    skinUsername: 'Notch',
    bio: 'Founder of AnajakSMP. Oversees vision, server economy balance, and creating the best Cambodian survival experience.',
    favoriteItem: 'Netherite Sword (Sharpness V)',
    languages: ['Khmer', 'English'],
    discordTag: 'anajak_king#0001',
    since: '2023',
    isOnline: true,
  },
  {
    id: 'staff-2',
    ign: 'KhmerKnight',
    nickname: 'Knight',
    role: '[CO-OWNER]',
    roleColor: 'bg-amber-950/80 text-amber-400 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
    category: 'leadership',
    skinUsername: 'Technoblade',
    bio: 'Operations & Community Director. Manages server hosting, tournaments, and payment integrations with ABA & KHQR.',
    favoriteItem: 'Enchanted Golden Apple',
    languages: ['Khmer', 'English'],
    discordTag: 'khmerknight#1337',
    since: '2023',
    isOnline: true,
  },
  {
    id: 'staff-3',
    ign: 'VathnaDev',
    nickname: 'Vathna',
    role: '[LEAD DEV]',
    roleColor: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    category: 'development',
    skinUsername: 'Jeb_',
    bio: 'Core software engineer building custom Paper plugins, RCON auto-fulfillment, security, and the Web Store platform.',
    favoriteItem: 'Command Block & Redstone',
    languages: ['Khmer', 'English'],
    discordTag: 'vathna#2026',
    since: '2024',
    isOnline: true,
  },
  {
    id: 'staff-4',
    ign: 'AngkorArchitect',
    nickname: 'Arch',
    role: '[HEAD BUILDER]',
    roleColor: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    category: 'building',
    skinUsername: 'Grian',
    bio: 'Master architect behind the Angkor Wat spawn cathedral, custom crate gazebos, and seasonal survival warp arenas.',
    favoriteItem: 'Stonecutter & Chiseled Deepslate',
    languages: ['Khmer', 'English'],
    discordTag: 'angkor_arch#7777',
    since: '2024',
    isOnline: false,
  },
  {
    id: 'staff-5',
    ign: 'LotusGuard',
    nickname: 'Lotus',
    role: '[SR MOD]',
    roleColor: 'bg-blue-950/80 text-blue-400 border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.3)]',
    category: 'moderation',
    skinUsername: 'CaptainSparklez',
    bio: 'Head of server moderation. Dedicated to keeping wilderness claims grief-free, handling player disputes, and ensuring fair play.',
    favoriteItem: 'Bow (Power V, Infinity)',
    languages: ['Khmer', 'English'],
    discordTag: 'lotus_guard#8888',
    since: '2024',
    isOnline: true,
  },
  {
    id: 'staff-6',
    ign: 'PhnomHero',
    nickname: 'Hero',
    role: '[COMMUNITY]',
    roleColor: 'bg-purple-950/80 text-purple-400 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]',
    category: 'moderation',
    skinUsername: 'MumboJumbo',
    bio: 'Community Manager & Event Host. Organizes weekend dragon fights, building contests, and player market festivals.',
    favoriteItem: 'Firework Rocket & Elytra',
    languages: ['Khmer', 'English'],
    discordTag: 'phnomhero#0420',
    since: '2024',
    isOnline: true,
  },
  {
    id: 'staff-7',
    ign: 'PixelSlayer',
    nickname: 'Pixel',
    role: '[HELPER]',
    roleColor: 'bg-yellow-950/80 text-yellow-400 border-yellow-500/60 shadow-[0_0_12px_rgba(234,179,8,0.3)]',
    category: 'moderation',
    skinUsername: 'DanTDM',
    bio: 'First point of contact for new players! Guides newcomers through claiming land, /sethome, and server tutorials.',
    favoriteItem: 'Diamond Pickaxe (Fortune III)',
    languages: ['Khmer', 'English'],
    discordTag: 'pixelslayer#5555',
    since: '2025',
    isOnline: false,
  },
];

export const TeamPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredMembers = activeCategory === 'all'
    ? staffMembers
    : staffMembers.filter((m) => m.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Staff', icon: Sparkles },
    { id: 'leadership', label: 'Leadership', icon: Crown },
    { id: 'development', label: 'Devs & Tech', icon: Wrench },
    { id: 'building', label: 'Builders', icon: Hammer },
    { id: 'moderation', label: 'Moderation', icon: Shield },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest font-minecraft text-minecraft-shadow">
          <Shield className="w-3.5 h-3.5 text-gold" />
          <span>Server Administration & Guardians</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-minecraft text-minecraft-shadow tracking-wide">
          MEET THE <span className="text-gold">ANAJAKSMP TEAM</span>
        </h1>

        <p className="text-sm sm:text-base text-[#9a9ab0] leading-relaxed">
          The passionate developers, architects, and community guardians who maintain the server, protect your survival claims, and run events every week.
        </p>

        {/* Quick Stats Pill */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[#8c8ca0] font-mono">
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#14141f] border border-[#232333]">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <span>7 Dedicated Staff</span>
          </span>
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#14141f] border border-[#232333]">
            <Award className="w-3.5 h-3.5 text-gold" />
            <span>24/7 Moderation & Ticket Support</span>
          </span>
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#14141f] border border-[#232333]">
            <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
            <span>Khmer & English Support</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playMinecraftClick();
                setActiveCategory(cat.id);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all font-minecraft ${
                isActive
                  ? 'bg-gold text-brand-bg shadow-gold-glow scale-105'
                  : 'bg-[#151522] border border-[#262638] text-[#9a9ab0] hover:text-white hover:border-gold/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="group rounded-2xl bg-gradient-to-b from-[#181826] to-[#12121d] border border-[#28283e] hover:border-gold/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-gold-glow flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header with Avatar & Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar Frame with Minecraft Head */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-[#232335] p-1 border border-[#3b3b55] group-hover:border-gold transition-colors overflow-hidden">
                      <img
                        src={`https://mc-heads.net/avatar/${member.skinUsername}/128`}
                        alt={member.ign}
                        className="w-full h-full object-cover rounded-lg pixelated"
                        onError={(e) => {
                          // Fallback to Steve head
                          (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/128';
                        }}
                      />
                    </div>
                    {/* Online Dot */}
                    <span
                      title={member.isOnline ? 'Online in-game / Discord' : 'Away'}
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#12121d] ${
                        member.isOnline ? 'bg-status-success' : 'bg-[#555566]'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-black text-white font-minecraft group-hover:text-gold transition-colors">
                        {member.ign}
                      </h3>
                    </div>
                    <p className="text-xs text-[#8c8ca0] font-mono">aka &quot;{member.nickname}&quot;</p>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[11px] font-black tracking-wider uppercase border font-minecraft ${member.roleColor}`}
                    >
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-[#b8b8cc] leading-relaxed min-h-[48px]">
                {member.bio}
              </p>

              {/* Details & Specs */}
              <div className="pt-3 border-t border-[#232336] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#8c8ca0]">
                  <span className="flex items-center space-x-1.5">
                    <Flame className="w-3.5 h-3.5 text-gold" />
                    <span>Fav Item:</span>
                  </span>
                  <span className="font-semibold text-white/90 text-right font-minecraft text-[11px]">
                    {member.favoriteItem}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#8c8ca0]">
                  <span>Languages:</span>
                  <div className="flex space-x-1">
                    {member.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-1.5 py-0.5 rounded bg-[#1e1e30] text-[10px] text-white/80 font-mono"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[#8c8ca0]">
                  <span>Staff Member Since:</span>
                  <span className="font-mono text-white/80">{member.since}</span>
                </div>
              </div>
            </div>

            {/* Discord Footer */}
            <div className="mt-5 pt-3 border-t border-[#232336] flex items-center justify-between">
              <span className="text-[11px] text-[#6e6e84] font-mono flex items-center space-x-1">
                <MessageSquare className="w-3 h-3 text-[#5865F2]" />
                <span>{member.discordTag}</span>
              </span>
              <a
                href="https://discord.gg/anajaksmp"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gold hover:text-white flex items-center space-x-1 font-semibold"
              >
                <span>Message</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Application CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-[#171725] via-[#1f1f33] to-[#171725] border border-gold/30 p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-bold font-minecraft uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Staff Recruitment Open</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-minecraft text-minecraft-shadow">
            WANT TO JOIN THE <span className="text-gold">ANAJAKSMP STAFF TEAM</span>?
          </h2>

          <p className="text-sm text-[#a4a4ba] leading-relaxed">
            We are always on the lookout for active, respectful, and mature players to help moderate chat, design events, and build spawn monuments. If you are passionate about AnajakSMP, submit your application today!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#c0c0d4] pt-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
              <span>Age 15+ with clean disciplinary record</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
              <span>Active player with 30+ hours on AnajakSMP</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
              <span>Working microphone & active Discord account</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
              <span>Fluent in Khmer or English</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <a
              href="https://discord.gg/anajaksmp"
              target="_blank"
              rel="noreferrer"
              onClick={playMinecraftClick}
              className="gold-gradient-btn px-6 py-3 rounded-xl font-minecraft text-xs flex items-center space-x-2 text-minecraft-shadow"
            >
              <MessageSquare className="w-4 h-4" />
              <span>APPLY VIA DISCORD TICKET</span>
            </a>
            <Link
              to="/support"
              onClick={playMinecraftClick}
              className="px-6 py-3 rounded-xl bg-[#141420] border border-[#2d2d42] text-white hover:border-gold/50 font-minecraft text-xs flex items-center space-x-2"
            >
              <span>READ REQUIREMENTS</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#88889a]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
