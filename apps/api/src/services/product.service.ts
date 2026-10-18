import { supabase, isSupabaseConfigured, memoryStore } from '../db/supabase.js';
import { Product, ProductCategory } from '@anajaksmp/shared';
import { v4 as uuidv4 } from 'uuid';

export class ProductService {
  static async getCategories(includeInactive = false): Promise<ProductCategory[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('product_categories').select('*').order('display_order', { ascending: true });
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as ProductCategory[];
    }

    return memoryStore.categories
      .filter((c) => includeInactive || c.is_active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  static async getAllProducts(options?: {
    categorySlug?: string;
    search?: string;
    sort?: 'price_asc' | 'price_desc' | 'popular' | 'newest';
    featuredOnly?: boolean;
    includeInactive?: boolean;
  }): Promise<Product[]> {
    let products: Product[] = [];
    const categories = await this.getCategories(true);
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('products').select('*');
      if (!options?.includeInactive) {
        query = query.eq('is_active', true);
      }
      if (options?.featuredOnly) {
        query = query.eq('is_featured', true);
      }
      const { data, error } = await query;
      if (error) throw error;
      products = (data || []) as Product[];
    } else {
      products = [...memoryStore.products].filter(
        (p) =>
          (options?.includeInactive || p.is_active) &&
          (!options?.featuredOnly || p.is_featured)
      );
    }

    // Attach category
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
    const categories = await this.getCategories(true);
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error || !data) return null;
      const product = data as Product;
      product.category = categoryMap.get(product.category_id);
      return product;
    }

    const found = memoryStore.products.find((p) => p.slug === slug && p.is_active);
    if (!found) return null;
    return {
      ...found,
      category: categoryMap.get(found.category_id),
    };
  }

  static async getProductById(id: string): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) return null;
      return data as Product;
    }
    return memoryStore.products.find((p) => p.id === id) || null;
  }

  static async createProduct(input: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const newProduct: Product = {
      ...input,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').insert(newProduct).select().single();
      if (error) throw error;
      return data as Product;
    }

    memoryStore.products.push(newProduct);
    return newProduct;
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Product;
    }

    const index = memoryStore.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    memoryStore.products[index] = {
      ...memoryStore.products[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return memoryStore.products[index];
  }

  static async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const index = memoryStore.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    memoryStore.products.splice(index, 1);
    return true;
  }
}
