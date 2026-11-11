import React, { useState } from 'react';
import { X, Search, CheckCircle, Clock, AlertTriangle, MessageCircle, Database } from 'lucide-react';
import { lookupOrderInSupabase } from '../lib/supabase';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    // 1. First check Supabase live cloud DB
    try {
      const dbResults = await lookupOrderInSupabase(query.trim());
      if (dbResults && dbResults.length > 0) {
        const item = dbResults[0];
        setFoundOrder({
          orderId: item.order_id,
          itemName: item.product_name,
          fullName: item.customer_name,
          amount: item.amount,
          utrNumber: item.utr_number,
          status: item.status === 'credentials_sent'
            ? 'Delivered'
            : item.status === 'verified'
            ? 'Payment Verified'
            : 'Verification Pending',
          source: 'Cloud DB',
        });
        setSearched(true);
        setLoading(false);
        return;
      }
    } catch {}

    // 2. Fallback to local storage
    const saved = JSON.parse(localStorage.getItem('subnest_orders') || localStorage.getItem('nexora_orders') || '[]');
    const match = saved.find(
      (o: any) =>
        o.orderId.toLowerCase() === query.trim().toLowerCase() ||
        o.email.toLowerCase() === query.trim().toLowerCase() ||
        o.phone.includes(query.trim()) ||
        (o.utrNumber && o.utrNumber.includes(query.trim()))
    );

    setFoundOrder(match ? { ...match, source: 'Device Memory' } : null);
    setSearched(true);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-background/90 backdrop-blur-sm" />

      <div className="relative bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Track Your Order</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Enter your 6-digit Order ID (e.g. <span className="text-primary font-mono font-bold">NXR-123456</span>), Phone number, or 12-digit UPI UTR:
        </p>

        <form onSubmit={handleTrack} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Order ID / Phone / UTR"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="storefront-field w-full pl-9 pr-3 py-2 text-xs bg-background border border-input text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="storefront-button px-4 py-2 bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Clock className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>{loading ? 'Searching...' : 'Track'}</span>
          </button>
        </form>

        {searched && foundOrder && (
          <div className="rounded-2xl bg-secondary/40 border border-border p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-bold text-foreground truncate max-w-[200px]">{foundOrder.itemName}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {foundOrder.status}
              </span>
            </div>

            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Order ID: <span className="font-mono text-foreground font-bold">{foundOrder.orderId}</span></p>
              <p>Customer: <span className="text-foreground">{foundOrder.fullName}</span></p>
              <p>Amount: <span className="text-emerald-400 font-bold">₹{foundOrder.amount}</span></p>
              <p>UTR: <span className="font-mono text-foreground">{foundOrder.utrNumber}</span></p>
            </div>

            <div className="pt-2 border-t border-border/60 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Order Placed & UTR Logged</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Verification in Progress (5-10 mins)</span>
              </div>
            </div>

            <a
              href={`https://wa.me/919347610989?text=Hello%20Subnest,%20checking%20status%20for%20Order%20${foundOrder.orderId}`}
              target="_blank"
              rel="noreferrer"
              className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Speed up via WhatsApp</span>
            </a>
          </div>
        )}

        {searched && !foundOrder && (
          <div className="text-center py-6 px-3 bg-secondary/30 rounded-2xl border border-border">
            <AlertTriangle className="w-7 h-7 text-amber-400 mx-auto mb-1.5" />
            <p className="text-xs text-foreground font-semibold">No recent order found in this browser.</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              If you paid from another device, message our WhatsApp support directly with your receipt:
            </p>
            <a
              href="https://wa.me/919347610989?text=Hello%20Subnest,%20I%20want%20to%20track%20my%20order."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Support on WhatsApp</span>
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

