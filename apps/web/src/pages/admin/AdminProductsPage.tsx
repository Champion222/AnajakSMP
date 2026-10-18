import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Product, ProductCategory } from '@anajaksmp/shared';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Search,
  Flame,
  Shield,
  Eye,
  DollarSign,
} from 'lucide-react';

interface AdminProductsPageProps {
  token: string;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ token }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setPriceUsd('9.99');
    setSalePriceUsd('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80');
    setRankDuration('Permanent Lifetime');
    setPerksText('[VIP] Chat Tag\nFly command (/fly)\n3 Extra Home teleports');
    setCommandsText('lp user {username} parent add vip\nbroadcast &6Player &e{username} &6unlocked VIP!');
    setIsFeatured(false);
    setIsActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
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

    const payload = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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
      } else {
        await api.admin.createProduct(token, payload);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${prodName}"?`)) return;
    try {
      await api.admin.deleteProduct(token, id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Product Catalog Management</h1>
          <p className="text-xs text-text-secondary mt-1">
            Create, edit prices, update delivery commands, and toggle items on the storefront.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-gold-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="p-3 bg-brand-secondary rounded-xl border border-brand-border flex items-center max-w-sm">
        <Search className="w-4 h-4 text-text-muted mr-2" />
        <input
          type="text"
          placeholder="Filter products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-xs text-white placeholder-text-muted focus:outline-none w-full"
        />
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
                        />
                        <div>
                          <p className="font-bold text-white">{prod.name}</p>
                          <span className="text-[10px] text-text-muted font-mono">{prod.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-brand-secondary border border-brand-border text-text-secondary text-[10px] font-bold">
                        {categories.find((c) => c.id === prod.category_id)?.name || 'General'}
                      </span>
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
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 rounded-lg bg-brand-secondary border border-brand-border hover:border-status-error text-text-secondary hover:text-status-error"
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
              <h3 className="font-extrabold text-base text-white">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

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
                    onChange={(e) => setName(e.target.value)}
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
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-gold"
                    required
                  />
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
                    {categories.map((c) => (
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

              <div className="pt-4 border-t border-brand-border flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-brand-secondary border border-brand-border text-text-secondary hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gold-gradient-btn px-6 py-2 rounded-xl font-bold text-xs"
                >
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
