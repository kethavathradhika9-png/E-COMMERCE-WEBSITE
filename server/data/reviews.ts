import { IReview } from '../../src/types.js';

export const SEED_REVIEWS: IReview[] = [
  // Reviews for Zenith Ultra 14 Pro (prod-lap-01)
  {
    id: 'rev-01',
    productId: 'prod-lap-01',
    userId: 'usr-dev-01',
    userName: 'Aarav Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    headline: 'Unmatched performance for compiling Docker microservices',
    comment: 'The 32GB RAM and Intel Ultra 7 handle multiple Android emulators and Docker containers effortlessly. The 3K OLED screen is stunning for long coding sessions.',
    sentiment: 'POSITIVE',
    sentimentScore: 0.94,
    aspects: [
      { aspect: 'Performance', sentiment: 'POSITIVE', mention: 'flawless Docker compilation' },
      { aspect: 'Build Quality', sentiment: 'POSITIVE', mention: 'solid CNC aluminum body' },
      { aspect: 'Battery', sentiment: 'POSITIVE', mention: 'lasts 12 hours easily' }
    ],
    verifiedPurchase: true,
    helpfulCount: 42,
    createdAt: '2026-08-10T14:20:00Z'
  },
  {
    id: 'rev-02',
    productId: 'prod-lap-01',
    userId: 'usr-dev-02',
    userName: 'Priya Venkatesh',
    rating: 5,
    headline: 'Best programming machine for my B.Tech engineering coursework',
    comment: 'Screen is gorgeous and keyboard travel is tactile. Price is slightly premium but value for money is outstanding considering the 32GB RAM and 1TB SSD.',
    sentiment: 'POSITIVE',
    sentimentScore: 0.91,
    aspects: [
      { aspect: 'Comfort', sentiment: 'POSITIVE', mention: 'great keyboard feel' },
      { aspect: 'Value for Money', sentiment: 'POSITIVE', mention: 'worth the 32GB spec' }
    ],
    verifiedPurchase: true,
    helpfulCount: 18,
    createdAt: '2026-08-15T09:12:00Z'
  },
  {
    id: 'rev-03',
    productId: 'prod-lap-01',
    userId: 'usr-dev-03',
    userName: 'Rohan Deshmukh',
    rating: 4,
    headline: 'Superb machine, fans ramp up during heavy ML model training',
    comment: 'Great overall build and battery. When training neural nets on CPU, the fans get audible, but temperatures remain within 78°C safely.',
    sentiment: 'NEUTRAL',
    sentimentScore: 0.45,
    aspects: [
      { aspect: 'Performance', sentiment: 'POSITIVE', mention: 'handles ML models well' },
      { aspect: 'Comfort', sentiment: 'NEUTRAL', mention: 'fan noise audible under heavy load' }
    ],
    verifiedPurchase: true,
    helpfulCount: 29,
    createdAt: '2026-08-22T16:00:00Z'
  },

  // Reviews for Pro-Book Air M2 Dev (prod-lap-02)
  {
    id: 'rev-04',
    productId: 'prod-lap-02',
    userId: 'usr-dev-04',
    userName: 'Karthik Rao',
    rating: 5,
    headline: 'Silent, lightweight and battery lasts 2 full college days!',
    comment: 'Completely silent with zero fan noise. Liquid Retina screen is sharp and text clarity is crisp. Best laptop under ₹60,000 for college students.',
    sentiment: 'POSITIVE',
    sentimentScore: 0.96,
    aspects: [
      { aspect: 'Battery', sentiment: 'POSITIVE', mention: '18 hours battery life' },
      { aspect: 'Build Quality', sentiment: 'POSITIVE', mention: 'unibody finish' },
      { aspect: 'Value for Money', sentiment: 'POSITIVE', mention: 'best buy under 60k' }
    ],
    verifiedPurchase: true,
    helpfulCount: 88,
    createdAt: '2026-07-28T11:30:00Z'
  },
  {
    id: 'rev-05',
    productId: 'prod-lap-02',
    userId: 'usr-dev-05',
    userName: 'Ananya Mehta',
    rating: 5,
    headline: 'Essential for mobile and web frontend engineering',
    comment: '16GB RAM is snappy for VS Code, React Native simulators, and Figma simultaneously. Highly recommend this over bulky gaming laptops.',
    sentiment: 'POSITIVE',
    sentimentScore: 0.92,
    aspects: [
      { aspect: 'Performance', sentiment: 'POSITIVE', mention: 'quick app compilation' },
      { aspect: 'Comfort', sentiment: 'POSITIVE', mention: 'featherweight in backpack' }
    ],
    verifiedPurchase: true,
    helpfulCount: 54,
    createdAt: '2026-08-04T13:45:00Z'
  },

  // Reviews for EliteBook X1 Gen 4 Code Edition (prod-lap-03)
  {
    id: 'rev-06',
    productId: 'prod-lap-03',
    userId: 'usr-dev-06',
    userName: 'Vikram Choudhury',
    rating: 5,
    headline: 'Unbeatable budget programming laptop under ₹45,000',
    comment: 'Ryzen 7 8-core CPU crushes multi-threaded tasks. Upgraded RAM to 32GB easily via the secondary slot. Battery gives 9 hours of continuous coding.',
    sentiment: 'POSITIVE',
    sentimentScore: 0.93,
    aspects: [
      { aspect: 'Performance', sentiment: 'POSITIVE', mention: 'fast 8-core Ryzen' },
      { aspect: 'Value for Money', sentiment: 'POSITIVE', mention: 'unbeatable price to performance' },
      { aspect: 'Battery', sentiment: 'POSITIVE', mention: '9 hours battery' }
    ],
    verifiedPurchase: true,
    helpfulCount: 71,
    createdAt: '2026-07-15T10:10:00Z'
  },

  // Reviews for SonicPod ANC Studio Wireless (prod-aud-02)
  {
    id: 'rev-07',
    productId: 'prod-aud-02',
    userId: 'usr-dev-07',
    userName: 'Divya Iyer',
    rating: 5,
    headline: 'ANC blocks out entire hostel and cafe chatter under ₹5000',
    comment: 'The -35dB noise cancellation is surprising at this price point. Sound signature is balanced with punchy bass. Plush ear pads do not hurt ears during 6-hour hackathons.',
    sentiment: 'POSITIVE',
    sentimentScore: 0.95,
    aspects: [
      { aspect: 'Sound Quality', sentiment: 'POSITIVE', mention: 'balanced punchy bass' },
      { aspect: 'Comfort', sentiment: 'POSITIVE', mention: 'no ear fatigue' },
      { aspect: 'Value for Money', sentiment: 'POSITIVE', mention: 'exceptional ANC under 5k' }
    ],
    verifiedPurchase: true,
    helpfulCount: 112,
    createdAt: '2026-08-01T15:20:00Z'
  },
  {
    id: 'rev-08',
    productId: 'prod-aud-02',
    userId: 'usr-dev-08',
    userName: 'Tanmay Saxena',
    rating: 4,
    headline: 'Solid ANC and battery, microphone is average in windy outdoors',
    comment: 'Battery easily hits 38+ hours. Inside rooms the call quality is great, but outdoors in heavy wind the mic picks up some breeze.',
    sentiment: 'POSITIVE',
    sentimentScore: 0.72,
    aspects: [
      { aspect: 'Battery', sentiment: 'POSITIVE', mention: 'lasts almost 40 hours' },
      { aspect: 'Build Quality', sentiment: 'NEUTRAL', mention: 'mic sensitive to outdoor wind' }
    ],
    verifiedPurchase: true,
    helpfulCount: 34,
    createdAt: '2026-08-18T17:40:00Z'
  },

  // Reviews for Veloce College Daily Glide 5 (prod-foot-02)
  {
    id: 'rev-09',
    productId: 'prod-foot-02',
    userId: 'usr-dev-09',
    userName: 'Aditya Sen',
    rating: 5,
    headline: 'Super comfy running shoes for campus walking under ₹2500',
    comment: 'I walk over 8,000 steps daily on campus and these feel like walking on clouds. Excellent grip on wet pavements and breathable mesh keeps feet cool.',
    sentiment: 'POSITIVE',
    sentimentScore: 0.97,
    aspects: [
      { aspect: 'Comfort', sentiment: 'POSITIVE', mention: 'cloud-like cushioning' },
      { aspect: 'Build Quality', sentiment: 'POSITIVE', mention: 'durable anti-slip rubber' },
      { aspect: 'Value for Money', sentiment: 'POSITIVE', mention: 'best college shoe under 2500' }
    ],
    verifiedPurchase: true,
    helpfulCount: 145,
    createdAt: '2026-07-22T08:30:00Z'
  },
  {
    id: 'rev-10',
    productId: 'prod-foot-02',
    userId: 'usr-dev-10',
    userName: 'Neha Kulkarni',
    rating: 5,
    headline: 'Great fit and style, perfect for gym and morning runs',
    comment: 'Fits true to size. Heel lock is snug and doesn’t slip. Clean modern aesthetic that pairs well with casual jeans or track pants.',
    sentiment: 'POSITIVE',
    sentimentScore: 0.91,
    aspects: [
      { aspect: 'Comfort', sentiment: 'POSITIVE', mention: 'snug heel fit' },
      { aspect: 'Design', sentiment: 'POSITIVE', mention: 'clean aesthetic' }
    ],
    verifiedPurchase: true,
    helpfulCount: 48,
    createdAt: '2026-08-05T12:15:00Z'
  },

  // Reviews for PulseFlow Air Wireless Buds (prod-aud-04)
  {
    id: 'rev-11',
    productId: 'prod-aud-04',
    userId: 'usr-dev-11',
    userName: 'Suresh Menon',
    rating: 5,
    headline: 'Awesome birthday gift for my roommate under ₹1500',
    comment: 'Bought this as a birthday gift. Sound clarity is crisp, pairing is instantaneous, and battery backup easily crosses 25 hours with case.',
    sentiment: 'POSITIVE',
    sentimentScore: 0.92,
    aspects: [
      { aspect: 'Value for Money', sentiment: 'POSITIVE', mention: 'great budget gift' },
      { aspect: 'Sound Quality', sentiment: 'POSITIVE', mention: 'crisp sound' },
      { aspect: 'Battery', sentiment: 'POSITIVE', mention: '25+ hours backup' }
    ],
    verifiedPurchase: true,
    helpfulCount: 65,
    createdAt: '2026-08-12T10:00:00Z'
  },

  // Reviews for Chronos Ultra Titanium Smartwatch (prod-wear-01)
  {
    id: 'rev-12',
    productId: 'prod-wear-01',
    userId: 'usr-dev-12',
    userName: 'Manish Verma',
    rating: 5,
    headline: 'Titanium grade build with exact GPS accuracy',
    comment: 'Battery lasts 14 full days with all sensors active. ECG reading matches my clinical monitor. Titanium case feels ultra-premium.',
    sentiment: 'POSITIVE',
    sentimentScore: 0.98,
    aspects: [
      { aspect: 'Build Quality', sentiment: 'POSITIVE', mention: 'Grade 5 Titanium' },
      { aspect: 'Battery', sentiment: 'POSITIVE', mention: '14-day real world battery' },
      { aspect: 'Performance', sentiment: 'POSITIVE', mention: 'precise dual GPS' }
    ],
    verifiedPurchase: true,
    helpfulCount: 92,
    createdAt: '2026-08-14T14:30:00Z'
  },

  // Reviews for KeySonic Pro Mechanical Keyboard (prod-desk-02)
  {
    id: 'rev-13',
    productId: 'prod-desk-02',
    userId: 'usr-dev-13',
    userName: 'Gaurav Patil',
    rating: 5,
    headline: 'Thocky sound profile and smooth pre-lubed switches',
    comment: 'CNC aluminum chassis gives satisfying weight and stability on desk. Multi-device Bluetooth switching between my MacBook and Windows PC is seamless.',
    sentiment: 'POSITIVE',
    sentimentScore: 0.95,
    aspects: [
      { aspect: 'Build Quality', sentiment: 'POSITIVE', mention: 'CNC aluminum body' },
      { aspect: 'Sound Quality', sentiment: 'POSITIVE', mention: 'deep thocky acoustic' },
      { aspect: 'Comfort', sentiment: 'POSITIVE', mention: 'smooth typing experience' }
    ],
    verifiedPurchase: true,
    helpfulCount: 104,
    createdAt: '2026-08-08T09:00:00Z'
  }
];
