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
  Zap,
  Copy,
  Check,
  Menu,
  X,
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

  const navLinks: NavItem[] = [
    { label: 'RANK', path: '/ranks', icon: Crown },
    { label: 'KEYS', path: '/crate-keys', icon: Key },
    { label: 'VOTE', path: '/socials', icon: CheckSquare },
    { label: 'HOME', path: '/', icon: Home },
    { label: 'TEAM', path: '/team', icon: Users },
    { label: 'GAME', path: '/fun', icon: Gamepad2 },
    { label: 'HELP', path: '/support', icon: HelpCircle },
  ];

  const serverIp = settings?.server_ip || 'play.anajaksmp.xyz';
  const onlinePlayers = serverStatus?.players?.online ?? 42;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c14]/95 backdrop-blur-md border-b border-[#202030]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Left: Brand Logo */}
          <Link
            to="/"
            onClick={playMinecraftClick}
            className="flex items-center space-x-2.5 group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE600] to-[#D99A16] p-0.5 shadow-[0_0_15px_rgba(255,230,0,0.3)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#12121c] rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#FFE600] fill-[#FFE600]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-minecraft text-lg sm:text-xl tracking-wider text-white group-hover:text-[#FFE600] transition-colors leading-tight">
                ANAJAK<span className="text-[#FFE600]">SMP</span>
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#8e8ea0] uppercase font-bold font-minecraft">
                EST. 2026
              </span>
            </div>
          </Link>

          {/* Center: Mazer-style Nav Bar with Icons and Pill Highlights */}
          <nav className="hidden lg:flex items-center justify-center space-x-1 xl:space-x-2 font-minecraft">
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
                      : 'text-white/90 hover:text-[#FFE600] hover:bg-white/5 active:scale-95'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${active ? 'text-[#121216]' : 'text-white/80'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center space-x-2.5 shrink-0 font-minecraft">
            {/* Server IP Pill */}
            <button
              onClick={copyServerIp}
              title="Click to copy Minecraft Server IP"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#151522] border border-[#262638] hover:border-[#FFE600]/60 transition-all text-xs font-mono text-white group"
            >
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span className="font-mono text-xs">{serverIp}</span>
              <span className="text-[#6d6d80] text-[11px] pl-1 border-l border-[#2e2e42] flex items-center space-x-1 group-hover:text-[#FFE600] font-minecraft">
                {copiedIp ? (
                  <>
                    <Check className="w-3 h-3 text-status-success" />
                    <span className="text-status-success font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{onlinePlayers}</span>
                  </>
                )}
              </span>
            </button>

            {/* Currency Selector */}
            <div className="flex items-center bg-[#151522] rounded-xl border border-[#262638] p-0.5 text-xs font-minecraft">
              <button
                onClick={() => {
                  playMinecraftClick();
                  setCurrency('USD');
                }}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  currency === 'USD'
                    ? 'bg-[#FFE600] text-[#121216] shadow-[0_0_10px_rgba(255,230,0,0.4)]'
                    : 'text-[#8e8ea0] hover:text-white'
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
                    : 'text-[#8e8ea0] hover:text-white'
                }`}
              >
                KHR (៛)
              </button>
            </div>

            {/* Shopping Cart Pill Button */}
            <Link
              to="/cart"
              onClick={playMinecraftClick}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#181827] border border-[#2a2a3e] hover:border-[#FFE600] text-white transition-all group"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#FFE600] group-hover:scale-110 transition-transform" />
              <span className="px-1.5 py-0.2 rounded-md bg-[#FFE600] text-[#121216] text-xs font-black min-w-[20px] text-center font-minecraft">
                {itemCount}
              </span>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 lg:hidden font-minecraft">
            <Link
              to="/cart"
              onClick={playMinecraftClick}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#181827] border border-[#2a2a3e] text-[#FFE600]"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="px-1.5 rounded-md bg-[#FFE600] text-[#121216] text-[10px] font-black font-minecraft">
                {itemCount}
              </span>
            </Link>

            <button
              onClick={() => {
                playMinecraftClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 rounded-lg bg-[#161622] border border-[#262638] text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#FFE600]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0c14] border-b border-[#252535] px-4 pt-3 pb-6 space-y-3 font-minecraft">
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
                      : 'text-white/90 hover:bg-[#1a1a28] hover:text-[#FFE600]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#121216]' : 'text-white/70'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#252535] flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-minecraft">
              <button
                onClick={() => {
                  playMinecraftClick();
                  setCurrency('USD');
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold ${
                  currency === 'USD' ? 'bg-[#FFE600] text-[#121216]' : 'text-[#8e8ea0]'
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
                  currency === 'KHR' ? 'bg-[#FFE600] text-[#121216]' : 'text-[#8e8ea0]'
                }`}
              >
                KHR (៛)
              </button>
            </div>

            <button
              onClick={copyServerIp}
              className="px-3 py-1.5 rounded-lg bg-[#161622] border border-[#262638] text-xs font-mono text-white flex items-center space-x-1"
            >
              {copiedIp ? (
                <span className="text-status-success font-bold font-minecraft text-[11px]">Copied!</span>
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
    </header>
  );
};
