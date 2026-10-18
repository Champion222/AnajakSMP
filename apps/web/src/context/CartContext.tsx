import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Coupon } from '@anajaksmp/shared';
import { api } from '../services/api.js';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  coupon: Coupon | null;
  discountUsd: number;
  couponError: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  subtotalUsd: number;
  totalUsd: number;
  totalKhr: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('anajaksmp_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [discountUsd, setDiscountUsd] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('anajaksmp_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const subtotalUsd = items.reduce((sum, item) => {
    const price = item.product.sale_price_usd ?? item.product.price_usd;
    return sum + price * item.quantity;
  }, 0);

  // Recalculate coupon if subtotal changes
  useEffect(() => {
    if (coupon) {
      if (subtotalUsd < coupon.min_order_amount_usd) {
        setDiscountUsd(0);
        setCouponError(`Min order amount ($${coupon.min_order_amount_usd}) no longer met`);
      } else {
        let disc = 0;
        if (coupon.discount_type === 'PERCENTAGE') {
          disc = (subtotalUsd * coupon.discount_value) / 100;
          if (coupon.max_discount_usd && disc > coupon.max_discount_usd) {
            disc = coupon.max_discount_usd;
          }
        } else {
          disc = coupon.discount_value;
        }
        setDiscountUsd(Math.min(disc, subtotalUsd));
        setCouponError(null);
      }
    } else {
      setDiscountUsd(0);
      setCouponError(null);
    }
  }, [subtotalUsd, coupon]);

  const totalUsd = Math.max(0, Math.round((subtotalUsd - discountUsd) * 100) / 100);
  const totalKhr = Math.round(totalUsd * 4100);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setDiscountUsd(0);
    setCouponError(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      setCouponError(null);
      const res = await api.validateCoupon(
        code,
        items.map((i) => ({ productId: i.product.id, quantity: i.quantity }))
      );

      if (res.isValid && res.coupon) {
        setCoupon(res.coupon);
        setDiscountUsd(res.discountAmountUsd);
        return true;
      } else {
        setCouponError(res.message || 'Invalid coupon code');
        return false;
      }
    } catch (err: any) {
      setCouponError(err.message || 'Error validating coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscountUsd(0);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        coupon,
        discountUsd,
        couponError,
        applyCoupon,
        removeCoupon,
        subtotalUsd,
        totalUsd,
        totalKhr,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
