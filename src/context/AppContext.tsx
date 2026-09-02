import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IProduct, IUser, ICartItem, ICategory, IRecommendationItem, IOrder } from '../types.js';
import { api } from '../services/api.js';

export interface IToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export type AppView = 'CATALOG' | 'RECOMMENDATIONS' | 'DEMAND_FORECAST' | 'ORDERS' | 'ADMIN' | 'PROFILE';

interface AppContextType {
  // Navigation & Views
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Catalog & Filter State
  products: IProduct[];
  categories: ICategory[];
  isLoadingProducts: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedBadge: string;
  setSelectedBadge: (b: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  refreshProducts: () => Promise<void>;

  // Product Modals & Selection
  selectedProduct: IProduct | null;
  setSelectedProduct: (product: IProduct | null) => void;
  
  // Cart & Orders
  cart: ICartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Comparison Matrix Tray
  compareList: IProduct[];
  addToCompare: (product: IProduct) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;

  // Conversational AI Assistant Drawer
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;

  // User Profile & Preferences
  currentUser: IUser | null;
  updatePreferences: (prefs: Partial<IUser['preferences']>) => Promise<void>;
  clearPrivacyData: () => Promise<void>;
  
  // Recommendations
  recommendations: IRecommendationItem[];
  isLoadingRecs: boolean;
  refreshRecommendations: () => Promise<void>;

  // Orders
  orders: IOrder[];
  refreshOrders: () => Promise<void>;
  placeOrder: (checkoutData: any) => Promise<IOrder>;

  // Toasts
  toasts: IToast[];
  addToast: (toast: Omit<IToast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('CATALOG');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [sortBy, setSortBy] = useState<string>('featured');

  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Cart state persisted locally
  const [cart, setCart] = useState<ICartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Comparison
  const [compareList, setCompareList] = useState<IProduct[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // AI Assistant Drawer
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // User Profile
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  // Recommendations
  const [recommendations, setRecommendations] = useState<IRecommendationItem[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  // Orders
  const [orders, setOrders] = useState<IOrder[]>([]);

  // Toasts
  const [toasts, setToasts] = useState<IToast[]>([]);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('nexora_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to persist cart:', e);
    }
  }, [cart]);

  // Save wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('nexora_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to persist wishlist:', e);
    }
  }, [wishlist]);

  // Initial Data Fetching
  const refreshProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const prods = await api.getProducts({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sort: sortBy !== 'featured' ? sortBy : undefined,
        badge: selectedBadge || undefined
      });
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
      addToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not load the latest product catalog.'
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const refreshRecommendations = async () => {
    setIsLoadingRecs(true);
    try {
      const res = await api.getRecommendations(currentUser?.id || 'usr-demo-01');
      if (res && Array.isArray(res.recommendations)) {
        setRecommendations(res.recommendations);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setRecommendations([]);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  const refreshOrders = async () => {
    try {
      const ords = await api.getOrders(currentUser?.id);
      setOrders(Array.isArray(ords) ? ords : []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setOrders([]);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        const [cats, userProfile] = await Promise.all([
          api.getCategories(),
          api.getUserProfile()
        ]);
        setCategories(cats);
        setCurrentUser(userProfile);
      } catch (e) {
        console.error('Init error:', e);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [selectedCategory, searchQuery, selectedBadge, priceRange, sortBy]);

  useEffect(() => {
    if (currentUser) {
      refreshRecommendations();
      refreshOrders();
    }
  }, [currentUser]);

  // Cart operations
  const addToCart = (product: IProduct, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });

    // Telemetry log
    if (currentUser) {
      api.logActivity({
        userId: currentUser.id,
        productId: product.id,
        category: product.category,
        activityType: 'CART'
      });
    }

    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added to your shopping bag.`
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast({ type: 'info', title: 'Removed', message: 'Item removed from your wishlist.' });
        return prev.filter(id => id !== productId);
      } else {
        addToast({ type: 'success', title: 'Saved', message: 'Item saved to your wishlist!' });
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare
  const addToCompare = (product: IProduct) => {
    if (compareList.some(p => p.id === product.id)) {
      addToast({ type: 'info', title: 'Already Added', message: 'Product is already in comparison tray.' });
      return;
    }
    if (compareList.length >= 4) {
      addToast({ type: 'warning', title: 'Tray Limit Reached', message: 'You can compare up to 4 items simultaneously.' });
      return;
    }
    setCompareList(prev => [...prev, product]);
    addToast({ type: 'success', title: 'Comparison Tray', message: `Added ${product.name} to comparison.` });
    
    if (currentUser) {
      api.logActivity({
        userId: currentUser.id,
        productId: product.id,
        category: product.category,
        activityType: 'COMPARE'
      });
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => setCompareList([]);

  // Preferences & Privacy
  const updatePreferences = async (prefs: Partial<IUser['preferences']>) => {
    try {
      const updated = await api.updateUserPreferences(prefs);
      setCurrentUser(updated);
      addToast({
        type: 'success',
        title: 'Preferences Updated',
        message: 'Your recommendation weights and explainability indices have re-computed.'
      });
      await refreshRecommendations();
    } catch (e) {
      addToast({ type: 'error', title: 'Update Failed', message: 'Could not update preferences.' });
    }
  };

  const clearPrivacyData = async () => {
    try {
      await api.clearUserPrivacy(currentUser?.id);
      addToast({
        type: 'success',
        title: 'Telemetry Cleared',
        message: 'All behavioral clickstreams and view history were permanently purged.'
      });
      await refreshRecommendations();
    } catch (e) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to reset privacy data.' });
    }
  };

  // Orders
  const placeOrder = async (checkoutData: any): Promise<IOrder> => {
    const newOrder = await api.createOrder({
      userId: currentUser?.id || 'usr-demo-01',
      customerName: currentUser?.name || 'Karan Malhotra',
      customerEmail: currentUser?.email || 'karan.malhotra@techuniv.edu',
      items: cart.map(c => ({
        productId: c.product.id,
        productName: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
        image: (c.product.images && c.product.images[0]) || '',
        brand: c.product.brand
      })),
      subtotal: cartTotal,
      shipping: checkoutData.shipping || 0,
      tax: Math.round(cartTotal * 0.05),
      discount: checkoutData.discount || 0,
      couponCode: checkoutData.couponCode || undefined,
      total: Math.max(0, cartTotal + (checkoutData.shipping || 0) + Math.round(cartTotal * 0.05) - (checkoutData.discount || 0)),
      paymentMethod: checkoutData.paymentMethod || 'UPI',
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      deliverySpeed: checkoutData.deliverySpeed || 'EXPRESS',
      shippingAddress: checkoutData.shippingAddress || currentUser?.address,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    });

    clearCart();
    await refreshProducts();
    await refreshOrders();
    return newOrder;
  };

  // Toast dispatchers
  const addToast = (toast: Omit<IToast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        products,
        categories,
        isLoadingProducts,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedBadge,
        setSelectedBadge,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        refreshProducts,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        currentUser,
        updatePreferences,
        clearPrivacyData,
        recommendations,
        isLoadingRecs,
        refreshRecommendations,
        orders,
        refreshOrders,
        placeOrder,
        toasts,
        addToast,
        removeToast
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
