export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  images: string[];
  tags: string[];
  attributes?: Record<string, string | number>;
  stock: number;
  rating: number;
  reviewCount: number;
  specifications?: Record<string, string>;
  badges?: string[];
  priceHistory?: { date: string; price: number }[];
  isFeatured?: boolean;
  isTrending?: boolean;
  valueScore?: number;
  performanceScore?: number;
  specSummary?: string;
  badge?: string;
  complementaryProductIds?: string[];
  cheaperAlternativeId?: string;
  createdAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  productCount?: number;
  itemCount?: number;
}

export interface IReviewAspect {
  aspect: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  mention: string;
}

export interface IReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  headline: string;
  comment: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  sentimentScore: number;
  aspects?: IReviewAspect[];
  verifiedPurchase: boolean;
  helpfulCount?: number;
  createdAt: string;
}

export interface IReviewAspectBreakdown {
  aspect: string;
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
  summary: string;
}

export interface IReviewSummary {
  summary: string;
  pros: string[];
  cons: string[];
  sentimentScore: number;
  aspectBreakdown: IReviewAspectBreakdown[];
}

export interface IUserAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface IUserPreferences {
  preferredCategories: string[];
  preferredBrands: string[];
  typicalBudgetMin: number;
  typicalBudgetMax: number;
  priceSensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
  performancePriority: number; // 0-100%
  priceSensitivityPriority: number; // 0-100%
  brandAffinityPriority: number; // 0-100%
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  tier: 'SILVER' | 'GOLD' | 'PLATINUM-LEVEL';
  address: IUserAddress;
  preferences: IUserPreferences;
  createdAt: string;
}

export interface IUserActivity {
  id: string;
  userId: string;
  productId?: string;
  category?: string;
  activityType: 'VIEW' | 'SEARCH' | 'WISHLIST' | 'CART' | 'PURCHASE' | 'COMPARE';
  timestamp: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IOrderTimelineItem {
  status: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  timestamp: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
    brand: string;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  orderStatus: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  shippingAddress: IUserAddress;
  trackingNumber: string;
  estimatedDelivery: string;
  deliverySpeed: 'STANDARD' | 'EXPRESS';
  timeline: IOrderTimelineItem[];
  createdAt: string;
}

export interface ITimeSeriesPoint {
  date: string;
  units: number;
  revenue: number;
  confidenceUpper?: number;
  confidenceLower?: number;
}

export interface IDemandForecast {
  productId: string;
  productName: string;
  currentStock: number;
  predictedDemand7Days: number;
  predictedDemand30Days: number;
  stockoutRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  daysUntilStockout: number;
  reorderPoint: number;
  recommendedOrderQuantity: number;
  elasticity: number;
  dynamicPricing: {
    currentPrice: number;
    optimalPrice: number;
    competitorPrice: number;
    surgeMultiplier: number;
    strategy: string;
  };
  history: ITimeSeriesPoint[];
  forecast: ITimeSeriesPoint[];
}

export interface IRecommendationItem {
  product: IProduct;
  matchScore: number;
  reasons: string[];
  collaborativeScore: number;
  contentScore: number;
  popularityScore: number;
  strategy: 'HYBRID';
}

export interface IRecommendationResponse {
  recommendations: IRecommendationItem[];
  strategyUsed: string;
  userProfileSummary: {
    preferredCategories: string[];
    priceSensitivity: string;
    topInterests: string[];
  };
}
