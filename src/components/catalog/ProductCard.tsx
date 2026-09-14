import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Eye, Flame, Check } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActiveProductModal
  } = useApp();

  const [isAdded, setIsAdded] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, {
      size: product.variants.sizes?.[0]?.name || 'Standard',
      price: product.price
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => setActiveProductModal(product)}
      className="group relative rounded-2xl bg-[#140e0b] border border-amber-950/40 hover:border-amber-700/60 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-950/50 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Container with Zoom & Floating Badges */}
      <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden bg-stone-900">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140e0b] via-transparent to-black/30 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges on Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isSeasonal && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 shadow-md">
              Seasonal
            </span>
          )}
          {product.isBestSeller && !product.isSeasonal && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-700 text-amber-100 shadow-md">
              Best Seller
            </span>
          )}
          {product.roastLevel && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-950/80 text-amber-300 border border-amber-800/40 flex items-center gap-1 backdrop-blur-xs">
              <Flame className="w-2.5 h-2.5 text-amber-400" />
              <span>{product.roastLevel}</span>
            </span>
          )}
        </div>

        {/* Wishlist Button on Top Right */}
        <button
          id={`btn-wishlist-${product.id}`}
          onClick={handleWishlistToggle}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 text-stone-300 transition-all z-10 active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? 'text-rose-500 fill-rose-500' : 'hover:text-white'
            }`}
          />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-10">
          <button
            id={`btn-quick-view-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveProductModal(product);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-stone-950/80 hover:bg-stone-900 text-stone-200 text-xs font-semibold backdrop-blur-md border border-amber-900/40 flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Customize</span>
          </button>

          <button
            id={`btn-card-quick-add-${product.id}`}
            onClick={handleQuickAdd}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
            }`}
          >
            {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>{isAdded ? 'Added' : 'Quick Add'}</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-[11px] text-stone-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Name & Tagline */}
          <h3 className="font-serif text-base font-bold text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline || product.description}
          </p>

          {/* Flavor Notes Tags */}
          {product.flavorNotes && product.flavorNotes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {product.flavorNotes.slice(0, 3).map((fn, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#1e1511] text-amber-200/80 border border-amber-950"
                >
                  {fn}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Stock Footer */}
        <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg font-extrabold text-amber-400">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-stone-400">
              {product.stock > 0 ? (
                <span className="text-emerald-400/90">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-rose-400">Out of Stock</span>
              )}
            </div>
          </div>

          <button
            id={`btn-bottom-add-${product.id}`}
            onClick={handleQuickAdd}
            className={`p-2 rounded-xl transition-all border ${
              isAdded
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-stone-950 border-amber-600/40'
            }`}
            title="Add to Cart"
          >
            {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
