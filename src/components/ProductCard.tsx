import React from 'react';
import { Product } from '../types';
import { Zap, Smartphone } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const lowestPlan = product.plans[0];
  const discountPercent = Math.round(
    ((lowestPlan.originalPrice - lowestPlan.price) / lowestPlan.originalPrice) * 100
  );

  return (
    <article
      data-storefront-card
      onClick={() => onSelect(product)}
      className="storefront-card group min-w-0 overflow-hidden border border-border bg-card flex flex-col transition-all duration-200 hover:border-primary/50 hover:shadow-xl cursor-pointer"
    >
      {/* Media Box (Square 1:1 ratio with inset) */}
      <div className="storefront-media relative bg-background overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.image}
          alt={product.name}
          className="storefront-artwork h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=400&h=400&fit=crop&q=80';
          }}
        />

        {/* Discount Badge */}
        <span className="storefront-badge absolute top-2 left-2 sm:top-3 sm:left-3 bg-secondary/90 backdrop-blur-md text-foreground border border-border px-2 py-1 text-[10px] sm:text-xs font-bold shadow-sm">
          {discountPercent}% OFF
        </span>

        {/* Delivery Type Pill */}
        <span className="absolute bottom-2 right-2 text-[9px] font-semibold text-emerald-400 bg-background/80 border border-emerald-500/30 px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
          <Zap className="w-2.5 h-2.5" />
          {product.deliveryType}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 gap-1.5 px-3 pb-3 pt-2.5">
        
        {/* Title (2 lines clamp) */}
        <h3 className="storefront-card-title text-xs sm:text-sm font-semibold leading-snug break-words text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Device Info */}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Smartphone className="w-3 h-3" />
          <span className="truncate">{product.devices}</span>
        </div>

        {/* Price & Buy Now Row */}
        <div className="mt-auto pt-2 border-t border-border/50">
          <div className="flex items-baseline justify-between gap-1 mb-2">
            <div>
              <span className="text-base sm:text-lg font-bold leading-tight tabular-nums text-foreground">
                ₹{lowestPlan.price}
              </span>
              <span className="text-[11px] text-muted-foreground line-through ml-1.5">
                ₹{lowestPlan.originalPrice}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              /{lowestPlan.duration.split(' ')[0]}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="storefront-button w-full h-10 sm:h-11 px-2 text-xs sm:text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-md shadow-primary/20"
          >
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </article>
  );
};

