import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory, OrderStatus, DeliveryAgent } from '../types';
import { buildAgentDeliveryWhatsApp } from '../utils/notifications';
import {
  ShieldAlert,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Lock,
  LogOut,
  CheckCircle,
  Clock,
  Truck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  X,
  Upload,
  Image as ImageIcon,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Copy,
  Check,
  UserCheck,
  QrCode
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    orders,
    updateOrderStatus,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    setActivePage,
    setShowNetlifyGuide,
    notifications,
    ownerConfig,
    updateOwnerConfig,
    sendTestNotification,
    deliveryAgents,
    addDeliveryAgent,
    updateDeliveryAgent,
    deleteDeliveryAgent,
    assignAgentToOrder,
    showToast
  } = useStore();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('homelander69.brrbrrpatapim@gmail.com');
  const [loginPass, setLoginPass] = useState('Sangms@Admin2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin tabs: 'overview' | 'products' | 'orders' | 'agents' | 'alerts' | 'security'
  const [currentTab, setCurrentTab] = useState<'overview' | 'products' | 'orders' | 'agents' | 'alerts' | 'security'>('overview');
  const [copiedNotifId, setCopiedNotifId] = useState<string | null>(null);
  const [editPhone, setEditPhone] = useState(ownerConfig.ownerPhone);
  const [editEmail, setEditEmail] = useState(ownerConfig.ownerEmail);
  const [editUpiVpa, setEditUpiVpa] = useState(ownerConfig.upiVpa || '9799896438@upi');
  const [isEditingConfig, setIsEditingConfig] = useState(false);

  // Agent Modal State (Add or Edit Delivery Agent)
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [agentForm, setAgentForm] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'Motorcycle' as DeliveryAgent['vehicleType'],
    vehicleNumber: '',
    serviceArea: 'Todinagar & Station Road, Sikar',
    status: 'Active' as DeliveryAgent['status']
  });

  const handleOpenAddAgent = () => {
    setEditingAgentId(null);
    setAgentForm({
      name: '',
      phone: '',
      email: '',
      vehicleType: 'Motorcycle',
      vehicleNumber: '',
      serviceArea: 'Todinagar & Station Road, Sikar',
      status: 'Active'
    });
    setIsAgentModalOpen(true);
  };

  const handleOpenEditAgent = (agent: DeliveryAgent) => {
    setEditingAgentId(agent.id);
    setAgentForm({
      name: agent.name,
      phone: agent.phone,
      email: agent.email,
      vehicleType: agent.vehicleType,
      vehicleNumber: agent.vehicleNumber || '',
      serviceArea: agent.serviceArea,
      status: agent.status
    });
    setIsAgentModalOpen(true);
  };

  const handleSaveAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentForm.name.trim() || !agentForm.phone.trim()) return;

    if (editingAgentId) {
      updateDeliveryAgent(editingAgentId, {
        name: agentForm.name.trim(),
        phone: agentForm.phone.trim(),
        email: agentForm.email.trim(),
        vehicleType: agentForm.vehicleType,
        vehicleNumber: agentForm.vehicleNumber.trim(),
        serviceArea: agentForm.serviceArea.trim(),
        status: agentForm.status
      });
    } else {
      addDeliveryAgent({
        name: agentForm.name.trim(),
        phone: agentForm.phone.trim(),
        email: agentForm.email.trim() || `${agentForm.name.toLowerCase().replace(/\s+/g, '')}@sangms.in`,
        vehicleType: agentForm.vehicleType,
        vehicleNumber: agentForm.vehicleNumber.trim() || 'RJ 23 SB ' + Math.floor(1000 + Math.random() * 9000),
        serviceArea: agentForm.serviceArea.trim(),
        status: agentForm.status
      });
    }
    setIsAgentModalOpen(false);
  };

  // Product Modal State (Add or Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: "Women's Dresses" as ProductCategory,
    price: 2499,
    originalPrice: 3299,
    discountPercent: 24,
    description: '',
    image: '/src/assets/images/womens_collection_editorial_1794323733103.jpg',
    stock: 20,
    gender: 'Women' as 'Women' | 'Ladies' | 'Girls',
    sizes: 'XS, S, M, L',
    colors: 'Beige:#D7C7B0, Noir:#111111'
  });

  // Filter states for Admin
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'All'>('All');
  const [productSearch, setProductSearch] = useState('');

  const adminFileInputRef = useRef<HTMLInputElement>(null);
  const [showAdminUrlInput, setShowAdminUrlInput] = useState(false);

  const handleAdminFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProductForm(prev => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculations for overview
  const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'Cancelled' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter(p => p.stock < 10);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const success = adminLogin(loginEmail, loginPass);
    if (!success) {
      setLoginError('Invalid credentials. Please enter: homelander69.brrbrrpatapim@gmail.com / Sangms@Admin2026');
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: "Women's Dresses",
      price: 2499,
      originalPrice: 3299,
      discountPercent: 24,
      description: 'Crafted with premium natural fibers and tailored finish in Todinagar, Sikar.',
      image: '/src/assets/images/womens_collection_editorial_1794323733103.jpg',
      stock: 25,
      gender: 'Women',
      sizes: 'XS, S, M, L',
      colors: 'Golden Sand:#D7C7B0, Noir:#111111'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      discountPercent: prod.discountPercent || 0,
      description: prod.description,
      image: prod.image,
      stock: prod.stock,
      gender: prod.gender,
      sizes: prod.availableSizes.join(', '),
      colors: prod.availableColors.map(c => `${c.name}:${c.hex}`).join(', ')
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    // Parse sizes
    const parsedSizes = productForm.sizes
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Parse colors
    const parsedColors = productForm.colors
      .split(',')
      .map(pair => {
        const [cName, cHex] = pair.split(':').map(s => s.trim());
        return { name: cName || 'Default', hex: cHex || '#111111' };
      })
      .filter(c => c.name);

    const discountVal =
      productForm.originalPrice > productForm.price
        ? Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100)
        : 0;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        discountPercent: discountVal,
        description: productForm.description,
        image: productForm.image,
        stock: Number(productForm.stock),
        gender: productForm.gender,
        availableSizes: parsedSizes.length > 0 ? parsedSizes : ['M', 'L'],
        availableColors: parsedColors.length > 0 ? parsedColors : [{ name: 'Default', hex: '#111111' }]
      });
    } else {
      addProduct({
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        discountPercent: discountVal,
        description: productForm.description,
        image: productForm.image,
        stock: Number(productForm.stock),
        gender: productForm.gender,
        availableSizes: parsedSizes.length > 0 ? parsedSizes : ['M', 'L'],
        availableColors: parsedColors.length > 0 ? parsedColors : [{ name: 'Default', hex: '#111111' }],
        features: ['Premium tailored fit', 'Ethically sourced in Rajasthan', 'Preshrunk fabric'],
        isNewArrival: true
      });
    }

    setIsProductModalOpen(false);
  };

  // If not logged in, show administrator login screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-[#FDFBF7]">
        <div className="w-full max-w-md bg-white border border-[#E5DECF] p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#171717] text-white flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase tracking-widest text-[#8E877D] font-bold">
              SANGM'S PORTAL
            </span>
            <h2 className="text-2xl font-bold font-heading text-[#121212]">
              Store Administrator Login
            </h2>
            <p className="text-xs text-[#737373]">
              Manage products, inspect stock in Sikar hub, handle customer orders, and dispatch delivery agents.
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-[#FFFDF5] border border-[#E8DEC8] p-3.5 text-xs text-[#786438] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#4F3F19]">
              <ShieldAlert className="w-4 h-4 text-[#C5A880]" />
              <span>Sikar Hub Admin Session</span>
            </div>
            <p className="leading-relaxed">
              Authorized portal for SANGM'S Women's Boutique management. Authenticate with registered administrator credentials.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#262626] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CDBD] text-xs px-3.5 py-2.5 outline-none focus:border-[#121212] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#262626] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CDBD] text-xs px-3.5 py-2.5 outline-none focus:border-[#121212] font-mono"
              />
              <span className="text-[10px] text-[#888888] mt-1 block">
                Store default: <code>homelander69.brrbrrpatapim@gmail.com</code> / <code>Sangms@Admin2026</code>
              </span>
            </div>

            {loginError && <p className="text-xs text-rose-600 font-medium">{loginError}</p>}

            <button
              type="submit"
              className="w-full bg-[#121212] hover:bg-[#2B2B2B] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              Sign In to Administrator Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#737373]">
            <button
              onClick={() => setActivePage('home')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              ← Back to Storefront
            </button>
            <button
              onClick={() => setShowNetlifyGuide(true)}
              className="text-[#8C6D44] hover:underline cursor-pointer"
            >
              Netlify Guide
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Bar for Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D5]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8E877D] font-bold mb-1">
              <span>SANGM'S CONTROL PANEL</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                Sikar Hub Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121212] font-heading">
              Store Administrator Dashboard
            </h1>
            <p className="text-xs text-[#737373] mt-1">
              Todinagar Hub, Sikar, Rajasthan · Real-time LocalStorage Synchronization
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('catalog')}
              className="text-xs font-semibold px-4 py-2 border border-[#D5CDBD] bg-white hover:bg-[#FAF8F5] text-[#121212] cursor-pointer"
            >
              View Live Storefront
            </button>
            <button
              onClick={adminLogout}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E2D5] overflow-x-auto pb-px">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
              currentTab === 'overview'
                ? 'border-b-2 border-[#121212] text-[#121212]'
                : 'text-[#737373] hover:text-black'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setCurrentTab('products')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
              currentTab === 'products'
                ? 'border-b-2 border-[#121212] text-[#121212]'
                : 'text-[#737373] hover:text-black'
            }`}
          >
            Product Management ({products.length})
          </button>
          <button
            onClick={() => setCurrentTab('orders')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
              currentTab === 'orders'
                ? 'border-b-2 border-[#121212] text-[#121212]'
                : 'text-[#737373] hover:text-black'
            }`}
          >
            Orders & Shipping ({orders.length})
          </button>
          <button
            onClick={() => setCurrentTab('agents')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'agents'
                ? 'border-b-2 border-[#121212] text-[#121212]'
                : 'text-[#737373] hover:text-black'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Agent Management ({deliveryAgents.length})</span>
          </button>
          <button
            onClick={() => setCurrentTab('alerts')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'alerts'
                ? 'border-b-2 border-[#121212] text-[#121212]'
                : 'text-[#737373] hover:text-black'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>SMS & Email Alerts ({notifications.length})</span>
          </button>
          <button
            onClick={() => setCurrentTab('security')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
              currentTab === 'security'
                ? 'border-b-2 border-[#121212] text-[#121212]'
                : 'text-[#737373] hover:text-black'
            }`}
          >
            Production Security Guide
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {currentTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 border border-[#E5DECF] shadow-xs">
                <div className="flex items-center justify-between text-[#8E877D] text-xs mb-2">
                  <span className="uppercase tracking-wider font-semibold">Total Revenue</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#121212] tabular-nums">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#737373] mt-1">From confirmed orders in ₹ INR</div>
              </div>

              <div className="bg-white p-6 border border-[#E5DECF] shadow-xs">
                <div className="flex items-center justify-between text-[#8E877D] text-xs mb-2">
                  <span className="uppercase tracking-wider font-semibold">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#8C6D44]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#121212] tabular-nums">
                  {totalOrdersCount}
                </div>
                <div className="text-[11px] text-[#737373] mt-1">
                  {orders.filter(o => o.orderStatus === 'Delivered').length} Delivered · {orders.filter(o => o.orderStatus === 'Processing' || o.orderStatus === 'Shipped').length} In Transit
                </div>
              </div>

              <div className="bg-white p-6 border border-[#E5DECF] shadow-xs">
                <div className="flex items-center justify-between text-[#8E877D] text-xs mb-2">
                  <span className="uppercase tracking-wider font-semibold">Active Products</span>
                  <Package className="w-4 h-4 text-[#121212]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#121212] tabular-nums">
                  {products.length}
                </div>
                <div className="text-[11px] text-[#737373] mt-1">Across {categories.length} categories</div>
              </div>

              <div className="bg-white p-6 border border-[#E5DECF] shadow-xs">
                <div className="flex items-center justify-between text-[#8E877D] text-xs mb-2">
                  <span className="uppercase tracking-wider font-semibold">Low Stock Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#121212] tabular-nums">
                  {lowStockProducts.length}
                </div>
                <div className="text-[11px] text-amber-700 mt-1">Items below 10 units in Sikar</div>
              </div>

            </div>

            {/* Quick Actions & Recent Orders Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Recent Orders (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 border border-[#E5DECF] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                  <h3 className="text-base font-bold text-[#121212] font-heading">
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setCurrentTab('orders')}
                    className="text-xs font-semibold text-[#8C6D44] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-[#F0EAE1] overflow-x-auto">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#121212]">{order.id}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-semibold ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : order.orderStatus === 'Shipped'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="text-[#737373] mt-0.5">
                          {order.customer.fullName} · {order.customer.city}, {order.customer.state}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-[#121212] text-sm tabular-nums">
                          ₹{order.total.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-[#888888]">
                          {order.paymentMethod.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Watchlist & Presets (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 border border-[#E5DECF] shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-[#121212] font-heading border-b border-[#F0EAE1] pb-3">
                    Inventory Replenishment Watch
                  </h3>
                  {lowStockProducts.length === 0 ? (
                    <p className="text-xs text-emerald-700">All products have healthy stock levels (&ge; 10 units).</p>
                  ) : (
                    <div className="space-y-3">
                      {lowStockProducts.map((p) => (
                        <div key={p.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img src={p.image} alt={p.name} className="w-9 h-11 object-cover bg-[#F5F2EB] border" />
                            <div>
                              <div className="font-semibold text-[#121212] line-clamp-1">{p.name}</div>
                              <div className="text-[11px] text-[#888888]">{p.category}</div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                            {p.stock} left
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-[#FAF8F5] p-5 border border-[#E8E2D5] space-y-3">
                  <h4 className="text-xs font-bold text-[#121212] uppercase tracking-wider">
                    Quick Catalogue Utilities
                  </h4>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleOpenAddProduct}
                      className="w-full bg-[#121212] hover:bg-[#2B2B2B] text-white py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Garment</span>
                    </button>
                    <button
                      onClick={resetProductsToDefault}
                      className="w-full bg-white hover:bg-[#F2ECE1] text-[#121212] border border-[#D5CDBD] py-2 px-4 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Default Catalog</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {currentTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-[#E5DECF]">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#888888]" />
                <input
                  type="text"
                  placeholder="Filter products by name or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs bg-transparent outline-none text-[#121212]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-[#121212] hover:bg-[#2B2B2B] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-[#E5DECF] overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E5DECF] text-[#737373] uppercase font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price (₹)</th>
                    <th className="py-3.5 px-4">Original (₹)</th>
                    <th className="py-3.5 px-4">Stock Units</th>
                    <th className="py-3.5 px-4">Sizes</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1]">
                  {products
                    .filter(p => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase()))
                    .map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-12 object-cover bg-[#F5F2EB] border border-[#E5DECF] shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-semibold text-[#121212] line-clamp-1">{prod.name}</div>
                            <div className="text-[10px] text-[#888888]">{prod.gender}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#555555] font-medium">{prod.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#121212] tabular-nums">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#888888] tabular-nums">
                          {prod.originalPrice ? `₹${prod.originalPrice.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 font-mono font-semibold text-[11px] ${
                            prod.stock < 10
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {prod.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[#555555]">
                          {prod.availableSizes.join(', ')}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 text-[#555555] hover:text-black border border-transparent hover:border-[#CCCCCC] transition-colors cursor-pointer"
                            title="Edit details & price"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 border border-transparent hover:border-rose-300 transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {currentTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-[#E5DECF]">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-[#737373] font-medium mr-1">Filter Status:</span>
                {(['All', 'Confirmed', 'Processing', 'Out for Delivery', 'Shipped', 'Delivered', 'Cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      orderFilter === st
                        ? 'bg-[#121212] text-white'
                        : 'bg-[#FAF8F5] text-[#555555] border border-[#DDD3C2] hover:border-black'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#737373] font-mono">
                Showing {orders.filter(o => orderFilter === 'All' || o.orderStatus === orderFilter).length} orders
              </div>
            </div>

            {/* Orders List Cards */}
            <div className="space-y-4">
              {orders
                .filter(o => orderFilter === 'All' || o.orderStatus === orderFilter)
                .map((order) => (
                  <div key={order.id} className="bg-white border border-[#E5DECF] p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EAE1] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-[#121212]">{order.id}</span>
                        <span className={`px-2.5 py-0.5 text-xs font-semibold ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {order.orderStatus}
                        </span>
                        <span className="text-[11px] text-[#888888]">
                          {new Date(order.createdAt).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Status Update Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#737373]">Update Status:</span>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-[#FAF8F5] border border-[#D5CDBD] text-xs px-2.5 py-1 font-semibold text-[#121212] outline-none cursor-pointer"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#404040]">
                      <div>
                        <span className="font-semibold text-black block mb-1">Customer & Contact</span>
                        <p className="font-medium text-[#121212]">{order.customer.fullName}</p>
                        <p>Phone: +91 {order.customer.phone}</p>
                        <p>{order.customer.email}</p>
                      </div>

                      <div>
                        <span className="font-semibold text-black block mb-1">Delivery Destination</span>
                        <p>{order.customer.addressLine}</p>
                        <p>{order.customer.city}, {order.customer.state} — {order.customer.pinCode}</p>
                        <p className="font-mono text-[#8C6D44] mt-1">Tracking: {order.trackingNumber || 'Awaiting dispatch'}</p>
                      </div>

                      <div className="md:text-right space-y-1">
                        <span className="font-semibold text-black block mb-1">Billing Summary</span>
                        <p>Payment: <strong className="text-black">{order.paymentMethod}</strong></p>
                        <div className="text-xs">
                          {order.paymentMethod === 'Cash on Delivery (COD)' ? (
                            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200 font-semibold text-[11px] inline-block">
                              Collect ₹{order.total.toLocaleString('en-IN')} Cash
                            </span>
                          ) : (
                            <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-semibold text-[11px] inline-block">
                              Prepaid (Payment Received)
                            </span>
                          )}
                        </div>
                        {order.paymentDetails?.utrNumber && (
                          <p className="font-mono text-[10px] text-[#555]">UTR: {order.paymentDetails.utrNumber}</p>
                        )}
                        {order.paymentDetails?.cardBrand && (
                          <p className="font-mono text-[10px] text-[#555]">{order.paymentDetails.cardBrand} •••• {order.paymentDetails.cardLast4}</p>
                        )}
                        {order.paymentDetails?.bankName && (
                          <p className="text-[10px] text-[#555]">{order.paymentDetails.bankName}</p>
                        )}
                        <p className="text-base font-mono font-bold text-[#121212] tabular-nums pt-0.5">
                          Total: ₹{order.total.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Ordered items preview */}
                    <div className="bg-[#FAF8F5] p-3 border border-[#EBE4D5] flex items-center gap-4 flex-wrap text-xs">
                      <span className="font-semibold text-[#121212]">Items:</span>
                      {order.items.map((item, idx) => (
                        <span key={idx} className="bg-white px-2.5 py-1 border border-[#DDD3C2]">
                          {item.product.name} ({item.selectedSize}, {item.selectedColor.name}) × <strong>{item.quantity}</strong>
                        </span>
                      ))}
                    </div>

                    {/* Delivery Agent Assignment Row */}
                    <div className="bg-white p-3.5 border border-[#E5DECF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-[#121212] flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-[#8C6D44]" />
                          Delivery Agent:
                        </span>
                        <select
                          value={order.assignedAgentId || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              assignAgentToOrder(order.id, e.target.value);
                            }
                          }}
                          className="bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-1.5 text-xs outline-none cursor-pointer font-medium"
                        >
                          <option value="">-- Assign Sikar Delivery Agent --</option>
                          {deliveryAgents.map((ag) => (
                            <option key={ag.id} value={ag.id}>
                              {ag.name} ({ag.serviceArea.split('&')[0].trim()} · {ag.vehicleType})
                            </option>
                          ))}
                        </select>

                        {order.assignedAgentName && (
                          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                            Assigned: {order.assignedAgentName} (+91 {order.assignedAgentPhone})
                          </span>
                        )}
                      </div>

                      {order.assignedAgentId && (
                        <button
                          type="button"
                          onClick={() => {
                            const ag = deliveryAgents.find(a => a.id === order.assignedAgentId);
                            if (ag) {
                              const url = buildAgentDeliveryWhatsApp(order, ag);
                              window.open(url, '_blank');
                            }
                          }}
                          className="bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-semibold px-3 py-1.5 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send WhatsApp Manifest to Agent</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: AGENT MANAGEMENT */}
        {currentTab === 'agents' && (
          <div className="space-y-8 max-w-6xl">
            {/* Header Card */}
            <div className="bg-white border border-[#E5DECF] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EAE1]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#121212] text-[#C5A880] flex items-center justify-center shrink-0 shadow-sm">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold font-heading text-[#121212]">
                        Delivery Agents Management
                      </h2>
                      <span className="bg-[#FAF8F5] border border-[#DDD3C2] text-[#8C6D44] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        Under Gaurish · Sikar Hub
                      </span>
                    </div>
                    <p className="text-xs text-[#737373] mt-0.5">
                      Manage delivery personnel operating under SANGM'S in Todinagar, Piprali Road, Station Road & Fatehpur Road. Assign agents to customer orders and dispatch delivery manifests.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenAddAgent}
                    className="bg-[#121212] hover:bg-[#2B2B2B] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>+ Add Delivery Agent</span>
                  </button>
                </div>
              </div>

              {/* Agents KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
                <div className="p-4 bg-[#FAF8F5] border border-[#DDD3C2]">
                  <span className="text-[#888888] block text-[11px]">Total Delivery Agents</span>
                  <div className="text-xl font-mono font-extrabold text-[#121212] mt-0.5">
                    {deliveryAgents.length}
                  </div>
                  <span className="text-[10px] text-[#737373]">Sikar fleet roster</span>
                </div>

                <div className="p-4 bg-[#FAF8F5] border border-[#DDD3C2]">
                  <span className="text-[#888888] block text-[11px]">Active On Duty</span>
                  <div className="text-xl font-mono font-extrabold text-emerald-700 mt-0.5">
                    {deliveryAgents.filter(a => a.status === 'Active' || a.status === 'On Delivery').length}
                  </div>
                  <span className="text-[10px] text-emerald-800">Ready for dispatch</span>
                </div>

                <div className="p-4 bg-[#FAF8F5] border border-[#DDD3C2]">
                  <span className="text-[#888888] block text-[11px]">Currently Delivering</span>
                  <div className="text-xl font-mono font-extrabold text-[#8C6D44] mt-0.5">
                    {orders.filter(o => o.orderStatus === 'Out for Delivery').length}
                  </div>
                  <span className="text-[10px] text-[#8C6D44]">Orders out on road</span>
                </div>

                <div className="p-4 bg-[#FAF8F5] border border-[#DDD3C2]">
                  <span className="text-[#888888] block text-[11px]">Sikar Service Hub</span>
                  <div className="text-sm font-bold text-[#121212] mt-1">
                    Todinagar
                  </div>
                  <span className="text-[10px] text-[#737373]">PIN: 332001, Rajasthan</span>
                </div>
              </div>
            </div>

            {/* Delivery Agents Cards Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-bold text-[#121212] uppercase tracking-wider">
                  Active Delivery Agents ({deliveryAgents.length})
                </h3>
                <span className="text-xs text-[#737373]">
                  Assigned vehicles & coverage zones
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {deliveryAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-white border border-[#E5DECF] p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 border-b border-[#F0EAE1] pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#121212] text-[#C5A880] flex items-center justify-center font-bold text-xs shrink-0">
                            {agent.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#121212]">{agent.name}</h4>
                            <span className="text-[10px] font-mono text-[#888888]">{agent.id}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            agent.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : agent.status === 'On Delivery'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>

                      <div className="space-y-2 pt-3 text-xs text-[#404040]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#888888]">Mobile (+91):</span>
                          <span className="font-mono font-bold text-black">+91 {agent.phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#888888]">Vehicle:</span>
                          <span className="font-medium text-black">
                            {agent.vehicleType} {agent.vehicleNumber ? `(${agent.vehicleNumber})` : ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#888888] block text-[11px]">Assigned Sikar Area:</span>
                          <span className="font-medium text-[#121212]">{agent.serviceArea}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-[#F5F2EB]">
                          <span className="text-[#888888]">Deliveries Assigned:</span>
                          <span className="font-mono font-bold text-[#8C6D44]">
                            {orders.filter(o => o.assignedAgentId === agent.id).length} Orders
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditAgent(agent)}
                          className="p-1.5 text-[#555555] hover:text-black border border-[#D5CDBD] bg-white cursor-pointer"
                          title="Edit agent details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteDeliveryAgent(agent.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 border border-rose-200 bg-rose-50 cursor-pointer"
                          title="Remove delivery agent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <a
                        href={`https://api.whatsapp.com/send?phone=91${agent.phone.replace(/[\s-+]/g, '').slice(-10)}&text=Hello%20${encodeURIComponent(agent.name)},%20dispatch%20update%20from%20SANGM'S%20Todinagar%20Sikar%20Hub.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-1.5 flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Order Assignment Table */}
            <div className="bg-white border border-[#E5DECF] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
                <div>
                  <h3 className="text-base font-bold text-[#121212] font-heading">
                    Order Delivery Assignment Board ({orders.length} Orders)
                  </h3>
                  <p className="text-xs text-[#737373]">
                    Assign delivery personnel to pending orders and dispatch instant manifests on WhatsApp.
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#737373]">
                  No orders placed yet. Place an order through checkout to test assigning delivery agents.
                </div>
              ) : (
                <div className="divide-y divide-[#F0EAE1]">
                  {orders.map((order) => (
                    <div key={order.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#121212]">{order.id}</span>
                          <span className="font-semibold text-black">· {order.customer.fullName}</span>
                          <span className="text-[11px] text-[#737373] font-mono">+91 {order.customer.phone}</span>
                        </div>
                        <div className="text-[11px] text-[#555555]">
                          Address: {order.customer.addressLine}, {order.customer.city} · PIN: {order.customer.pinCode}
                        </div>
                        <div className="text-[11px] font-mono text-[#121212]">
                          Amount: <strong>₹{order.total.toLocaleString('en-IN')}</strong> ({order.paymentMethod})
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap">
                        <select
                          value={order.assignedAgentId || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              assignAgentToOrder(order.id, e.target.value);
                            }
                          }}
                          className="bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-1.5 text-xs outline-none cursor-pointer font-medium"
                        >
                          <option value="">-- Assign Delivery Agent --</option>
                          {deliveryAgents.map((ag) => (
                            <option key={ag.id} value={ag.id}>
                              {ag.name} ({ag.vehicleType})
                            </option>
                          ))}
                        </select>

                        {order.assignedAgentId && (
                          <button
                            type="button"
                            onClick={() => {
                              const ag = deliveryAgents.find(a => a.id === order.assignedAgentId);
                              if (ag) {
                                const url = buildAgentDeliveryWhatsApp(order, ag);
                                window.open(url, '_blank');
                              }
                            }}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-semibold px-3 py-1.5 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Manifest</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SMS & EMAIL ALERTS */}
        {currentTab === 'alerts' && (
          <div className="space-y-8 max-w-5xl">
            {/* Header Card */}
            <div className="bg-white border border-[#E5DECF] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EAE1]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#121212] text-[#C5A880] flex items-center justify-center shrink-0 shadow-sm">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold font-heading text-[#121212]">
                        Order SMS & Email Notifications Control
                      </h2>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-[#737373] mt-0.5">
                      Configured for store owner alerts: Phone <strong>+91 {ownerConfig.ownerPhone}</strong> · Email <strong>{ownerConfig.ownerEmail}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sendTestNotification();
                    }}
                    className="bg-[#121212] hover:bg-[#2B2B2B] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Trigger Test Alert</span>
                  </button>
                </div>
              </div>

              {/* Contact Configuration Strip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                {/* Target 1: SMS on 9799896438 */}
                <div className="p-4 bg-[#FAF8F5] border border-[#DDD3C2] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[#C5A880]" />
                      SMS & WhatsApp Notification Target
                    </span>
                    <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 font-mono font-bold">
                      Direct Push Ready
                    </span>
                  </div>
                  <div className="text-base font-mono font-extrabold text-[#121212]">
                    +91 {ownerConfig.ownerPhone}
                  </div>
                  <p className="text-[11px] text-[#737373] leading-relaxed">
                    Whenever an order is placed in Checkout, a formatted SMS summary with order number, customer name, mobile number, full delivery address, and ordered items is generated.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs">
                    <a
                      href={`sms:+91${ownerConfig.ownerPhone}`}
                      className="inline-flex items-center gap-1 text-[#8C6D44] font-semibold hover:underline"
                    >
                      <Send className="w-3 h-3" />
                      <span>Test Direct SMS</span>
                    </a>
                    <span className="text-[#CCCCCC]">·</span>
                    <a
                      href={`https://api.whatsapp.com/send?phone=91${ownerConfig.ownerPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Test WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Target 2: Email on homelander69.brrbrrpatapim@gmail.com */}
                <div className="p-4 bg-[#FAF8F5] border border-[#DDD3C2] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[#C5A880]" />
                      Email Notification Target
                    </span>
                    <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 font-mono font-bold">
                      Direct Push Ready
                    </span>
                  </div>
                  <div className="text-base font-mono font-extrabold text-[#121212] truncate">
                    {ownerConfig.ownerEmail}
                  </div>
                  <p className="text-[11px] text-[#737373] leading-relaxed">
                    Formatted order slips with full pricing math, item breakdown, and delivery hub tags are queued to your Gmail address instantly upon checkout submission.
                  </p>
                  <div className="pt-2 text-xs">
                    <a
                      href={`mailto:${ownerConfig.ownerEmail}?subject=SANGM%27S%20Store%20Test%20Alert`}
                      className="inline-flex items-center gap-1 text-[#8C6D44] font-semibold hover:underline"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Test Email Draft</span>
                    </a>
                  </div>
                </div>

                {/* Target 3: Store UPI ID (VPA) */}
                <div className="p-4 bg-[#FAF8F5] border border-[#DDD3C2] space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#C5A880]" />
                      Store UPI Payment VPA (Dynamic QR & 1-Tap Apps)
                    </span>
                    <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 font-mono font-bold">
                      Direct NPCI Routing
                    </span>
                  </div>
                  <div className="text-base font-mono font-extrabold text-[#121212] truncate">
                    {ownerConfig.upiVpa || '9799896438@upi'}
                  </div>
                  <p className="text-[11px] text-[#737373] leading-relaxed">
                    Customer payments via Google Pay, PhonePe, Paytm, and BHIM QR codes are routed directly to this UPI address without intermediary platform commissions.
                  </p>
                </div>
              </div>

              {/* Edit Settings Form Toggle */}
              <div className="mt-6 pt-4 border-t border-[#F0EAE1]">
                {!isEditingConfig ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditPhone(ownerConfig.ownerPhone);
                      setEditEmail(ownerConfig.ownerEmail);
                      setEditUpiVpa(ownerConfig.upiVpa || '9799896438@upi');
                      setIsEditingConfig(true);
                    }}
                    className="text-xs font-semibold text-[#8C6D44] hover:text-black underline cursor-pointer"
                  >
                    Edit Owner Contact Phone / Email / Store UPI ID
                  </button>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateOwnerConfig({
                        ownerPhone: editPhone.trim(),
                        ownerEmail: editEmail.trim(),
                        upiVpa: editUpiVpa.trim() || '9799896438@upi'
                      });
                      setIsEditingConfig(false);
                    }}
                    className="space-y-4 bg-[#FAF8F5] p-4 border border-[#DDD3C2] animate-in fade-in duration-150"
                  >
                    <div className="font-semibold text-xs text-[#121212]">Update Alert Destination & Payment Configuration:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#404040] mb-1">
                          Owner Mobile Phone (SMS/WhatsApp) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full bg-white border border-[#D5CDBD] px-3 py-2 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#404040] mb-1">
                          Owner Email Address (Order Slips) *
                        </label>
                        <input
                          type="email"
                          required
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full bg-white border border-[#D5CDBD] px-3 py-2 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#404040] mb-1">
                          Store UPI VPA (Direct QR Routing) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editUpiVpa}
                          onChange={(e) => setEditUpiVpa(e.target.value)}
                          placeholder="9799896438@upi"
                          className="w-full bg-white border border-[#D5CDBD] px-3 py-2 outline-none font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="bg-[#121212] text-white text-xs px-4 py-2 font-bold cursor-pointer"
                      >
                        Save Configuration
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditPhone('9799896438');
                          setEditEmail('homelander69.brrbrrpatapim@gmail.com');
                          setEditUpiVpa('9799896438@upi');
                          updateOwnerConfig({
                            ownerPhone: '9799896438',
                            ownerEmail: 'homelander69.brrbrrpatapim@gmail.com',
                            upiVpa: '9799896438@upi'
                          });
                          setIsEditingConfig(false);
                        }}
                        className="bg-white border border-[#D5CDBD] text-xs px-3 py-2 cursor-pointer hover:bg-gray-50"
                      >
                        Reset to Defaults
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingConfig(false)}
                        className="text-xs text-[#737373] px-3 py-2 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Notification History Log */}
            <div className="bg-white border border-[#E5DECF] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
                <div>
                  <h3 className="text-base font-bold text-[#121212] font-heading">
                    Order Notification History ({notifications.length})
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Live log of all automated customer order notifications sent to you.
                  </p>
                </div>
                {notifications.length > 0 && (
                  <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                    Latest: {notifications[0].orderId}
                  </span>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#737373] space-y-3">
                  <Bell className="w-8 h-8 text-[#CCCCCC] mx-auto" />
                  <p>No order alerts generated yet.</p>
                  <button
                    type="button"
                    onClick={() => sendTestNotification()}
                    className="bg-[#121212] text-white text-xs px-4 py-2 font-semibold cursor-pointer uppercase tracking-wider"
                  >
                    Generate Test Order Alert Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="border border-[#E5DECF] bg-[#FAF8F5] p-4 sm:p-5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D5] pb-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#121212]">{notif.orderId}</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                            {notif.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#737373] font-mono">
                          {new Date(notif.timestamp).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#404040]">
                        <div>
                          <span className="text-[#888888] block text-[11px]">Customer & Phone</span>
                          <div className="font-semibold text-black">{notif.customerName}</div>
                          <div className="font-mono text-[#555555]">+91 {notif.customerPhone}</div>
                        </div>

                        <div>
                          <span className="text-[#888888] block text-[11px]">Payable Total</span>
                          <div className="font-mono font-bold text-base text-[#121212]">
                            ₹{notif.orderTotal.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-[#666666]">{notif.paymentMethod}</div>
                        </div>

                        <div>
                          <span className="text-[#888888] block text-[11px]">Alert Dispatched To</span>
                          <div className="font-mono font-semibold text-black">+91 {notif.recipientPhone} (SMS)</div>
                          <div className="font-mono text-[#555555] truncate">{notif.recipientEmail}</div>
                        </div>
                      </div>

                      {/* Message preview block */}
                      <div className="bg-white p-3 border border-[#DDD3C2] text-xs font-mono text-[#333333] space-y-2">
                        <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-1.5 text-[11px]">
                          <span className="font-bold text-[#8C6D44]">SMS Payload Preview:</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(notif.smsBody);
                              setCopiedNotifId(notif.id);
                              showToast('SMS text copied to clipboard');
                              setTimeout(() => setCopiedNotifId(null), 2000);
                            }}
                            className="inline-flex items-center gap-1 text-[#8C6D44] hover:text-black cursor-pointer"
                          >
                            {copiedNotifId === notif.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedNotifId === notif.id ? 'Copied' : 'Copy SMS'}</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap text-[11px] text-[#555555] max-h-28 overflow-y-auto font-sans leading-relaxed">
                          {notif.smsBody}
                        </pre>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <a
                          href={notif.smsUrl}
                          className="bg-[#121212] hover:bg-[#2B2B2B] text-white px-3 py-1.5 font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Send className="w-3 h-3 text-[#C5A880]" />
                          <span>Send / Open SMS</span>
                        </a>

                        <a
                          href={notif.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>WhatsApp to 9799896438</span>
                        </a>

                        <a
                          href={notif.emailUrl}
                          className="bg-white border border-[#D5CDBD] hover:bg-[#FAF8F5] text-[#121212] px-3 py-1.5 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Mail className="w-3 h-3 text-[#C5A880]" />
                          <span>Open in Email</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Production Architecture Checklist */}
            <div className="bg-[#FAF8F5] border border-[#E5DECF] p-6 space-y-4 text-xs text-[#555555]">
              <div className="flex items-center gap-2 font-bold text-[#121212] text-sm">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                <span>Production SMS & Email Gateway Integration Architecture</span>
              </div>
              <p className="leading-relaxed">
                Store notifications are formatted instantly with one-click direct SMS protocols (<code className="font-mono">sms:+919799896438</code>), WhatsApp Business APIs, and <code className="font-mono">mailto:</code> integration. For 100% automated background delivery without opening mobile apps:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3.5 border border-[#DDD3C2] space-y-1.5">
                  <strong className="text-black block">1. Automated Indian SMS Gateway (Fast2SMS / MSG91 / Twilio)</strong>
                  <p className="text-[11px] leading-relaxed">
                    Set up an account on Fast2SMS or MSG91 (DLT approved in India). Call their REST API from an Express or Netlify serverless function using your API Key:
                  </p>
                  <code className="block bg-[#121212] text-emerald-400 p-2 text-[10px] font-mono whitespace-pre overflow-x-auto">
                    {`fetch("https://www.fast2sms.com/dev/bulkV2", {\n  method: "POST",\n  headers: { authorization: "YOUR_API_KEY" },\n  body: JSON.stringify({\n    route: "q",\n    message: notif.smsBody,\n    numbers: "9799896438"\n  })\n});`}
                  </code>
                </div>

                <div className="bg-white p-3.5 border border-[#DDD3C2] space-y-1.5">
                  <strong className="text-black block">2. Automated Transactional Email (Resend / SendGrid / Nodemailer)</strong>
                  <p className="text-[11px] leading-relaxed">
                    Use Resend or Nodemailer with your SMTP credentials to send HTML order slips automatically to <code className="font-mono">homelander69.brrbrrpatapim@gmail.com</code>:
                  </p>
                  <code className="block bg-[#121212] text-emerald-400 p-2 text-[10px] font-mono whitespace-pre overflow-x-auto">
                    {`await resend.emails.send({\n  from: "orders@sangms.in",\n  to: "homelander69.brrbrrpatapim@gmail.com",\n  subject: notif.emailSubject,\n  text: notif.emailBody\n});`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTION SECURITY GUIDE */}
        {currentTab === 'security' && (
          <div className="bg-white border border-[#E5DECF] p-8 shadow-xs space-y-6 max-w-4xl">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0EAE1]">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#121212] font-heading">
                  Production Authentication & Database Security Architecture
                </h3>
                <p className="text-xs text-[#737373]">
                  Essential guidelines for transitioning from browser storage to hosted cloud database
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#404040] leading-relaxed">
              <p>
                The store dashboard currently uses persistent <strong>LocalStorage</strong> and client-side session states for instant offline-capable management at the Todinagar Sikar hub. For enterprise multi-staff production, connect a dedicated backend like Firebase or PostgreSQL with server-side authentication.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#FAF8F5] border border-[#E5DECF] space-y-2">
                  <h4 className="font-bold text-[#121212] text-sm">Option A: Firebase Integration</h4>
                  <ul className="list-disc list-inside space-y-1 text-[#555555]">
                    <li>Enable <strong>Firebase Authentication</strong> (Email/Password or Google Sign-In).</li>
                    <li>Store products and orders in <strong>Cloud Firestore</strong>.</li>
                    <li>Deploy strict <code>firestore.rules</code>: Allow public read of products; restrict writes to users with <code>request.auth.token.admin == true</code>.</li>
                    <li>Keep service account private keys out of client builds.</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#FAF8F5] border border-[#E5DECF] space-y-2">
                  <h4 className="font-bold text-[#121212] text-sm">Option B: Supabase (PostgreSQL + RLS)</h4>
                  <ul className="list-disc list-inside space-y-1 text-[#555555]">
                    <li>Use Supabase GoTrue Auth for role-based sessions.</li>
                    <li>Enable <strong>Row Level Security (RLS)</strong> on <code>products</code> and <code>orders</code> tables.</li>
                    <li>Define policies so customers can only read their own orders via <code>auth.uid() = user_id</code>.</li>
                    <li>Expose only public <code>anon_key</code> on the client; never include the <code>service_role_key</code> in Vite bundles.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-[#FFFDF5] border border-[#E8DEC8] text-[#786438] space-y-1.5">
                <span className="font-bold text-[#4F3F19]">Production Payment Gateway Checklist (Razorpay / Cashfree):</span>
                <p>
                  To accept real Indian Rupees via UPI, Net Banking, and Cards:
                  create an order on your secure server backend (Node.js/Express or Supabase Edge Functions), pass the <code>order_id</code> to the client checkout modal, and verify the cryptographic signature (HMAC SHA256) on your webhook before marking orders as <code>Paid</code>.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowNetlifyGuide(true)}
                  className="inline-flex items-center gap-2 bg-[#121212] text-white px-5 py-2.5 text-xs font-semibold tracking-wider uppercase cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Netlify Deployment Instructions</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg border border-[#E5DECF] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
              <h3 className="text-base font-bold text-[#121212] font-heading">
                {editingProductId ? 'Edit Product Details' : 'Add New Apparel Item'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#888888] hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-[#262626] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Pure Linen Resort Collar Shirt"
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none focus:border-[#121212]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#262626] mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#262626] mb-1">Audience / Demographic *</label>
                  <select
                    value={productForm.gender}
                    onChange={(e) => setProductForm({ ...productForm, gender: e.target.value as any })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none cursor-pointer"
                  >
                    <option value="Women">Women</option>
                    <option value="Ladies">Ladies</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#262626] mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#262626] mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min="100"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#262626] mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#262626] mb-1">Available Sizes (comma-separated)</label>
                <input
                  type="text"
                  value={productForm.sizes}
                  onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  placeholder="S, M, L, XL"
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#262626] mb-1">Available Colours (Name:Hex, Name:Hex)</label>
                <input
                  type="text"
                  value={productForm.colors}
                  onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                  placeholder="Ivory:#FAF6EE, Black:#111111"
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#262626] mb-1.5">
                  Product Photograph *
                </label>

                {/* Hidden native file input */}
                <input
                  ref={adminFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAdminFileUpload}
                  className="hidden"
                />

                {/* Upload Action Area */}
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#FAF8F5] border border-[#D5CDBD]">
                  {/* Image Preview Box */}
                  <div
                    onClick={() => adminFileInputRef.current?.click()}
                    className="w-24 h-28 sm:w-28 sm:h-32 bg-[#EFEBE1] border border-[#DDD3C2] relative flex items-center justify-center overflow-hidden shrink-0 cursor-pointer group shadow-xs"
                    title="Click to choose or change image from device"
                  >
                    {productForm.image ? (
                      <>
                        <img
                          src={productForm.image}
                          alt="Product preview"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-semibold transition-opacity">
                          Change Photo
                        </div>
                      </>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#8C8273]" />
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="font-semibold text-[#121212] block">
                        Upload Photograph from Your Device
                      </span>
                      <p className="text-[11px] text-[#737373] mt-0.5 leading-relaxed">
                        Pick a picture directly from your phone gallery, camera, or computer file storage.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => adminFileInputRef.current?.click()}
                        className="bg-[#121212] hover:bg-[#2B2B2B] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                      >
                        <Upload className="w-4 h-4 text-[#C5A880]" />
                        <span>Choose Image from Device</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowAdminUrlInput(!showAdminUrlInput)}
                        className="bg-white border border-[#D5CDBD] hover:bg-[#FAF8F5] text-[#262626] px-3 py-2 text-xs font-medium cursor-pointer"
                      >
                        {showAdminUrlInput ? 'Hide URL' : 'Or Paste URL'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Optional URL input if toggled */}
                {showAdminUrlInput && (
                  <div className="mt-2 animate-in fade-in duration-150">
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="Paste image URL (https://...)"
                      className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono text-xs"
                    />
                  </div>
                )}

                {/* Presets */}
                <div className="flex items-center gap-2 mt-2 text-[11px] overflow-x-auto pb-1">
                  <span className="text-[#888888] shrink-0 font-medium">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, image: '/src/assets/images/womens_collection_editorial_1794323733103.jpg' })}
                    className="underline text-[#8C6D44] cursor-pointer hover:text-black shrink-0"
                  >
                    Dress
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, image: '/src/assets/images/hero_editorial_banner_1794323733100.jpg' })}
                    className="underline text-[#8C6D44] cursor-pointer hover:text-black shrink-0"
                  >
                    Kurti & Top
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, image: '/src/assets/images/accessories_collection_1794323733805.jpg' })}
                    className="underline text-[#8C6D44] cursor-pointer hover:text-black shrink-0"
                  >
                    Accessories
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#262626] mb-1">Description & Craftsmanship</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#F0EAE1]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#D5CDBD] text-[#555555] hover:text-black cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#121212] hover:bg-[#2B2B2B] text-white px-6 py-2 font-bold uppercase tracking-wider cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Delivery Agent Modal */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg border border-[#E5DECF] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#C5A880]" />
                <h3 className="text-base font-bold text-[#121212] font-heading">
                  {editingAgentId ? 'Edit Delivery Agent' : 'Add Delivery Agent (Under Gaurish)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAgentModalOpen(false)}
                className="text-[#888888] hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAgent} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-[#262626] mb-1">Agent Full Name *</label>
                <input
                  type="text"
                  required
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  placeholder="e.g. Rakesh Sharma"
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none focus:border-[#121212]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#262626] mb-1">Mobile Phone (+91) *</label>
                  <input
                    type="tel"
                    required
                    value={agentForm.phone}
                    onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                    placeholder="98290 12345"
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono focus:border-[#121212]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#262626] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={agentForm.email}
                    onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                    placeholder="agent@sangms.in"
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono focus:border-[#121212]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#262626] mb-1">Vehicle Type *</label>
                  <select
                    value={agentForm.vehicleType}
                    onChange={(e) => setAgentForm({ ...agentForm, vehicleType: e.target.value as DeliveryAgent['vehicleType'] })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none cursor-pointer"
                  >
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Electric Bike">Electric Bike</option>
                    <option value="Delivery Van">Delivery Van</option>
                    <option value="Auto Rickshaw">Auto Rickshaw</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#262626] mb-1">Vehicle Reg Number</label>
                  <input
                    type="text"
                    value={agentForm.vehicleNumber}
                    onChange={(e) => setAgentForm({ ...agentForm, vehicleNumber: e.target.value })}
                    placeholder="e.g. RJ 23 SB 4812"
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono uppercase focus:border-[#121212]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#262626] mb-1">Assigned Sikar Service Area *</label>
                <input
                  type="text"
                  required
                  value={agentForm.serviceArea}
                  onChange={(e) => setAgentForm({ ...agentForm, serviceArea: e.target.value })}
                  placeholder="e.g. Todinagar & Station Road, Sikar"
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none focus:border-[#121212]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#262626] mb-1">Availability Status *</label>
                <select
                  value={agentForm.status}
                  onChange={(e) => setAgentForm({ ...agentForm, status: e.target.value as DeliveryAgent['status'] })}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="Active">Active (Ready for Orders)</option>
                  <option value="On Delivery">On Delivery</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#F0EAE1]">
                <button
                  type="button"
                  onClick={() => setIsAgentModalOpen(false)}
                  className="px-4 py-2 border border-[#D5CDBD] text-[#555555] hover:text-black cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#121212] hover:bg-[#2B2B2B] text-white px-6 py-2 font-bold uppercase tracking-wider cursor-pointer"
                >
                  {editingAgentId ? 'Update Agent' : 'Save Delivery Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
