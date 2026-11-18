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
  MessageSquare,
  Send,
  Flame,
  TrendingUp,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  fetchUserWallet,
  WalletData,
  phoneToReferralCode,
  registerReferralCode,
} from '../lib/supabase';

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
  const [copiedFullMsg, setCopiedFullMsg] = useState(false);

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

  // Private, stylish branded referral code (NO phone number exposed)
  const referralCode = activePhone ? phoneToReferralCode(activePhone) : '';
  const referralLink = referralCode
    ? `${siteUrl}/?refer_and_earn=${referralCode}&ref=${referralCode}`
    : '';

  // Viral pre-formatted message with privacy-protected VIP referral code
  const fullShareText =
    `🔥 *SUBNEST REFER & EARN SPECIAL OFFER* 🎁\n\n` +
    `Dosto ke liye exclusive OTT & AI Tool Deals! ⚡\n` +
    `Netflix 4K UHD, Prime Video, JioHotstar, YouTube Premium & ChatGPT starting @ *just ₹49/month*!\n\n` +
    `🎁 *Refer & Earn VIP Link:*\n` +
    `Click karo aur direct *FLAT ₹20 OFF* paao apne pehle order par:\n` +
    `👉 ${referralLink}\n\n` +
    `Or use Refer & Earn Promo Code at checkout:\n` +
    `🎟️ Promo Code: *${referralCode}*\n\n` +
    `✅ 100% Replacement Warranty & Instant WhatsApp Delivery within 5-10 Mins!\n` +
    `💸 *Tip:* Aap bhi apna link create karke har dost ke order par ₹20 Wallet Cash kama sakte ho!`;

  // Handle generating / saving the referral link
  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError(null);

    const clean = normalizePhone(phoneInput);
    if (!clean || clean.length !== 10) {
      setInputError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    const genCode = phoneToReferralCode(clean);
    setActivePhone(clean);
    setIsEditing(false);

    try {
      localStorage.setItem('subnest_referral_owner_phone', clean);
      localStorage.setItem('subnest_referral_owner_code', genCode);
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

    // Register code in cloud DB
    registerReferralCode(clean, genCode);

    // Auto copy generated link to clipboard & fire celebration
    const genLink = `${siteUrl}/?refer_and_earn=${genCode}&ref=${genCode}`;
    copyToClipboard(genLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);

    try {
      confetti({
        particleCount: 50,
        spread: 65,
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

  const handleCopyFullMessage = async () => {
    if (!referralLink) return;
    const ok = await copyToClipboard(fullShareText);
    if (ok) {
      setCopiedFullMsg(true);
      setTimeout(() => setCopiedFullMsg(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (!referralLink || !referralCode) return;
    const encoded = encodeURIComponent(fullShareText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleShareTelegram = () => {
    if (!referralLink || !referralCode) return;
    const encodedUrl = encodeURIComponent(referralLink);
    const encodedText = encodeURIComponent(
      `🔥 SUBNEST REFER & EARN: Flat ₹20 OFF on Netflix 4K, Prime, YouTube Premium & ChatGPT! Use Code: ${referralCode}`
    );
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-background/90 backdrop-blur-md" />

      {/* Modal Dialog */}
      <div className="relative bg-card border border-border rounded-3xl p-5 sm:p-7 max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl z-10 flex flex-col space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/25">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-foreground flex items-center gap-1.5">
                <span>Subnest Refer & Earn</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  Dual ₹20 Cash
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Dost ko Flat ₹20 OFF, aur unke har order par aapko ₹20 Direct Wallet Cash!
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
                Apna 10-digit WhatsApp number daalo Refer & Earn link activate karne ke liye:
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
                <span>Generate Refer & Earn Link ⚡</span>
              </button>
            </div>

            {inputError ? (
              <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{inputError}</span>
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Aapka number 100% private rahega. Public share link me stylish VIP code (e.g. NEST-XXXX) use hoga.</span>
              </p>
            )}
          </form>
        ) : (
          /* ───────── STEP 2: ACTIVE BRANDED REFER & EARN LINK ───────── */
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent border border-violet-500/25 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Aapka Official Refer & Earn Link Ready Hai!</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20"
                  title="Click to copy Promo Code"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>VIP Code: <strong>{referralCode}</strong></span>
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

            {/* Privacy protected note */}
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span><strong>100% Privacy Protected:</strong> Aapka phone number link me kahi bhi nahi hai. Sabhi jagah aapka VIP Code: <strong>{referralCode}</strong> share hoga!</span>
            </div>

            {/* Branded Link Display Box */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Official Refer & Earn Share Link:
              </label>
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
            </div>

            {/* Multi-Channel Viral Share Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {/* WhatsApp Share */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share WhatsApp</span>
              </button>

              {/* Telegram Share */}
              <button
                type="button"
                onClick={handleShareTelegram}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Share Telegram</span>
              </button>

              {/* Copy Full Viral Post */}
              <button
                type="button"
                onClick={handleCopyFullMessage}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                  copiedFullMsg
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-secondary hover:bg-secondary/80 border-border text-foreground'
                }`}
              >
                {copiedFullMsg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <MessageSquare className="w-3.5 h-3.5" />}
                <span>{copiedFullMsg ? 'Post Copied!' : 'Copy Full Post'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ───────── VIRAL EARNING CALCULATOR / MILESTONES ───────── */}
        <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>Unlimited Free OTT Earnings:</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">₹20 per friend</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-background border border-border">
              <span className="text-[10px] text-muted-foreground">5 Dosto Ko</span>
              <p className="font-black text-foreground">₹100 Cash</p>
              <span className="text-[9px] text-emerald-400 font-medium">Free Hotstar/Prime</span>
            </div>
            <div className="p-2 rounded-xl bg-background border border-border">
              <span className="text-[10px] text-muted-foreground">10 Dosto Ko</span>
              <p className="font-black text-primary">₹200 Cash</p>
              <span className="text-[9px] text-emerald-400 font-medium">Free Netflix 4K</span>
            </div>
            <div className="p-2 rounded-xl bg-background border border-border">
              <span className="text-[10px] text-muted-foreground">25 Dosto Ko</span>
              <p className="font-black text-emerald-400">₹500 Cash</p>
              <span className="text-[9px] text-emerald-400 font-medium">Free Annual Plan</span>
            </div>
          </div>
        </div>

        {/* ───────── 3. LIVE WALLET & EARNINGS CARD ───────── */}
        {activePhone && (
          <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-bold text-foreground">Aapka Subnest Wallet</h4>
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
          <p className="text-xs font-bold text-foreground">Refer & Earn Kaise Kaam Karta Hai:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-secondary/30 border border-border flex flex-col justify-between">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center mb-1.5">
                1
              </span>
              <p className="text-xs font-bold text-foreground">Link Share Karo</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Apna Refer & Earn link WhatsApp groups, Status ya dosto ko bhejo.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-secondary/30 border border-border flex flex-col justify-between">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center mb-1.5">
                2
              </span>
              <p className="text-xs font-bold text-foreground">Dost Ko ₹20 OFF</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Aapke link se aane par dost ko checkout par turant Flat ₹20 discount milta hai.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-secondary/30 border border-border flex flex-col justify-between">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center mb-1.5">
                3
              </span>
              <p className="text-xs font-bold text-foreground">Aapko ₹20 Cash</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Dost ka order deliver hote hi aapke Subnest wallet me ₹20 add ho jaate hain.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>100% Genuine Subnest MSME Reseller Affiliate Program</span>
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
