import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Product, ProductCategory } from '@anajaksmp/shared';
import { api } from '../services/api.js';
import { ProductCard } from '../components/ProductCard.js';
import { ProductDetailsModal } from '../components/ProductDetailsModal.js';
import {
  Crown,
  Key,
  Coins,
  Sparkles,
  Package,
  Flame,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Loader2,
} from 'lucide-react';

interface StorePageProps {
  initialCategory?: string;
}

export const StorePage: React.FC<StorePageProps> = ({ initialCategory }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = initialCategory || searchParams.get('category') || 'ranks';

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
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
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(loadProducts, 150);
    return () => clearTimeout(debounce);
  }, [currentCategory, searchQuery, sortOption]);

  const handleCategoryChange = (slug: string) => {
    searchParams.set('category', slug);
    setSearchParams(searchParams);
  };

  const getCategoryMeta = () => {
    if (currentCategory === 'ranks') {
      return {
        title: 'RANK SHOP',
        subtitle: 'Unlock exclusive perks and stand out from the crowd!',
        breadcrumb: 'Ranks',
        bannerImg: '/assets/ranks_banner.jpg',
      };
    }
    if (currentCategory === 'crate-keys') {
      return {
        title: 'CRATE KEY SHOP',
        subtitle: 'Open crates and get amazing rewards!',
        breadcrumb: 'Crate Keys',
        bannerImg: '/assets/hero_warrior.jpg',
      };
    }
    if (currentCategory === 'cosmetics') {
      return {
        title: 'COSMETICS SHOP',
        subtitle: 'Customize your style with wings, particle halos and cloaks!',
        breadcrumb: 'Cosmetics',
        bannerImg: '/assets/hero_warrior.jpg',
      };
    }
    if (currentCategory === 'bundles') {
      return {
        title: 'BUNDLE SHOP',
        subtitle: 'High value combo packages with ranks and keys combined!',
        breadcrumb: 'Bundles',
        bannerImg: '/assets/ranks_banner.jpg',
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

  const getCategoryIcon = (slug: string) => {
    if (slug === 'ranks') return <Crown className="w-4 h-4" />;
    if (slug === 'crate-keys') return <Key className="w-4 h-4 rotate-45" />;
    if (slug === 'cosmetics') return <Sparkles className="w-4 h-4" />;
    if (slug === 'bundles') return <Package className="w-4 h-4" />;
    if (slug === 'coins-currency') return <Coins className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  // Main sidebar category list
  const sidebarCategories = [
    { slug: 'ranks', label: 'Ranks', icon: Crown },
    { slug: 'crate-keys', label: 'Crate Keys', icon: Key },
    { slug: 'cosmetics', label: 'Cosmetics', icon: Sparkles },
    { slug: 'bundles', label: 'Bundles', icon: Package },
    { slug: 'coins-currency', label: 'Currency', icon: Coins },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Category Top Hero Banner matching reference image */}
      <div className="relative rounded-3xl bg-white/85 backdrop-blur-md border border-[#cbe4f6] p-6 sm:p-10 overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between">
        <div className="relative z-10 space-y-2 text-center md:text-left mb-6 md:mb-0">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center md:justify-start space-x-2 text-xs text-[#5a7184] mb-1">
            <Link to="/" className="hover:text-[#d99a16] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#d99a16] font-bold">{meta.breadcrumb}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a2530] tracking-wide">
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#5a7184] max-w-md">
            {meta.subtitle}
          </p>
        </div>

        {/* Banner Graphic Thumbnail */}
        <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[#cbe4f6] shadow-sm shrink-0">
          <img
            src={meta.bannerImg}
            alt={meta.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#d99a16]/10" />
        </div>
      </div>

      {/* 2. Main Two-Column Layout (Left Sidebar + Right Product Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Category Menu */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl bg-white/85 backdrop-blur-md border border-[#cbe4f6] p-3 space-y-1.5 shadow-sm">
            <span className="text-[10px] font-black tracking-widest text-[#7a8a98] uppercase px-3 py-1.5 block">
              Categories
            </span>

            {sidebarCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = currentCategory === cat.slug;

              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FFE600] text-[#121216] shadow-sm'
                      : 'text-[#5a7184] hover:text-[#1a2530] hover:bg-[#ebf5fc]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#121216]' : 'text-[#d99a16]'}`} />
                  <span className="tracking-wide">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-md border border-[#cbe4f6] p-4 space-y-3 shadow-sm">
            <span className="text-[10px] font-black tracking-widest text-[#7a8a98] uppercase block">
              Search Products
            </span>
            <div className="relative">
              <Search className="w-4 h-4 text-[#7a8a98] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ranks, keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#ebf5fc] border border-[#cbe4f6] text-xs text-[#1a2530] placeholder-[#7a8a98] focus:outline-none focus:border-[#d99a16]"
              />
            </div>
          </div>
        </aside>

        {/* Right Product Grid Area */}
        <section className="lg:col-span-9 space-y-6">
          {/* Status Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-[#cbe4f6]">
            <span className="text-xs text-[#5a7184] font-medium">
              Showing <span className="text-[#1a2530] font-bold">{products.length}</span> items
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gold" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-[#161622] border border-[#262638] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-gold"
              >
                <option value="newest">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-[#14141e] border border-[#232333] p-4 h-80 animate-pulse space-y-4"
                >
                  <div className="h-36 bg-[#1e1e2d] rounded-xl" />
                  <div className="h-4 bg-[#1e1e2d] rounded w-2/3" />
                  <div className="h-3 bg-[#1e1e2d] rounded w-1/3" />
                  <div className="h-8 bg-[#1e1e2d] rounded-xl" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelectProduct={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 rounded-2xl bg-[#12121c] border border-[#232333]">
              <Sparkles className="w-10 h-10 text-gold mx-auto" />
              <h3 className="text-base font-bold text-white">No items found</h3>
              <p className="text-xs text-[#8e8ea0]">
                Try adjusting your search query or selecting a different category from the sidebar.
              </p>
            </div>
          )}
        </section>
      </div>

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
