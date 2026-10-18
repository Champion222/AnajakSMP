import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Product, ProductCategory } from '@anajaksmp/shared';
import { api } from '../services/api.js';
import { ProductCard } from '../components/ProductCard.js';
import { ProductDetailsModal } from '../components/ProductDetailsModal.js';
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  PackageOpen,
  Crown,
  Key,
  Lock,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { playMinecraftClick } from '../utils/minecraft-sounds.js';
import { pageSettingsService } from '../services/pageSettingsService.js';

interface StorePageProps {
  initialCategory?: string;
}

export const StorePage: React.FC<StorePageProps> = ({ initialCategory }) => {
  const [searchParams] = useSearchParams();
  const currentCategory = initialCategory || searchParams.get('category') || 'ranks';

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isKeysSoon, setIsKeysSoon] = useState(() => pageSettingsService.getSettings().keys);

  useEffect(() => {
    const handleSoonUpdate = (e: any) => {
      if (e.detail) setIsKeysSoon(Boolean(e.detail.keys));
    };
    window.addEventListener('anajaksmp_soon_updated', handleSoonUpdate);
    return () => window.removeEventListener('anajaksmp_soon_updated', handleSoonUpdate);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await api.getProducts({
          category: currentCategory === 'all' ? undefined : currentCategory,
          search: searchQuery.trim() || undefined,
          sort: sortOption,
        });
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to load products from API/Supabase:', err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(loadProducts, 150);
    return () => clearTimeout(debounce);
  }, [currentCategory, searchQuery, sortOption]);

  const getCategoryMeta = () => {
    if (currentCategory === 'ranks') {
      return {
        title: 'RANK SHOP',
        subtitle: 'Unlock exclusive permanent perks, claims, kits, and chat tags!',
        breadcrumb: 'Ranks',
        bannerImg: '/assets/ranks_banner.jpg',
      };
    }
    if (currentCategory === 'crate-keys') {
      return {
        title: 'CRATE KEY SHOP',
        subtitle: 'Open spawn crates and win Netherite gear, spawners, and coin pouches!',
        breadcrumb: 'Crate Keys',
        bannerImg: '/assets/hero_warrior.jpg',
      };
    }
    return {
      title: 'SERVER STORE',
      subtitle: 'Official Minecraft server store for AnajakSMP survival!',
      breadcrumb: 'Store',
      bannerImg: '/assets/hero_warrior.jpg',
    };
  };

  const meta = getCategoryMeta();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Mazer Style Header Banner */}
      <div className="bg-[#1e1319] border-2 border-[#3b202d] rounded-2xl px-5 py-3.5 flex items-center space-x-3.5 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-[#e93b67] flex items-center justify-center shrink-0 shadow-inner">
          {currentCategory === 'crate-keys' ? (
            <Key className="w-5 h-5 text-white" />
          ) : (
            <Crown className="w-5 h-5 text-white" />
          )}
        </div>
        <div>
          <span className="block text-xs font-minecraft font-bold text-[#ffb4c2] tracking-wider uppercase">
            {currentCategory === 'crate-keys' ? 'MYSTERY LOOT & CRATES' : 'SERVER MEMBERSHIP'}
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-minecraft font-black text-white tracking-wide uppercase">
            {currentCategory === 'crate-keys' ? 'CRATE KEYS' : 'RANK SHOP'}
          </h1>
        </div>
      </div>

      {/* Crate Keys "SOON" State View (Controlled via Admin) */}
      {currentCategory === 'crate-keys' && isKeysSoon ? (
        <section className="rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] p-8 sm:p-14 text-center shadow-sm relative overflow-hidden space-y-6">
          {/* Key Icon Container */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#485963] text-[#FFE600] border-2 border-white/40 flex items-center justify-center mx-auto shadow-lg relative group">
            <Key className="w-10 h-10 sm:w-12 sm:h-12 text-[#FFE600] rotate-45 filter drop-shadow-[0_0_12px_rgba(255,230,0,0.8)] animate-pulse" />
            <div className="absolute -top-2 -right-2 bg-[#e93b67] text-white p-1 rounded-full shadow-md">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          {/* Title & Badge */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#485963]/15 border border-[#485963]/30 text-[#131d24] text-xs font-minecraft font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#d99a16]" />
              <span>UPCOMING CRATE SYSTEM</span>
            </div>
            <h2 className="font-minecraft text-3xl sm:text-5xl font-black text-[#131d24] tracking-widest uppercase">
              SOON
            </h2>
            <p className="text-sm text-[#485963] max-w-lg mx-auto leading-relaxed font-medium">
              Crate keys and mystery spawn loot crates are currently undergoing balance tuning for the upcoming season launch. Stay tuned on Discord for the official release!
            </p>
          </div>

          {/* Upcoming Crates Teaser Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
            {[
              { name: 'Common Key', tier: 'Tier 1' },
              { name: 'Rare Key', tier: 'Tier 2' },
              { name: 'Epic Key', tier: 'Tier 3' },
              { name: 'Mythic Spawner', tier: 'Tier 4' },
            ].map((crate, idx) => (
              <div
                key={idx}
                className="bg-[#9ec4cd]/70 border border-[#89b1ba] rounded-2xl p-3.5 flex flex-col items-center justify-center space-y-1.5 opacity-90 shadow-2xs"
              >
                <Key className="w-6 h-6 text-[#485963] rotate-45" />
                <span className="font-minecraft text-xs sm:text-sm font-bold text-[#131d24] text-center">
                  {crate.name}
                </span>
                <span className="text-xs font-minecraft font-bold text-[#e93b67] bg-[#e93b67]/15 px-2.5 py-0.5 rounded-md uppercase">
                  SOON
                </span>
              </div>
            ))}
          </div>

          {/* Discord CTA */}
          <div className="pt-2">
            <a
              href="https://discord.gg/anajaksmp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playMinecraftClick}
              className="inline-flex items-center space-x-2 bg-[#FFE600] hover:bg-[#ffd700] active:scale-95 text-[#131d24] font-minecraft font-black px-6 py-3 rounded-2xl shadow-md transition-all text-xs sm:text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>JOIN DISCORD FOR KEY RELEASE NOTIFICATIONS</span>
            </a>
          </div>
        </section>
      ) : (
        /* Products Section for Ranks */
        <section className="w-full space-y-6">
          {/* Status & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/85 backdrop-blur-md border border-[#cbe4f6] rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-[#5a7184] font-medium">
              Showing <span className="text-[#1a2530] font-black">{products.length}</span> items
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Quick Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#7a8a98] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search ranks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#ebf5fc] border border-[#cbe4f6] text-xs text-[#1a2530] placeholder-[#7a8a98] focus:outline-none focus:border-[#d99a16]"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#d99a16]" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="bg-white border border-[#cbe4f6] rounded-xl px-3 py-2 text-xs text-[#1a2530] focus:outline-none focus:border-[#d99a16] shadow-sm font-medium"
                >
                  <option value="newest">Featured First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Cards Grid - Full Width Columns */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/80 border border-[#cbe4f6] p-4 h-80 animate-pulse space-y-4"
                >
                  <div className="h-36 bg-[#ebf5fc] rounded-xl" />
                  <div className="h-4 bg-[#ebf5fc] rounded w-2/3" />
                  <div className="h-3 bg-[#ebf5fc] rounded w-1/3" />
                  <div className="h-8 bg-[#ebf5fc] rounded-xl" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-[#cbe4f6] p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#ebf5fc] border border-[#cbe4f6] flex items-center justify-center text-[#d99a16] mx-auto shadow-sm">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-[#1a2530]">No items found</h3>
              <p className="text-xs text-[#5a7184] max-w-sm mx-auto">
                Try adjusting your search query or check back soon for new inventory!
              </p>
            </div>
          )}
        </section>
      )}

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
