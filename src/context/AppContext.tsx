import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  SavedAddress,
  Coupon,
  Review,
  User,
  Role,
  CoffeeCategory
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_ADDRESSES,
  INITIAL_COUPONS,
  INITIAL_REVIEWS
} from '../data/mockData';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

interface AppContextType {
  // Theme & Currency
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInUSD: number) => string;

  // Authentication & Profile
  user: User | null;
  role: Role;
  setRole: (r: Role) => void;
  login: (email: string, role?: Role) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;

  // Products
  products: Product[];
  selectedCategory: CoffeeCategory | 'All';
  setSelectedCategory: (c: CoffeeCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    options?: {
      size?: string;
      milk?: string;
      sugar?: string;
      toppings?: string[];
      grind?: string;
      price?: number;
      quantity?: number;
    }
  ) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  addCoupon: (c: Omit<Coupon, 'id' | 'usageCount'>) => void;
  deleteCoupon: (id: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  cancelOrder: (orderId: string) => void;

  // Addresses
  addresses: SavedAddress[];
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'status'>) => void;
  replyToReview: (reviewId: string, reply: string) => void;
  approveReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;

  // Modals & UI View
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (p: Product | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register' | 'forgot';
  setAuthModalTab: (tab: 'login' | 'register' | 'forgot') => void;
  activeView: 'home' | 'catalog' | 'dashboard' | 'admin';
  setActiveView: (view: 'home' | 'catalog' | 'dashboard' | 'admin') => void;

  // Quick Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_USER: User = {
  id: 'user-demo-customer',
  name: 'Julian Vance',
  email: 'julian.vance@example.com',
  phone: '+1 (555) 234-8901',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bio: 'Specialty pour-over enthusiast & home barista.',
  rewardPoints: 340,
  joinedDate: '2025-06-12',
  notificationPreferences: {
    orderUpdates: true,
    roastAlerts: true,
    promotionalOffers: true,
    newsletter: true
  }
};

const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string }> = {
  USD: { rate: 1.0, symbol: '$' },
  EUR: { rate: 0.92, symbol: '€' },
  GBP: { rate: 0.78, symbol: '£' },
  INR: { rate: 83.5, symbol: '₹' }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currency, setCurrency] = useState<Currency>('USD');

  // Auth & Roles
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [role, setRole] = useState<Role>('customer');

  // Navigation / Views
  const [activeView, setActiveView] = useState<'home' | 'catalog' | 'dashboard' | 'admin'>('home');

  // Products
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<CoffeeCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      productId: 'prod-3',
      name: 'Roasted Hazelnut Praline Latte',
      price: 6.25,
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=300&q=80',
      quantity: 1,
      selectedSize: 'Medium (12 oz)',
      selectedMilk: 'Oat Milk (Barista Edition)',
      selectedSugar: 'Half Sweet (50%)',
      itemTotalPrice: 7.00
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-9']);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Orders
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Addresses
  const [addresses, setAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync dark class on documentElement
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const formatPrice = (amountInUSD: number): string => {
    const config = CURRENCY_RATES[currency];
    const converted = amountInUSD * config.rate;
    return `${config.symbol}${converted.toFixed(2)}`;
  };

  // User Profile
  const login = (email: string, targetRole: Role = 'customer') => {
    const isNewAdmin = targetRole === 'admin' || email.includes('admin');
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0] || 'Coffee Connoisseur',
      email,
      role: isNewAdmin ? 'admin' : 'customer',
      avatar: isNewAdmin
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rewardPoints: 100,
      joinedDate: new Date().toISOString().split('T')[0],
      notificationPreferences: {
        orderUpdates: true,
        roastAlerts: true,
        promotionalOffers: true,
        newsletter: true
      }
    };
    setUser(newUser);
    setRole(newUser.role);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${newUser.name}! Logged in as ${newUser.role}.`);
  };

  const logout = () => {
    setUser(null);
    setRole('customer');
    setActiveView('home');
    showToast('Signed out successfully.');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    setUser(prev => (prev ? { ...prev, ...updates } : null));
    showToast('Profile updated successfully.');
  };

  // Cart Management
  const addToCart = (
    product: Product,
    options?: {
      size?: string;
      milk?: string;
      sugar?: string;
      toppings?: string[];
      grind?: string;
      price?: number;
      quantity?: number;
    }
  ) => {
    const qty = options?.quantity || 1;
    const basePrice = options?.price !== undefined ? options.price : product.price;
    const sizeName = options?.size || 'Standard';

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: product.id,
      name: product.name,
      price: basePrice,
      image: product.images[0],
      quantity: qty,
      selectedSize: sizeName,
      selectedMilk: options?.milk,
      selectedSugar: options?.sugar,
      selectedToppings: options?.toppings,
      selectedGrind: options?.grind,
      itemTotalPrice: basePrice * qty
    };

    setCart(prev => [...prev, newItem]);
    showToast(`Added "${product.name}" to cart!`);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              itemTotalPrice: item.price * quantity
            }
          : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
    showToast('Item removed from cart.');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Coupons
  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const found = coupons.find(c => c.code === normalized && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    if (found.minSpend && cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Minimum order of $${found.minSpend} required for this coupon.`
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Coupon "${found.code}" applied! ${found.discountPercentage}% discount.`
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const discountAmount = appliedCoupon
    ? Math.min(
        (cartSubtotal * appliedCoupon.discountPercentage) / 100,
        appliedCoupon.maxDiscount || Infinity
      )
    : 0;

  const addCoupon = (newCoupon: Omit<Coupon, 'id' | 'usageCount'>) => {
    const created: Coupon = {
      ...newCoupon,
      id: `coup-${Date.now()}`,
      usageCount: 0
    };
    setCoupons(prev => [created, ...prev]);
    showToast(`Coupon ${created.code} created.`);
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon removed.');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist!');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      trackingNumber: `VR-${Math.floor(1000000 + Math.random() * 9000000)}-US`
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);

    // Give loyalty reward beans
    if (user) {
      setUser(prev =>
        prev
          ? {
              ...prev,
              rewardPoints: prev.rewardPoints + Math.floor(newOrder.total * 10)
            }
          : null
      );
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, orderStatus: status } : ord))
    );
    showToast(`Order ${orderId} updated to ${status}.`);
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, orderStatus: 'cancelled' } : ord))
    );
    showToast(`Order ${orderId} has been cancelled.`);
  };

  // Addresses
  const addAddress = (addr: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = {
      ...addr,
      id: `addr-${Date.now()}`
    };
    if (newAddr.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(newAddr));
    } else {
      setAddresses(prev => [...prev, newAddr]);
    }
    showToast('New shipping address saved.');
  };

  const updateAddress = (id: string, updates: Partial<SavedAddress>) => {
    setAddresses(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates } : updates.isDefault ? { ...a, isDefault: false } : a))
    );
    showToast('Address updated.');
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast('Address deleted.');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    showToast('Default delivery address changed.');
  };

  // Product Catalog CRUD (Admin)
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...p,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(`Added product "${newProd.name}".`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Product updated successfully.');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted.');
  };

  // Reviews
  const addReview = (newRev: Omit<Review, 'id' | 'date' | 'status'>) => {
    const created: Review = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'approved'
    };
    setReviews(prev => [created, ...prev]);
    showToast('Review submitted! Thank you for the feedback.');
  };

  const replyToReview = (reviewId: string, reply: string) => {
    setReviews(prev =>
      prev.map(r => (r.id === reviewId ? { ...r, adminReply: reply } : r))
    );
    showToast('Reply published.');
  };

  const approveReview = (reviewId: string) => {
    setReviews(prev =>
      prev.map(r => (r.id === reviewId ? { ...r, status: 'approved' } : r))
    );
    showToast('Review approved.');
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    showToast('Review removed.');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currency,
        setCurrency,
        formatPrice,
        user,
        role,
        setRole,
        login,
        logout,
        updateUserProfile,
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotalCount,
        isCartOpen,
        setIsCartOpen,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        addCoupon,
        deleteCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        reviews,
        addReview,
        replyToReview,
        approveReview,
        deleteReview,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeProductModal,
        setActiveProductModal,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        activeView,
        setActiveView,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
