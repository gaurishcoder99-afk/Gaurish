import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  ProductCategory,
  CartItem,
  Order,
  CustomerDetails,
  CustomerUser,
  DeliveryAgent,
  OrderStatus,
  ActivePage,
  OrderNotification,
  OwnerNotificationConfig
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { buildOrderNotification, DEFAULT_OWNER_CONFIG } from '../utils/notifications';

export const INITIAL_DELIVERY_AGENTS: DeliveryAgent[] = [
  {
    id: 'AGENT-101',
    name: 'Rakesh Sharma',
    phone: '9829102938',
    email: 'rakesh.delivery@sangms.in',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'RJ 23 SB 4812',
    serviceArea: 'Todinagar & Railway Station Road, Sikar',
    status: 'Active',
    assignedOrdersCount: 0,
    createdAt: '2026-11-01T10:00:00.000Z'
  },
  {
    id: 'AGENT-102',
    name: 'Sunil Kumawat',
    phone: '9785234190',
    email: 'sunil.delivery@sangms.in',
    vehicleType: 'Scooter',
    vehicleNumber: 'RJ 23 SC 9102',
    serviceArea: 'Piprali Road & Nawalgarh Road, Sikar',
    status: 'Active',
    assignedOrdersCount: 0,
    createdAt: '2026-11-02T11:00:00.000Z'
  },
  {
    id: 'AGENT-103',
    name: 'Mukesh Saini',
    phone: '9636781240',
    email: 'mukesh.delivery@sangms.in',
    vehicleType: 'Electric Bike',
    vehicleNumber: 'RJ 23 EV 3301',
    serviceArea: 'Fatehpur Road & Clock Tower, Sikar',
    status: 'Active',
    assignedOrdersCount: 0,
    createdAt: '2026-11-03T09:30:00.000Z'
  },
  {
    id: 'AGENT-104',
    name: 'Ajay Shekhawat',
    phone: '9829554433',
    email: 'ajay.delivery@sangms.in',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'RJ 23 SB 1104',
    serviceArea: 'Bajaj Gram & Sanwali, Sikar',
    status: 'Active',
    assignedOrdersCount: 0,
    createdAt: '2026-11-04T08:00:00.000Z'
  },
  {
    id: 'AGENT-105',
    name: 'Vikas Verma',
    phone: '9784112233',
    email: 'vikas.delivery@sangms.in',
    vehicleType: 'Scooter',
    vehicleNumber: 'RJ 23 SC 7788',
    serviceArea: 'Rani Sati Road & Court Area, Sikar',
    status: 'Active',
    assignedOrdersCount: 0,
    createdAt: '2026-11-05T09:15:00.000Z'
  }
];

interface StoreContextType {
  products: Product[];
  categories: ProductCategory[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteAllProducts: () => void;
  resetProductsToDefault: () => void;

  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;

  cart: CartItem[];
  addToCart: (product: Product, size: string, color: { name: string; hex: string }, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, colorName: string) => void;
  updateQuantity: (productId: string, size: string, colorName: string, delta: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  appliedCoupon: string | null;
  couponDiscount: number;
  cartTotal: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  orders: Order[];
  currentOrder: Order | null;
  placeOrder: (
    customer: CustomerDetails,
    paymentMethod: Order['paymentMethod'],
    paymentDetails?: Order['paymentDetails']
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;

  // Delivery Agents Management
  deliveryAgents: DeliveryAgent[];
  addDeliveryAgent: (agent: Omit<DeliveryAgent, 'id' | 'createdAt' | 'assignedOrdersCount'>) => void;
  updateDeliveryAgent: (id: string, updates: Partial<DeliveryAgent>) => void;
  deleteDeliveryAgent: (id: string) => void;
  assignAgentToOrder: (orderId: string, agentId: string) => void;

  // Customer Account & Authentication
  currentUser: CustomerUser | null;
  customers: CustomerUser[];
  registerCustomer: (data: Omit<CustomerUser, 'id' | 'createdAt'>) => { success: boolean; message: string; user?: CustomerUser };
  loginCustomer: (email: string, password?: string) => { success: boolean; message: string; user?: CustomerUser };
  logoutCustomer: () => void;
  updateCustomerProfile: (updates: Partial<CustomerUser>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (cat: ProductCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  isAdminLoggedIn: boolean;
  adminLogin: (email: string, pass: string) => boolean;
  adminLogout: () => void;

  showNetlifyGuide: boolean;
  setShowNetlifyGuide: (show: boolean) => void;

  showInstallModal: boolean;
  setShowInstallModal: (show: boolean) => void;

  notifications: OrderNotification[];
  latestNotification: OrderNotification | null;
  ownerConfig: OwnerNotificationConfig;
  updateOwnerConfig: (cfg: Partial<OwnerNotificationConfig>) => void;
  sendTestNotification: () => OrderNotification;
  dismissLatestNotification: () => void;

  toast: string | null;
  showToast: (msg: string) => void;
}

const ALL_CATEGORIES: ProductCategory[] = [
  "Women's Dresses",
  "Tops & Blouses",
  "Co-ords & Sets",
  "Jeans & Trousers",
  "Skirts",
  "Kurties & Modern Ethnic",
  "Hoodies & Winterwear",
  "Handbags & Accessories"
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('sangms_products');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('sangms_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  const addProduct = (newProduct: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const product: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      rating: 5,
      reviewCount: 1
    };
    setProducts(prev => [product, ...prev]);
    showToast(`Added ${product.name} to catalogue`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted');
  };

  const deleteAllProducts = () => {
    setProducts([]);
    showToast('All products deleted');
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    showToast('Products reset');
  };

  // 2. Customer Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('sangms_cart');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('sangms_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (product: Product, size: string, color: { name: string; hex: string }, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size && item.selectedColor.name === color.name
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
    });
    showToast(`Added ${product.name} (${size}) to your bag`);
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string, size: string, colorName: string) => {
    setCart(prev =>
      prev.filter(
        item => !(item.product.id === productId && item.selectedSize === size && item.selectedColor.name === colorName)
      )
    );
    showToast('Item removed from cart');
  };

  const updateQuantity = (productId: string, size: string, colorName: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId && item.selectedSize === size && item.selectedColor.name === colorName) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Delivery: Free for orders >= ₹999 or with SIKARFREE coupon
  const shippingFee = cartSubtotal === 0 || cartSubtotal >= 999 || appliedCoupon === 'SIKARFREE' ? 0 : 99;

  let couponDiscount = 0;
  if (appliedCoupon === 'FIRST10') {
    couponDiscount = Math.round(cartSubtotal * 0.1);
  } else if (appliedCoupon === 'SIKAR500' && cartSubtotal >= 3000) {
    couponDiscount = 500;
  }

  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FIRST10') {
      setAppliedCoupon('FIRST10');
      return { success: true, message: 'Coupon FIRST10 applied! 10% discount deducted.' };
    }
    if (clean === 'SIKARFREE') {
      setAppliedCoupon('SIKARFREE');
      return { success: true, message: 'Coupon SIKARFREE applied! Free Express Delivery unlocked.' };
    }
    if (clean === 'SIKAR500') {
      if (cartSubtotal < 3000) {
        return { success: false, message: 'SIKAR500 requires minimum order value of ₹3,000' };
      }
      setAppliedCoupon('SIKAR500');
      return { success: true, message: 'Coupon SIKAR500 applied! ₹500 flat discount deducted.' };
    }
    return { success: false, message: 'Invalid coupon code. Try FIRST10, SIKARFREE, or SIKAR500.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // 3. Customer Authentication & Accounts
  const [customers, setCustomers] = useState<CustomerUser[]>(() => {
    try {
      const stored = localStorage.getItem('sangms_customers');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    try {
      const stored = localStorage.getItem('sangms_current_user');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');

  useEffect(() => {
    try {
      localStorage.setItem('sangms_customers', JSON.stringify(customers));
    } catch {
      // ignore
    }
  }, [customers]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('sangms_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('sangms_current_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const registerCustomer = (data: Omit<CustomerUser, 'id' | 'createdAt'>) => {
    const existing = customers.find(c => c.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email address already exists. Please Sign In.' };
    }
    const newUser: CustomerUser = {
      ...data,
      id: `CUST-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Welcome to SANGM'S, ${newUser.fullName}! Account created.`);
    return { success: true, message: 'Account registered successfully!', user: newUser };
  };

  const loginCustomer = (email: string, password?: string) => {
    const user = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'No account found with this email. Please register.' };
    }
    if (password && user.password && user.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${user.fullName}!`);
    return { success: true, message: 'Signed in successfully!', user };
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    showToast('Signed out of your account');
  };

  const updateCustomerProfile = (updates: Partial<CustomerUser>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setCustomers(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    showToast('Account details updated');
  };

  // 4. Delivery Agents Management (Under Admin / Gaurish)
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>(() => {
    try {
      const stored = localStorage.getItem('sangms_delivery_agents');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_DELIVERY_AGENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sangms_delivery_agents', JSON.stringify(deliveryAgents));
    } catch {
      // ignore
    }
  }, [deliveryAgents]);

  const addDeliveryAgent = (agentData: Omit<DeliveryAgent, 'id' | 'createdAt' | 'assignedOrdersCount'>) => {
    const newAgent: DeliveryAgent = {
      ...agentData,
      id: `AGENT-${Math.floor(100 + Math.random() * 900)}`,
      assignedOrdersCount: 0,
      createdAt: new Date().toISOString()
    };
    setDeliveryAgents(prev => [newAgent, ...prev]);
    showToast(`Delivery agent ${newAgent.name} added under Sikar Hub`);
  };

  const updateDeliveryAgent = (id: string, updates: Partial<DeliveryAgent>) => {
    setDeliveryAgents(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Agent details updated');
  };

  const deleteDeliveryAgent = (id: string) => {
    setDeliveryAgents(prev => prev.filter(a => a.id !== id));
    showToast('Delivery agent removed');
  };

  const assignAgentToOrder = (orderId: string, agentId: string) => {
    const agent = deliveryAgents.find(a => a.id === agentId);
    if (!agent) return;

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: 'Out for Delivery',
            assignedAgentId: agent.id,
            assignedAgentName: agent.name,
            assignedAgentPhone: agent.phone,
            assignedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );

    // Update agent's active deliveries count
    setDeliveryAgents(prev =>
      prev.map(a => {
        if (a.id === agentId) {
          return { ...a, assignedOrdersCount: a.assignedOrdersCount + 1, status: 'On Delivery' };
        }
        return a;
      })
    );

    showToast(`Order ${orderId} assigned to ${agent.name} (Out for Delivery)`);
  };

  // 5. Customer Orders State (Real Store Orders)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('sangms_orders');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('sangms_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const placeOrder = (
    customer: CustomerDetails,
    paymentMethod: Order['paymentMethod'],
    paymentDetails?: Order['paymentDetails']
  ): Order => {
    const orderNumber = `SGM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      customerId: currentUser?.id,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: couponDiscount,
      shippingFee,
      total: cartTotal,
      paymentMethod,
      paymentStatus:
        paymentMethod === 'Cash on Delivery (COD)'
          ? 'Cash on Delivery'
          : 'Payment Received',
      orderStatus: 'Confirmed',
      trackingNumber: `SGM-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentDetails
    };

    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);

    // Build and dispatch order alert to owner
    const notif = buildOrderNotification(newOrder, ownerConfig);
    setNotifications(prev => [notif, ...prev]);
    setLatestNotification(notif);

    // Automatically draft WhatsApp message containing order details to +919799896438
    try {
      if (typeof window !== 'undefined' && notif.whatsappUrl) {
        window.open(notif.whatsappUrl, '_blank');
      }
    } catch {
      // Handled if popup blocker is active
    }

    clearCart();
    setActivePage('order-confirmation');
    showToast(`Order placed! WhatsApp alert drafted to +91 9799896438 & Email sent to ${ownerConfig.ownerEmail}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, orderStatus: status, ...(trackingNumber ? { trackingNumber } : {}) } : o))
    );
    showToast(`Order ${orderId} updated to ${status}`);
  };

  // 6. Store Owner Notifications (SMS & Email alerts on orders)
  const [ownerConfig, setOwnerConfig] = useState<OwnerNotificationConfig>(() => {
    try {
      const stored = localStorage.getItem('sangms_owner_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.ownerEmail === 'gaurishcoder99@gmail.com' || !parsed.ownerEmail) {
          parsed.ownerEmail = 'homelander69.brrbrrpatapim@gmail.com';
        }
        if (!parsed.upiVpa) {
          parsed.upiVpa = '9799896438@upi';
        }
        return { ...DEFAULT_OWNER_CONFIG, ...parsed };
      }
    } catch {
      // ignore
    }
    return DEFAULT_OWNER_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sangms_owner_config', JSON.stringify(ownerConfig));
    } catch {
      // ignore
    }
  }, [ownerConfig]);

  const [notifications, setNotifications] = useState<OrderNotification[]>(() => {
    try {
      const stored = localStorage.getItem('sangms_notifications');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  const [latestNotification, setLatestNotification] = useState<OrderNotification | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('sangms_notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const updateOwnerConfig = (cfg: Partial<OwnerNotificationConfig>) => {
    setOwnerConfig(prev => ({ ...prev, ...cfg }));
    showToast('Notification contact settings updated');
  };

  const dismissLatestNotification = () => {
    setLatestNotification(null);
  };

  const sendTestNotification = (): OrderNotification => {
    const testOrder: Order = {
      id: `SGM-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: 'Priya Sharma',
        phone: '9829012345',
        email: 'priya.customer@example.com',
        addressLine: 'House 14, Todinagar Main Road',
        city: 'Sikar',
        state: 'Rajasthan',
        pinCode: '332001'
      },
      items: [
        {
          product: {
            id: 'sample-test',
            name: 'Embroidered Silk Anarkali Suit',
            category: "Women's Dresses",
            price: 2499,
            image: '/src/assets/images/womens_collection_editorial_1794323733103.jpg',
            stock: 12,
            gender: 'Women',
            description: 'Handcrafted luxury weave from Sikar artisans',
            features: ['Pure Resham Zari Work', 'Lined with soft mulmul'],
            availableSizes: ['M', 'L'],
            availableColors: [{ name: 'Golden Beige', hex: '#D7C7B0' }],
            rating: 5,
            reviewCount: 28
          },
          quantity: 1,
          selectedSize: 'M',
          selectedColor: { name: 'Golden Beige', hex: '#D7C7B0' }
        }
      ],
      subtotal: 2499,
      discount: 0,
      shippingFee: 0,
      total: 2499,
      paymentMethod: 'Cash on Delivery (COD)',
      paymentStatus: 'Cash on Delivery',
      orderStatus: 'Confirmed',
      trackingNumber: `SGM-EXP-${Math.floor(100000 + Math.random() * 900000)}`
    };

    const notif = buildOrderNotification(testOrder, ownerConfig);
    setNotifications(prev => [notif, ...prev]);
    setLatestNotification(notif);
    showToast(`Test alert generated for ${ownerConfig.ownerPhone} / ${ownerConfig.ownerEmail}`);
    return notif;
  };

  // 7. Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sangms_wishlist');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('sangms_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // 8. Admin Authentication
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sangms_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const adminLogin = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (
      (cleanEmail === 'homelander69.brrbrrpatapim@gmail.com' ||
        cleanEmail === 'gaurishcoder99@gmail.com' ||
        cleanEmail === 'admin@sangms.in') &&
      pass === 'Sangms@Admin2026'
    ) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem('sangms_admin_auth', 'true');
      } catch {
        // ignore
      }
      showToast('Admin session authenticated');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('sangms_admin_auth');
    } catch {
      // ignore
    }
    showToast('Admin logged out');
  };

  // 9. Navigation & View Routing
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 10. Modals & Guides
  const [showNetlifyGuide, setShowNetlifyGuide] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // 11. Toast Feedback
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories: ALL_CATEGORIES,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteAllProducts,
        resetProductsToDefault,

        isAddProductModalOpen,
        setIsAddProductModalOpen,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartCount,
        cartSubtotal,
        shippingFee,
        appliedCoupon,
        couponDiscount,
        cartTotal,
        applyCoupon,
        removeCoupon,

        orders,
        currentOrder,
        placeOrder,
        updateOrderStatus,

        deliveryAgents,
        addDeliveryAgent,
        updateDeliveryAgent,
        deleteDeliveryAgent,
        assignAgentToOrder,

        currentUser,
        customers,
        registerCustomer,
        loginCustomer,
        logoutCustomer,
        updateCustomerProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,

        wishlist,
        toggleWishlist,
        isInWishlist,

        activePage,
        setActivePage,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,

        isAdminLoggedIn,
        adminLogin,
        adminLogout,

        showNetlifyGuide,
        setShowNetlifyGuide,

        showInstallModal,
        setShowInstallModal,

        notifications,
        latestNotification,
        ownerConfig,
        updateOwnerConfig,
        sendTestNotification,
        dismissLatestNotification,

        toast,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
