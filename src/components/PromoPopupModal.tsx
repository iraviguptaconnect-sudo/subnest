import React, { useState, useEffect } from 'react';
import { X, Sparkles, Tag, Check, Copy, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PromoPopupModalProps {
  onShopNow: () => void;
}

export const PromoPopupModal: React.FC<PromoPopupModalProps> = ({ onShopNow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if dismissed recently (within last 6 hours) or already seen in this session
    try {
      // If user arrived via a friend's referral link, do not pop up and do not overwrite friend's referral
      const hasUrlRef = window.location.search.includes('ref=') || window.location.hash.includes('ref=');
      const activeRef =
        sessionStorage.getItem('subnest_referral_code') ||
        localStorage.getItem('subnest_referral_code');
      if (hasUrlRef || (activeRef && !activeRef.toUpperCase().includes('SUBNEST10'))) {
        return;
      }

      const closedTime = localStorage.getItem('subnest_promo_closed_time');
      if (closedTime) {
        const diff = Date.now() - parseInt(closedTime, 10);
        if (diff < 6 * 60 * 60 * 1000) {
          return; // Don't show if closed within 6 hours
        }
      }

      // Pop up after 2.5 seconds on first visit
      const timer = setTimeout(() => {
        setIsOpen(true);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.5 },
          });
        } catch {}
      }, 2500);

      return () => clearTimeout(timer);
    } catch {
      setIsOpen(false);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem('subnest_promo_closed_time', Date.now().toString());
    } catch {}
  };

  const handleApplyAndShop = () => {
    try {
      const activeRef =
        sessionStorage.getItem('subnest_referral_code') ||
        localStorage.getItem('subnest_referral_code');
      if (!activeRef || activeRef.toUpperCase().includes('SUBNEST10')) {
        sessionStorage.setItem('subnest_referral_code', 'SUBNEST10');
        localStorage.setItem('subnest_referral_code', 'SUBNEST10');
      }
      navigator.clipboard.writeText('SUBNEST10');
    } catch {}
    setCopied(true);
    setTimeout(() => {
      handleClose();
      onShopNow();
    }, 700);
  };

  const handleCopyOnly = () => {
    try {
      navigator.clipboard.writeText('SUBNEST10');
      const activeRef =
        sessionStorage.getItem('subnest_referral_code') ||
        localStorage.getItem('subnest_referral_code');
      if (!activeRef || activeRef.toUpperCase().includes('SUBNEST10')) {
        sessionStorage.setItem('subnest_referral_code', 'SUBNEST10');
        localStorage.setItem('subnest_referral_code', 'SUBNEST10');
      }
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/85 backdrop-blur-md"
      />

      {/* Modal Card */}
      <div className="relative bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Close Offer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-blue-600/20 border border-violet-500/30 text-violet-400 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>WELCOME DISCOUNT</span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Get <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">10% OFF</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
            Enjoy instant 10% discount on Netflix, Hotstar, Prime, ChatGPT Plus & LinkedIn subscriptions!
          </p>
        </div>

        {/* Coupon Box */}
        <div className="w-full p-4 rounded-2xl bg-secondary/50 border-2 border-dashed border-primary/40 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
            Use Promo Code At Checkout
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-xl sm:text-2xl font-black text-primary tracking-widest bg-primary/10 px-4 py-1.5 rounded-xl border border-primary/20">
              SUBNEST10
            </span>
            <button
              onClick={handleCopyOnly}
              className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              title="Copy Coupon"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">
            ⚡ Valid on all plans · Zero surcharge direct UPI
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2 pt-1">
          <button
            onClick={handleApplyAndShop}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>{copied ? 'Applied! Opening Plans...' : 'Apply 10% OFF & View Plans'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleClose}
            className="w-full py-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            Maybe later
          </button>
        </div>

        {/* Trust Note */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>MSME Verified · 100% Replacement Warranty</span>
        </div>

      </div>
    </div>
  );
};
