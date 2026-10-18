import { supabase, isSupabaseConfigured } from '../db/supabase.js';
import { Product, ProductCategory } from '@anajaksmp/shared';
import { v4 as uuidv4 } from 'uuid';

export class ProductService {
  static async getCategories(includeInactive = false): Promise<ProductCategory[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    let query = supabase.from('product_categories').select('*').order('display_order', { ascending: true });
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) {
      console.error('❌ [ProductService] Supabase getCategories error:', error);
      throw error;
    }
    return (data || []) as ProductCategory[];
  }

  static async getAllProducts(options?: {
    categorySlug?: string;
    search?: string;
    sort?: 'price_asc' | 'price_desc' | 'popular' | 'newest';
    featuredOnly?: boolean;
    includeInactive?: boolean;
  }): Promise<Product[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    let query = supabase.from('products').select('*');
    if (!options?.includeInactive) {
      query = query.eq('is_active', true);
    }
    if (options?.featuredOnly) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;
    if (error) {
      console.error('❌ [ProductService] Supabase getAllProducts error:', error);
      throw error;
    }

    let products = (data || []) as Product[];

    // Fetch and attach categories
    const categories = await this.getCategories(true);
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    products = products.map((p) => ({
      ...p,
      category: categoryMap.get(p.category_id),
    }));

    // Filter by category slug
    if (options?.categorySlug && options.categorySlug !== 'all') {
      products = products.filter((p) => p.category?.slug === options.categorySlug);
    }

    // Search query
    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (options?.sort) {
      case 'price_asc':
        products.sort((a, b) => (a.sale_price_usd ?? a.price_usd) - (b.sale_price_usd ?? b.price_usd));
        break;
      case 'price_desc':
        products.sort((a, b) => (b.sale_price_usd ?? b.price_usd) - (a.sale_price_usd ?? a.price_usd));
        break;
      case 'popular':
        products.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0) || a.display_order - b.display_order);
        break;
      case 'newest':
      default:
        products.sort((a, b) => a.display_order - b.display_order);
        break;
    }

    return products;
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const categories = await this.getCategories(true);
    const category = categories.find((c) => c.id === data.category_id);
    return {
      ...(data as Product),
      category,
    };
  }

  static async getProductById(id: string): Promise<Product | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const categories = await this.getCategories(true);
    const category = categories.find((c) => c.id === data.category_id);
    return {
      ...(data as Product),
      category,
    };
  }

  static async createProduct(input: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured');
    }

    const now = new Date().toISOString();
    const newProduct: Product = {
      ...input,
      id: uuidv4(),
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase.from('products').insert(newProduct).select().single();
    if (error) {
      console.error('❌ [ProductService] Supabase insert error:', error);
      if (error.code === '42501') {
        throw new Error(
          'Supabase RLS Policy: Insert denied. Please set SUPABASE_SERVICE_ROLE_KEY in .env or run "ALTER TABLE products DISABLE ROW LEVEL SECURITY;" in Supabase SQL editor.'
        );
      }
      throw new Error(error.message || 'Failed to create product in Supabase');
    }

    return data as Product;
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured');
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('❌ [ProductService] Supabase update error:', error);
      if (error.code === '42501') {
        throw new Error(
          'Supabase RLS Policy: Update denied. Please set SUPABASE_SERVICE_ROLE_KEY in .env or run "ALTER TABLE products DISABLE ROW LEVEL SECURITY;" in Supabase SQL editor.'
        );
      }
      throw new Error(error.message || 'Failed to update product in Supabase');
    }

    return data ? (data as Product) : null;
  }

  static async deleteProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('❌ [ProductService] Supabase delete error:', error);
      if (error.code === '42501') {
        throw new Error(
          'Supabase RLS Policy: Delete denied. Please set SUPABASE_SERVICE_ROLE_KEY in .env or run "ALTER TABLE products DISABLE ROW LEVEL SECURITY;" in Supabase SQL editor.'
        );
      }
      throw new Error(error.message || 'Failed to delete product from Supabase');
    }

    return true;
  }
}
