import React, { useState, useEffect } from 'react';
import {
  X,
  Gift,
  Copy,
  Check,
  Share2,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Edit2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchUserWallet, WalletData } from '../lib/supabase';

interface ReferEarnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShopNow?: () => void;
}

// Robust fallback clipboard copy helper for mobile/webviews
async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(el);
    return successful;
  } catch {
    return false;
  }
}

// Normalize phone input: strip +91, leading 0, spaces, dashes
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length > 10) {
    if (digits.startsWith('91') && digits.length === 12) {
      return digits.slice(2);
    }
    if (digits.startsWith('0') && digits.length === 11) {
      return digits.slice(1);
    }
    return digits.slice(-10);
  }
  return digits;
}

export const ReferEarnModal: React.FC<ReferEarnModalProps> = ({
  isOpen,
  onClose,
  onShopNow,
}) => {
  if (!isOpen) return null;

  const [phoneInput, setPhoneInput] = useState('');
  const [activePhone, setActivePhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Initialize phone from saved storage
  useEffect(() => {
    try {
      const savedReferralOwner = localStorage.getItem('subnest_referral_owner_phone');
      if (savedReferralOwner && normalizePhone(savedReferralOwner).length === 10) {
        const clean = normalizePhone(savedReferralOwner);
        setActivePhone(clean);
        setPhoneInput(clean);
        setIsEditing(false);
        return;
      }

      const savedProfile =
        localStorage.getItem('subnest_user_profile') || localStorage.getItem('nexora_user_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.phone) {
          const clean = normalizePhone(parsed.phone);
          if (clean.length === 10) {
            setActivePhone(clean);
            setPhoneInput(clean);
            setIsEditing(false);
            return;
          }
        }
      }

      // If no valid phone found, show input state
      setIsEditing(true);
    } catch {
      setIsEditing(true);
    }
  }, []);

  // Fetch wallet stats when activePhone is set
  useEffect(() => {
    if (activePhone.length === 10) {
      setLoadingWallet(true);
      fetchUserWallet(activePhone)
        .then((data) => setWallet(data))
        .finally(() => setLoadingWallet(false));
    } else {
      setWallet(null);
    }
  }, [activePhone]);

  // Determine site base URL (prefer production domain if localhost or preview)
  const siteUrl =
    typeof window !== 'undefined' &&
    window.location.origin &&
    !window.location.origin.includes('localhost')
      ? window.location.origin
      : 'https://www.subnests.in';

  // Referral link with explicit trailing slash before ?ref=
  const referralLink = activePhone ? `${siteUrl}/?ref=${activePhone}` : '';
  const referralCode = activePhone;

  // Handle generating / saving the referral link
  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError(null);

    const clean = normalizePhone(phoneInput);
    if (!clean || clean.length !== 10) {
      setInputError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setActivePhone(clean);
    setIsEditing(false);

    try {
      localStorage.setItem('subnest_referral_owner_phone', clean);
      const existing = localStorage.getItem('subnest_user_profile');
      if (existing) {
        const parsed = JSON.parse(existing);
        localStorage.setItem(
          'subnest_user_profile',
          JSON.stringify({ ...parsed, phone: clean })
        );
      } else {
        localStorage.setItem('subnest_user_profile', JSON.stringify({ phone: clean }));
      }
    } catch {}

    // Auto copy generated link to clipboard & fire celebration
    const genLink = `${siteUrl}/?ref=${clean}`;
    copyToClipboard(genLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleCopyLink = async () => {
    if (!referralLink) return;
    const ok = await copyToClipboard(referralLink);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = async () => {
    if (!referralCode) return;
    const ok = await copyToClipboard(referralCode);
    if (ok) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (!referralLink || !referralCode) return;
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

        {/* ───────── STEP 1: PHONE INPUT / EDIT STATE ───────── */}
        {(!activePhone || isEditing) ? (
          <form onSubmit={handleGenerate} className="p-4 sm:p-5 rounded-2xl bg-secondary/40 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-foreground">
                Enter your WhatsApp Number to generate your link:
              </label>
              {activePhone && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phoneInput}
                  onChange={(e) => {
                    setInputError(null);
                    setPhoneInput(normalizePhone(e.target.value));
                  }}
                  className="storefront-field w-full pl-12 pr-3 py-2.5 text-sm bg-background border border-input text-foreground focus:outline-none focus:border-primary rounded-xl font-mono font-semibold"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-600/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate My Link ⚡</span>
              </button>
            </div>

            {inputError ? (
              <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{inputError}</span>
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Aapka WhatsApp number hi aapka permanent referral tracking code hoga.
              </p>
            )}
          </form>
        ) : (
          /* ───────── STEP 2: ACTIVE REFERRAL LINK & WHATSAPP SHARE ───────── */
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent border border-violet-500/25 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Your Referral Link is Active & Verified</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Code: {referralCode}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer p-1"
                  title="Change Phone Number"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Generated Link Box */}
            <div className="flex items-center gap-2 bg-background/90 border border-border rounded-xl p-2 px-3 shadow-inner">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="bg-transparent text-xs text-foreground font-mono w-full focus:outline-none select-all truncate font-medium"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                  copiedLink
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* One-click WhatsApp Share */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <Share2 className="w-4 h-4" />
              <span>Share with Friends on WhatsApp</span>
            </button>
          </div>
        )}

        {/* ───────── 3. LIVE WALLET & EARNINGS CARD ───────── */}
        {activePhone && (
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

        {/* ───────── 4. HOW IT WORKS: 3 SIMPLE STEPS ───────── */}
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
