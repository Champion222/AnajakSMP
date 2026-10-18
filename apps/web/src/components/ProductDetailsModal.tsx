import React, { useState } from 'react';
import { Product } from '@anajaksmp/shared';
import { useCart } from '../context/CartContext.js';
import { useSettings } from '../context/SettingsContext.js';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  Crown,
  Key,
  Flame,
  Sparkles,
  Command,
  Gift,
  Check,
} from 'lucide-react';
import { playMinecraftClick } from '../utils/minecraft-sounds.js';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  const { addItem } = useCart();
  const { currency } = useSettings();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isRank = product.slug.includes('rank') || product.category?.slug === 'ranks';
  const isSale = product.sale_price_usd !== null && product.sale_price_usd !== undefined;
  const currentPriceUsd = isSale ? product.sale_price_usd! : product.price_usd;
  const exchangeRate = 4100;

  const formattedPrice =
    currency === 'USD'
      ? `$${(currentPriceUsd * quantity).toFixed(2)}`
      : `${Math.round(currentPriceUsd * quantity * exchangeRate).toLocaleString()} ៛`;

  const originalPriceFormatted = isSale
    ? currency === 'USD'
      ? `$${(product.price_usd * quantity).toFixed(2)}`
      : `${Math.round(product.price_usd * quantity * exchangeRate).toLocaleString()} ៛`
    : null;

  const handleAddToCart = () => {
    playMinecraftClick();
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  // Rank-specific Theme configurations
  const getRankTheme = () => {
    if (product.slug.includes('custom')) {
      return {
        prefixText: '[CUSTOM]',
        prefixColor: 'text-[#FFE600] font-black',
        badgeBg: 'bg-gradient-to-r from-[#FF007A] via-[#7928CA] to-[#00DFD8]',
        badgeText: 'text-white',
        glowBorder: 'border-[#FFE600]/60',
        chatSample: '⭐ [CUSTOM] Your personalized prefix & chat color in AnajakSMP!',
        sampleColor: 'text-[#FFE600]',
        icon: Sparkles,
      };
    }
    if (product.slug.includes('premium') || product.slug.includes('premuin')) {
      return {
        prefixText: '[PREMIUM]',
        prefixColor: 'text-[#E879F9] font-black',
        badgeBg: 'bg-gradient-to-r from-[#A855F7] to-[#EC4899]',
        badgeText: 'text-white',
        glowBorder: 'border-[#A855F7]/60',
        chatSample: 'Hello world! Mining with 1.5x economy bonus and /repair hand.',
        sampleColor: 'text-[#F472B6]',
        icon: Crown,
      };
    }
    if (product.slug.includes('titan')) {
      return {
        prefixText: '[TITAN]',
        prefixColor: 'text-[#FF3366] font-black',
        badgeBg: 'bg-gradient-to-r from-[#FF3366] to-[#FFE600]',
        badgeText: 'text-[#121216]',
        glowBorder: 'border-[#FF3366]/60',
        chatSample: 'Hello everyone! All hail the Titan ruler of AnajakSMP!',
        sampleColor: 'text-[#FFE600]',
        icon: Crown,
      };
    }
    if (product.slug.includes('mvp-plus')) {
      return {
        prefixText: '[MVP+]',
        prefixColor: 'text-[#00FFAA] font-black',
        badgeBg: 'bg-gradient-to-r from-[#00FFAA] to-[#00B0FF]',
        badgeText: 'text-[#121216]',
        glowBorder: 'border-[#00FFAA]/60',
        chatSample: 'Survival claims updated! /fly is active!',
        sampleColor: 'text-[#00FFAA]',
        icon: Crown,
      };
    }
    if (product.slug.includes('mvp')) {
      return {
        prefixText: '[MVP]',
        prefixColor: 'text-[#00E5FF] font-black',
        badgeBg: 'bg-gradient-to-r from-[#00E5FF] to-[#0091EA]',
        badgeText: 'text-[#121216]',
        glowBorder: 'border-[#00E5FF]/60',
        chatSample: 'Just claimed new land in the SMP wilderness!',
        sampleColor: 'text-[#00E5FF]',
        icon: Crown,
      };
    }
    // VIP default
    return {
      prefixText: '[VIP]',
      prefixColor: 'text-[#FFE600] font-black',
      badgeBg: 'bg-[#FFE600]',
      badgeText: 'text-[#121216]',
      glowBorder: 'border-[#FFE600]/60',
      chatSample: 'Welcome to AnajakSMP! Trading diamond gear at spawn.',
      sampleColor: 'text-[#FFE600]',
      icon: Crown,
    };
  };

  const rankTheme = getRankTheme();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#cbe4f6] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] max-h-[92vh] flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Header Banner */}
        <div className="relative bg-gradient-to-br from-[#7A0222] via-[#A80836] to-[#C71047] p-5 sm:p-6 text-white shrink-0 overflow-hidden">
          {/* Ambient Sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-4 left-8 w-1.5 h-1.5 bg-white/40 rotate-45 animate-pulse" />
            <span className="absolute bottom-4 right-12 w-1.5 h-1.5 bg-[#FFE600]/50 rotate-45 animate-pulse" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              playMinecraftClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-colors border border-white/15"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* 3D Rank Icon Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/30 border-2 border-white/20 p-2 shadow-2xl flex items-center justify-center shrink-0">
              {isRank ? (
                <Crown className="w-10 h-10 text-[#FFE600] drop-shadow-[0_0_12px_rgba(255,230,0,0.7)]" />
              ) : (
                <Key className="w-10 h-10 text-[#FFE600] rotate-45 drop-shadow-[0_0_12px_rgba(255,230,0,0.7)]" />
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${rankTheme.badgeBg} ${rankTheme.badgeText} font-minecraft shadow-sm`}>
                  {product.category?.name || 'PERMANENT RANK'}
                </span>
                {isSale && (
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-status-error text-white shadow-sm">
                    🔥 SALE
                  </span>
                )}
                {product.rank_duration && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-black/30 border border-white/20 text-white text-[10px] font-bold">
                    <Clock className="w-3 h-3 text-[#FFE600]" />
                    <span>{product.rank_duration}</span>
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                {product.name}
              </h2>

              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-md">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-[#1a2530]">
          {/* In-Game Chat Prefix Simulation for Ranks */}
          {isRank && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5a7184] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d99a16]" />
                  <span>In-Game Chat Prefix Preview</span>
                </span>
                <span className="text-[10px] text-[#7a8a98] font-mono">Real-time preview</span>
              </div>

              <div className="rounded-2xl bg-[#12121c] border-2 border-[#252538] p-3.5 shadow-inner text-left font-minecraft">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-white tracking-wide">
                  <span className={`${rankTheme.prefixColor} px-1.5 py-0.5 bg-white/5 rounded border border-white/10`}>
                    {rankTheme.prefixText}
                  </span>
                  <span className="text-white font-bold">Steve:</span>
                  <span className="text-white/90">{rankTheme.chatSample}</span>
                </div>
              </div>
            </div>
          )}

          {/* Perks & Features Grid */}
          {product.perks && product.perks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#1a2530] flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#d99a16]" />
                  <span>Unlocked Perks & Privileges</span>
                </h4>
                <span className="text-[11px] text-[#5a7184] font-medium">
                  {product.perks.length} Benefits Included
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.perks.map((perk, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#ebf5fc] border border-[#cbe4f6] text-xs transition-colors hover:border-[#FFE600]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#d99a16] shrink-0 mt-0.5" />
                    <span className="font-semibold text-[#1a2530] leading-snug">
                      {perk.replace(/\[.*?\]\s*/g, '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instant Delivery & Lifetime Trust Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-[#cbe4f6] shadow-sm">
              <Zap className="w-5 h-5 text-[#d99a16] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#1a2530]">Instant Automated Delivery</p>
                <p className="text-[11px] text-[#5a7184] mt-0.5">
                  Applied via Minecraft RCON in 30-60 seconds after payment confirmation.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-[#cbe4f6] shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#48b354] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#1a2530]">Lifetime Purchase Guarantee</p>
                <p className="text-[11px] text-[#5a7184] mt-0.5">
                  Permanent survival access. Zero monthly renewals or recurring fees.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Modal Footer Controls */}
        <div className="p-5 sm:p-6 bg-white border-t border-[#cbe4f6] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Quantity Selector */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs text-[#5a7184] font-black uppercase">Quantity:</span>
            <div className="flex items-center bg-[#ebf5fc] rounded-xl border border-[#cbe4f6]">
              <button
                onClick={() => {
                  playMinecraftClick();
                  setQuantity(Math.max(1, quantity - 1));
                }}
                className="p-2 text-[#5a7184] hover:text-[#1a2530] transition-colors"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 font-mono font-black text-sm text-[#1a2530]">{quantity}</span>
              <button
                onClick={() => {
                  playMinecraftClick();
                  setQuantity(quantity + 1);
                }}
                className="p-2 text-[#5a7184] hover:text-[#1a2530] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pricing & Add to Cart Button */}
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-[10px] text-[#7a8a98] uppercase font-bold block">Total Price</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-[#1a2530] tracking-tight">{formattedPrice}</span>
                {originalPriceFormatted && (
                  <span className="text-xs text-[#8a9ba8] line-through">{originalPriceFormatted}</span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`py-3.5 px-6 rounded-xl font-minecraft text-xs font-black tracking-wider uppercase transition-all duration-200 flex items-center space-x-2 shadow-md active:scale-95 ${
                added
                  ? 'bg-status-success text-white'
                  : 'bg-[#FFE600] hover:bg-[#fad800] text-[#121216] shadow-[0_4px_14px_rgba(255,230,0,0.5)]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#121216]" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
