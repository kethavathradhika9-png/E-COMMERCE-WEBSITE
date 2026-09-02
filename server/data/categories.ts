import { ICategory } from '../../src/types.js';

export const SEED_CATEGORIES: ICategory[] = [
  {
    id: 'cat-laptops',
    name: 'Laptops & Computing',
    slug: 'laptops-computing',
    description: 'High-performance machines for programming, creator workflows, and machine learning.',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    itemCount: 10
  },
  {
    id: 'cat-audio',
    name: 'Audio & Acoustics',
    slug: 'audio-acoustics',
    description: 'Audiophile ANC headphones, studio monitors, and lossless wireless earbuds.',
    icon: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    itemCount: 9
  },
  {
    id: 'cat-wearables',
    name: 'Smart Wearables',
    slug: 'smart-wearables',
    description: 'Biometric tracking smartwatches, health rings, and tactical outdoor GPS timepieces.',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    itemCount: 8
  },
  {
    id: 'cat-smartphones',
    name: 'Smartphones & Tablets',
    slug: 'smartphones-tablets',
    description: 'Flagship silicon, high-refresh OLED displays, and computational camera systems.',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    itemCount: 8
  },
  {
    id: 'cat-footwear',
    name: 'Performance Footwear',
    slug: 'performance-footwear',
    description: 'Carbon-plated marathon runners, lifestyle trainers, and ergonomic collegiate shoes.',
    icon: 'Footprints',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    itemCount: 8
  },
  {
    id: 'cat-workspace',
    name: 'Workspace & Ergonomics',
    slug: 'workspace-ergonomics',
    description: 'Minimalist desk accessories, mechanical keyboards, ergonomic seating, and 4K displays.',
    icon: 'Monitor',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    itemCount: 8
  }
];
