import React, { useState } from 'react';
import { Product } from '../types';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

interface ComboBuilderProps {
  products: Product[];
  onOrderCombo: (title: string, price: number, apps: string[]) => void;
  onClose?: () => void;
}

export const ComboBuilder: React.FC<ComboBuilderProps> = ({
  products,
  onOrderCombo,
  onClose,
}) => {
  const candidateIds = [
    'netflix',
    'prime-with-ads',
    'hotstar-super',
    'sonyliv',
    'zee5',
    'youtube-premium',
    'crunchyroll',
    'aha-video',
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>([
    'netflix',
    'prime-with-ads',
    'hotstar-super',
  ]);

  const toggleApp = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
  const subtotal = selectedProducts.reduce((sum, p) => {
    const plan = p.plans[0];
    return sum + (plan ? plan.price : 0);
  }, 0);

  // Discount rule:
  // 2 apps => 10%
  // 3 apps => 15%
  // 4+ apps => 20%
  const discountRate = selectedIds.length >= 4 ? 0.2 : selectedIds.length === 3 ? 0.15 : 0.1;
  const discountAmount = Math.round(subtotal * discountRate);
  const finalPrice = Math.max(subtotal - discountAmount, 49);

  const handleCheckout = () => {
    const appNames = selectedProducts.map((p) => p.name.split(' ')[0]).join(' + ');
    const title = `OTT Combo (${selectedIds.length} Apps: ${appNames})`;
    onOrderCombo(title, finalPrice, selectedProducts.map((p) => p.name));
  };

  return (
    <section id="combo-builder" className="max-w-4xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl">
        
        {/* Subtle red ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Subnest Combo Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Build Your Own OTT Combo & Save 20%
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Select 2 or more streaming platforms to unlock automatic bundle discounts.
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="self-end sm:self-center text-xs text-muted-foreground hover:text-foreground bg-secondary px-3 py-1.5 rounded-lg"
            >
              Close
            </button>
          )}
        </div>

        {/* App Tiles Grid */}
        <div className="relative z-10 py-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Tap to add or remove apps:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {candidateIds.map((id) => {
              const p = products.find((prod) => prod.id === id);
              if (!p) return null;
              const isSelected = selectedIds.includes(id);
              const plan = p.plans[0];

              return (
                <div
                  key={id}
                  onClick={() => toggleApp(id)}
                  className={`cursor-pointer rounded-2xl p-3 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-secondary border-primary shadow-md shadow-primary/15'
                      : 'bg-background/50 border-border hover:border-foreground/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-background p-1 border border-border flex items-center justify-center">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-primary text-primary-foreground font-bold' : 'border border-border'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3" /> : null}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-foreground truncate">{p.name}</h4>
                    <p className="text-[11px] text-primary font-bold mt-0.5">
                      ₹{plan ? plan.price : 99} <span className="text-[9px] text-muted-foreground">/mo</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Math & Order */}
        <div className="relative z-10 bg-background/80 rounded-2xl p-4 sm:p-5 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground line-through">₹{subtotal}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {Math.round(discountRate * 100)}% COMBO SAVINGS
              </span>
            </div>
            <div className="text-2xl font-black text-foreground mt-0.5">
              ₹{finalPrice}{' '}
              <span className="text-xs font-normal text-muted-foreground">/ 1 Month</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="storefront-button w-full sm:w-auto h-11 px-6 bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:opacity-90 shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Order This Combo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

