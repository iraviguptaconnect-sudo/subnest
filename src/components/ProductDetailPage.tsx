import React, { useState, useEffect } from 'react';
import { Product, PlanOption } from '../types';
import { ArrowLeft, Check, Sun, Moon, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectRelated: (product: Product) => void;
  onBuyNow: (product: Product, plan: PlanOption) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onSelectRelated,
  onBuyNow,
  isDarkMode,
  toggleTheme,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(product.plans[0]);

  // Reset selected plan and update browser tab title when product changes
  useEffect(() => {
    setSelectedPlan(product.plans[0]);
    document.title = `${product.name} | Subnest`;
    return () => {
      document.title = 'Subnest – Premium OTT & Digital Subscriptions';
    };
  }, [product]);

  // Related products (exclude current)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      
      {/* ───────── Top Navigation Bar (Exact Subsplit Style) ───────── */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="storefront-detail-container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Left: Round Back Button */}
          <button
            onClick={onBack}
            className="storefront-back h-11 w-11 border border-border bg-card text-foreground flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer shadow-sm"
            aria-label="Back to products"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Center: Brand Logo & Name */}
          <button
            onClick={onBack}
            className="flex items-center gap-2.5 min-h-11 font-bold text-xl text-foreground hover:opacity-90 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-blue-500/20 border border-violet-500/30 shrink-0 flex items-center justify-center">
              <img
                src="/assets/subnest-logo.png"
                alt="Subnest"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(124,58,237,0.3)]"
              />
            </div>
            <span className="font-black tracking-wide">
              Sub<span className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">nest</span>
            </span>
          </button>

          {/* Right: Round Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="h-11 w-11 rounded-full border border-border bg-card text-foreground flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer shadow-sm"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>

        </div>
      </header>

      {/* ───────── Main Content Container (960px max width) ───────── */}
      <main className="storefront-detail-container mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12">
        
        {/* Two-Column Product Layout (Left: Media, Right: Purchase Panel) */}
        <div className="storefront-product-layout">
          
          {/* Left Column: Big Media Artwork Box (Image 2 style) */}
          <div className="storefront-detail-media bg-card overflow-hidden border border-border rounded-[28px] aspect-square flex flex-col items-center justify-center p-8 relative shadow-lg">
            
            {/* Subtle background grid pattern like Subsplit */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Centered App Icon with shadow and white rounded background for crispness */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[26px] bg-secondary/80 border border-border p-4 shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105 relative z-10">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=400&h=400&fit=crop&q=80';
                }}
              />
            </div>

            {/* Bottom subtitle on the card (e.g. ZEE5 PREMIUM) */}
            <p className="mt-6 text-xs sm:text-sm font-black tracking-widest uppercase text-muted-foreground text-center relative z-10">
              {product.name.split(' ')[0]} PREMIUM
            </p>
          </div>

          {/* Right Column: Title, Price, Plans Grid & Buy Now */}
          <div className="min-w-0 space-y-4">
            
            {/* Top Purchase Panel Card */}
            <div className="storefront-section-overlay p-6 space-y-4">
              
              {/* Product Title in Big Bold */}
              <h1 className="text-2xl sm:text-[28px] font-bold text-foreground break-words leading-tight uppercase">
                {product.name}
              </h1>

              {/* Big Price Display */}
              <div className="text-3xl sm:text-4xl font-black text-foreground tabular-nums leading-tight">
                ₹{selectedPlan.price}
              </div>

              {/* "Choose a plan" Label */}
              <div>
                <p className="font-semibold mb-2.5 text-sm text-foreground">
                  Choose a plan
                </p>

                {/* 2x2 Grid of Plan Cards (Exact Image 2 Style) */}
                <div className="grid grid-cols-2 gap-2.5">
                  {product.plans.map((plan) => {
                    const isSelected = selectedPlan.id === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[76px] ${
                          isSelected
                            ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                            : 'border-border bg-card/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-semibold leading-snug">
                            {plan.duration}
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary shrink-0" />
                          )}
                        </div>

                        <div className="text-sm sm:text-base font-bold tabular-nums mt-2 text-foreground">
                          ₹{plan.price}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Big Red Buy Now Button */}
              <button
                onClick={() => onBuyNow(product, selectedPlan)}
                className="storefront-button w-full h-12 sm:h-14 bg-primary text-primary-foreground text-sm sm:text-base font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-primary/25 transition-opacity cursor-pointer mt-4"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

            {/* Description & Features Card (Exact Image 2 Style) */}
            <div className="storefront-section-overlay p-6 space-y-3 text-xs sm:text-sm">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
                Description & features
              </h3>

              <div className="text-muted-foreground space-y-1">
                <p className="font-medium uppercase">{product.description}</p>
                <p className="font-medium text-foreground">{product.devices}</p>
              </div>

              {/* Bullet Points with Red Checkmarks */}
              <div className="pt-2 border-t border-border/60 space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>Works on all devices</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>{product.deliveryType} Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>Ads Free HD/4K Streaming Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>Login Details / Activation Will Be Given on WhatsApp</span>
                </div>
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ───────── Related Products Section (Image 2 style) ───────── */}
        <div className="pt-8 border-t border-border">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-6">
            Related products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={onSelectRelated}
              />
            ))}
          </div>
        </div>

      </main>

    </div>
  );
};
