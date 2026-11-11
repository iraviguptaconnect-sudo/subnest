import React, { useState, useEffect } from 'react';
import { Product, PlanOption } from '../types';
import { X, Check, Copy, QrCode, ShieldCheck, Zap, MessageCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  comboData?: { title: string; price: number; apps: string[] };
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  comboData,
}) => {
  if (!isOpen) return null;

  // Step 1: Select Plan, Step 2: Details, Step 3: Payment
  const [step, setStep] = useState<1 | 2 | 3>(comboData ? 2 : 1);
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(() => {
    return product?.plans[0] || { id: 'default', duration: '1 Month', price: 99, originalPrice: 649 };
  });

  // User details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [orderId] = useState(() => 'NXR-' + Math.floor(100000 + Math.random() * 900000));
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeQr, setActiveQr] = useState<'paytm' | 'phonepe' | 'pop'>('paytm');
  const [isSuccess, setIsSuccess] = useState(false);

  // Load saved details if available
  useEffect(() => {
    const saved = localStorage.getItem('subnest_user_profile') || localStorage.getItem('nexora_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
      } catch {}
    }
  }, []);

  const amountToPay = comboData ? comboData.price : selectedPlan.price;
  const itemName = comboData ? comboData.title : `${product?.name} (${selectedPlan.duration})`;

  const qrConfig = {
    paytm: {
      name: 'Paytm UPI',
      id: '9347610989@pthdfc',
      image: '/assets/paytm-qr.jpg',
    },
    phonepe: {
      name: 'PhonePe',
      id: '9347610989@pthdfc',
      image: '/assets/phonepe-qr.jpg',
    },
    pop: {
      name: 'POP Club',
      id: '9347610989@yespop',
      image: '/assets/pop-qr.jpg',
    },
  };

  const currentUpi = qrConfig[activeQr];

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(currentUpi.id);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleOpenUpiApp = () => {
    const upiLink = `upi://pay?pa=${currentUpi.id}&pn=NAMAN%20JAIN&am=${amountToPay}&cu=INR&tn=Order%20${orderId}`;
    window.location.href = upiLink;
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      alert('Please fill your name, WhatsApp number, and email.');
      return;
    }
    // Save to profile for fast repeat purchase
    localStorage.setItem(
      'nexora_user_profile',
      JSON.stringify({ fullName, phone, email })
    );
    setStep(3);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.length < 8) {
      alert('Please enter your valid 12-digit UPI UTR / Transaction Reference number.');
      return;
    }

    const newOrder = {
      orderId,
      itemName,
      amount: amountToPay,
      fullName,
      phone,
      email,
      utrNumber,
      status: 'Verification Pending',
      date: new Date().toLocaleString(),
    };

    const existing = JSON.parse(localStorage.getItem('subnest_orders') || localStorage.getItem('nexora_orders') || '[]');
    localStorage.setItem('subnest_orders', JSON.stringify([newOrder, ...existing]));

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch {}

    setIsSuccess(true);
  };

  const handleWhatsAppRedirect = () => {
    const text =
      `*NEW SUBNEST ORDER CONFIRMATION*%0A%0A` +
      `*Order ID:* ${orderId}%0A` +
      `*Product:* ${itemName}%0A` +
      `*Amount:* Rs.${amountToPay}%0A` +
      `*Customer Name:* ${fullName}%0A` +
      `*Phone:* ${phone}%0A` +
      `*Email:* ${email}%0A` +
      `*UPI UTR / Ref:* ${utrNumber}%0A%0A` +
      `_Payment done via UPI QR. Please verify & send credentials._`;
    window.open(`https://wa.me/919347610989?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-background/90 backdrop-blur-md"
      />

      {/* Modal Dialog (Full screen on mobile, max-w-xl on desktop) */}
      <div className="relative bg-card border border-border sm:rounded-3xl p-5 sm:p-7 max-w-xl w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] overflow-y-auto shadow-2xl z-10 flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
          <div className="flex items-center gap-2">
            {step > 1 && !isSuccess && (
              <button
                onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {comboData ? 'Combo Checkout' : product?.name}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Order Ref: <span className="font-mono text-primary font-semibold">{orderId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        {!isSuccess && (
          <div className="flex items-center justify-center gap-2 mb-6 text-xs font-semibold">
            <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              1. Plan
            </span>
            <span className="text-muted-foreground">→</span>
            <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              2. Details
            </span>
            <span className="text-muted-foreground">→</span>
            <span className={`px-3 py-1 rounded-full ${step === 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              3. Pay
            </span>
          </div>
        )}

        {/* ───────── STEP 1: CHOOSE PLAN ───────── */}
        {step === 1 && product && !isSuccess && (
          <div className="space-y-5 flex-1">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-secondary/50 border border-border mx-auto p-3 mb-3 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="text-base font-bold text-foreground">{product.name}</h4>
              <p className="text-xs text-muted-foreground">{product.tagline}</p>
            </div>

            <p className="text-xs font-bold text-center text-foreground uppercase tracking-wider">
              Choose Your Plan (Tap on plan below 👇)
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {product.plans.map((p) => {
                const isSelected = selectedPlan.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-secondary border-primary shadow-lg shadow-primary/10'
                        : 'bg-card border-border hover:border-foreground/30'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                    )}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
                      {p.duration}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-foreground">₹{p.price}</span>
                      <span className="text-xs text-muted-foreground line-through">₹{p.originalPrice}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* What's Included */}
            <div className="bg-secondary/40 border border-border rounded-2xl p-4 space-y-2 text-xs text-muted-foreground">
              <p className="font-bold text-foreground">What's Included:</p>
              <p className="flex items-center gap-1.5 text-foreground/80">
                <Check className="w-3.5 h-3.5 text-success" />
                Instant delivery via WhatsApp within 5-10 minutes
              </p>
              <p className="flex items-center gap-1.5 text-foreground/80">
                <Check className="w-3.5 h-3.5 text-success" />
                100% full-duration replacement warranty
              </p>
              <p className="flex items-center gap-1.5 text-foreground/80">
                <Check className="w-3.5 h-3.5 text-success" />
                24/7 dedicated support by verified team
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="storefront-button w-full h-12 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-lg shadow-primary/25 transition-opacity"
            >
              Continue to Details →
            </button>
          </div>
        )}

        {/* ───────── STEP 2: DETAILS ───────── */}
        {step === 2 && !isSuccess && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4 flex-1">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Enter your real WhatsApp number & email for credential delivery.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="storefront-field w-full min-h-11 px-3.5 py-2.5 text-sm bg-card border border-input text-foreground focus:border-primary focus:outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                WhatsApp Number * (Credentials will be sent here)
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="storefront-field w-full min-h-11 px-3.5 py-2.5 text-sm bg-card border border-input text-foreground focus:border-primary focus:outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Email Address * (For account login details)
              </label>
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="storefront-field w-full min-h-11 px-3.5 py-2.5 text-sm bg-card border border-input text-foreground focus:border-primary focus:outline-none placeholder:text-muted-foreground"
              />
            </div>

            {/* Order summary box */}
            <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Order Item</p>
                <p className="text-sm font-bold text-foreground">{itemName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-primary">₹{amountToPay}</p>
              </div>
            </div>

            <button
              type="submit"
              className="storefront-button w-full h-12 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-lg shadow-primary/25 transition-opacity"
            >
              Continue to Payment →
            </button>
          </form>
        )}

        {/* ───────── STEP 3: PAYMENT VIA UPI QR ───────── */}
        {step === 3 && !isSuccess && (
          <form onSubmit={handlePaymentSubmit} className="space-y-4 flex-1">
            {/* Amount Banner */}
            <div className="rounded-2xl bg-secondary/60 border border-border p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Order Total</span>
                <p className="text-xs text-foreground font-medium">{itemName}</p>
              </div>
              <span className="text-2xl font-black text-primary">₹{amountToPay}</span>
            </div>

            {/* Beneficiary Header */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Scan to Pay via Any UPI App</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified: NAMAN JAIN
              </span>
            </div>

            {/* QR App Selector */}
            <div className="grid grid-cols-3 gap-2">
              {(['paytm', 'phonepe', 'pop'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveQr(key)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    activeQr === key
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {qrConfig[key].name}
                </button>
              ))}
            </div>

            {/* QR Card */}
            <div className="bg-secondary/40 rounded-2xl border border-border p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white rounded-2xl p-2 border-2 border-primary/40 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                <img
                  src={currentUpi.image}
                  alt={currentUpi.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 w-full space-y-2.5 text-center sm:text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Merchant UPI ID:</span>
                  <div className="mt-1 flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-2">
                    <span className="font-mono text-xs text-foreground font-semibold truncate flex-1">
                      {currentUpi.id}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1 rounded bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {copiedUpi && <p className="text-[10px] text-success mt-0.5">✓ Copied to clipboard!</p>}
                </div>

                <button
                  type="button"
                  onClick={handleOpenUpiApp}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Open Installed UPI App</span>
                </button>

                <p className="text-[10px] text-muted-foreground">
                  Works with GPay, PhonePe, Paytm, Cred, BHIM.
                </p>
              </div>
            </div>

            {/* 12-Digit UTR Input */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Enter 12-Digit UPI Ref / UTR Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 429182910384"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="storefront-field w-full min-h-11 px-3.5 py-2.5 text-sm bg-card border border-primary/50 text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Find the 12-digit UPI Transaction / UTR number in your payment receipt.
              </p>
            </div>

            <button
              type="submit"
              className="storefront-button w-full h-12 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-lg shadow-primary/25 transition-opacity"
            >
              Verify Payment & Claim Access
            </button>
          </form>
        )}

        {/* ───────── SUCCESS STATE ───────── */}
        {isSuccess && (
          <div className="p-4 sm:p-6 text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">Order Submitted!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Order ID: <span className="font-mono text-primary font-bold">{orderId}</span>
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-2">
                Your payment UTR has been logged. Click below to notify us on WhatsApp for instant 5-minute activation.
              </p>
            </div>

            <div className="space-y-2 pt-2 max-w-xs mx-auto">
              <button
                type="button"
                onClick={handleWhatsAppRedirect}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp (5 Mins)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Done / Back to Store
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

