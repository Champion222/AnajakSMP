import React, { useState } from 'react';
import { MessageSquare, Check, Sparkles, CheckCircle2 } from 'lucide-react';
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
        ign: 'XinG_Mazer',
        skinUsername: 'Xing_Mazer',
        discordTag: 'xing_mazer',
        hasChat: false,
      },
      {
        id: 'owner-2',
        ign: 'KingTayy',
        skinUsername: 'KingTayy',
        discordTag: 'kingtayy',
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
        ign: 'CUBEKHMER',
        skinUsername: 'CUBEKHMER',
        discordTag: 'cubekhmer',
        hasChat: true,
      },
      {
        id: 'builder-2',
        ign: 'PRO_PHEAR',
        skinUsername: 'PRO_PHEAR',
        discordTag: 'pro_phear',
        hasChat: true,
      },
      {
        id: 'builder-3',
        ign: 'CHOMRERN',
        skinUsername: 'CHOMRERN',
        discordTag: 'chomrern',
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
        ign: 'Golden_IQ',
        skinUsername: 'Golden_IQ',
        discordTag: 'golden_iq',
        hasChat: true,
      },
      {
        id: 'dev-2',
        ign: 'VathnaDev',
        skinUsername: 'VathnaDev',
        discordTag: 'vathnadev',
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
        ign: 'LotusGuard',
        skinUsername: 'CaptainSparklez',
        discordTag: 'lotus_guard',
        hasChat: true,
      },
      {
        id: 'mod-2',
        ign: 'PixelSlayer',
        skinUsername: 'DanTDM',
        discordTag: 'pixelslayer',
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
                className="bg-[#9ec4cd] hover:bg-[#93bcc5] border border-[#89b1ba] rounded-2xl p-3 sm:p-3.5 flex items-center space-x-3.5 shadow-sm transition-all hover:shadow-md hover:scale-[1.01]"
              >
                {/* Minecraft Bust / Body Avatar */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#c5dfe6] border border-white/40 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                  <img
                    src={`https://mc-heads.net/body/${member.skinUsername}/160`}
                    alt={member.ign}
                    className="w-full h-full object-cover object-top scale-[1.3] translate-y-1 pixelated"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://mc-heads.net/body/Steve/160';
                    }}
                  />
                </div>

                {/* Dark Name Pill with Optional Speech Bubble */}
                <button
                  onClick={() => handleCopyDiscord(member.discordTag, member.ign)}
                  title={`Click to copy Discord: ${member.discordTag}`}
                  className="bg-[#485963] hover:bg-[#3b4952] active:scale-95 text-white px-3.5 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-sm font-minecraft group"
                >
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wider">
                    {member.ign}
                  </span>
                  {member.hasChat && (
                    <MessageSquare className="w-3.5 h-3.5 text-white/90 shrink-0 group-hover:scale-110 transition-transform" />
                  )}
                </button>
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
