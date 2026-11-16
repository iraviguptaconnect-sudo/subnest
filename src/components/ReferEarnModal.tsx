import React, { useState, useEffect } from 'react';
import {
  X,
  Gift,
  Copy,
  Check,
  Share2,
  Wallet,
  Users,
  Coins,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { fetchUserWallet, WalletData } from '../lib/supabase';

interface ReferEarnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShopNow?: () => void;
}

export const ReferEarnModal: React.FC<ReferEarnModalProps> = ({
  isOpen,
  onClose,
  onShopNow,
}) => {
  if (!isOpen) return null;

  const [phone, setPhone] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Auto-fill phone from saved profile if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('subnest_user_profile') || localStorage.getItem('nexora_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.phone) {
          const clean = parsed.phone.replace(/\D/g, '').slice(-10);
          if (clean.length === 10) {
            setPhone(clean);
          }
        }
      }
    } catch {}
  }, []);

  // Fetch wallet data whenever a valid 10-digit phone is present
  useEffect(() => {
    const clean = phone.replace(/\D/g, '').slice(-10);
    if (clean.length === 10) {
      setLoadingWallet(true);
      fetchUserWallet(clean)
        .then((data) => setWallet(data))
        .finally(() => setLoadingWallet(false));
    } else {
      setWallet(null);
    }
  }, [phone]);

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://subnest-rgg9.vercel.app';
  const referralLink = cleanPhone.length === 10 ? `${siteUrl}?ref=${cleanPhone}` : `${siteUrl}?ref=YOURPHONE`;
  const referralCode = cleanPhone.length === 10 ? cleanPhone : 'YOURPHONE';

  const handleCopyLink = () => {
    if (cleanPhone.length !== 10) {
      alert('Please enter your 10-digit WhatsApp number first.');
      return;
    }
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    if (cleanPhone.length !== 10) {
      alert('Please enter your 10-digit WhatsApp number first.');
      return;
    }
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (cleanPhone.length !== 10) {
      alert('Please enter your 10-digit WhatsApp number first.');
      return;
    }
    const message =
      `*Hey! Check this out for cheap OTT subscriptions* ⚡%0A%0A` +
      `Netflix 4K, Amazon Prime, Hotstar & YouTube Premium starting at just *Rs.49/mo* on Subnest!%0A%0A` +
      `🎁 *Use my referral link to get FLAT Rs.20 OFF on your first subscription:*%0A` +
      `${referralLink}%0A%0A` +
      `Or use my promo code: *${referralCode}* at checkout.%0A` +
      `100% replacement warranty & instant WhatsApp delivery!`;

    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-background/90 backdrop-blur-md" />

      {/* Modal Dialog */}
      <div className="relative bg-card border border-border rounded-3xl p-5 sm:p-7 max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl z-10 flex flex-col space-y-5">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/25">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-foreground flex items-center gap-1.5">
                <span>Refer & Earn</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
                  Dual ₹20 Bonus
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Dost ko Flat ₹20 OFF, aur unke order par aapko ₹20 Wallet Cash!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Enter WhatsApp Number */}
        <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
          <label className="block text-xs font-bold text-foreground">
            Enter your WhatsApp Number to activate your Referral Link:
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="storefront-field w-full pl-12 pr-3 py-2.5 text-sm bg-background border border-input text-foreground focus:outline-none focus:border-primary rounded-xl font-mono font-semibold"
              />
            </div>
          </div>
          {cleanPhone.length === 10 ? (
            <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Referral link active & ready to share!</span>
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Aapka WhatsApp number hi aapka unique referral code hoga.
            </p>
          )}
        </div>

        {/* 2. Referral Link & One-Click WhatsApp Share */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent border border-violet-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Your Unique Referral Link</span>
            </span>
            <button
              onClick={handleCopyCode}
              className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Code: {referralCode}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-background/80 border border-border rounded-xl p-2 px-3">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="bg-transparent text-xs text-foreground font-mono w-full focus:outline-none select-all truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <Share2 className="w-4 h-4" />
            <span>Share with Friends on WhatsApp</span>
          </button>
        </div>

        {/* 3. Live Wallet Card */}
        {cleanPhone.length === 10 && (
          <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-bold text-foreground">Your Subnest Wallet</h4>
              </div>
              {loadingWallet && <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-background border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Available</span>
                <p className="text-base sm:text-lg font-black text-emerald-500">
                  ₹{wallet?.availableBalance ?? 0}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-background border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Earned</span>
                <p className="text-base sm:text-lg font-black text-primary">
                  ₹{wallet?.totalEarned ?? 0}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-background border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Friends</span>
                <p className="text-base sm:text-lg font-black text-foreground">
                  {wallet?.referrals.length ?? 0}
                </p>
              </div>
            </div>

            {wallet && wallet.referrals.length > 0 ? (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold text-muted-foreground">Recent Verified Referrals:</p>
                <div className="max-h-24 overflow-y-auto space-y-1 text-xs pr-1">
                  {wallet.referrals.map((r, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-background/60 border border-border flex items-center justify-between text-[11px]"
                    >
                      <span>Member: {r.friendPhone.slice(0, 4)}••••{r.friendPhone.slice(-2)}</span>
                      <span className="font-bold text-emerald-400">+₹{r.bonus} Credited</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground text-center">
                Aapke dosto ke orders verify hote hi yahan ₹20 credit show honge!
              </p>
            )}

            {wallet && wallet.availableBalance > 0 && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 flex items-center justify-between">
                <span>Aapke paas ₹{wallet.availableBalance} credit hai! Agle order par direct discount milega.</span>
                {onShopNow && (
                  <button
                    onClick={() => {
                      onClose();
                      onShopNow();
                    }}
                    className="underline font-bold text-emerald-300 ml-2 shrink-0 cursor-pointer"
                  >
                    Use Now →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. How It Works: 3 Simple Steps */}
        <div className="space-y-2 pt-1">
          <p className="text-xs font-bold text-foreground">How Model 1 (Dual ₹20) Works:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-secondary/30 border border-border flex flex-col justify-between">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center mb-1.5">
                1
              </span>
              <p className="text-xs font-bold text-foreground">Share Link</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Apna link WhatsApp groups ya dosto ko bhejo.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-secondary/30 border border-border flex flex-col justify-between">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center mb-1.5">
                2
              </span>
              <p className="text-xs font-bold text-foreground">Friend Gets ₹20 OFF</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Dost ko checkout par turant Flat ₹20 discount milta hai.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-secondary/30 border border-border flex flex-col justify-between">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center mb-1.5">
                3
              </span>
              <p className="text-xs font-bold text-foreground">You Get ₹20 Cash</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Order verify hote hi aapke wallet me ₹20 add ho jayenge.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>100% Verified Subnest MSME Reseller Program</span>
          </div>
          <button
            onClick={onClose}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
