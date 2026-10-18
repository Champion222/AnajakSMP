import { supabase, isSupabaseConfigured, memoryStore } from '../db/supabase.js';
import { Product, ProductCategory } from '@anajaksmp/shared';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// In-memory cache for fast, reactive queries
let cachedProducts: Product[] | null = null;

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e: any) {
      console.warn('⚠️ [ProductService] Could not create data dir:', e.message);
    }
  }
}

async function loadProducts(): Promise<Product[]> {
  if (cachedProducts !== null) {
    return cachedProducts;
  }

  ensureDataDir();

  // 1. Try reading from local products.json first if it exists
  if (fs.existsSync(PRODUCTS_FILE)) {
    try {
      const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedProducts = parsed;
        memoryStore.products = [...cachedProducts];
        return cachedProducts;
      }
    } catch (err: any) {
      console.warn('⚠️ [ProductService] Failed to read local products.json:', err.message);
    }
  }

  // 2. If not on disk, load from Supabase or fallback to memoryStore
  let initialProducts: Product[] = [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        initialProducts = data as Product[];
      }
    } catch (err: any) {
      console.warn('⚠️ [ProductService] Supabase initial products fetch failed:', err.message);
    }
  }

  if (initialProducts.length === 0) {
    initialProducts = [...memoryStore.products];
  }

  cachedProducts = initialProducts;
  memoryStore.products = [...cachedProducts];

  // Persist to disk so future server restarts retain everything
  try {
    ensureDataDir();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(cachedProducts, null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('⚠️ [ProductService] Failed to write initial products.json:', err.message);
  }

  return cachedProducts;
}

function saveProductsToDisk(products: Product[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('⚠️ [ProductService] Failed to save products to disk:', err.message);
  }
}

export class ProductService {
  static async getCategories(includeInactive = false): Promise<ProductCategory[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('product_categories').select('*').order('display_order', { ascending: true });
        if (!includeInactive) {
          query = query.eq('is_active', true);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as ProductCategory[];
        }
      } catch (err: any) {
        console.warn('⚠️ [ProductService] Supabase getCategories warning:', err.message);
      }
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
    const all = await loadProducts();
    const categories = await this.getCategories(true);
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    let products = all.filter(
      (p) =>
        (options?.includeInactive || p.is_active) &&
        (!options?.featuredOnly || p.is_featured)
    );

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
    const products = await loadProducts();
    const categories = await this.getCategories(true);
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    const found = products.find((p) => p.slug === slug && p.is_active);
    if (!found) return null;
    return {
      ...found,
      category: categoryMap.get(found.category_id),
    };
  }

  static async getProductById(id: string): Promise<Product | null> {
    const products = await loadProducts();
    const categories = await this.getCategories(true);
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    const found = products.find((p) => p.id === id);
    if (!found) return null;
    return {
      ...found,
      category: categoryMap.get(found.category_id),
    };
  }

  static async createProduct(input: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const products = await loadProducts();

    const newProduct: Product = {
      ...input,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Attempt to sync with Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').insert(newProduct);
      } catch (err: any) {
        console.warn('⚠️ [ProductService] Supabase insert warning (RLS/Permissions):', err.message);
      }
    }

    products.unshift(newProduct);
    cachedProducts = products;
    saveProductsToDisk(cachedProducts);
    memoryStore.products = [...cachedProducts];

    return newProduct;
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = await loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated: Product = {
      ...products[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Attempt to sync with Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').update({ ...updates, updated_at: updated.updated_at }).eq('id', id);
      } catch (err: any) {
        console.warn('⚠️ [ProductService] Supabase update warning (RLS/Permissions):', err.message);
      }
    }

    products[index] = updated;
    cachedProducts = products;
    saveProductsToDisk(cachedProducts);
    memoryStore.products = [...cachedProducts];

    return updated;
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const products = await loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    // Attempt to delete from Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err: any) {
        console.warn('⚠️ [ProductService] Supabase delete warning (RLS/Permissions):', err.message);
      }
    }

    products.splice(index, 1);
    cachedProducts = products;
    saveProductsToDisk(cachedProducts);
    memoryStore.products = [...cachedProducts];

    return true;
  }
}

