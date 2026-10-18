import React, { useState } from 'react';
import { Product } from '@anajaksmp/shared';
import { useCart } from '../context/CartContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { X, CheckCircle, ShieldCheck, Zap, Plus, Minus, ShoppingBag, Clock } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  const { addItem } = useCart();
  const { currency } = useSettings();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isSale = product.sale_price_usd !== null && product.sale_price_usd !== undefined;
  const currentPriceUsd = isSale ? product.sale_price_usd! : product.price_usd;
  const exchangeRate = 4100;

  const formattedPrice =
    currency === 'USD'
      ? `$${(currentPriceUsd * quantity).toFixed(2)}`
      : `${Math.round(currentPriceUsd * quantity * exchangeRate).toLocaleString()} ៛`;

  const handleAddToCart = () => {
    addItem(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative h-56 w-full bg-brand-secondary overflow-hidden shrink-0">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-black/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              {product.category && (
                <span className="text-xs uppercase font-extrabold tracking-wider text-gold bg-brand-bg/80 px-2.5 py-1 rounded border border-gold/30">
                  {product.category.name}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                {product.name}
              </h2>
            </div>
            {product.rank_duration && (
              <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{product.rank_duration}</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-text-secondary">
          {/* Description */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-text-muted mb-1.5">Description</h4>
            <p className="leading-relaxed text-white/90">{product.description}</p>
          </div>

          {/* Perks & Features */}
          {product.perks && product.perks.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-text-muted mb-3 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>Included Benefits & In-Game Perks</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-brand-secondary/60 p-4 rounded-xl border border-brand-border">
                {product.perks.map((perk, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-xs text-white/90 leading-tight">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instant Delivery Notice */}
          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-gold/5 border border-gold/20 text-xs text-gold">
            <Zap className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Instant Automated Delivery</p>
              <p className="text-text-secondary mt-0.5">
                Ranks and items are delivered within 60 seconds after payment verification directly to your Minecraft character.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 bg-brand-secondary/90 border-t border-brand-border flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-text-muted font-bold">Qty:</span>
            <div className="flex items-center bg-brand-card rounded-lg border border-brand-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 text-text-secondary hover:text-white"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 font-mono font-bold text-sm text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 text-text-secondary hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-[10px] text-text-muted uppercase block">Total Price</span>
              <span className="text-xl font-extrabold text-gold">{formattedPrice}</span>
            </div>
            <button
              onClick={handleAddToCart}
              className="gold-gradient-btn px-6 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-gold-glow active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
