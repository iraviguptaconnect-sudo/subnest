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

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showCombo, setShowCombo] = useState(true);

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

  // URL Hash handling for deep linking & back button support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setIsAdminOpen(true);
        return;
      }
      if (hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        const found = PRODUCTS.find((p) => p.id === prodId);
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

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      <SplashScreen />

      {/* ───────── CONDITIONAL VIEW RENDERING ───────── */}
      {activeProduct ? (
        /* PRODUCT DETAIL VIEW (EXACT IMAGE 2 REPLICA) */
        <ProductDetailPage
          product={activeProduct}
          allProducts={PRODUCTS}
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
                products={PRODUCTS}
                onOrderCombo={handleOrderCombo}
              />
            )}

            {/* Product Catalog Grid */}
            <ProductList
              products={PRODUCTS}
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

      {/* Admin Orders Modal (Shift + A or #admin) */}
      <AdminOrdersModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
      />

    </div>
  );
};

export default App;
