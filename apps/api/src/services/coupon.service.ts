import { supabase, isSupabaseConfigured, memoryStore } from '../db/supabase.js';
import { Coupon } from '@anajaksmp/shared';
import { v4 as uuidv4 } from 'uuid';

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discountAmountUsd: number;
  message?: string;
}

export class CouponService {
  static async validateCoupon(code: string, subtotalUsd: number): Promise<CouponValidationResult> {
    const cleanCode = code.trim().toUpperCase();
    let coupon: Coupon | null = null;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .ilike('code', cleanCode)
        .eq('is_active', true)
        .single();
      if (!error && data) {
        coupon = data as Coupon;
      }
    } else {
      coupon = memoryStore.coupons.find((c) => c.code.toUpperCase() === cleanCode && c.is_active) || null;
    }

    if (!coupon) {
      return { isValid: false, discountAmountUsd: 0, message: 'Invalid or expired coupon code' };
    }

    const now = new Date();

    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      return { isValid: false, discountAmountUsd: 0, message: 'This coupon is not active yet' };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      return { isValid: false, discountAmountUsd: 0, message: 'This coupon has expired' };
    }

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return { isValid: false, discountAmountUsd: 0, message: 'Coupon usage limit has been reached' };
    }

    if (subtotalUsd < coupon.min_order_amount_usd) {
      return {
        isValid: false,
        discountAmountUsd: 0,
        message: `Order must be at least $${coupon.min_order_amount_usd.toFixed(2)} to use this coupon`,
      };
    }

    let discount = 0;
    if (coupon.discount_type === 'PERCENTAGE') {
      discount = (subtotalUsd * coupon.discount_value) / 100;
      if (coupon.max_discount_usd && discount > coupon.max_discount_usd) {
        discount = coupon.max_discount_usd;
      }
    } else if (coupon.discount_type === 'FIXED') {
      discount = coupon.discount_value;
    }

    // Discount cannot exceed subtotal
    if (discount > subtotalUsd) {
      discount = subtotalUsd;
    }

    discount = Math.round(discount * 100) / 100;

    return {
      isValid: true,
      coupon,
      discountAmountUsd: discount,
      message: `Coupon applied: Saved $${discount.toFixed(2)}`,
    };
  }

  static async recordCouponUsage(couponId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from('coupons').select('times_used').eq('id', couponId).single();
        if (data) {
          await supabase.from('coupons').update({ times_used: data.times_used + 1 }).eq('id', couponId);
        }
      } catch {
        // ignore update error
      }
      return;
    }

    const coupon = memoryStore.coupons.find((c) => c.id === couponId);
    if (coupon) {
      coupon.times_used += 1;
    }
  }

  static async getAllCoupons(): Promise<Coupon[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Coupon[];
    }
    return [...memoryStore.coupons];
  }

  static async createCoupon(input: Omit<Coupon, 'id' | 'times_used' | 'created_at' | 'updated_at'>): Promise<Coupon> {
    const newCoupon: Coupon = {
      ...input,
      id: uuidv4(),
      times_used: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('coupons').insert(newCoupon).select().single();
      if (error) throw error;
      return data as Coupon;
    }

    memoryStore.coupons.push(newCoupon);
    return newCoupon;
  }

  static async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('coupons')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Coupon;
    }

    const index = memoryStore.coupons.findIndex((c) => c.id === id);
    if (index === -1) return null;
    memoryStore.coupons[index] = {
      ...memoryStore.coupons[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return memoryStore.coupons[index];
  }
}
