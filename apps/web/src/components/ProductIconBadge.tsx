import React from 'react';
import { Crown, Key, Sparkles, Package, Coins } from 'lucide-react';

interface ProductIconBadgeProps {
  slug: string;
  categorySlug?: string;
  imageUrl?: string;
  name: string;
  className?: string;
}

export const ProductIconBadge: React.FC<ProductIconBadgeProps> = ({
  slug,
  categorySlug,
  imageUrl,
  name,
  className = 'h-36',
}) => {
  // Determine color theme based on slug or tier
  const isVip = slug.includes('vip') && !slug.includes('mvp');
  const isMvp = slug.includes('mvp') && !slug.includes('plus');
  const isMvpPlus = slug.includes('mvp-plus') || slug.includes('plus');
  const isPremium = slug.includes('premium') || slug.includes('premuin');
  const isCustomRank = slug.includes('custom');
  const isTitanOrFlame = slug.includes('titan') || slug.includes('flame');

  const isCommonKey = slug.includes('common');
  const isRareKey = slug.includes('rare');
  const isEpicKey = slug.includes('epic');
  const isLegendaryKey = slug.includes('legendary') || slug.includes('mythic') || slug.includes('spawner');

  let glowColor = 'from-gold/20 via-gold/10 to-transparent';
  let iconColor = 'text-gold';
  let borderColor = 'border-gold/30';
  let auraBg = 'bg-gold/10';

  if (isVip) {
    glowColor = 'from-yellow-400/30 via-amber-500/15 to-transparent';
    iconColor = 'text-yellow-400';
    borderColor = 'border-yellow-400/40';
    auraBg = 'bg-yellow-400/15';
  } else if (isMvp) {
    glowColor = 'from-cyan-400/30 via-cyan-400/10 to-transparent';
    iconColor = 'text-cyan-400';
    borderColor = 'border-cyan-400/40';
    auraBg = 'bg-cyan-400/15';
  } else if (isMvpPlus) {
    glowColor = 'from-emerald-400/30 via-teal-400/15 to-transparent';
    iconColor = 'text-emerald-400';
    borderColor = 'border-emerald-400/40';
    auraBg = 'bg-emerald-400/15';
  } else if (isPremium) {
    glowColor = 'from-purple-500/35 via-fuchsia-500/20 to-transparent';
    iconColor = 'text-fuchsia-400';
    borderColor = 'border-purple-400/50';
    auraBg = 'bg-purple-500/20';
  } else if (isCustomRank) {
    glowColor = 'from-pink-500/35 via-amber-400/20 to-cyan-400/20';
    iconColor = 'text-amber-300';
    borderColor = 'border-amber-300/50';
    auraBg = 'bg-gradient-to-tr from-pink-500/25 via-purple-500/20 to-cyan-500/25';
  } else if (isTitanOrFlame) {
    glowColor = 'from-red-500/30 via-orange-500/15 to-transparent';
    iconColor = 'text-orange-400';
    borderColor = 'border-orange-500/40';
    auraBg = 'bg-orange-500/15';
  } else if (isRareKey) {
    glowColor = 'from-blue-500/25 via-blue-500/10 to-transparent';
    iconColor = 'text-blue-400';
    borderColor = 'border-blue-500/30';
    auraBg = 'bg-blue-500/10';
  } else if (isEpicKey) {
    glowColor = 'from-purple-500/25 via-purple-500/10 to-transparent';
    iconColor = 'text-purple-400';
    borderColor = 'border-purple-500/30';
    auraBg = 'bg-purple-500/10';
  } else if (isLegendaryKey) {
    glowColor = 'from-gold/30 via-gold/10 to-transparent';
    iconColor = 'text-gold';
    borderColor = 'border-gold/40';
    auraBg = 'bg-gold/15';
  }

  const isRank = categorySlug === 'ranks' || slug.includes('rank');
  const isKey = categorySlug === 'crate-keys' || slug.includes('key');
  const isCoin = categorySlug === 'coins-currency' || slug.includes('coin');
  const isBundle = categorySlug === 'bundles' || slug.includes('bundle');

  return (
    <div
      className={`relative w-full ${className} rounded-xl overflow-hidden bg-gradient-to-b from-brand-secondary/90 to-brand-card/90 flex items-center justify-center border border-white/5 group-hover:border-gold/30 transition-all duration-300`}
    >
      {/* Background Radial Glow */}
      <div
        className={`absolute inset-0 bg-radial-glow ${glowColor} opacity-75 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Floating particles aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

      {/* Central Icon container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Glow halo */}
        <div
          className={`w-20 h-20 rounded-2xl ${auraBg} border ${borderColor} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm`}
        >
          {imageUrl && !imageUrl.includes('unsplash') ? (
            <img src={imageUrl} alt={name} className="w-14 h-14 object-contain filter drop-shadow-md" />
          ) : isRank ? (
            <Crown className={`w-10 h-10 ${iconColor} filter drop-shadow-[0_0_12px_currentColor]`} />
          ) : isKey ? (
            <Key className={`w-10 h-10 ${iconColor} filter drop-shadow-[0_0_12px_currentColor] rotate-45`} />
          ) : isCoin ? (
            <Coins className={`w-10 h-10 ${iconColor} filter drop-shadow-[0_0_12px_currentColor]`} />
          ) : isBundle ? (
            <Package className={`w-10 h-10 ${iconColor} filter drop-shadow-[0_0_12px_currentColor]`} />
          ) : (
            <Sparkles className={`w-10 h-10 ${iconColor} filter drop-shadow-[0_0_12px_currentColor]`} />
          )}
        </div>
      </div>
    </div>
  );
};
