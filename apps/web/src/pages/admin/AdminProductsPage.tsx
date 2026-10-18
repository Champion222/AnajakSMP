import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Product, ProductCategory } from '@anajaksmp/shared';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Check,
  CheckCircle2,
  X,
  Loader2,
  Search,
  Flame,
  Shield,
  Eye,
  DollarSign,
  Crown,
  Key,
  Sparkles,
  Wand2,
} from 'lucide-react';

interface AdminProductsPageProps {
  token: string;
}

interface ProductPreset {
  name: string;
  slug: string;
  priceUsd: string;
  salePriceUsd: string;
  description: string;
  imageUrl: string;
  rankDuration: string;
  perksText: string;
  commandsText: string;
  isFeatured: boolean;
}

const RANK_PRESETS: Record<string, ProductPreset> = {
  vip: {
    name: 'VIP Rank',
    slug: 'vip-rank',
    priceUsd: '4.99',
    salePriceUsd: '',
    description: 'The premier entry rank with chat prefix, claim fly, extra homes, and diamond kits.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    rankDuration: 'Permanent Lifetime',
    perksText: '[VIP] Chat Tag & Prefix\nFly ability in claims (/fly)\n3 Extra Home Teleports (/sethome)\nVIP Weekly Diamond Kit\nAccess to /hat and /workbench\nPriority queue slot',
    commandsText: 'lp user {username} parent add vip\nbroadcast &6Player &e{username} &6has purchased &6VIP Rank!',
    isFeatured: false,
  },
  mvp: {
    name: 'MVP Rank',
    slug: 'mvp-rank',
    priceUsd: '12.99',
    salePriceUsd: '9.99',
    description: 'Advanced rank with automation, extra land claims, keep inventory, and superior kits.',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
    rankDuration: 'Permanent Lifetime',
    perksText: 'All VIP perks included\n[MVP] Cyan Diamond Prefix\n6 Extra Home Teleports\nAccess to /feed and /condense\nMVP Weekly Kit with Netherite\nKeep Inventory in Wilderness\nDouble claim accrual rate',
    commandsText: 'lp user {username} parent add mvp\nbroadcast &bPlayer &e{username} &bhas ascended to &bMVP Rank!',
    isFeatured: true,
  },
  mvpplus: {
    name: 'MVP+ Rank',
    slug: 'mvp-plus-rank',
    priceUsd: '24.99',
    salePriceUsd: '19.99',
    description: 'Elite prestige rank with full survival utility, auto-sorting, and monthly key crates.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    rankDuration: 'Permanent Lifetime',
    perksText: 'All VIP & MVP perks included\n[MVP+] Emerald Prefix\n10 Extra Home Teleports\n/heal command (30m cooldown)\n/craft and /enderchest anywhere\nAutomatic chest sorting\n1x Free Mythic Spawner Key monthly',
    commandsText: 'lp user {username} parent add mvpplus\nbroadcast &aPlayer &e{username} &ahas unlocked &aMVP+ Rank!',
    isFeatured: true,
  },
  titan: {
    name: 'Anajak Titan Rank',
    slug: 'anajak-titan-rank',
    priceUsd: '49.99',
    salePriceUsd: '39.99',
    description: 'The supreme apex rank of AnajakSMP. Ultimate dominance, exclusive Titan armor, and prestige.',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=80',
    rankDuration: 'Permanent Lifetime',
    perksText: 'All VIP, MVP & MVP+ perks included\n[TITAN] Chat Prefix & Glow\n20 Extra Home Teleports\n/repair hand without XP cost\nCustom particle trail\n1.5x Economy Multiplier\nExclusive Titan Discord role',
    commandsText: 'lp user {username} parent add titan\nbroadcast &d&lPlayer &e{username} &d&lunlocked &d&lTITAN RANK!',
    isFeatured: true,
  },
  custom: {
    name: 'Custom Rank',
    slug: 'custom-rank',
    priceUsd: '49.99',
    salePriceUsd: '',
    description: 'Personalized server rank! Custom prefix, chat color, join announcement, and top perks.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    rankDuration: 'Permanent Lifetime',
    perksText: '⭐ Choose your custom prefix (up to 12 chars)\n⭐ Choose your chat & prefix color\n⭐ Custom join broadcast announcement\nALL server commands unlocked\nUnlimited Home Teleports\nDirect contact with Owner',
    commandsText: 'lp user {username} parent add custom\nbroadcast &ePlayer &e{username} &6unlocked Custom Rank!',
    isFeatured: true,
  },
};

const KEY_PRESETS: Record<string, ProductPreset> = {
  common: {
    name: 'Common Key',
    slug: 'common-key',
    priceUsd: '1.00',
    salePriceUsd: '',
    description: 'Open the Common Crate at spawn crates. Win iron gear, building materials, and food supplies.',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
    rankDuration: '',
    perksText: 'Common crate rewards\nBasic survival gear & tools\nFood & building supplies\nInstant delivery',
    commandsText: 'crate key give {username} common 1\nmsg {username} &7You received 1x Common Key!',
    isFeatured: false,
  },
  rare: {
    name: 'Rare Key',
    slug: 'rare-key',
    priceUsd: '2.50',
    salePriceUsd: '',
    description: 'Open the Rare Crate for diamond tools, enchanted books, and economy coin pouches.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    rankDuration: '',
    perksText: 'Diamond enchanted equipment\nEnchanted books & experience\nEconomy coins pouches\nInstant delivery',
    commandsText: 'crate key give {username} rare 1\nmsg {username} &bYou received 1x Rare Key!',
    isFeatured: false,
  },
  epic: {
    name: 'Epic Key',
    slug: 'epic-key',
    priceUsd: '5.00',
    salePriceUsd: '',
    description: 'Unlock high-tier Netherite gear, custom enchants, and rare spawner vouchers.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    rankDuration: '',
    perksText: 'Netherite enchanted equipment\nCustom Enchantment books\nRare Spawner vouchers\nInstant delivery',
    commandsText: 'crate key give {username} epic 1\nmsg {username} &dYou received 1x Epic Key!',
    isFeatured: true,
  },
  spawner: {
    name: '5x Spawner Crate Keys',
    slug: 'spawner-crate-key-5x',
    priceUsd: '3.99',
    salePriceUsd: '',
    description: 'Open the legendary Spawner Crate at /warp crates. Win Blaze, Iron Golem, Creeper, or Skeleton spawners!',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
    rankDuration: '',
    perksText: '5x Spawner Crate Keys bundle\nChance to win Iron Golem spawners\nBlaze & Creeper spawners\nInstant automated delivery',
    commandsText: 'crate key give {username} spawner 5\nbroadcast &e{username} &6unlocked &a5x Spawner Crate Keys&6!',
    isFeatured: false,
  },
  mythic: {
    name: '3x Mythic Dragon Keys',
    slug: 'mythic-dragon-key-3x',
    priceUsd: '7.99',
    salePriceUsd: '',
    description: 'Contains ancient Netherite enchanted tools, God apples, Elytra wings, and Custom Enchantment tomes.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    rankDuration: '',
    perksText: '3x Mythic Dragon Crate Keys\nGod apples & Netherite gear\nElytra wings & rare cosmetics\nInstant delivery',
    commandsText: 'crate key give {username} mythic 3\nbroadcast &d{username} &6claimed &d3x Mythic Dragon Keys&6!',
    isFeatured: true,
  },
};

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ token }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'ranks' | 'crate-keys'>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalType, setModalType] = useState<'rank' | 'key' | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priceUsd, setPriceUsd] = useState('');
  const [salePriceUsd, setSalePriceUsd] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rankDuration, setRankDuration] = useState('Permanent Lifetime');
  const [perksText, setPerksText] = useState('');
  const [commandsText, setCommandsText] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.admin.getProducts(token),
        api.getCategories(),
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes || []);
      if (catRes && catRes.length > 0 && !categoryId) {
        setCategoryId(catRes[0].id);
      }
    } catch (err) {
      console.error('Error loading products', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const applyPreset = (preset: ProductPreset) => {
    setName(preset.name);
    let targetSlug = preset.slug;
    if (!editingProduct && products.some((p) => p.slug.toLowerCase() === targetSlug.toLowerCase())) {
      targetSlug = `${preset.slug}-${Date.now().toString().slice(-4)}`;
    }
    setSlug(targetSlug);
    setPriceUsd(preset.priceUsd);
    setSalePriceUsd(preset.salePriceUsd);
    setDescription(preset.description);
    setImageUrl(preset.imageUrl);
    setRankDuration(preset.rankDuration);
    setPerksText(preset.perksText);
    setCommandsText(preset.commandsText);
    setIsFeatured(preset.isFeatured);
  };

  const openCreateRankModal = () => {
    const rankCat = categories.find((c) => c.slug === 'ranks' || c.name.toLowerCase().includes('rank'));
    setEditingProduct(null);
    setModalType('rank');
    if (rankCat) setCategoryId(rankCat.id);
    setName('');
    setSlug('');
    setPriceUsd('4.99');
    setSalePriceUsd('');
    setDescription('Exclusive server rank with custom prefix, extra homes, and survival kits.');
    setImageUrl('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80');
    setRankDuration('Permanent Lifetime');
    setPerksText('[RANK] Chat Tag & Prefix\nFly ability in claims (/fly)\nExtra Home Teleports\nWeekly Diamond Kit');
    setCommandsText('lp user {username} parent add rank\nbroadcast &6Player &e{username} &6unlocked a new Rank!');
    setIsFeatured(false);
    setIsActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openCreateKeyModal = () => {
    const keyCat = categories.find((c) => c.slug === 'crate-keys' || c.name.toLowerCase().includes('key'));
    setEditingProduct(null);
    setModalType('key');
    if (keyCat) setCategoryId(keyCat.id);
    setName('');
    setSlug('');
    setPriceUsd('1.99');
    setSalePriceUsd('');
    setDescription('Open exclusive crates at spawn for rare equipment and loot drops.');
    setImageUrl('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80');
    setRankDuration('');
    setPerksText('Rare crate drop rewards\nCustom enchantment tomes\nInstant automated delivery');
    setCommandsText('crate key give {username} key 1\nmsg {username} &6You received 1x Crate Key!');
    setIsFeatured(false);
    setIsActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setModalType(isRankProduct(p) ? 'rank' : 'key');
    setName(p.name);
    setSlug(p.slug);
    setCategoryId(p.category_id);
    setPriceUsd(p.price_usd.toString());
    setSalePriceUsd(p.sale_price_usd ? p.sale_price_usd.toString() : '');
    setDescription(p.description);
    setImageUrl(p.image_url);
    setRankDuration(p.rank_duration || '');
    setPerksText((p.perks || []).join('\n'));
    setCommandsText((p.delivery_commands || []).join('\n'));
    setIsFeatured(p.is_featured);
    setIsActive(p.is_active);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const price = parseFloat(priceUsd);
    if (isNaN(price) || price < 0) {
      setFormError('Please enter a valid price.');
      return;
    }

    const salePrice = salePriceUsd.trim() ? parseFloat(salePriceUsd) : null;
    if (salePrice !== null && (isNaN(salePrice) || salePrice >= price)) {
      setFormError('Sale price must be lower than original price.');
      return;
    }

    const perks = perksText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const commands = commandsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    let finalSlug = (slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).toLowerCase();
    if (!finalSlug || finalSlug === '-') {
      finalSlug = `${modalType || 'product'}-${Date.now().toString().slice(-4)}`;
    }
    if (!editingProduct && products.some((p) => p.slug.toLowerCase() === finalSlug)) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const payload = {
      name: name.trim(),
      slug: finalSlug,
      category_id: categoryId,
      price_usd: price,
      sale_price_usd: salePrice,
      description: description.trim(),
      image_url: imageUrl.trim(),
      rank_duration: rankDuration.trim() || null,
      perks,
      delivery_commands: commands,
      is_featured: isFeatured,
      is_active: isActive,
    };

    try {
      setIsSubmitting(true);
      if (editingProduct) {
        await api.admin.updateProduct(token, editingProduct.id, payload);
        setNotification(`Successfully updated "${payload.name}"!`);
      } else {
        await api.admin.createProduct(token, payload);
        setNotification(`Successfully added "${payload.name}" to catalog!`);
      }
      setIsModalOpen(false);
      await loadData();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('products_slug_key') || msg.includes('duplicate key') || msg.includes('unique constraint')) {
        setFormError(`The Slug/URL "${finalSlug}" is already used by an existing product. Please change the Slug.`);
      } else {
        setFormError(msg || 'Failed to save product');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    const targetId = productToDelete.id;
    const targetName = productToDelete.name;
    try {
      setIsDeleting(true);
      await api.admin.deleteProduct(token, targetId);
      setProducts((prev) => prev.filter((p) => p.id !== targetId));
      setNotification(`Successfully removed "${targetName}" from catalog.`);
      setProductToDelete(null);
      await loadData();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const isRankProduct = (p: Product) =>
    p.slug.toLowerCase().includes('rank') ||
    p.category?.slug === 'ranks' ||
    p.name.toLowerCase().includes('rank');

  const isKeyProduct = (p: Product) =>
    p.slug.toLowerCase().includes('key') ||
    p.category?.slug === 'crate-keys' ||
    p.name.toLowerCase().includes('key');

  // Website only sells Ranks and Keys
  const storeProducts = products.filter((p) => isRankProduct(p) || isKeyProduct(p));

  const filtered = storeProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedTab === 'ranks') return isRankProduct(p);
    if (selectedTab === 'crate-keys') return isKeyProduct(p);
    return true;
  });

  const ranksCount = storeProducts.filter(isRankProduct).length;
  const keysCount = storeProducts.filter(isKeyProduct).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Product Catalog Management</h1>
          <p className="text-xs text-text-secondary mt-1">
            Manage your store's Ranks and Crate Keys: edit prices, update perks, configure RCON commands, or remove items.
          </p>
        </div>

        {/* Action Buttons for Rank & Key only */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={openCreateRankModal}
            className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-gold-glow cursor-pointer active:scale-95"
          >
            <Crown className="w-4 h-4 text-brand-bg fill-current" />
            <span>+ Add Rank</span>
          </button>

          <button
            onClick={openCreateKeyModal}
            className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 bg-[#5865F2] hover:bg-[#4752c4] text-white shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Key className="w-4 h-4 text-white rotate-45" />
            <span>+ Add Crate Key</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-4 rounded-2xl bg-status-success/15 border border-status-success/30 text-xs text-status-success flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-bold">{notification}</span>
        </div>
      )}

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs: All Products, Ranks, Crate Keys only */}
        <div className="flex items-center space-x-1 p-1 bg-brand-secondary rounded-xl border border-brand-border text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedTab === 'all'
                ? 'bg-gold text-brand-bg shadow-sm'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            All Products ({storeProducts.length})
          </button>
          <button
            onClick={() => setSelectedTab('ranks')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center space-x-1 cursor-pointer ${
              selectedTab === 'ranks'
                ? 'bg-gold text-brand-bg shadow-sm'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Ranks ({ranksCount})</span>
          </button>
          <button
            onClick={() => setSelectedTab('crate-keys')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center space-x-1 cursor-pointer ${
              selectedTab === 'crate-keys'
                ? 'bg-gold text-brand-bg shadow-sm'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Crate Keys ({keysCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-2.5 bg-brand-secondary rounded-xl border border-brand-border flex items-center sm:max-w-xs w-full">
          <Search className="w-4 h-4 text-text-muted mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-text-muted focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
          <p className="text-xs text-text-secondary">Loading product inventory...</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-secondary/80 text-text-muted uppercase font-bold border-b border-brand-border">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Commands</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Active</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-brand-secondary/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={prod.image_url}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover bg-black/40"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/anajak_logo.png';
                          }}
                        />
                        <div>
                          <p className="font-bold text-white">{prod.name}</p>
                          <span className="text-[10px] text-text-muted font-mono">{prod.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {isRankProduct(prod) ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gold/15 border border-gold/30 text-gold text-[10px] font-black uppercase font-minecraft">
                          <Crown className="w-3 h-3" />
                          <span>RANK</span>
                        </span>
                      ) : isKeyProduct(prod) ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#7289da] text-[10px] font-black uppercase font-minecraft">
                          <Key className="w-3 h-3 rotate-45" />
                          <span>CRATE KEY</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-brand-secondary border border-brand-border text-text-secondary text-[10px] font-bold">
                          {categories.find((c) => c.id === prod.category_id)?.name || 'General'}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gold">
                        ${(prod.sale_price_usd ?? prod.price_usd).toFixed(2)}
                      </div>
                      {prod.sale_price_usd && (
                        <span className="text-[10px] text-text-muted line-through">
                          ${prod.price_usd.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-[10px] text-text-secondary">
                      {prod.delivery_commands?.length || 0} commands
                    </td>
                    <td className="p-4">
                      {prod.is_featured ? (
                        <span className="px-2 py-0.5 rounded bg-gold/15 text-gold text-[10px] font-bold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-text-muted">No</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.is_active
                            ? 'bg-status-success/15 text-status-success'
                            : 'bg-status-error/15 text-status-error'
                        }`}
                      >
                        {prod.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 rounded-lg bg-brand-secondary border border-brand-border hover:border-gold text-text-secondary hover:text-white"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setProductToDelete(prod)}
                        className="p-1.5 rounded-lg bg-brand-secondary border border-brand-border hover:border-status-error text-text-secondary hover:text-status-error cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-brand-border bg-brand-secondary flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
                  {editingProduct ? (
                    <>
                      <Edit2 className="w-4 h-4 text-gold" />
                      <span>Edit Product: {editingProduct.name}</span>
                    </>
                  ) : modalType === 'rank' ? (
                    <>
                      <Crown className="w-4 h-4 text-gold" />
                      <span>Add New Server Rank</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 text-[#5865F2] rotate-45" />
                      <span>Add New Crate Key</span>
                    </>
                  )}
                </h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {editingProduct
                    ? 'Update prices, perks, and RCON automated delivery commands.'
                    : 'Choose a quick template below or type your custom rank/key details.'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Template Presets */}
            {!editingProduct && (
              <div className="px-6 py-2.5 bg-[#131d24] border-b border-brand-border/60 flex items-center space-x-2 overflow-x-auto text-[11px]">
                <span className="text-text-muted shrink-0 font-bold flex items-center space-x-1">
                  <Wand2 className="w-3.5 h-3.5 text-gold" />
                  <span>Templates:</span>
                </span>
                {modalType === 'rank' ? (
                  <>
                    {Object.entries(RANK_PRESETS).map(([k, p]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="px-2.5 py-1 rounded-lg bg-brand-secondary border border-brand-border hover:border-gold hover:text-gold text-white font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
                      >
                        {p.name} (${p.priceUsd})
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    {Object.entries(KEY_PRESETS).map(([k, p]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="px-2.5 py-1 rounded-lg bg-brand-secondary border border-brand-border hover:border-[#5865F2] hover:text-[#7289da] text-white font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
                      >
                        {p.name} (${p.priceUsd})
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-status-error/15 text-status-error">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setName(newName);
                      if (!editingProduct) {
                        setSlug(newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
                      }
                    }}
                    placeholder={modalType === 'rank' ? 'e.g. VIP Rank' : 'e.g. Mythic Key'}
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">
                    Slug / URL Key *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. vip-rank"
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-gold"
                    required
                  />
                  {!editingProduct && slug.trim() && products.some((p) => p.slug.toLowerCase() === slug.trim().toLowerCase()) && (
                    <p className="text-[10px] text-amber-400 mt-1 flex items-center space-x-1">
                      <span>⚠️ Note: This Slug is already taken. A unique suffix will be added automatically to prevent collision.</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    {categories
                      .filter(
                        (c) =>
                          c.slug === 'ranks' ||
                          c.slug === 'crate-keys' ||
                          c.name.toLowerCase().includes('rank') ||
                          c.name.toLowerCase().includes('key')
                      )
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">
                    Duration / Quantity Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Permanent Lifetime"
                    value={rankDuration}
                    onChange={(e) => setRankDuration(e.target.value)}
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">
                    Original Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(e.target.value)}
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">
                    Sale Price ($ USD, Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Leave empty if no sale"
                    value={salePriceUsd}
                    onChange={(e) => setSalePriceUsd(e.target.value)}
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold text-text-secondary mb-1">
                  Product Image URL *
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-text-secondary mb-1">
                  Description *
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-text-secondary mb-1">
                  Perks & Benefits (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={perksText}
                  onChange={(e) => setPerksText(e.target.value)}
                  className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-text-secondary mb-1">
                  Minecraft RCON Delivery Commands (1 per line)
                </label>
                <span className="text-[10px] text-text-muted block mb-1">
                  Use token placeholder: <code>{'{username}'}</code>, <code>{'{order_number}'}</code>, <code>{'{amount}'}</code>
                </span>
                <textarea
                  rows={3}
                  value={commandsText}
                  onChange={(e) => setCommandsText(e.target.value)}
                  className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-gold font-mono"
                  placeholder="lp user {username} parent add vip"
                />
              </div>

              <div className="flex space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded bg-brand-secondary border-brand-border text-gold"
                  />
                  <span className="font-bold text-white">Feature on Home Page</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded bg-brand-secondary border-brand-border text-gold"
                  />
                  <span className="font-bold text-white">Active in Store</span>
                </label>
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                {editingProduct ? (
                  <button
                    type="button"
                    onClick={() => {
                      const prod = editingProduct;
                      setIsModalOpen(false);
                      setProductToDelete(prod);
                    }}
                    className="px-4 py-2 rounded-xl bg-status-error/15 border border-status-error/40 text-status-error hover:bg-status-error hover:text-white font-bold transition-all flex items-center space-x-1.5 cursor-pointer text-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Product</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-brand-secondary border border-brand-border text-text-secondary hover:text-white font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="gold-gradient-btn px-6 py-2 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-status-error">
              <div className="p-3 rounded-xl bg-status-error/15 border border-status-error/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Delete Product</h3>
                <p className="text-xs text-text-muted">This action will remove the item from your store.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-brand-secondary border border-brand-border text-xs">
              <p className="text-white font-bold">{productToDelete.name}</p>
              <p className="text-[11px] text-text-muted font-mono mt-0.5">{productToDelete.slug}</p>
            </div>

            <p className="text-xs text-text-secondary">
              Are you sure you want to permanently delete this product? Players will no longer be able to purchase it in the store.
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl bg-brand-secondary border border-brand-border text-text-secondary hover:text-white font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteProduct}
                className="px-4 py-2 rounded-xl bg-status-error hover:bg-red-600 text-white font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
