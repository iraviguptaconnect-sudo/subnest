import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MsmeTrust } from './components/MsmeTrust';
import { SupportedAppsMarquee } from './components/SupportedAppsMarquee';
import { ComboBuilder } from './components/ComboBuilder';
import { ProductList } from './components/ProductList';
import { ReviewsSection } from './components/ReviewsSection';
import { OffersSection } from './components/OffersSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminOrdersModal } from './components/AdminOrdersModal';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { SplashScreen } from './components/SplashScreen';
import { PRODUCTS } from './data/products';
import { Product, PlanOption } from './types';
import { fetchProductsFromSupabase, upsertProductInSupabase, deleteProductFromSupabase } from './lib/supabase';

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = (window.location.pathname || '').toLowerCase().replace(/\/+$/, '') || '/';
      const hash = (window.location.hash || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();
      return (
        path === '/admin' ||
        path.startsWith('/admin') ||
        hash === '#admin' ||
        search.includes('admin=true')
      );
    }
    return false;
  });
  const [showCombo, setShowCombo] = useState(true);

  // Dynamic Catalog products state (backed by localStorage and Supabase)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('subnest_products_catalog');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return PRODUCTS;
  });

  // Try loading products from Supabase on start
  useEffect(() => {
    fetchProductsFromSupabase().then((dbProds) => {
      if (dbProds && dbProds.length > 0) {
        const mapped: Product[] = dbProds.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          tagline: p.tagline,
          description: p.description,
          image: p.image,
          popular: p.popular,
          deliveryType: p.delivery_type || p.deliveryType,
          devices: p.devices,
          features: p.features || [],
          plans: p.plans || [],
        }));
        setProducts(mapped);
        localStorage.setItem('subnest_products_catalog', JSON.stringify(mapped));
      }
    });
  }, []);

  const handleSaveProduct = (updated: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === updated.id);
      const next = exists
        ? prev.map((p) => (p.id === updated.id ? updated : p))
        : [updated, ...prev];
      localStorage.setItem('subnest_products_catalog', JSON.stringify(next));
      return next;
    });
    upsertProductInSupabase(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      localStorage.setItem('subnest_products_catalog', JSON.stringify(next));
      return next;
    });
    deleteProductFromSupabase(productId);
  };

  const handleResetProducts = () => {
    if (window.confirm('Reset catalog to default 23 products?')) {
      setProducts(PRODUCTS);
      localStorage.setItem('subnest_products_catalog', JSON.stringify(PRODUCTS));
    }
  };

  // Active view: null = Catalog, Product = ProductDetailPage
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Checkout modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | undefined>(undefined);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanOption | undefined>(undefined);
  const [comboData, setComboData] = useState<{ title: string; price: number; apps: string[] } | undefined>(undefined);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // URL Hash & Path handling for deep linking & back button support (/admin, #admin, ?admin=true, #product-*)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = (window.location.pathname || '').toLowerCase().replace(/\/+$/, '') || '/';
      const hash = (window.location.hash || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();

      // Check admin route via pathname (/admin), hash (#admin), or search (?admin=true)
      if (
        path === '/admin' ||
        path.startsWith('/admin') ||
        hash === '#admin' ||
        search.includes('admin=true')
      ) {
        setIsAdminOpen(true);
        return;
      }

      // Check product route via hash (#product-netflix) or pathname (/product/netflix)
      let prodId: string | null = null;
      if (hash.startsWith('#product-')) {
        prodId = hash.replace('#product-', '');
      } else if (path.startsWith('/product/')) {
        prodId = path.replace('/product/', '');
      }

      if (prodId) {
        const found = products.find((p) => p.id === prodId) || PRODUCTS.find((p) => p.id === prodId);
        if (found) {
          setActiveProduct(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      setActiveProduct(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + A to open admin orders feed
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        setIsAdminOpen((prev) => !prev);
      }
    };

    handleLocationChange();
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [products]);

  const handleSelectProduct = (product: Product) => {
    setActiveProduct(product);
    window.location.hash = `product-${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setActiveProduct(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNowFromDetail = (product: Product, plan: PlanOption) => {
    setCheckoutProduct(product);
    setCheckoutPlan(plan);
    setComboData(undefined);
    setIsCheckoutOpen(true);
  };

  const handleOrderCombo = (title: string, price: number, apps: string[]) => {
    setCheckoutProduct(undefined);
    setCheckoutPlan(undefined);
    setComboData({ title, price, apps });
    setIsCheckoutOpen(true);
  };

  const handleScrollToPlans = () => {
    if (activeProduct) {
      handleBackToCatalog();
      setTimeout(() => {
        const el = document.getElementById('subscriptions');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('subscriptions');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToCombo = () => {
    if (activeProduct) {
      handleBackToCatalog();
      setTimeout(() => {
        const el = document.getElementById('combo-builder');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setShowCombo(true);
      const el = document.getElementById('combo-builder');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToReviews = () => {
    if (activeProduct) {
      handleBackToCatalog();
      setTimeout(() => {
        const el = document.getElementById('reviews');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('reviews');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      
      {/* ───────── LUXURY SPLASH SCREEN (PRELOADER) ───────── */}
      {!isAdminOpen && <SplashScreen />}

      {/* ───────── CONDITIONAL VIEW RENDERING ───────── */}
      {activeProduct ? (
        /* PRODUCT DETAIL VIEW (EXACT IMAGE 2 REPLICA) */
        <ProductDetailPage
          product={activeProduct}
          allProducts={products}
          onBack={handleBackToCatalog}
          onSelectRelated={handleSelectProduct}
          onBuyNow={handleBuyNowFromDetail}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      ) : (
        /* MAIN STOREFRONT CATALOG VIEW */
        <>
          {/* Floating Pill Navbar */}
          <Navbar
            onViewPlans={handleScrollToPlans}
            onOpenCombo={handleScrollToCombo}
            onOpenTracking={() => setIsTrackingOpen(true)}
            onOpenReviews={handleScrollToReviews}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          <main className="flex-1">
            {/* Hero Section */}
            <Hero
              onViewPlans={handleScrollToPlans}
              onOpenCombo={handleScrollToCombo}
              onOpenReviews={handleScrollToReviews}
            />

            {/* MSME Trust Banner */}
            <MsmeTrust />

            {/* Supported Apps Marquee */}
            <SupportedAppsMarquee />

            {/* Custom OTT Combo Builder */}
            {showCombo && (
              <ComboBuilder
                products={products}
                onOrderCombo={handleOrderCombo}
              />
            )}

            {/* Product Catalog Grid */}
            <ProductList
              products={products}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectProduct={handleSelectProduct}
            />

            {/* Reviews Section */}
            <ReviewsSection />

            {/* Exclusive Offers Section */}
            <OffersSection />

            {/* FAQs */}
            <FaqSection />
          </main>

          {/* Footer */}
          <Footer
            onViewPlans={handleScrollToPlans}
            onOpenCombo={handleScrollToCombo}
            onOpenTracking={() => setIsTrackingOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        </>
      )}

      {/* Floating Sticky WhatsApp Button */}
      <WhatsAppFloat />

      {/* Checkout Modal with Naman Jain's UPI QR codes */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={checkoutProduct}
        plan={checkoutPlan}
        comboData={comboData}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* Admin Orders & Products Modal (Shift + A or /admin or #admin) */}
      <AdminOrdersModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          const path = (window.location.pathname || '').toLowerCase();
          const hash = window.location.hash;
          if (hash === '#admin') {
            window.location.hash = '';
          }
          if (path === '/admin' || path.startsWith('/admin') || window.location.search.includes('admin=')) {
            window.history.pushState(null, '', '/');
          }
        }}
        products={products}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetProducts={handleResetProducts}
      />

    </div>
  );
};

export default App;
