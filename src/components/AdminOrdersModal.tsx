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
  Lock,
  User,
  Eye,
  EyeOff,
  LogOut,
  KeyRound,
  Gift,
  Wallet,
} from 'lucide-react';
import {
  fetchAllOrdersForAdmin,
  updateOrderStatus,
  DbOrder,
  fetchAdminCredentialsFromCloud,
  saveAdminCredentialsToCloud,
  creditReferralBonus,
  fetchAllWalletsForAdmin,
  WalletData,
  supabase,
} from '../lib/supabase';
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

  // ───────── AUTHENTICATION & SECURITY STATE ─────────
  const getAdminCredentials = () => {
    try {
      const saved = localStorage.getItem('subnest_admin_creds');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id && parsed.password) return parsed;
      }
    } catch {}
    return {
      id: (import.meta as any).env?.VITE_ADMIN_USER || 'admin',
      password: (import.meta as any).env?.VITE_ADMIN_PASS || 'subnest@2026',
    };
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('subnest_admin_session');
      if (session) {
        try {
          const parsed = JSON.parse(session);
          if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
            return true;
          }
        } catch {}
      }
    }
    return false;
  });

  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [authError, setAuthError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  // Security Credentials form
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [credSaveMsg, setCredSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingCreds, setIsSavingCreds] = useState(false);

  // Synchronize credentials with Supabase Cloud across all devices
  useEffect(() => {
    // 1. If this device has customized credentials in localStorage, sync them to cloud
    const saved = localStorage.getItem('subnest_admin_creds');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id && parsed.password) {
          saveAdminCredentialsToCloud(parsed.id, parsed.password);
        }
      } catch {}
    }

    // 2. Fetch latest credentials from cloud and update local cache
    fetchAdminCredentialsFromCloud().then((cloudCreds) => {
      if (cloudCreds && cloudCreds.id && cloudCreds.password) {
        localStorage.setItem('subnest_admin_creds', JSON.stringify(cloudCreds));
      }
    });
  }, []);

  // Handle Login with Cloud Sync & Brute-force Protection
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      // Check lock
      try {
        const lockData = JSON.parse(localStorage.getItem('subnest_auth_lock') || '{}');
        if (lockData.lockedUntil && Date.now() < lockData.lockedUntil) {
          const remainingMinutes = Math.ceil((lockData.lockedUntil - Date.now()) / 60000);
          setAuthError(`Too many failed attempts. Login locked for ${remainingMinutes} more minute(s).`);
          setIsVerifying(false);
          return;
        }
      } catch {}

      let creds = getAdminCredentials();
      const cleanId = loginId.trim().toLowerCase();
      let cleanExpectedId = creds.id.trim().toLowerCase();

      // Check ID (also accept 'admin', 'naman', 'subnest' for standard setups)
      let isIdValid =
        cleanId === cleanExpectedId ||
        (cleanExpectedId === 'admin' && (cleanId === 'naman' || cleanId === 'subnest'));

      let isPassValid = loginPass === creds.password;

      // If local credentials check fails, immediately verify with Supabase Cloud
      // (in case the password was changed from another device!)
      if (!isIdValid || !isPassValid) {
        try {
          const cloudCreds = await fetchAdminCredentialsFromCloud();
          if (cloudCreds && cloudCreds.id && cloudCreds.password) {
            creds = cloudCreds;
            cleanExpectedId = cloudCreds.id.trim().toLowerCase();
            isIdValid =
              cleanId === cleanExpectedId ||
              (cleanExpectedId === 'admin' && (cleanId === 'naman' || cleanId === 'subnest'));
            isPassValid = loginPass === cloudCreds.password;

            if (isIdValid && isPassValid) {
              // Update local storage with the cloud credentials
              localStorage.setItem('subnest_admin_creds', JSON.stringify(cloudCreds));
            }
          }
        } catch {}
      }

      if (isIdValid && isPassValid) {
        setIsAuthenticated(true);
        setAuthError('');
        localStorage.removeItem('subnest_auth_lock');
        const expiresAt = rememberMe
          ? Date.now() + 14 * 24 * 60 * 60 * 1000 // 14 days
          : Date.now() + 8 * 60 * 60 * 1000; // 8 hours
        localStorage.setItem(
          'subnest_admin_session',
          JSON.stringify({ user: cleanId, loggedAt: Date.now(), expiresAt })
        );
      } else {
        // Record failed attempt
        let attempts = 1;
        try {
          const lockData = JSON.parse(localStorage.getItem('subnest_auth_lock') || '{}');
          attempts = (lockData.attempts || 0) + 1;
          if (attempts >= 5) {
            const lockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins lock
            localStorage.setItem('subnest_auth_lock', JSON.stringify({ attempts, lockedUntil }));
            setAuthError('Too many failed attempts. Login locked for 15 minutes.');
            setIsVerifying(false);
            return;
          }
          localStorage.setItem('subnest_auth_lock', JSON.stringify({ attempts }));
        } catch {}

        const remaining = 5 - attempts;
        setAuthError(`Incorrect Admin ID or Password. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('subnest_admin_session');
    setIsAuthenticated(false);
    setLoginPass('');
    setAuthError('');
  };

  // Handle Saving New Credentials (synced to cloud for all devices)
  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredSaveMsg(null);

    if (!newAdminId.trim()) {
      setCredSaveMsg({ type: 'error', text: 'Admin ID cannot be empty.' });
      return;
    }
    if (newAdminPass.length < 4) {
      setCredSaveMsg({ type: 'error', text: 'Password must be at least 4 characters long.' });
      return;
    }
    if (newAdminPass !== confirmAdminPass) {
      setCredSaveMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsSavingCreds(true);
    try {
      const cleanId = newAdminId.trim();
      // 1. Save locally
      localStorage.setItem(
        'subnest_admin_creds',
        JSON.stringify({ id: cleanId, password: newAdminPass })
      );

      // 2. Sync to Supabase cloud for all other devices
      const cloudSuccess = await saveAdminCredentialsToCloud(cleanId, newAdminPass);

      setCredSaveMsg({
        type: 'success',
        text: cloudSuccess
          ? 'Admin ID & Password updated and synced across all devices!'
          : 'Admin ID & Password updated locally!',
      });
      setNewAdminPass('');
      setConfirmAdminPass('');
    } finally {
      setIsSavingCreds(false);
    }
  };

  // Reset Credentials to default
  const handleResetCredentials = async () => {
    if (window.confirm('Reset credentials to default: (admin / subnest@2026)?')) {
      localStorage.removeItem('subnest_admin_creds');
      await saveAdminCredentialsToCloud('admin', 'subnest@2026');
      setCredSaveMsg({ type: 'success', text: 'Credentials reset to default (admin / subnest@2026) across all devices.' });
      setNewAdminId('');
      setNewAdminPass('');
      setConfirmAdminPass('');
    }
  };

  // Emergency Unlock Lockout
  const handleEmergencyUnlock = () => {
    localStorage.removeItem('subnest_auth_lock');
    setAuthError('');
  };

  // Active admin section: 'orders' | 'products' | 'referrals' | 'security'
  const [activeSection, setActiveSection] = useState<'orders' | 'products' | 'referrals' | 'security'>('orders');

  // Orders state
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderTab, setOrderTab] = useState<'all' | 'pending' | 'delivered'>('all');

  // Wallets & Referrals state
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loadingWallets, setLoadingWallets] = useState(false);

  // Products state
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState<string>('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Load orders safely
  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const cloudOrders = await fetchAllOrdersForAdmin();
      let local: any[] = [];
      try {
        const saved =
          localStorage.getItem('subnest_orders') ||
          localStorage.getItem('nexora_orders');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) local = parsed;
        }
      } catch (err) {
        console.warn('Local orders parse error:', err);
      }

      const mappedLocal: DbOrder[] = local.map((l: any) => ({
        order_id: l.orderId || 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        product_name: l.itemName || 'Subscription',
        amount: Number(l.amount) || 0,
        customer_name: l.fullName || 'Customer',
        customer_phone: l.phone || '',
        customer_email: l.email || '',
        utr_number: l.utrNumber || 'N/A',
        status: (l.status || '').toLowerCase().includes('deliver')
          ? 'credentials_sent'
          : (l.status || '').toLowerCase().includes('verif')
          ? 'verified'
          : 'pending_verification',
        created_at: l.date || new Date().toISOString(),
        credentials_note: l.referralCode ? JSON.stringify({ referral_code: l.referralCode, referral_discount: 20 }) : '',
      }));

      const merged = [...(cloudOrders || [])];
      for (const loc of mappedLocal) {
        if (!merged.some((o) => o.order_id === loc.order_id)) {
          merged.push(loc);
        }
      }

      setOrders(merged);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadWallets = async () => {
    setLoadingWallets(true);
    try {
      const res = await fetchAllWalletsForAdmin();
      setWallets(res);
    } catch (err) {
      console.warn('Error loading wallets:', err);
    } finally {
      setLoadingWallets(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      loadWallets();
    }
  }, [isAuthenticated]);

  const handleStatusChange = async (orderId: string, newStatus: DbOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
    );
    await updateOrderStatus(orderId, newStatus);

    // If verified or credentials sent: automatically credit ₹20 to Referrer's wallet
    if (newStatus === 'verified' || newStatus === 'credentials_sent') {
      const order = orders.find((o) => o.order_id === orderId);
      if (order && order.credentials_note) {
        try {
          const meta = JSON.parse(order.credentials_note);
          if (meta.referral_code && !meta.reward_credited) {
            const ok = await creditReferralBonus(meta.referral_code, order.customer_phone, orderId, 20);
            if (ok) {
              meta.reward_credited = true;
              const updatedNote = JSON.stringify(meta);
              await supabase.from('orders').update({ credentials_note: updatedNote }).eq('order_id', orderId);
              setOrders((prev) =>
                prev.map((o) => (o.order_id === orderId ? { ...o, credentials_note: updatedNote } : o))
              );
              loadWallets();
            }
          }
        } catch {}
      }
    }
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

  // ───────── UN-AUTHENTICATED: LOGIN SCREEN ─────────
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <div onClick={onClose} className="fixed inset-0 bg-background/90 backdrop-blur-md" />

        {/* Login Dialog Card */}
        <div className="relative bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 flex flex-col items-center">
          
          {/* Top Close Button */}
          <div className="w-full flex justify-end">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Close and Return to Storefront"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Logo Badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center p-2 mb-3 shadow-lg shadow-violet-500/10">
            <img
              src="/assets/subnest-logo.png"
              alt="Subnest"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(124,58,237,0.3)]"
            />
          </div>

          <h3 className="text-xl font-black tracking-tight text-foreground text-center">
            Subnest Admin Access
          </h3>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Restricted area. Enter your ID & Password to manage orders and catalog.
          </p>

          {/* Error Alert with Emergency Unlock */}
          {authError && (
            <div className="w-full mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
              {authError.includes('locked') && (
                <div className="pt-1 border-t border-destructive/20 flex justify-end">
                  <button
                    type="button"
                    onClick={handleEmergencyUnlock}
                    className="text-[11px] underline font-semibold text-destructive hover:opacity-80 cursor-pointer"
                  >
                    Unlock now & retry
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="w-full mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Admin ID / Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="admin"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="storefront-field w-full pl-10 pr-3 py-2.5 text-xs bg-background border border-input text-foreground focus:outline-none focus:border-primary rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="storefront-field w-full pl-10 pr-10 py-2.5 text-xs bg-background border border-input text-foreground focus:outline-none focus:border-primary rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border accent-primary w-3.5 h-3.5"
                />
                <span>Remember me for 14 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Login to Admin Workspace</span>
                </>
              )}
            </button>
          </form>

          {/* Cancel & Back to Storefront */}
          <div className="w-full mt-5 pt-3 border-t border-border/60 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              ← Cancel & Back to Storefront
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ───────── AUTHENTICATED: ADMIN WORKSPACE ─────────
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
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
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">Subnest Admin Workspace</h2>
                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Authorized
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Manage Live Orders, Products & Security</p>
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
              onClick={handleLogout}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
              title="Log Out of Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Close Admin Panel"
            >
              <span className="hidden xs:inline">Exit Admin</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs: Orders vs Products vs Security */}
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

            <button
              onClick={() => {
                setActiveSection('referrals');
                loadWallets();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeSection === 'referrals'
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                  : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Referrals & Wallets ({wallets.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('security')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeSection === 'security'
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                  : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Security & Password</span>
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
                filteredOrders.map((order) => {
                  let refMeta: any = null;
                  try {
                    if (order.credentials_note) {
                      const p = JSON.parse(order.credentials_note);
                      if (p.referral_code) refMeta = p;
                    }
                  } catch {}

                  return (
                    <div
                      key={order.order_id}
                      className="p-4 rounded-2xl bg-secondary/30 border border-border hover:border-primary/40 transition-colors space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary">{order.order_id}</span>
                          <span className="text-xs font-semibold text-foreground">{order.product_name}</span>
                          {refMeta && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium">
                              <Gift className="w-3 h-3" />
                              <span>Ref: {refMeta.referral_code} (-₹{refMeta.referral_discount || 20})</span>
                              {refMeta.reward_credited && (
                                <span className="text-emerald-400 font-bold ml-1">✓ Rewarded</span>
                              )}
                            </span>
                          )}
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
                );
              })
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

        {/* ───────── TAB 3: REFERRALS & WALLETS (MODEL 1) ───────── */}
        {activeSection === 'referrals' && (
          <div className="flex-1 flex flex-col min-h-0 pt-3 space-y-3">
            {/* Header & Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Active Wallets</span>
                <p className="text-lg font-black text-foreground">{wallets.length}</p>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Bonus Earned</span>
                <p className="text-lg font-black text-primary">
                  ₹{wallets.reduce((acc, w) => acc + (w.totalEarned || 0), 0)}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Outstanding Credits</span>
                <p className="text-lg font-black text-emerald-400">
                  ₹{wallets.reduce((acc, w) => acc + (w.availableBalance || 0), 0)}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Verified Referrals</span>
                <p className="text-lg font-black text-violet-400">
                  {wallets.reduce((acc, w) => acc + (w.referrals?.length || 0), 0)}
                </p>
              </div>
            </div>

            {/* Wallets List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div className="flex items-center justify-between pb-1">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-primary" />
                  <span>Subnest Member Wallets (Dual ₹20 Model)</span>
                </h4>
                <button
                  onClick={loadWallets}
                  className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingWallets ? 'animate-spin' : ''}`} />
                  <span>Refresh Wallets</span>
                </button>
              </div>

              {loadingWallets && wallets.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">
                  <RefreshCw className="w-4 h-4 animate-spin text-primary mr-2" />
                  Loading member wallets from Supabase...
                </div>
              ) : wallets.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-secondary/20 border border-border">
                  <Gift className="w-8 h-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm font-semibold text-foreground">No referral wallets yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    Jab koi customer apna WhatsApp number daalkar referral link share karega aur unka dost order karega, wo yahan show hoga.
                  </p>
                </div>
              ) : (
                wallets.map((w) => (
                  <div
                    key={w.phone}
                    className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold text-foreground">
                            +91 {w.phone}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-2">
                            ({w.referrals?.length || 0} friends referred)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-muted-foreground mr-1">Available:</span>
                          <span className="font-mono font-black text-emerald-400">₹{w.availableBalance}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground mr-1">Earned:</span>
                          <span className="font-mono font-bold text-primary">₹{w.totalEarned}</span>
                        </div>
                        <a
                          href={`https://wa.me/91${w.phone}?text=Hello%20Subnest%20VIP,%20you%20have%20Rs.${w.availableBalance}%20in%20your%20Subnest%20Wallet!`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-600/20 cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Chat</span>
                        </a>
                      </div>
                    </div>

                    {w.referrals && w.referrals.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Referred Orders:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {w.referrals.map((r, i) => (
                            <div
                              key={i}
                              className="p-2 rounded-xl bg-background/60 border border-border text-[11px] flex items-center justify-between"
                            >
                              <span className="font-mono text-muted-foreground">
                                {r.orderId} ({r.friendPhone})
                              </span>
                              <span className="font-bold text-emerald-400">+₹{r.bonus} Credited</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ───────── TAB 4: SECURITY & PASSWORD SETTINGS ───────── */}
        {activeSection === 'security' && (
          <div className="flex-1 overflow-y-auto pt-4 max-w-lg mx-auto w-full space-y-5 pr-1">
            <div className="p-5 rounded-2xl bg-secondary/40 border border-border space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Admin Login Credentials</h3>
                  <p className="text-xs text-muted-foreground">Change your Admin ID and Password</p>
                </div>
              </div>

              {credSaveMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    credSaveMsg.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-destructive/10 border border-destructive/30 text-destructive'
                  }`}
                >
                  {credSaveMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>{credSaveMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveCredentials} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    New Admin ID / Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. admin or naman"
                    value={newAdminId}
                    onChange={(e) => setNewAdminId(e.target.value)}
                    className="storefront-field w-full px-3 py-2 text-xs bg-background border border-input text-foreground rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="At least 4 characters"
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    className="storefront-field w-full px-3 py-2 text-xs bg-background border border-input text-foreground rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={confirmAdminPass}
                    onChange={(e) => setConfirmAdminPass(e.target.value)}
                    className="storefront-field w-full px-3 py-2 text-xs bg-background border border-input text-foreground rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleResetCredentials}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    Reset to Default
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingCreds}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSavingCreds && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSavingCreds ? 'Syncing to Cloud...' : 'Save & Sync to Cloud'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/20 border border-border text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Session Security</span>
              </p>
              <p>
                Your active session is remembered for 14 days on this browser. When you are done managing orders from a shared computer or mobile device, always click <strong className="text-foreground">Logout</strong>.
              </p>
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
