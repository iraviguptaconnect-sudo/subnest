import React, { useState, useEffect } from 'react';
import { Sparkles, Package, MessageCircle, Moon, Sun, Menu, X, ArrowRight, ShieldCheck, Gift } from 'lucide-react';

interface NavbarProps {
  onOpenTracking: () => void;
  onOpenCombo: () => void;
  onViewPlans: () => void;
  onOpenReviews?: () => void;
  onOpenAdmin?: () => void;
  onOpenReferral?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTracking,
  onOpenCombo,
  onViewPlans,
  onOpenReviews,
  onOpenAdmin,
  onOpenReferral,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoSecretClicks, setLogoSecretClicks] = useState(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    // Hidden Secret Easter Egg: 5 rapid taps on logo triggers Admin login
    const next = logoSecretClicks + 1;
    if (next >= 5) {
      e.preventDefault();
      if (onOpenAdmin) onOpenAdmin();
      setLogoSecretClicks(0);
      return;
    }
    setLogoSecretClicks(next);
    setTimeout(() => setLogoSecretClicks(0), 2500);
  };
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  // Apply theme class to <html> and save to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Detect scroll position to update navbar blur & shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const navLinks = [
    { label: 'Plans', action: onViewPlans },
    { label: 'Combos', action: onOpenCombo, highlight: true },
    ...(onOpenReferral ? [{ label: 'Refer & Earn', action: onOpenReferral, isRefer: true }] : []),
    { label: 'Reviews', action: onOpenReviews },
    { label: 'Track Order', action: onOpenTracking },
  ];

  return (
    <nav className="fixed top-3 sm:top-4 left-0 right-0 z-50 mx-auto max-w-5xl px-3 sm:px-4 transition-all duration-300">
      {/* Floating Island Capsule */}
      <div
        className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-2.5 sm:py-3 border transition-all duration-300 ${
          isScrolled
            ? 'bg-card/95 backdrop-blur-2xl border-border shadow-2xl'
            : 'bg-card/85 backdrop-blur-xl border-border shadow-md'
        }`}
      >
        {/* Left: Brand Logo & Title (Hidden Easter Egg: 5 rapid taps triggers secret Admin login) */}
        <a
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 group cursor-pointer"
          title="Subnest"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-blue-500/20 border border-violet-500/30 shadow-md shadow-violet-500/10 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
            <img
              src="/assets/subnest-logo.png"
              alt="Subnest Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(124,58,237,0.3)]"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-wide text-foreground flex items-center">
              Sub<span className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">nest</span>
            </span>
            <span className="hidden xs:inline text-[9px] uppercase tracking-widest text-primary font-bold -mt-1">
              Subscriptions
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link: any) => (
            <button
              key={link.label}
              onClick={link.action}
              className={`relative px-1 py-1 text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                link.isRefer
                  ? 'text-violet-400 hover:text-violet-300 flex items-center gap-1.5'
                  : link.highlight
                  ? 'text-primary hover:text-primary/80 flex items-center gap-1'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.isRefer && <Gift className="w-3.5 h-3.5 text-primary" />}
              {link.highlight && <Sparkles className="w-3.5 h-3.5" />}
              <span>{link.label}</span>
              {link.isRefer && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-primary/20 text-primary font-bold border border-primary/30">
                  ₹20
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right: Actions (Theme Toggle + Support CTA + Hamburger) */}
        <div className="flex items-center gap-2">
          
          {/* Support / WhatsApp CTA */}
          <a
            href="https://wa.me/917032996297?text=Hello%20Subnest,%20I%20want%20to%20order%20a%20subscription."
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/25 transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp VIP</span>
          </a>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="theme-toggle h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full border border-border bg-card text-foreground hover:bg-secondary flex items-center justify-center transition-colors shadow-sm"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-9 h-9 sm:h-10 sm:w-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-foreground" />
            ) : (
              <Menu className="w-4 h-4 text-foreground" />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu (Subsplit smooth slide-down glass card) */}
      <div
        id="mobile-navigation"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-card/95 backdrop-blur-2xl border border-border rounded-2xl px-5 py-4 shadow-2xl space-y-3">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                onViewPlans();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between py-2 text-xs font-bold text-foreground hover:text-primary transition-colors text-left border-b border-border/50"
            >
              <span>Explore All Plans</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <button
              onClick={() => {
                onOpenCombo();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between py-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors text-left border-b border-border/50"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Build OTT Combo (Save 20%)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </button>

            {onOpenReferral && (
              <button
                onClick={() => {
                  onOpenReferral();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-between py-2 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors text-left border-b border-border/50"
              >
                <div className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-primary" />
                  <span>Refer & Earn (Dual ₹20 Bonus)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-primary" />
              </button>
            )}

            {onOpenReviews && (
              <button
                onClick={() => {
                  onOpenReviews();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-between py-2 text-xs font-bold text-foreground hover:text-primary transition-colors text-left border-b border-border/50"
              >
                <span>Customer Reviews (4.9/5)</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}

            <button
              onClick={() => {
                onOpenTracking();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between py-2 text-xs font-bold text-foreground hover:text-primary transition-colors text-left border-b border-border/50"
            >
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Track Existing Order</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          {/* Mobile WhatsApp Button */}
          <a
            href="https://wa.me/917032996297?text=Hello%20Subnest,%20I%20want%20to%20order."
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp (+91 7032996297)</span>
          </a>
        </div>
      </div>
    </nav>
  );
};
