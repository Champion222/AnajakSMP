import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { useSettings } from '../context/SettingsContext.js';
import {
  ShoppingBag,
  Zap,
  Copy,
  Check,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { playMinecraftClick } from '../utils/minecraft-sounds.js';

export const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { settings, serverStatus, copiedIp, copyServerIp, currency, setCurrency } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Ranks', path: '/ranks' },
    { label: 'Crate Keys', path: '/crate-keys' },
    { label: 'Team', path: '/team' },
    { label: 'Social Media', path: '/socials' },
    { label: 'Fun', path: '/fun', badge: '✨' },
    { label: 'Support', path: '/support' },
  ];

  const serverIp = settings?.server_ip || 'play.anajaksmp.xyz';
  const onlinePlayers = serverStatus?.players?.online ?? 42;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d14]/95 backdrop-blur-md border-b border-[#232333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={playMinecraftClick}
            className="flex items-center space-x-3 group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold via-gold-bright to-gold-deep p-0.5 shadow-gold-glow group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#12121c] rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-gold fill-gold" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-minecraft text-xl tracking-wider text-white text-minecraft-shadow group-hover:text-gold transition-colors">
                ANAJAK<span className="text-gold">SMP</span>
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#8e8ea0] uppercase font-bold font-minecraft">
                PLAY • SURVIVE • WIN
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links using Minecraft Font */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-7">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={playMinecraftClick}
                  className={`text-xs xl:text-sm font-minecraft tracking-wider transition-all relative py-1 flex items-center space-x-1 text-minecraft-shadow whitespace-nowrap ${
                    active
                      ? 'text-gold text-minecraft-glow'
                      : 'text-[#a4a4b8] hover:text-gold hover:scale-105'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] text-gold animate-bounce">{link.badge}</span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full shadow-[0_0_8px_#f5c542]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-2.5 shrink-0">
            {/* Server IP Copy Pill */}
            <button
              onClick={copyServerIp}
              title="Click to copy Minecraft Server IP"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#161622] border border-[#262638] hover:border-gold/50 transition-all text-xs font-medium text-white/90 group"
            >
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span className="font-mono text-xs">{serverIp}</span>
              <span className="text-[#6d6d80] text-[11px] pl-1 border-l border-[#2e2e42] flex items-center space-x-1 group-hover:text-gold font-minecraft">
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

            {/* Currency Switcher */}
            <div className="flex items-center bg-[#161622] rounded-xl border border-[#262638] p-0.5 text-xs font-minecraft">
              <button
                onClick={() => {
                  playMinecraftClick();
                  setCurrency('USD');
                }}
                className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                  currency === 'USD' ? 'bg-gold text-brand-bg text-minecraft-shadow' : 'text-[#8e8ea0] hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => {
                  playMinecraftClick();
                  setCurrency('KHR');
                }}
                className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                  currency === 'KHR' ? 'bg-gold text-brand-bg text-minecraft-shadow' : 'text-[#8e8ea0] hover:text-white'
                }`}
              >
                KHR (៛)
              </button>
            </div>

            {/* Cart Pill Button */}
            <Link
              to="/cart"
              onClick={playMinecraftClick}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#1a1a28] border border-[#2a2a3e] hover:border-gold text-white transition-all group"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
              <span className="px-1.5 py-0.2 rounded-md bg-gold text-brand-bg text-xs font-black min-w-[20px] text-center font-minecraft text-minecraft-shadow">
                {itemCount}
              </span>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Link
              to="/cart"
              onClick={playMinecraftClick}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#1a1a28] border border-[#2a2a3e] text-gold"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="px-1.5 rounded-md bg-gold text-brand-bg text-[10px] font-black font-minecraft">
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
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-gold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0d14] border-b border-[#252535] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => {
                  playMinecraftClick();
                  setMobileMenuOpen(false);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-minecraft tracking-wider transition-colors flex items-center justify-between text-minecraft-shadow ${
                  isActive(link.path)
                    ? 'bg-gold text-brand-bg'
                    : 'text-[#9c9cb0] hover:bg-[#1a1a28] hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && <span>{link.badge}</span>}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#252535] flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-minecraft">
              <button
                onClick={() => {
                  playMinecraftClick();
                  setCurrency('USD');
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold ${
                  currency === 'USD' ? 'bg-gold text-brand-bg text-minecraft-shadow' : 'text-[#8e8ea0]'
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
                  currency === 'KHR' ? 'bg-gold text-brand-bg text-minecraft-shadow' : 'text-[#8e8ea0]'
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
