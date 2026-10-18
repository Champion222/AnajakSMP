import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@anajaksmp/shared';
import { api } from '../services/api.js';
import { useSettings } from '../context/SettingsContext.js';
import { ProductCard } from '../components/ProductCard.js';
import { ProductDetailsModal } from '../components/ProductDetailsModal.js';
import {
  Crown,
  Key,
  Zap,
  ShieldCheck,
  Headphones,
  Star,
  ArrowRight,
  ChevronRight,
  Server,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { settings, serverStatus, copiedIp, copyServerIp } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const serverIp = settings?.server_ip || 'play.anajaksmp.xyz';
  const onlinePlayers = serverStatus?.players?.online ?? 42;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await api.getProducts({ featured: true });
        if (products && products.length > 0) {
          setFeaturedProducts(products.slice(0, 4));
        } else {
          const all = await api.getProducts();
          setFeaturedProducts(all.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      }
    };
    loadProducts();
  }, []);

  const faqs = [
    {
      q: 'How long does in-game item delivery take?',
      a: 'Purchases are fulfilled automatically within 30 to 60 seconds after your payment is confirmed by ABA PayWay or Bakong KHQR. Ranks and keys are applied directly via Minecraft RCON.',
    },
    {
      q: 'What payment methods do you support in Cambodia?',
      a: 'We support all major Cambodian banking apps through Bakong KHQR (ABA Mobile, Wing, Acleda, Canadia, Sathapana, etc.) as well as direct ABA PayWay.',
    },
    {
      q: 'Do I need to register an account on this website?',
      a: 'No! AnajakSMP has guest checkout enabled. All you need is your valid in-game Minecraft Java username and your email address for your order receipt.',
    },
    {
      q: 'What happens if I entered the wrong Minecraft username?',
      a: 'If you made a typo, please reach out to our staff immediately via our Support page or Discord with your unique Order ID and payment receipt before claiming.',
    },
    {
      q: 'Are server ranks permanent or monthly subscriptions?',
      a: 'All server ranks (VIP, MVP, MVP+, and Anajak Titan) on AnajakSMP are permanent lifetime purchases with no recurring fees.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section (Split Layout matching reference image) */}
      <section className="relative pt-6 sm:pt-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-white/85 backdrop-blur-md border border-[#cbe4f6] p-6 sm:p-12 lg:p-14 overflow-hidden shadow-lg">
            {/* Ambient Soft Sky & Gold Glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#FFE600]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#0092ff]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Headline and CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <span className="text-[11px] sm:text-xs font-black tracking-[0.25em] text-[#5a7184] uppercase block">
                  WELCOME TO
                </span>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1a2530] leading-none">
                  ANAJAK<span className="text-[#d99a16]">SMP</span>
                </h1>

                <p className="text-lg sm:text-2xl font-bold text-[#2a3c4c]">
                  Buy ranks, crate keys and more!
                </p>

                <p className="text-xs sm:text-sm text-[#5a7184] max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Get exclusive perks, cosmetics and enjoy the best Minecraft survival experience in Cambodia. Instant automated delivery directly to your account.
                </p>

                {/* Hero Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    to="/ranks"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-black text-xs tracking-wider uppercase bg-[#FFE600] hover:bg-[#fad800] text-[#121216] shadow-[0_4px_14px_rgba(255,230,0,0.45)] flex items-center justify-center space-x-2 transition-all active:scale-95"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="#categories"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider text-[#1a2530] bg-white hover:bg-[#ebf5fc] border border-[#cbe4f6] flex items-center justify-center transition-all shadow-sm"
                  >
                    Learn More
                  </a>
                </div>
              </div>

              {/* Right Column: 3D Character Art with Community Badge */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square rounded-2xl overflow-hidden border border-[#cbe4f6] shadow-xl bg-white group">
                  <img
                    src="/assets/hero_warrior.jpg"
                    alt="AnajakSMP Minecraft Hero"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Floating 'Join Our Community!' badge */}
                  <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md border border-[#FFE600]/60 px-3.5 py-1.5 rounded-full shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                    <span className="text-xs font-extrabold text-[#FFE600] tracking-wide italic">
                      ✨ Join Our Community!
                    </span>
                  </div>

                  {/* Bottom Player Status */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#12121c]/95 backdrop-blur-md border border-[#252535] rounded-xl px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
                      <span className="font-mono text-xs text-white font-bold">{serverIp}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#FFE600]">{onlinePlayers} Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Value Props Bar (Directly below hero matching reference image) */}
          <div className="mt-6 rounded-2xl bg-white/85 backdrop-blur-md border border-[#cbe4f6] p-4 sm:p-5 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#e2eef8]">
              <div className="flex items-center space-x-3 px-3 pt-2 md:pt-0">
                <div className="w-9 h-9 rounded-xl bg-[#ebf5fc] border border-[#cbe4f6] flex items-center justify-center text-[#d99a16] shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1a2530]">Instant Delivery</h4>
                  <p className="text-[11px] text-[#5a7184]">Get your items instantly</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 px-3 pt-2 md:pt-0">
                <div className="w-9 h-9 rounded-xl bg-[#ebf5fc] border border-[#cbe4f6] flex items-center justify-center text-[#d99a16] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1a2530]">Secure Payment</h4>
                  <p className="text-[11px] text-[#5a7184]">100% safe & trusted</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 px-3 pt-2 md:pt-0">
                <div className="w-9 h-9 rounded-xl bg-[#ebf5fc] border border-[#cbe4f6] flex items-center justify-center text-[#d99a16] shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1a2530]">24/7 Support</h4>
                  <p className="text-[11px] text-[#5a7184]">We're here to help</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 px-3 pt-2 md:pt-0">
                <div className="w-9 h-9 rounded-xl bg-[#ebf5fc] border border-[#cbe4f6] flex items-center justify-center text-[#d99a16] shrink-0">
                  <Star className="w-5 h-5 fill-[#d99a16]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1a2530]">Best Prices</h4>
                  <p className="text-[11px] text-[#5a7184]">More value for your money</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Banners (2-Column Grid matching reference image) */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: RANKS */}
          <div className="group relative rounded-2xl bg-white/85 backdrop-blur-md border border-[#cbe4f6] hover:border-[#FFE600] p-6 sm:p-8 flex items-center justify-between overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative z-10 space-y-3 max-w-[65%]">
              <h3 className="text-2xl sm:text-3xl font-black text-[#1a2530] tracking-wide">
                RANKS
              </h3>
              <p className="text-xs sm:text-sm text-[#5a7184]">
                VIP, MVP, MVP+ and more
              </p>
              <div className="pt-2">
                <Link
                  to="/ranks"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1a2530] hover:bg-[#FFE600] text-white hover:text-[#121216] font-extrabold text-xs transition-all shadow-sm"
                >
                  <span>View Ranks</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graphic Artwork */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-[#cbe4f6] shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/assets/ranks_banner.jpg"
                alt="Minecraft Ranks"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#d99a16]/10" />
            </div>
          </div>

          {/* Card 2: CRATE KEYS */}
          <div className="group relative rounded-2xl bg-white/85 backdrop-blur-md border border-[#cbe4f6] hover:border-[#FFE600] p-6 sm:p-8 flex items-center justify-between overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative z-10 space-y-3 max-w-[65%]">
              <h3 className="text-2xl sm:text-3xl font-black text-[#1a2530] tracking-wide">
                CRATE KEYS
              </h3>
              <p className="text-xs sm:text-sm text-[#5a7184]">
                Open amazing rewards
              </p>
              <div className="pt-2">
                <Link
                  to="/crate-keys"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1a2530] hover:bg-[#FFE600] text-white hover:text-[#121216] font-extrabold text-xs transition-all shadow-sm"
                >
                  <span>View Keys</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graphic Artwork for Keys */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-[#ebf5fc] border border-[#cbe4f6] shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#cbe4f6] flex items-center justify-center shadow-sm">
                  <Key className="w-9 h-9 text-[#d99a16] rotate-45 filter drop-shadow-[0_0_8px_currentColor]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Products (Header + 4-Card Grid matching reference image) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ebf5fc] border border-[#cbe4f6] flex items-center justify-center text-[#d99a16]">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1a2530] tracking-wide">
                Featured Products
              </h2>
              <p className="text-xs text-[#5a7184]">Popular ranks and crate keys</p>
            </div>
          </div>

          <Link
            to="/store"
            className="text-xs font-bold text-[#b8860b] hover:text-[#d99a16] flex items-center space-x-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={setSelectedProduct}
            />
          ))}
        </div>
      </section>

      {/* 5. Community CTA Banner (Wide Card matching reference image) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1a2530] via-[#243342] to-[#1a2530] border border-[#3b4e60] p-8 sm:p-12 text-center overflow-hidden shadow-xl text-white">
          <div className="absolute inset-0 bg-radial-glow from-[#FFE600]/10 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              THE BEST MINECRAFT EXPERIENCE
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Join AnajakSMP and be part of our growing community! Connect with hundreds of active players, participate in weekly survival events, and build your kingdom.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={copyServerIp}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-[#FFE600] hover:bg-[#fad800] text-[#121216] shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <span>{copiedIp ? 'Server IP Copied!' : 'Join Now'}</span>
                {copiedIp ? <Check className="w-4 h-4 text-[#121216]" /> : <ArrowRight className="w-4 h-4" />}
              </button>
              <a
                href={settings?.discord_url || 'https://discord.gg/anajaksmp'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>Discord Community</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center mb-8 space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#d99a16] block">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1a2530]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white/90 border border-[#cbe4f6] shadow-sm overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between font-bold text-sm text-[#1a2530] hover:text-[#d99a16] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#d99a16] transition-transform duration-200 shrink-0 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-[#5a7184] leading-relaxed border-t border-[#e2eef8] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
