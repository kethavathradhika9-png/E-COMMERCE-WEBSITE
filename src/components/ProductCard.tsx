import React from 'react';
import { IProduct } from '../types.js';
import { useApp } from '../context/AppContext.js';
import {
  Star,
  ShoppingCart,
  Heart,
  GitCompare,
  Sparkles,
  AlertTriangle,
  Check,
  Eye
} from 'lucide-react';

interface ProductCardProps {
  product: IProduct;
  matchScore?: number;
  explainReason?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, matchScore, explainReason }) => {
  const {
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    removeFromCompare,
    compareList
  } = useApp();

  const isLiked = isInWishlist(product.id);
  const isCompared = compareList.some(p => p.id === product.id);

  // Discount percentage calculation
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Extract top 2 key specs
  const specEntries = Object.entries(product.specifications || (product as any).attributes || {}).slice(0, 2);
  const badgesList = product.badges || (product.badge ? [product.badge] : []);
  const mainImage = (product.images && product.images[0]) || '';

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between rounded-xl bg-slate-900/70 border border-white/10 hover:border-sky-500/40 shadow-lg hover:shadow-sky-500/5 transition-all duration-300 overflow-hidden"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950/80 p-3">
        
        {/* Badges / Match Score */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {matchScore && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-mono text-[10px] font-bold shadow-md">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{matchScore}% MATCH</span>
            </div>
          )}

          {badgesList.map((badge, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-white/15 text-slate-200 font-mono text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Wishlist & Compare Quick Floating Controls */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-1.5 rounded-lg border backdrop-blur-md transition-all ${
              isLiked
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-slate-950/70 border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400' : ''}`} />
          </button>

          <button
            id={`compare-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (isCompared) {
                removeFromCompare(product.id);
              } else {
                addToCompare(product);
              }
            }}
            className={`p-1.5 rounded-lg border backdrop-blur-md transition-all ${
              isCompared
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-950/70 border-white/10 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/30'
            }`}
            title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
          >
            {isCompared ? <Check className="w-3.5 h-3.5 text-indigo-400" /> : <GitCompare className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Product Image */}
        <img
          src={mainImage}
          alt={product.name}
          className="h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onClick={() => setSelectedProduct(product)}
        />

        {/* Quick View Overlay Bar on Hover */}
        <div
          onClick={() => setSelectedProduct(product)}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-2.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-400">
            <Eye className="w-3 h-3" /> Quick AI Breakdown & Specs
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-mono uppercase text-sky-400/90">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-400 font-mono">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-semibold text-slate-100 text-sm hover:text-sky-300 transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* AI Explainability Micro-Reason */}
          {explainReason && (
            <p className="mt-1 text-[11px] text-sky-400/90 font-mono line-clamp-1 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-500/20">
              💡 {explainReason}
            </p>
          )}

          {/* Key Specs Pills */}
          <div className="mt-2 flex flex-wrap gap-1">
            {specEntries.map(([key, val]) => (
              <span
                key={key}
                className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5 truncate max-w-[140px]"
                title={`${key}: ${val}`}
              >
                {val}
              </span>
            ))}
          </div>
        </div>

        {/* Stock & Price Row */}
        <div className="mt-4 pt-3 border-t border-white/5">
          
          {/* Stock Alert */}
          <div className="flex items-center justify-between text-[10px] font-mono mb-2">
            {product.stock <= 5 ? (
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <AlertTriangle className="w-2.5 h-2.5" />
                Only {product.stock} units left!
              </span>
            ) : product.stock <= 15 ? (
              <span className="text-amber-400">
                Low inventory ({product.stock} left)
              </span>
            ) : (
              <span className="text-emerald-400">
                In Stock ({product.stock} units)
              </span>
            )}

            <span className="text-slate-500">Free Express</span>
          </div>

          {/* Pricing & Add to Cart Button */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-bold text-base text-slate-100">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-slate-500 line-through font-mono">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            <button
              id={`add-to-cart-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              disabled={product.stock <= 0}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                product.stock <= 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/10 active:scale-95'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{product.stock <= 0 ? 'Out of Stock' : 'Add'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
