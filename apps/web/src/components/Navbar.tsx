import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { useSettings } from '../context/SettingsContext.js';
import {
  Home,
  Crown,
  Key,
  CheckSquare,
  Users,
  Gamepad2,
  HelpCircle,
  ShoppingBag,
  Copy,
  Menu,
  X,
  Play,
  MessageSquare,
  Server,
  Smartphone,
} from 'lucide-react';
import { playMinecraftClick } from '../utils/minecraft-sounds.js';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { settings, serverStatus, copiedIp, copyServerIp, currency, setCurrency } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedBedrock, setCopiedBedrock] = useState(false);
  const location = useLocation();

  // Sliding pill position state for desktop active nav item
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // Navigation order matching Mazer reference: HOME, VOTE, HELP, TEAM, RANK, KEYS
  const navLinks: NavItem[] = [
    { label: 'HOME', path: '/', icon: Home },
    { label: 'VOTE', path: '/socials', icon: CheckSquare },
    { label: 'HELP', path: '/support', icon: HelpCircle },
    { label: 'TEAM', path: '/team', icon: Users },
    { label: 'RANK', path: '/ranks', icon: Crown },
    { label: 'KEYS', path: '/crate-keys', icon: Key },
  ];

  // Mobile drawer items matching Mazer reference layout: Home, Vote, Help, Team, Rank, Keys
  const mobileNavLinks: NavItem[] = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Vote', path: '/socials', icon: CheckSquare },
    { label: 'Help', path: '/support', icon: HelpCircle },
    { label: 'Team', path: '/team', icon: Users },
    { label: 'Rank', path: '/ranks', icon: Crown },
    { label: 'Keys', path: '/crate-keys', icon: Key },
  ];

  const serverIp = settings?.server_ip || 'play.anajaksmp.xyz';
  const onlinePlayers = serverStatus?.players?.online ?? 42;

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Update sliding pill indicator position whenever route or window size changes
  const updatePillPosition = () => {
    const activeItem = navLinks.find((item) => isActive(item.path));
    if (activeItem && navContainerRef.current) {
      const el = navItemRefs.current.get(activeItem.label);
      if (el) {
        const containerRect = navContainerRef.current.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setPillStyle({
          left: elRect.left - containerRect.left,
          width: elRect.width,
          opacity: 1,
        });
        return;
      }
    }
    setPillStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  useEffect(() => {
    updatePillPosition();
    const timer = setTimeout(updatePillPosition, 60);
    window.addEventListener('resize', updatePillPosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePillPosition);
    };
  }, [location.pathname]);

  return (
    <div className="relative w-full select-none">
      {/* 1. Fixed Navigation Bar (Follows on scroll permanently) */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-[#6b021d] via-[#820424] to-[#6b021d] border-b border-black/30 shadow-[0_4px_25px_rgba(0,0,0,0.5)] backdrop-blur-md">
        {/* Minecraft Grass Block Top Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#3e721a] via-[#529322] to-[#3e721a] border-b border-[#284c10]" />

        {/* Ambient subtle sparkles in fixed bar */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-4 left-[12%] w-1.5 h-1.5 bg-white/30 rotate-45 animate-pulse" />
          <span className="absolute top-5 right-[18%] w-1.5 h-1.5 bg-white/30 rotate-45 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            {/* Mobile Brand */}
            <div className="flex items-center lg:hidden">
              <Link to="/" onClick={playMinecraftClick} className="flex items-center space-x-2.5">
                <img
                  src="/assets/anajak_logo.png"
                  alt="AnajakSMP"
                  className="h-9 w-auto object-contain drop-shadow"
                />
                <span className="font-minecraft text-sm font-black text-white tracking-wider">
                  ANAJAK<span className="text-[#FFE600]">SMP</span>
                </span>
              </Link>
            </div>

            {/* Desktop Centered Mazer-style Nav Bar with Sliding Pill Animation */}
            <div
              ref={navContainerRef}
              className="hidden lg:flex items-center justify-center flex-1 space-x-1 xl:space-x-2 font-minecraft relative py-1"
            >
              {/* Sliding Active Pill Indicator with Glowing Shimmer */}
              <div
                className="absolute top-1 bottom-1 rounded-xl bg-[#FFE600] shadow-[0_0_24px_rgba(255,230,0,0.75)] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-0"
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.opacity,
                  transform: pillStyle.opacity ? 'scale(1)' : 'scale(0.95)',
                }}
              >
                {/* Shimmer Light Sweep across the pill */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-navbar-shimmer" />
                </div>
              </div>

              {navLinks.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    ref={(el) => {
                      if (el) navItemRefs.current.set(item.label, el);
                      else navItemRefs.current.delete(item.label);
                    }}
                    onClick={playMinecraftClick}
                    className={`relative z-10 px-3.5 xl:px-4 py-2 rounded-xl text-xs xl:text-[13px] font-black tracking-wider transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap select-none ${
                      active
                        ? 'text-[#121216]'
                        : 'text-white/90 hover:text-white hover:bg-black/20 active:scale-95'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-colors duration-200 ${
                        active ? 'text-[#121216]' : 'text-white/80'
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Top Right Utilities: Currency, Cart & Mobile Menu Button */}
            <div className="flex items-center space-x-2 shrink-0 font-minecraft">
              {/* Currency Selector (Desktop) */}
              <div className="hidden sm:flex items-center bg-black/30 rounded-xl border border-white/15 p-0.5 text-xs font-minecraft">
                <button
                  onClick={() => {
                    playMinecraftClick();
                    setCurrency('USD');
                  }}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    currency === 'USD'
                      ? 'bg-[#FFE600] text-[#121216] shadow-[0_0_10px_rgba(255,230,0,0.4)]'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => {
                    playMinecraftClick();
                    setCurrency('KHR');
                  }}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    currency === 'KHR'
                      ? 'bg-[#FFE600] text-[#121216] shadow-[0_0_10px_rgba(255,230,0,0.4)]'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  KHR (៛)
                </button>
              </div>

              {/* Shopping Cart Pill Button */}
              <Link
                to="/cart"
                onClick={playMinecraftClick}
                className="flex items-center space-x-2 bg-black/30 hover:bg-black/50 border border-white/15 hover:border-[#FFE600]/60 rounded-xl px-3 py-2 text-white transition-all shadow-md group select-none"
              >
                <ShoppingBag className="w-4 h-4 text-[#FFE600] group-hover:scale-110 transition-transform" />
                <span className="bg-[#FFE600] text-[#121216] font-black text-[11px] px-1.5 py-0.2 rounded-md font-mono">
                  {itemCount}
                </span>
              </Link>

              {/* Mobile Hamburger Menu Toggle Button */}
              <button
                onClick={() => {
                  playMinecraftClick();
                  setMobileMenuOpen(true);
                }}
                className="lg:hidden p-2 rounded-xl bg-black/30 hover:bg-black/50 border border-white/20 text-white hover:text-[#FFE600] active:scale-90 transition-all shadow-md"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5 text-[#FFE600]" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Main Red Crimson Header with Server Showcase & Sawtooth Edge */}
      <header className="relative bg-gradient-to-b from-[#7A0222] via-[#A80836] to-[#C71047] text-white overflow-hidden shadow-2xl pt-[70px] sm:pt-[86px]">
        {/* Ambient Glow & Sparkle Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
          <span className="absolute top-6 left-[12%] w-1.5 h-1.5 bg-white/40 rotate-45 animate-pulse" />
          <span className="absolute top-16 left-[28%] w-1 h-1 bg-white/30 rotate-45" />
          <span className="absolute top-8 right-[18%] w-1.5 h-1.5 bg-white/40 rotate-45 animate-pulse" />
          <span className="absolute top-24 right-[32%] w-1 h-1 bg-white/30 rotate-45" />
          <span className="absolute bottom-10 left-[42%] w-1 h-1 bg-white/30 rotate-45" />
          <span className="absolute bottom-14 right-[10%] w-1.5 h-1.5 bg-white/40 rotate-45 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Middle Server Showcase Row (Play Online | 3D Emblem | Users Online) */}
          <div className="py-6 sm:py-8 lg:py-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4">
              {/* Left Card: Play Online */}
              <div
                onClick={copyServerIp}
                title="Click to copy Minecraft Server IP"
                className="w-full sm:w-auto lg:min-w-[280px] bg-black/30 backdrop-blur-md border border-white/15 hover:border-[#FFE600]/60 rounded-2xl px-5 py-3.5 flex items-center space-x-4 transition-all cursor-pointer group shadow-xl hover:scale-[1.02]"
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform shrink-0 border border-white/10">
                  <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-minecraft font-black text-white text-xs sm:text-sm tracking-wider">
                      PLAY ONLINE
                    </span>
                    <span className="bg-[#FFE600] text-[#121216] font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg shadow-sm font-minecraft">
                      {onlinePlayers}
                    </span>
                  </div>
                  <span className="text-xs text-white/70 font-mono tracking-wide group-hover:text-[#FFE600] transition-colors flex items-center gap-1.5 mt-0.5">
                    {copiedIp ? (
                      <span className="text-[#FFE600] font-bold font-minecraft text-[11px]">COPIED TO CLIPBOARD!</span>
                    ) : (
                      <>
                        <span>{serverIp.toUpperCase()}</span>
                        <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Center: 3D AnajakSMP Logo Emblem */}
              <Link
                to="/"
                onClick={playMinecraftClick}
                className="group shrink-0 flex flex-col items-center justify-center my-2 lg:my-0"
              >
                <img
                  src="/assets/anajak_logo.png"
                  alt="AnajakSMP Minecraft Server"
                  className="w-48 sm:w-56 md:w-64 lg:w-72 h-auto drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300 select-none pointer-events-auto"
                />
              </Link>

              {/* Right Card: Users Online */}
              <a
                href={settings?.discord_url || 'https://discord.gg/anajaksmp'}
                target="_blank"
                rel="noopener noreferrer"
                title="Join our Discord community"
                className="w-full sm:w-auto lg:min-w-[280px] bg-black/30 backdrop-blur-md border border-white/15 hover:border-[#5865F2]/70 rounded-2xl px-5 py-3.5 flex items-center justify-between space-x-4 transition-all group shadow-xl hover:scale-[1.02]"
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#FFE600] text-[#121216] font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg shadow-sm font-minecraft">
                      250+
                    </span>
                    <span className="font-minecraft font-black text-white text-xs sm:text-sm tracking-wider">
                      USERS ONLINE
                    </span>
                  </div>
                  <span className="text-xs text-white/70 font-mono tracking-wide group-hover:text-white transition-colors mt-0.5">
                    DC.ANAJAKSMP.XYZ
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#5865F2]/40 border border-[#5865F2]/60 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform shrink-0">
                  <MessageSquare className="w-5 h-5 fill-white text-white" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* 3. Minecraft Pixel Sawtooth Divider along bottom edge */}
        <div className="w-full overflow-hidden leading-none relative z-10 pointer-events-none -mb-px">
          <svg
            className="w-full h-3.5 sm:h-5 text-[#E8F6FE] fill-current transition-colors"
            viewBox="0 0 1280 16"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="mc-sawtooth" width="32" height="16" patternUnits="userSpaceOnUse">
                <path d="M0 0 H6 V4 H10 V8 H14 V12 H18 V12 H22 V8 H26 V4 H32 V0 H32 V16 H0 Z" />
              </pattern>
            </defs>
            <rect width="100%" height="16" fill="url(#mc-sawtooth)" />
          </svg>
        </div>
      </header>

      {/* 4. Mobile Slide-Out Drawer (Matching Mazer Club Reference) */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          playMinecraftClick();
          setMobileMenuOpen(false);
        }}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[100] w-[86%] max-w-[340px] sm:max-w-[380px] bg-gradient-to-b from-[#6e031e] via-[#5c0319] to-[#450212] text-white shadow-[-12px_0_40px_rgba(0,0,0,0.7)] flex flex-col justify-between p-5 overflow-y-auto transition-transform duration-300 ease-out lg:hidden rounded-l-3xl border-l border-white/15 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-4">
          {/* Drawer Header: Logo + Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
            <Link
              to="/"
              onClick={() => {
                playMinecraftClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2"
            >
              <img
                src="/assets/anajak_logo.png"
                alt="AnajakSMP"
                className="h-10 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              />
            </Link>

            <button
              onClick={() => {
                playMinecraftClick();
                setMobileMenuOpen(false);
              }}
              className="w-10 h-10 rounded-2xl bg-[#871131] hover:bg-[#9d173c] active:scale-90 text-white flex items-center justify-center transition-all border border-white/15 shadow-sm"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5 py-1">
            {mobileNavLinks.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => {
                    playMinecraftClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-2xl text-[15px] font-bold tracking-wide transition-all duration-150 flex items-center space-x-3.5 select-none ${
                    active
                      ? 'bg-[#FFE600] text-[#121216] font-black shadow-[0_4px_20px_rgba(255,230,0,0.45)] scale-[1.02]'
                      : 'text-white/85 hover:text-white hover:bg-white/10 active:scale-[0.98]'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      active ? 'text-[#121216]' : 'text-white/80'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Bottom Cards */}
        <div className="space-y-2.5 pt-4 border-t border-white/10 shrink-0 mt-4">
          {/* Card 1: Server IP */}
          <button
            onClick={() => {
              playMinecraftClick();
              copyServerIp();
            }}
            className="w-full bg-[#3d0210]/70 hover:bg-[#4a0214] active:scale-[0.98] border border-white/10 rounded-2xl p-3 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate tracking-wide">
                  {serverIp.replace('play.', '')}
                </p>
                <p className="text-[11px] text-white/60">
                  {copiedIp ? (
                    <span className="text-[#FFE600] font-bold">Copied to clipboard!</span>
                  ) : (
                    'tap to copy IP'
                  )}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-[#2b020c] border border-white/10 text-xs font-bold text-[#FFE600] font-mono shrink-0">
              {onlinePlayers || 1033}
            </span>
          </button>

          {/* Card 2: Discord */}
          <a
            href={settings?.discord_url || 'https://discord.gg/anajaksmp'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playMinecraftClick}
            className="w-full bg-[#3d0210]/70 hover:bg-[#4a0214] active:scale-[0.98] border border-white/10 rounded-2xl p-3 flex items-center justify-between text-left transition-all block"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#5865F2] shrink-0">
                <MessageSquare className="w-5 h-5 fill-current" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate tracking-wide">
                  dc.anajaksmp.xyz
                </p>
                <p className="text-[11px] text-white/60">join Discord</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-[#2b020c] border border-white/10 text-xs font-bold text-white/90 font-mono shrink-0">
              1657
            </span>
          </a>

          {/* Card 3: Bedrock Edition */}
          <div className="w-full bg-[#3d0210]/90 border border-white/10 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#FFE600]/20 flex items-center justify-center text-[#FFE600] shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">Bedrock Edition</p>
                <p className="text-xs font-bold text-[#FFE600] font-mono truncate">
                  bedrock.anajaksmp.xyz : 19132
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <a
                href="minecraft://?addExternalServer=AnajakSMP|bedrock.anajaksmp.xyz:19132"
                onClick={playMinecraftClick}
                className="bg-[#d99a16] hover:bg-[#f0ac1d] active:scale-95 text-[#121216] font-black text-xs py-2 px-2.5 rounded-xl flex items-center justify-center space-x-1 transition-all shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Click to Play</span>
              </a>
              <button
                onClick={() => {
                  playMinecraftClick();
                  navigator.clipboard.writeText('bedrock.anajaksmp.xyz:19132');
                  setCopiedBedrock(true);
                  setTimeout(() => setCopiedBedrock(false), 2000);
                }}
                className="bg-black/30 hover:bg-black/50 active:scale-95 text-white font-bold text-xs py-2 px-2.5 rounded-xl flex items-center justify-center space-x-1 transition-all border border-white/10"
              >
                {copiedBedrock ? (
                  <span className="text-[#FFE600]">Copied!</span>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy IP</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-white/60 font-medium">Currency</span>
            <div className="flex items-center bg-black/30 rounded-xl border border-white/10 p-0.5">
              <button
                onClick={() => {
                  playMinecraftClick();
                  setCurrency('USD');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  currency === 'USD'
                    ? 'bg-[#FFE600] text-[#121216]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => {
                  playMinecraftClick();
                  setCurrency('KHR');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  currency === 'KHR'
                    ? 'bg-[#FFE600] text-[#121216]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                KHR (៛)
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
