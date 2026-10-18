import { useNavigate } from 'react-router-dom';
import { Product } from '@anajaksmp/shared';
import { useCart } from '../context/CartContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { ProductIconBadge } from './ProductIconBadge.js';
import { ShoppingBag, Eye, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addItem } = useCart();
  const { currency } = useSettings();
  const navigate = useNavigate();

  const isSale = product.sale_price_usd !== null && product.sale_price_usd !== undefined;
  const currentPriceUsd = isSale ? product.sale_price_usd! : product.price_usd;
  const exchangeRate = 4100;

  const formattedPrice =
    currency === 'USD'
      ? `$${currentPriceUsd.toFixed(2)}`
      : `${Math.round(currentPriceUsd * exchangeRate).toLocaleString()} ៛`;

  const originalPriceFormatted = isSale
    ? currency === 'USD'
      ? `$${product.price_usd.toFixed(2)}`
      : `${Math.round(product.price_usd * exchangeRate).toLocaleString()} ៛`
    : null;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    navigate('/cart');
  };

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  // Determine category badge label
  const categoryLabel =
    product.category?.name ||
    (product.slug.includes('key')
      ? 'Crate Key'
      : product.slug.includes('rank')
      ? 'Rank'
      : 'Upgrade');

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-2xl bg-white/90 backdrop-blur-sm border border-[#cbe4f6] hover:border-[#FFE600] p-4 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl cursor-pointer"
    >
      {/* Featured / Sale Ribbon */}
      {(product.is_featured || isSale) && (
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-1 pointer-events-none">
          {product.is_featured && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider bg-[#FFE600] text-[#121216] shadow-sm">
              <Flame className="w-3.5 h-3.5 text-[#121216] fill-[#121216]" />
              <span>Popular</span>
            </span>
          )}
          {isSale && (
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider bg-status-error text-white shadow-sm">
              Sale
            </span>
          )}
        </div>
      )}

      {/* Top Section: Glowing Icon Badge */}
      <div className="relative mb-3">
        <ProductIconBadge
          slug={product.slug}
          categorySlug={product.category?.slug}
          imageUrl={product.image_url}
          name={product.name}
          className="h-36"
        />

        {/* Quick View Button on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct?.(product);
          }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 border border-white/10 text-white/90 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          title="View Details"
          aria-label={`View details for ${product.name}`}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div className="text-center sm:text-left">
          {/* Product Name */}
          <h3 className="font-extrabold text-lg text-[#1a2530] group-hover:text-[#b8860b] transition-colors tracking-wide">
            {product.name}
          </h3>

          {/* Category Pill */}
          <div className="mt-1">
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-[#ebf5fc] text-[#4a6b82] border border-[#cbe4f6]">
              {categoryLabel}
            </span>
          </div>

          {/* Perks Bullet List */}
          {product.perks && product.perks.length > 0 ? (
            <ul className="mt-3 space-y-1.5 text-xs text-[#5a7184]">
              {product.perks.slice(0, 3).map((perk, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d99a16] shrink-0" />
                  <span className="truncate">{perk.replace(/\[.*?\]\s*/g, '')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-[#5a7184] line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing and Action Button */}
        <div className="pt-3 border-t border-[#e2eef8] space-y-2.5">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="font-extrabold text-xl text-[#1a2530] tracking-tight">
                {formattedPrice}
              </span>
              {originalPriceFormatted && (
                <span className="text-xs text-[#8a9ba8] line-through">
                  {originalPriceFormatted}
                </span>
              )}
            </div>
            {product.rank_duration && (
              <span className="text-xs text-[#6b7c8c] uppercase font-bold">
                {product.rank_duration}
              </span>
            )}
          </div>

          {/* Full-width Buy Now button */}
          <button
            onClick={handleBuyNow}
            className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-2 bg-[#FFE600] hover:bg-[#fad800] text-[#121216] shadow-sm hover:shadow-[0_4px_12px_rgba(255,230,0,0.4)] active:scale-[0.98]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
