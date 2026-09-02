import { IProduct, ICategory, IReview, IOrder, IUser, IUserActivity, IUserPreferences } from '../../src/types.js';
import { SEED_CATEGORIES } from '../data/categories.js';
import { SEED_PRODUCTS } from '../data/products.js';
import { SEED_REVIEWS } from '../data/reviews.js';
import { SEED_ORDERS } from '../data/orders.js';

export class DatabaseStore {
  private categories: ICategory[] = [...SEED_CATEGORIES];
  private products: IProduct[] = [...SEED_PRODUCTS];
  private reviews: IReview[] = [...SEED_REVIEWS];
  private orders: IOrder[] = [...SEED_ORDERS];
  private activities: IUserActivity[] = [];
  
  private defaultUser: IUser = {
    id: 'usr-demo-01',
    name: 'Karan Malhotra',
    email: 'karan.malhotra@techuniv.edu',
    role: 'USER',
    tier: 'PLATINUM-LEVEL',
    address: {
      fullName: 'Karan Malhotra',
      street: 'Flat 402, Quantum Heights, Silicon Valley Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560103',
      country: 'India',
      phone: '+91 98765 43210'
    },
    preferences: {
      preferredCategories: ['Laptops & Computing', 'Workspace & Ergonomics', 'Audio & Acoustics'],
      preferredBrands: ['Zenith', 'AuraSound', 'Apex'],
      typicalBudgetMin: 2000,
      typicalBudgetMax: 70000,
      priceSensitivity: 'MEDIUM',
      performancePriority: 88,
      priceSensitivityPriority: 62,
      brandAffinityPriority: 14
    },
    createdAt: '2026-01-01T00:00:00Z'
  };

  private users: IUser[] = [
    this.defaultUser,
    {
      id: 'usr-admin-01',
      name: 'System Architect Admin',
      email: 'admin@nexora.ai',
      role: 'ADMIN',
      tier: 'PLATINUM-LEVEL',
      address: {
        fullName: 'Admin Operations',
        street: 'NEXORA AI HQ, Sector 5',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560100',
        country: 'India',
        phone: '+91 98000 00000'
      },
      preferences: {
        preferredCategories: ['Laptops & Computing'],
        preferredBrands: ['Zenith'],
        typicalBudgetMin: 5000,
        typicalBudgetMax: 150000,
        priceSensitivity: 'LOW',
        performancePriority: 95,
        priceSensitivityPriority: 20,
        brandAffinityPriority: 40
      },
      createdAt: '2026-01-01T00:00:00Z'
    }
  ];

  constructor() {
    // Seed initial behavioral activities
    this.activities = [
      { id: 'act-1', userId: 'usr-demo-01', productId: 'prod-lap-02', category: 'Laptops & Computing', activityType: 'VIEW', timestamp: '2026-08-30T10:00:00Z' },
      { id: 'act-2', userId: 'usr-demo-01', productId: 'prod-lap-01', category: 'Laptops & Computing', activityType: 'COMPARE', timestamp: '2026-08-30T10:05:00Z' },
      { id: 'act-3', userId: 'usr-demo-01', productId: 'prod-lap-02', category: 'Laptops & Computing', activityType: 'CART', timestamp: '2026-08-30T10:10:00Z' },
      { id: 'act-4', userId: 'usr-demo-01', productId: 'prod-desk-05', category: 'Workspace & Ergonomics', activityType: 'CART', timestamp: '2026-08-30T10:12:00Z' },
      { id: 'act-5', userId: 'usr-demo-01', productId: 'prod-lap-02', category: 'Laptops & Computing', activityType: 'PURCHASE', timestamp: '2026-08-30T10:14:00Z' },
      { id: 'act-6', userId: 'usr-demo-01', productId: 'prod-aud-02', category: 'Audio & Acoustics', activityType: 'VIEW', timestamp: '2026-08-31T14:20:00Z' }
    ];
  }

  // Categories
  public getCategories(): ICategory[] {
    return this.categories;
  }

  // Products
  public getProducts(): IProduct[] {
    return this.products;
  }

  public getProductById(id: string): IProduct | undefined {
    return this.products.find(p => p.id === id || p.slug === id);
  }

  public addProduct(product: Omit<IProduct, 'id' | 'createdAt'>): IProduct {
    const newProduct: IProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<IProduct>): IProduct | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length < initialLen;
  }

  // Reviews
  public getReviews(productId?: string): IReview[] {
    if (productId) {
      return this.reviews.filter(r => r.productId === productId);
    }
    return this.reviews;
  }

  public addReview(review: Omit<IReview, 'id' | 'createdAt'>): IReview {
    const newReview: IReview = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.reviews.unshift(newReview);
    // Update product rating and review count
    const productReviews = this.reviews.filter(r => r.productId === newReview.productId);
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    this.updateProduct(newReview.productId, {
      rating: parseFloat(avgRating.toFixed(2)),
      reviewCount: productReviews.length
    });
    return newReview;
  }

  // Orders
  public getOrders(userId?: string): IOrder[] {
    if (userId) {
      return this.orders.filter(o => o.userId === userId);
    }
    return this.orders;
  }

  public getOrderById(id: string): IOrder | undefined {
    return this.orders.find(o => o.id === id || o.orderNumber === id || o.trackingNumber === id);
  }

  public createOrder(orderData: Omit<IOrder, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'timeline'>): IOrder {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `NEX-${randomNum}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const trackingNumber = `NEX-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date().toISOString();

    const newOrder: IOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      trackingNumber,
      orderStatus: 'CONFIRMED',
      timeline: [
        {
          status: 'PLACED',
          timestamp: now,
          title: 'Order Placed & Verified',
          description: `Total payment of ₹${orderData.total.toLocaleString('en-IN')} confirmed via ${orderData.paymentMethod}.`,
          completed: true,
          current: false
        },
        {
          status: 'CONFIRMED',
          timestamp: now,
          title: 'Order Confirmed',
          description: 'Inventory reserved from Regional Automated Warehouse.',
          completed: true,
          current: true
        },
        {
          status: 'PACKED',
          timestamp: '',
          title: 'Quality Checked & Packed',
          description: 'High-security packaging with tamper seals.',
          completed: false,
          current: false
        },
        {
          status: 'SHIPPED',
          timestamp: '',
          title: 'Dispatched via Air Courier',
          description: `Airway bill ${trackingNumber} allocated.`,
          completed: false,
          current: false
        },
        {
          status: 'OUT_FOR_DELIVERY',
          timestamp: '',
          title: 'Out for Final Delivery',
          description: 'Courier agent on route to delivery destination.',
          completed: false,
          current: false
        },
        {
          status: 'DELIVERED',
          timestamp: '',
          title: 'Delivered',
          description: 'Delivered directly to customer.',
          completed: false,
          current: false
        }
      ],
      createdAt: now
    };

    // Decrement stock for ordered items
    for (const item of orderData.items) {
      const prod = this.getProductById(item.productId);
      if (prod) {
        this.updateProduct(prod.id, {
          stock: Math.max(0, prod.stock - item.quantity)
        });
        // Log activity
        this.logActivity({
          userId: orderData.userId,
          productId: prod.id,
          category: prod.category,
          activityType: 'PURCHASE'
        });
      }
    }

    this.orders.unshift(newOrder);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: IOrder['orderStatus']): IOrder | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.orderStatus = status;
    const now = new Date().toISOString();
    const statusOrder: IOrder['orderStatus'][] = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const targetIdx = statusOrder.indexOf(status);

    order.timeline = order.timeline.map((item, idx) => {
      if (idx < targetIdx) {
        return { ...item, completed: true, current: false, timestamp: item.timestamp || now };
      } else if (idx === targetIdx) {
        return { ...item, completed: true, current: true, timestamp: now };
      } else {
        return { ...item, completed: false, current: false };
      }
    });

    return order;
  }

  // Users & Preferences
  public getUsers(): IUser[] {
    return this.users;
  }

  public getUserById(id: string): IUser | undefined {
    return this.users.find(u => u.id === id);
  }

  public updateUserPreferences(userId: string, preferences: Partial<IUserPreferences>): IUser | null {
    const user = this.getUserById(userId);
    if (!user) return null;
    user.preferences = { ...user.preferences, ...preferences };
    return user;
  }

  // Activities & GDPR Privacy
  public logActivity(activity: Omit<IUserActivity, 'id' | 'timestamp'>): IUserActivity {
    const newActivity: IUserActivity = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };
    this.activities.unshift(newActivity);
    if (this.activities.length > 500) {
      this.activities.pop();
    }
    return newActivity;
  }

  public getUserActivities(userId: string): IUserActivity[] {
    return this.activities.filter(a => a.userId === userId);
  }

  public clearUserActivities(userId: string): void {
    this.activities = this.activities.filter(a => a.userId !== userId);
  }
}

export const db = new DatabaseStore();
