import { IProduct, ICategory, IReview, IOrder, IUser, IDemandForecast, IRecommendationResponse, IReviewSummary, IUserPreferences } from '../types.js';

export const api = {
  // Categories
  async getCategories(): Promise<ICategory[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  // Products
  async getProducts(params?: { category?: string; brand?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string; badge?: string }): Promise<IProduct[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.brand) query.append('brand', params.brand);
    if (params?.search) query.append('search', params.search);
    if (params?.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
    if (params?.sort) query.append('sort', params.sort);
    if (params?.badge) query.append('badge', params.badge);

    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProductById(id: string): Promise<IProduct> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  async createProduct(product: Partial<IProduct>): Promise<IProduct> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async updateProduct(id: string, updates: Partial<IProduct>): Promise<IProduct> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  async getBundle(productId: string): Promise<{ items: IProduct[]; comboPrice: number; discountSavings: number }> {
    const res = await fetch(`/api/products/${productId}/bundle`);
    if (!res.ok) throw new Error('Failed to fetch bundle');
    return res.json();
  },

  async getSimilar(productId: string): Promise<IProduct[]> {
    const res = await fetch(`/api/products/${productId}/similar`);
    if (!res.ok) throw new Error('Failed to fetch similar products');
    return res.json();
  },

  // Reviews
  async getReviews(productId?: string): Promise<IReview[]> {
    const query = productId ? `?productId=${productId}` : '';
    const res = await fetch(`/api/reviews${query}`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async addReview(review: Partial<IReview>): Promise<IReview> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  async getReviewSummary(productId: string): Promise<IReviewSummary> {
    const res = await fetch(`/api/reviews/summary/${productId}`);
    if (!res.ok) throw new Error('Failed to fetch review summary');
    return res.json();
  },

  // Recommendations
  async getRecommendations(userId = 'usr-demo-01'): Promise<IRecommendationResponse> {
    const res = await fetch(`/api/recommendations?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  // Comparison
  async compareProducts(productIds: string[]): Promise<{
    verdict: string;
    bestFor: Record<string, string>;
    comparisonPoints: Array<{ feature: string; values: Record<string, string>; winnerId: string }>;
  }> {
    const res = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds })
    });
    if (!res.ok) throw new Error('Failed to generate product comparison');
    return res.json();
  },

  // AI Chat
  async sendChatMessage(message: string, history: Array<{ role: 'user' | 'model'; text: string }>, userId = 'usr-demo-01'): Promise<{ message: string; recommendedProducts: IProduct[] }> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, userId })
    });
    if (!res.ok) throw new Error('Failed to chat with AI');
    return res.json();
  },

  // Orders
  async getOrders(userId?: string): Promise<IOrder[]> {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`/api/orders${query}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async getOrderById(id: string): Promise<IOrder> {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error('Failed to fetch order');
    return res.json();
  },

  async createOrder(orderData: any): Promise<IOrder> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Failed to place order');
    return res.json();
  },

  async updateOrderStatus(id: string, status: string): Promise<IOrder> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  // Forecast & Demand Analytics
  async getProductForecast(productId: string): Promise<IDemandForecast> {
    const res = await fetch(`/api/forecast/${productId}`);
    if (!res.ok) throw new Error('Failed to fetch product forecast');
    return res.json();
  },

  async getPlatformDemandOverview(): Promise<any> {
    const res = await fetch('/api/forecast/platform/overview');
    if (!res.ok) throw new Error('Failed to fetch demand overview');
    return res.json();
  },

  // User Profile & Preferences
  async getUserProfile(): Promise<IUser> {
    const res = await fetch('/api/user/profile');
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async updateUserPreferences(preferences: Partial<IUserPreferences>): Promise<IUser> {
    const res = await fetch('/api/user/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences)
    });
    if (!res.ok) throw new Error('Failed to update preferences');
    return res.json();
  },

  async logActivity(activity: { userId: string; productId: string; category: string; activityType: string }): Promise<void> {
    try {
      await fetch('/api/user/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });
    } catch {
      // Non-blocking telemetry
    }
  },

  async clearUserPrivacy(userId = 'usr-demo-01'): Promise<{ message: string }> {
    const res = await fetch(`/api/user/privacy?userId=${userId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to reset privacy data');
    return res.json();
  }
};
