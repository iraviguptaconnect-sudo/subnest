import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle, Clock, Send, MessageCircle, ShieldCheck, Search } from 'lucide-react';
import { fetchAllOrdersForAdmin, updateOrderStatus, DbOrder } from '../lib/supabase';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'delivered'>('all');

  const loadOrders = async () => {
    setLoading(true);
    // 1. Fetch from Supabase
    const cloudOrders = await fetchAllOrdersForAdmin();

    // 2. Also merge any local orders if cloud is empty or schema not yet run
    const local = JSON.parse(localStorage.getItem('subnest_orders') || localStorage.getItem('nexora_orders') || '[]');
    const mappedLocal: DbOrder[] = local.map((l: any) => ({
      order_id: l.orderId,
      product_name: l.itemName,
      amount: l.amount,
      customer_name: l.fullName,
      customer_phone: l.phone,
      customer_email: l.email,
      utr_number: l.utrNumber,
      status: l.status?.toLowerCase().includes('deliver')
        ? 'credentials_sent'
        : l.status?.toLowerCase().includes('verif')
        ? 'verified'
        : 'pending_verification',
      created_at: l.date,
    }));

    // Deduplicate by order_id
    const merged = [...cloudOrders];
    for (const loc of mappedLocal) {
      if (!merged.some((o) => o.order_id === loc.order_id)) {
        merged.push(loc);
      }
    }

    setOrders(merged);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: DbOrder['status']) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
    );
    await updateOrderStatus(orderId, newStatus);
  };

  const openCustomerWhatsApp = (phone: string, order: DbOrder) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = `Hello ${order.customer_name}, your Subnest order *${order.order_id}* for *${order.product_name}* has been processed! Here are your credentials:%0A%0A`;
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'pending' && o.status !== 'pending_verification') return false;
    if (activeTab === 'delivered' && o.status !== 'credentials_sent') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.order_id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        o.utr_number.toLowerCase().includes(q) ||
        o.product_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-background/90 backdrop-blur-md" />

      <div className="relative bg-card border border-border rounded-3xl p-5 sm:p-6 max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl z-10">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Subnest Admin Order Feed</h2>
              <p className="text-[11px] text-muted-foreground">Connected to Supabase DB · Live Orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
          <div className="flex items-center gap-1.5 p-1 bg-secondary/50 rounded-xl border border-border w-full sm:w-auto">
            {(['all', 'pending', 'delivered'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID / Phone / UTR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="storefront-field w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-input text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Orders Table / List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading && orders.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin text-primary mr-2" />
              Loading live orders from Supabase...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4">
              <Clock className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm font-semibold text-foreground">No orders found</p>
              <p className="text-xs text-muted-foreground mt-1">Orders submitted with UPI UTR will appear here live.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.order_id}
                className="p-4 rounded-2xl bg-secondary/30 border border-border hover:border-primary/40 transition-colors space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{order.order_id}</span>
                    <span className="text-xs font-semibold text-foreground">{order.product_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">₹{order.amount}</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.order_id, e.target.value as any)}
                      className="text-[11px] font-semibold rounded-lg bg-card border border-border px-2 py-1 text-foreground focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="pending_verification">⏳ Pending</option>
                      <option value="verified">✓ Verified</option>
                      <option value="credentials_sent">📦 Delivered</option>
                      <option value="cancelled">✕ Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Customer</span>
                    <span className="text-foreground font-medium">{order.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Phone</span>
                    <span className="font-mono text-foreground">{order.customer_phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">UTR Number</span>
                    <span className="font-mono text-primary font-bold">{order.utr_number}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Email</span>
                    <span className="text-foreground truncate block">{order.customer_email}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-muted-foreground">
                    {order.created_at ? new Date(order.created_at).toLocaleString() : 'Just now'}
                  </span>
                  <button
                    onClick={() => openCustomerWhatsApp(order.customer_phone, order)}
                    className="py-1 px-2.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send Credentials via WhatsApp</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Total Orders: <strong className="text-foreground">{orders.length}</strong></span>
          <span>Press <code className="bg-secondary px-1 py-0.5 rounded text-foreground font-mono">Shift + A</code> or visit <code className="bg-secondary px-1 py-0.5 rounded text-foreground font-mono">#admin</code> to toggle</span>
        </div>

      </div>
    </div>
  );
};

