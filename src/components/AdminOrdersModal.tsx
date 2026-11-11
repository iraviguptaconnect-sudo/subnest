import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  Clock,
  MessageCircle,
  ShieldCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Package,
  Layers,
  Check,
  Tag,
  AlertTriangle,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { fetchAllOrdersForAdmin, updateOrderStatus, DbOrder } from '../lib/supabase';
import { Product, PlanOption } from '../types';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetProducts: () => void;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProduct,
  onDeleteProduct,
  onResetProducts,
}) => {
  if (!isOpen) return null;

  // Active admin section: 'orders' | 'products'
  const [activeSection, setActiveSection] = useState<'orders' | 'products'>('orders');

  // Orders state
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderTab, setOrderTab] = useState<'all' | 'pending' | 'delivered'>('all');

  // Products state
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState<string>('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Load orders
  const loadOrders = async () => {
    setLoadingOrders(true);
    const cloudOrders = await fetchAllOrdersForAdmin();
    const local = JSON.parse(
      localStorage.getItem('subnest_orders') ||
        localStorage.getItem('nexora_orders') ||
        '[]'
    );
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

    const merged = [...cloudOrders];
    for (const loc of mappedLocal) {
      if (!merged.some((o) => o.order_id === loc.order_id)) {
        merged.push(loc);
      }
    }

    setOrders(merged);
    setLoadingOrders(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: DbOrder['status']) => {
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

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderTab === 'pending' && o.status !== 'pending_verification') return false;
    if (orderTab === 'delivered' && o.status !== 'credentials_sent') return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
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

  // Filtered products
  const categories = ['All', 'OTT', 'Regional', 'Music', 'Entertainment', 'Special'];
  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategory === 'All' || p.category === productCategory;
    const matchesSearch =
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.tagline.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Start add new product
  const handleAddNew = () => {
    setEditingProduct({
      id: 'sub-' + Date.now().toString(36),
      name: '',
      category: 'OTT',
      tagline: '',
      description: '',
      image: '/subsplit-assets/canva-RwBsyx4M.png',
      popular: false,
      deliveryType: 'On Your Number',
      devices: '1 Device',
      features: ['Instant Delivery on WhatsApp', '100% Replacement Warranty'],
      plans: [
        { id: 'p1', duration: '1 Month', price: 99, originalPrice: 299 },
        { id: 'p2', duration: '12 Months (Annual)', price: 699, originalPrice: 1499, badge: 'Best Value' },
      ],
    });
    setIsCreatingNew(true);
  };

  // Start edit product
  const handleStartEdit = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setIsCreatingNew(false);
  };

  // Confirm delete
  const handleDelete = (prod: Product) => {
    if (window.confirm(`Are you sure you want to delete "${prod.name}" from catalog?`)) {
      onDeleteProduct(prod.id);
    }
  };

  // Save edited or created product
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) {
      alert('Product name is required.');
      return;
    }
    if (!editingProduct.image.trim()) {
      alert('Product image is required.');
      return;
    }
    if (editingProduct.plans.length === 0) {
      alert('Please add at least one plan tier.');
      return;
    }

    onSaveProduct(editingProduct);
    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-background/90 backdrop-blur-md" />

      {/* Main Dialog */}
      <div className="relative bg-card border border-border rounded-3xl p-5 sm:p-6 max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl z-10">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Subnest Admin Workspace</h2>
              <p className="text-[11px] text-muted-foreground">Manage Live Orders & Products Catalog</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeSection === 'orders' && (
              <button
                onClick={loadOrders}
                className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
                title="Refresh Orders"
              >
                <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin text-primary' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs: Orders vs Products */}
        <div className="flex items-center justify-between border-b border-border py-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeSection === 'orders'
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                  : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Live Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeSection === 'products'
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                  : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Manage Products ({products.length})</span>
            </button>
          </div>

          {activeSection === 'products' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onResetProducts}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground text-xs font-medium cursor-pointer"
                title="Reset to default 23 products"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>

              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold shadow-md hover:opacity-90 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Product</span>
              </button>
            </div>
          )}
        </div>

        {/* ───────── TAB 1: LIVE ORDERS ───────── */}
        {activeSection === 'orders' && (
          <div className="flex-1 flex flex-col min-h-0 pt-3">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3 shrink-0">
              <div className="flex items-center gap-1.5 p-1 bg-secondary/50 rounded-xl border border-border w-full sm:w-auto">
                {(['all', 'pending', 'delivered'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setOrderTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      orderTab === tab
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
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="storefront-field w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-input text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Orders List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loadingOrders && orders.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">
                  <RefreshCw className="w-4 h-4 animate-spin text-primary mr-2" />
                  Loading live orders from Supabase...
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <Clock className="w-8 h-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm font-semibold text-foreground">No orders found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Orders submitted with UPI UTR will appear here live.
                  </p>
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
          </div>
        )}

        {/* ───────── TAB 2: PRODUCTS CATALOG MANAGEMENT ───────── */}
        {activeSection === 'products' && (
          <div className="flex-1 flex flex-col min-h-0 pt-3">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      productCategory === cat
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="storefront-field w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-input text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filteredProducts.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <Package className="w-8 h-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm font-semibold text-foreground">No products found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try changing your category or search query, or click "+ Add Product".
                  </p>
                </div>
              ) : (
                filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-2xl bg-secondary/30 border border-border hover:border-primary/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-card border border-border p-1 overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as any).src = '/assets/subnest-logo.png';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-foreground truncate">{prod.name}</h4>
                          <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                            {prod.category}
                          </span>
                          {prod.popular && (
                            <span className="text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                              ★ Popular
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">{prod.tagline}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                          <span>{prod.deliveryType}</span>
                          <span>•</span>
                          <span>{prod.devices}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Plans Overview */}
                    <div className="flex items-center gap-1.5 flex-wrap max-w-sm">
                      {prod.plans.map((pl) => (
                        <span
                          key={pl.id}
                          className="text-[10px] bg-card border border-border px-2 py-0.5 rounded-md text-foreground font-mono"
                        >
                          {pl.duration}: <strong className="text-emerald-400">₹{pl.price}</strong>
                        </span>
                      ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleStartEdit(prod)}
                        className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs flex items-center gap-1 transition-colors cursor-pointer border border-border"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[11px] font-semibold">Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(prod)}
                        className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs flex items-center gap-1 transition-colors cursor-pointer border border-destructive/20"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold">Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ───────── ADD / EDIT PRODUCT MODAL (SUB-MODAL) ───────── */}
        {editingProduct && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-background/80 backdrop-blur-md">
            <div className="relative bg-card border border-border rounded-3xl p-5 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {isCreatingNew ? 'Add New Product to Catalog' : `Edit: ${editingProduct.name}`}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Configure pricing, plans, features, and delivery info.</p>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-4">
                
                {/* 1. Basic Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HBO Max / Max"
                      value={editingProduct.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setEditingProduct((prev) =>
                          prev
                            ? {
                                ...prev,
                                name,
                                id: isCreatingNew
                                  ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || prev.id
                                  : prev.id,
                              }
                            : null
                        );
                      }}
                      className="storefront-field w-full px-3 py-2 text-xs bg-background border border-input text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Product ID / Slug</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.id}
                      onChange={(e) =>
                        setEditingProduct((prev) => (prev ? { ...prev, id: e.target.value } : null))
                      }
                      className="storefront-field w-full px-3 py-2 text-xs bg-background border border-input text-foreground font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* 2. Category & Popular Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct((prev) => (prev ? { ...prev, category: e.target.value } : null))
                      }
                      className="storefront-field w-full px-3 py-2 text-xs bg-background border border-input text-foreground focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="OTT">OTT</option>
                      <option value="Regional">Regional</option>
                      <option value="Music">Music</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Special">Special</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="popularCheck"
                      checked={!!editingProduct.popular}
                      onChange={(e) =>
                        setEditingProduct((prev) => (prev ? { ...prev, popular: e.target.checked } : null))
                      }
                      className="w-4 h-4 text-primary rounded border-border cursor-pointer"
                    />
                    <label htmlFor="popularCheck" className="text-xs font-semibold text-foreground cursor-pointer">
                      Mark as Top Seller / Popular Badge
                    </label>
                  </div>
                </div>

                {/* 3. Image URL with Preview */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Image URL or Local Path *
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 rounded-xl bg-secondary border border-border p-1 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={editingProduct.image}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as any).src = '/assets/subnest-logo.png';
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="/subsplit-assets/canva-RwBsyx4M.png or https://..."
                      value={editingProduct.image}
                      onChange={(e) =>
                        setEditingProduct((prev) => (prev ? { ...prev, image: e.target.value } : null))
                      }
                      className="storefront-field flex-1 px-3 py-2 text-xs bg-background border border-input text-foreground font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Presets: <code className="text-primary cursor-pointer" onClick={() => setEditingProduct(p => p ? {...p, image: '/subsplit-assets/canva-RwBsyx4M.png'} : null)}>canva</code>, <code className="text-primary cursor-pointer" onClick={() => setEditingProduct(p => p ? {...p, image: '/subsplit-assets/chatgpt-D-eCKgGu.png'} : null)}>chatgpt</code>, <code className="text-primary cursor-pointer" onClick={() => setEditingProduct(p => p ? {...p, image: '/subsplit-assets/jiohotstar-BlEax2r6.png'} : null)}>hotstar</code>, <code className="text-primary cursor-pointer" onClick={() => setEditingProduct(p => p ? {...p, image: '/subsplit-assets/spotify-eBjxoM9M.png'} : null)}>spotify</code>
                  </p>
                </div>

                {/* 4. Tagline & Description */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Ads Free · 4K Ultra HD"
                    value={editingProduct.tagline}
                    onChange={(e) =>
                      setEditingProduct((prev) => (prev ? { ...prev, tagline: e.target.value } : null))
                    }
                    className="storefront-field w-full px-3 py-2 text-xs bg-background border border-input text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Full Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe account features, streaming quality, etc."
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct((prev) => (prev ? { ...prev, description: e.target.value } : null))
                    }
                    className="storefront-field w-full px-3 py-2 text-xs bg-background border border-input text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                {/* 5. Delivery & Devices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Delivery Method</label>
                    <input
                      type="text"
                      placeholder="e.g. On Your Number, On Your Email, Login Details"
                      value={editingProduct.deliveryType}
                      onChange={(e) =>
                        setEditingProduct((prev) => (prev ? { ...prev, deliveryType: e.target.value } : null))
                      }
                      className="storefront-field w-full px-3 py-2 text-xs bg-background border border-input text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Supported Devices</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Device, 5 Devices simultaneously"
                      value={editingProduct.devices}
                      onChange={(e) =>
                        setEditingProduct((prev) => (prev ? { ...prev, devices: e.target.value } : null))
                      }
                      className="storefront-field w-full px-3 py-2 text-xs bg-background border border-input text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* 6. Pricing Plan Tiers */}
                <div className="bg-secondary/40 border border-border rounded-2xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Subscription Plan Tiers *</h4>
                      <p className="text-[10px] text-muted-foreground">Add at least 1 plan (e.g. 1 Month: ₹99)</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct((prev) =>
                          prev
                            ? {
                                ...prev,
                                plans: [
                                  ...prev.plans,
                                  {
                                    id: 'p-' + Date.now().toString(36),
                                    duration: '1 Month',
                                    price: 99,
                                    originalPrice: 299,
                                  },
                                ],
                              }
                            : null
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Plan</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingProduct.plans.map((plan, pIdx) => (
                      <div
                        key={plan.id}
                        className="flex items-center gap-2 bg-card p-2 rounded-xl border border-border"
                      >
                        <input
                          type="text"
                          required
                          placeholder="Duration (e.g. 3 Months)"
                          value={plan.duration}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingProduct((prev) => {
                              if (!prev) return null;
                              const plans = [...prev.plans];
                              plans[pIdx].duration = val;
                              return { ...prev, plans };
                            });
                          }}
                          className="storefront-field flex-1 px-2.5 py-1.5 text-xs bg-background border border-input text-foreground"
                        />
                        <div className="w-20">
                          <input
                            type="number"
                            required
                            placeholder="Price ₹"
                            value={plan.price}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setEditingProduct((prev) => {
                                if (!prev) return null;
                                const plans = [...prev.plans];
                                plans[pIdx].price = val;
                                return { ...prev, plans };
                              });
                            }}
                            className="storefront-field w-full px-2 py-1.5 text-xs bg-background border border-input text-foreground font-mono font-bold"
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            placeholder="MRP ₹"
                            value={plan.originalPrice}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setEditingProduct((prev) => {
                                if (!prev) return null;
                                const plans = [...prev.plans];
                                plans[pIdx].originalPrice = val;
                                return { ...prev, plans };
                              });
                            }}
                            className="storefront-field w-full px-2 py-1.5 text-xs bg-background border border-input text-muted-foreground font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct((prev) => {
                              if (!prev) return null;
                              return {
                                ...prev,
                                plans: prev.plans.filter((_, idx) => idx !== pIdx),
                              };
                            });
                          }}
                          className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer"
                          title="Delete plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/25 hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Product</span>
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            {activeSection === 'orders' ? `Total Orders: ${orders.length}` : `Catalog Products: ${products.length}`}
          </span>
          <span>
            Shortcut: <code className="bg-secondary px-1 py-0.5 rounded text-foreground font-mono">Shift + A</code> or visit <code className="bg-secondary px-1 py-0.5 rounded text-foreground font-mono">#admin</code>
          </span>
        </div>

      </div>
    </div>
  );
};
