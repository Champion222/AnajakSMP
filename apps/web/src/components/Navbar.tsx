import React, { useState } from 'react';
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
  const location = useLocation();

  // Navigation order matching Mazer Club reference: HOME, RANK, HELP, VOTE, TEAM, GAME, KEYS
  const navLinks: NavItem[] = [
    { label: 'HOME', path: '/', icon: Home },
    { label: 'RANK', path: '/ranks', icon: Crown },
    { label: 'HELP', path: '/support', icon: HelpCircle },
    { label: 'VOTE', path: '/socials', icon: CheckSquare },
    { label: 'TEAM', path: '/team', icon: Users },
    { label: 'GAME', path: '/fun', icon: Gamepad2 },
    { label: 'KEYS', path: '/crate-keys', icon: Key },
  ];

  const serverIp = settings?.server_ip || 'play.anajaksmp.xyz';
  const onlinePlayers = serverStatus?.players?.online ?? 42;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getBreadcrumbTitle = (pathname: string): { subtitle: string; title: string } => {
    if (pathname === '/') return { subtitle: 'RETURN TO BROWSE', title: 'HOME' };
    if (pathname.startsWith('/ranks')) return { subtitle: 'RETURN TO BROWSE', title: 'RANK SHOP' };
    if (pathname.startsWith('/crate-keys')) return { subtitle: 'RETURN TO BROWSE', title: 'CRATE KEYS' };
    if (pathname.startsWith('/store')) return { subtitle: 'RETURN TO BROWSE', title: 'ALL PRODUCTS' };
    if (pathname.startsWith('/team')) return { subtitle: 'RETURN TO BROWSE', title: 'OUR STAFF TEAM' };
    if (pathname.startsWith('/socials') || pathname.startsWith('/social-media'))
      return { subtitle: 'RETURN TO BROWSE', title: 'VOTE LINKS & SOCIALS' };
    if (pathname.startsWith('/fun')) return { subtitle: 'RETURN TO BROWSE', title: 'MINI GAMES & FUN' };
    if (pathname.startsWith('/support')) return { subtitle: 'RETURN TO BROWSE', title: 'HELP & SUPPORT' };
    if (pathname.startsWith('/cart')) return { subtitle: 'RETURN TO BROWSE', title: 'SHOPPING CART' };
    if (pathname.startsWith('/checkout')) return { subtitle: 'RETURN TO BROWSE', title: 'CHECKOUT' };
    if (pathname.startsWith('/orders')) return { subtitle: 'RETURN TO BROWSE', title: 'ORDER STATUS' };
    return { subtitle: 'RETURN TO BROWSE', title: 'STORE' };
  };

  const breadcrumb = getBreadcrumbTitle(location.pathname);

  return (
    <div className="relative w-full select-none">
      {/* 1. Minecraft Grass Block Top Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#3e721a] via-[#529322] to-[#3e721a] border-b border-[#284c10]" />

      {/* 2. Main Red Crimson Header with Subtle Pixel Sparkles */}
      <header className="relative bg-gradient-to-b from-[#7A0222] via-[#A80836] to-[#C71047] text-white overflow-hidden shadow-2xl">
        {/* Ambient Glow & Sparkle Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
          {/* Diamond dust particles */}
          <span className="absolute top-6 left-[12%] w-1.5 h-1.5 bg-white/40 rotate-45 animate-pulse" />
          <span className="absolute top-16 left-[28%] w-1 h-1 bg-white/30 rotate-45" />
          <span className="absolute top-8 right-[18%] w-1.5 h-1.5 bg-white/40 rotate-45 animate-pulse" />
          <span className="absolute top-24 right-[32%] w-1 h-1 bg-white/30 rotate-45" />
          <span className="absolute bottom-10 left-[42%] w-1 h-1 bg-white/30 rotate-45" />
          <span className="absolute bottom-14 right-[10%] w-1.5 h-1.5 bg-white/40 rotate-45 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between h-16 sm:h-20 border-b border-white/10 gap-2">
            {/* Mobile Brand / Toggle */}
            <div className="flex items-center lg:hidden space-x-2">
              <button
                onClick={() => {
                  playMinecraftClick();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="p-2 rounded-xl bg-black/30 border border-white/20 text-white hover:text-[#FFE600]"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#FFE600]" />}
              </button>
              <Link to="/" onClick={playMinecraftClick} className="font-minecraft text-sm font-black text-white">
                ANAJAK<span className="text-[#FFE600]">SMP</span>
              </Link>
            </div>

            {/* Desktop Centered Mazer-style Nav Bar */}
            <nav className="hidden lg:flex items-center justify-center flex-1 space-x-1 xl:space-x-2 font-minecraft">
              {navLinks.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={playMinecraftClick}
                    className={`px-3.5 xl:px-4 py-2 rounded-xl text-xs xl:text-[13px] font-black tracking-wider transition-all duration-200 flex items-center space-x-2 whitespace-nowrap select-none ${
                      active
                        ? 'bg-[#FFE600] text-[#121216] shadow-[0_0_20px_rgba(255,230,0,0.65)] scale-105'
                        : 'text-white/90 hover:text-[#FFE600] hover:bg-black/20 active:scale-95'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${active ? 'text-[#121216]' : 'text-white/80'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Top Right Utilities: Currency & Cart */}
            <div className="flex items-center space-x-2 shrink-0 font-minecraft">
              {/* Currency Selector */}
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
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-black/30 border border-white/20 hover:border-[#FFE600] text-white transition-all group"
                aria-label="View shopping cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#FFE600] group-hover:scale-110 transition-transform" />
                <span className="px-1.5 py-0.2 rounded-md bg-[#FFE600] text-[#121216] text-xs font-black min-w-[20px] text-center font-minecraft">
                  {itemCount}
                </span>
              </Link>
            </div>
          </div>

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

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#570217] border-t border-white/10 px-4 pt-3 pb-6 space-y-3 font-minecraft relative z-30">
            <nav className="flex flex-col space-y-1.5">
              {navLinks.map((item) => {
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
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-black tracking-wider transition-colors flex items-center space-x-2.5 ${
                      active
                        ? 'bg-[#FFE600] text-[#121216] shadow-[0_0_15px_rgba(255,230,0,0.5)]'
                        : 'text-white/90 hover:bg-black/20 hover:text-[#FFE600]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#121216]' : 'text-white/70'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-minecraft">
                <button
                  onClick={() => {
                    playMinecraftClick();
                    setCurrency('USD');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg font-bold ${
                    currency === 'USD' ? 'bg-[#FFE600] text-[#121216]' : 'text-white/70'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => {
                    playMinecraftClick();
                    setCurrency('KHR');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg font-bold ${
                    currency === 'KHR' ? 'bg-[#FFE600] text-[#121216]' : 'text-white/70'
                  }`}
                >
                  KHR (៛)
                </button>
              </div>

              <button
                onClick={copyServerIp}
                className="px-3 py-1.5 rounded-lg bg-black/30 border border-white/20 text-xs font-mono text-white flex items-center space-x-1"
              >
                {copiedIp ? (
                  <span className="text-[#FFE600] font-bold font-minecraft text-[11px]">Copied!</span>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-status-success" />
                    <span>{serverIp}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

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

      {/* 4. Floating Dark Maroon Breadcrumb Bar */}
      <div className="relative z-20 -mt-3 sm:-mt-5 px-4 max-w-4xl mx-auto">
        <Link
          to="/"
          onClick={playMinecraftClick}
          title="Return to Browse Home"
          className="bg-[#2B0513] hover:bg-[#340718] border-2 border-[#4A0B21] hover:border-[#6B1232] rounded-2xl md:rounded-3xl p-3 sm:p-4 shadow-[0_16px_40px_rgba(20,2,8,0.7)] flex items-center space-x-4 transition-all group block"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#DE124D] to-[#FF4579] shadow-[0_0_15px_rgba(222,18,77,0.5)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Home className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] font-minecraft tracking-[0.2em] text-[#E0A0B0] uppercase group-hover:text-white transition-colors">
              {breadcrumb.subtitle}
            </span>
            <span className="font-minecraft text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wider leading-tight group-hover:text-[#FFE600] transition-colors">
              {breadcrumb.title}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};
