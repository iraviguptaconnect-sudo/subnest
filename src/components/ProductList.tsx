import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Search } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'OTT', 'AI & Tools', 'Music', 'Regional', 'Entertainment', 'Special'];

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="subscriptions" className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Search Input Bar (Subsplit styling) */}
      <div className="relative max-w-xl mx-auto mb-6">
        <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search Netflix, Prime, Hotstar, Combos…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 sm:h-13 pl-11 pr-11 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {cat === 'All' ? '🔥 All Plans' : cat}
            </button>
          );
        })}
      </div>

      {/* Grid count summary */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 px-1">
        <span>Showing <strong className="text-foreground">{filteredProducts.length}</strong> available subscriptions</span>
        {searchQuery && (
          <span>Filter: <strong className="text-primary font-mono">"{searchQuery}"</strong></span>
        )}
      </div>

      {/* Storefront Grid (2 cols mobile, 3 tablet, 4 desktop) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground text-sm mb-3">Nothing in this category matching "{searchQuery}"</p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="text-xs text-primary font-semibold hover:underline"
          >
            Reset filters & explore all
          </button>
        </div>
      )}

    </section>
  );
};

