import React, { useState, useEffect } from 'react';
import { Product, PlanOption } from '../types';
import { X, Check, Copy, ShieldCheck, Zap, MessageCircle, AlertCircle, ArrowLeft, Download, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createOrderInSupabase } from '../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  plan?: PlanOption;
  comboData?: { title: string; price: number; apps: string[] };
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  plan,
  comboData,
}) => {
  if (!isOpen) return null;

  // Step 1: Details, Step 2: Pay QR
  const [step, setStep] = useState<1 | 2>(1);

  // User details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [orderId] = useState(() => 'NXR-' + Math.floor(100000 + Math.random() * 900000));
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeQr, setActiveQr] = useState<'paytm' | 'phonepe' | 'pop'>('paytm');
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes session

  // Countdown timer in step 2
  useEffect(() => {
    if (step !== 2 || isSuccess) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, isSuccess]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const amountToPay = comboData ? comboData.price : plan?.price || 99;
  const itemName = comboData ? comboData.title : `${product?.name} (${plan?.duration})`;

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

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = currentUpi.image;
    link.download = `subnest-${activeQr}-qr.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      alert('Please fill your name, WhatsApp number, and email.');
      return;
    }
    localStorage.setItem(
      'subnest_user_profile',
      JSON.stringify({ fullName, phone, email })
    );
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
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

    // 1. Local storage backup
    const existing = JSON.parse(localStorage.getItem('subnest_orders') || '[]');
    localStorage.setItem('subnest_orders', JSON.stringify([newOrder, ...existing]));

    // 2. Real-time Supabase Cloud DB write
    createOrderInSupabase({
      order_id: orderId,
      product_name: itemName,
      plan_duration: plan?.duration || '',
      amount: amountToPay,
      customer_name: fullName,
      customer_phone: phone,
      customer_email: email,
      utr_number: utrNumber,
      payment_method: activeQr,
      status: 'pending_verification',
    }).then((res) => {
      if (res.success) {
        console.log('[Subnest] Order synced to Supabase successfully:', orderId);
      } else {
        console.warn('[Subnest] Supabase sync fallback (schema pending):', res.error);
      }
    });

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

      {/* Modal Dialog */}
      <div className="relative bg-card border border-border sm:rounded-3xl p-5 sm:p-7 max-w-xl w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] overflow-y-auto shadow-2xl z-10 flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
          <div className="flex items-center gap-2">
            {step === 2 && !isSuccess && (
              <button
                onClick={() => setStep(1)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground mr-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {itemName}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Order ID: <span className="font-mono text-primary font-semibold">{orderId}</span>
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

        {/* Step Progress Indicators */}
        {!isSuccess && (
          <div className="flex items-center justify-center gap-2 mb-6 text-xs font-semibold">
            <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              1. Your Details
            </span>
            <span className="text-muted-foreground">→</span>
            <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              2. UPI Payment
            </span>
          </div>
        )}

        {/* ───────── STEP 1: DETAILS ───────── */}
        {step === 1 && !isSuccess && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4 flex-1">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>We pre-filled your details from your last order if saved. You can edit them.</span>
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
                WhatsApp Number * (For instant activation & credentials)
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="storefront-field w-full min-h-11 px-3.5 py-2.5 text-sm bg-card border border-input text-foreground focus:border-primary focus:outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Email Address * (For account login access)
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
            <div className="bg-secondary/40 border border-border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Order Item</p>
                <p className="text-sm font-bold text-foreground">{itemName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-primary">₹{amountToPay}</p>
              </div>
            </div>

            <button
              type="submit"
              className="storefront-button w-full h-12 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-lg shadow-primary/25 transition-opacity cursor-pointer"
            >
              Continue to Payment →
            </button>
          </form>
        )}

        {/* ───────── STEP 2: UPI PAYMENT ───────── */}
        {step === 2 && !isSuccess && (
          <form onSubmit={handlePaymentSubmit} className="space-y-4 flex-1">
            {/* Amount Banner + Urgency Countdown */}
            <div className="rounded-2xl bg-secondary/60 border border-border p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Total to Pay</span>
                <p className="text-xs text-foreground font-medium">{itemName}</p>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-amber-500 font-semibold">
                  <Timer className="w-3 h-3 animate-spin" />
                  <span>Session expires in {formatTimer(timeLeft)}</span>
                </div>
              </div>
              <span className="text-3xl font-black text-primary">₹{amountToPay}</span>
            </div>

            {/* Beneficiary Header */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Scan to Pay via Any UPI App</span>
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
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
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    activeQr === key
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {qrConfig[key].name}
                </button>
              ))}
            </div>

            {/* QR Card with Naman Jain's verified QR code */}
            <div className="bg-secondary/40 rounded-2xl border border-border p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white rounded-2xl p-2 border-2 border-primary/40 flex items-center justify-center overflow-hidden shadow-lg">
                  <img
                    src={currentUpi.image}
                    alt={currentUpi.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="w-full py-1.5 px-3 rounded-lg bg-card hover:bg-secondary border border-border text-foreground text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span>Download QR to Gallery</span>
                </button>
              </div>

              <div className="flex-1 w-full space-y-2.5 text-center sm:text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Beneficiary UPI ID:</span>
                  <div className="mt-1 flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-2">
                    <span className="font-mono text-xs text-foreground font-semibold truncate flex-1">
                      {currentUpi.id}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1 rounded bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {copiedUpi && <p className="text-[10px] text-success mt-0.5">✓ Copied to clipboard!</p>}
                </div>

                <button
                  type="button"
                  onClick={handleOpenUpiApp}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Open Installed UPI App (GPay/Paytm)</span>
                </button>

                <p className="text-[10px] text-muted-foreground">
                  Works with PhonePe, Paytm, Google Pay, Cred, BHIM.
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
                Check your UPI payment receipt for the 12-digit UTR/Reference number.
              </p>
            </div>

            <button
              type="submit"
              className="storefront-button w-full h-12 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-lg shadow-primary/25 transition-opacity cursor-pointer"
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
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp (5 Mins)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
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

