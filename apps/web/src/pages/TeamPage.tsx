import React, { useState } from 'react';
import { MessageSquare, Check, Sparkles, CheckCircle2, Users } from 'lucide-react';
import { playMinecraftClick } from '../utils/minecraft-sounds.js';

interface StaffMember {
  id: string;
  ign: string;
  skinUsername: string;
  discordTag: string;
  hasChat?: boolean;
}

interface RoleGroup {
  id: string;
  title: string;
  members: StaffMember[];
}

const roleGroups: RoleGroup[] = [
  {
    id: 'owner',
    title: 'OWNER',
    members: [
      {
        id: 'owner-1',
        ign: '_T_Z',
        skinUsername: '_T_Z',
        discordTag: '_T_Z',
        hasChat: false,
      },
    ],
  },
  {
    id: 'builder',
    title: 'BUILDER',
    members: [
      {
        id: 'builder-1',
        ign: 'Nx4YGzz',
        skinUsername: 'Nx4YGzz',
        discordTag: 'Nx4YGzz',
        hasChat: true,
      },
    ],
  },
  {
    id: 'developer',
    title: 'DEVELOPER',
    members: [
      {
        id: 'dev-1',
        ign: 'Nx4YGzz',
        skinUsername: 'Nx4YGzz',
        discordTag: 'Nx4YGzz',
        hasChat: true,
      },
    ],
  },
  {
    id: 'moderator',
    title: 'MODERATOR',
    members: [
      {
        id: 'mod-1',
        ign: '_T_Z',
        skinUsername: '_T_Z',
        discordTag: '_T_Z',
        hasChat: true,
      },
    ],
  },
];

export const TeamPage: React.FC = () => {
  const [copiedInfo, setCopiedInfo] = useState<string | null>(null);

  const handleCopyDiscord = (discordTag: string, ign: string) => {
    playMinecraftClick();
    navigator.clipboard.writeText(discordTag);
    setCopiedInfo(`Copied Discord: ${discordTag} (${ign})`);
    setTimeout(() => {
      setCopiedInfo(null);
    }, 2500);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 sm:space-y-8 select-none">
      {/* Toast Notification */}
      {copiedInfo && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131d24] text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center space-x-2.5 animate-bounce">
          <Check className="w-4 h-4 text-[#FFE600]" />
          <span className="text-xs sm:text-sm font-minecraft font-bold text-[#FFE600]">
            {copiedInfo}
          </span>
        </div>
      )}

      {/* Mazer Style Header Banner */}
      <div className="bg-[#1e1319] border-2 border-[#3b202d] rounded-2xl px-5 py-3.5 flex items-center space-x-3.5 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-[#e93b67] flex items-center justify-center shrink-0 shadow-inner">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="block text-[10px] font-minecraft text-[#ffb4c2] tracking-wider uppercase">
            SERVER DIRECTORY
          </span>
          <h1 className="text-lg sm:text-2xl font-minecraft font-black text-white tracking-wide uppercase">
            STAFF TEAM
          </h1>
        </div>
      </div>

      {/* Role Group Sections */}
      {roleGroups.map((group) => (
        <section
          key={group.id}
          className="rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] shadow-[0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden transition-all"
        >
          {/* Group Header Title */}
          <div className="px-5 sm:px-8 pt-5 pb-3 sm:pt-6 sm:pb-4 border-b border-[#a7ccd6]/50">
            <h2 className="font-minecraft text-xl sm:text-2xl md:text-3xl font-black text-[#131d24] tracking-wider uppercase">
              {group.title}
            </h2>
          </div>

          {/* Member Cards Grid */}
          <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {group.members.map((member) => (
              <div
                key={member.id}
                className="bg-[#9ec4cd] hover:bg-[#93bcc5] border border-[#89b1ba] rounded-2xl p-3 sm:p-4 flex items-center space-x-3.5 shadow-sm transition-all hover:shadow-md hover:scale-[1.01]"
              >
                {/* Full Minecraft Character Standing Skin */}
                <div className="w-16 sm:w-20 h-28 sm:h-34 rounded-xl bg-[#c5dfe6] border border-white/50 overflow-hidden flex items-center justify-center p-1 shrink-0 shadow-inner group/skin">
                  <img
                    src={`https://mc-heads.net/body/${member.skinUsername}/240`}
                    alt={member.ign}
                    className="h-full w-auto object-contain pixelated drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] transition-transform duration-200 group-hover/skin:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://mc-heads.net/body/Steve/240';
                    }}
                  />
                </div>

                {/* Member Details */}
                <div className="flex flex-col justify-center space-y-1.5 min-w-0 flex-1">
                  {/* Dark Name Pill with Optional Speech Bubble */}
                  <button
                    onClick={() => handleCopyDiscord(member.discordTag, member.ign)}
                    title={`Click to copy Discord: ${member.discordTag}`}
                    className="bg-[#485963] hover:bg-[#3b4952] active:scale-95 text-white px-3.5 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-sm font-minecraft group w-fit max-w-full"
                  >
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wider truncate">
                      {member.ign}
                    </span>
                    {member.hasChat && (
                      <MessageSquare className="w-3.5 h-3.5 text-white/90 shrink-0 group-hover:scale-110 transition-transform ml-0.5" />
                    )}
                  </button>

                  {/* Discord Username Copy Hint */}
                  <p className="text-[11px] text-[#2c3e50]/80 font-medium truncate flex items-center space-x-1">
                    <span className="text-[#3b4e5b]">Discord:</span>
                    <span className="font-semibold text-[#131d24]">@{member.discordTag}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Staff Application Section */}
      <div className="rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 text-xs font-minecraft font-black text-[#131d24]">
            <Sparkles className="w-4 h-4 text-[#d99a16]" />
            <span>JOIN OUR TEAM</span>
          </div>
          <h3 className="font-minecraft text-xl sm:text-2xl font-black text-[#131d24]">
            WANT TO BECOME AN ANAJAKSMP STAFF?
          </h3>
          <p className="text-xs sm:text-sm text-[#485963] max-w-xl">
            We are actively recruiting passionate builders, moderators, and community helpers. Open a ticket in our Discord server to apply!
          </p>
        </div>

        <a
          href="https://discord.gg/anajaksmp"
          target="_blank"
          rel="noopener noreferrer"
          onClick={playMinecraftClick}
          className="bg-[#FFE600] hover:bg-[#ffd700] active:scale-95 text-[#131d24] font-minecraft font-black px-6 py-3 rounded-2xl shadow-md transition-all flex items-center space-x-2 shrink-0 text-xs sm:text-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-[#131d24]" />
          <span>APPLY ON DISCORD</span>
        </a>
      </div>
    </div>
  );
};

export default TeamPage;
