import { IOrder } from '../../src/types.js';

export const SEED_ORDERS: IOrder[] = [
  {
    id: 'ord-1001',
    orderNumber: 'NEX-88921-A',
    userId: 'usr-demo-01',
    customerName: 'Karan Malhotra',
    customerEmail: 'karan.malhotra@techuniv.edu',
    items: [
      {
        productId: 'prod-lap-02',
        productName: 'Pro-Book Air M2 Dev',
        price: 58900,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
        brand: 'Apex'
      },
      {
        productId: 'prod-desk-05',
        productName: 'PowerHub 140W GaN 4-Port Fast Charger',
        price: 2999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
        brand: 'NovaTech'
      }
    ],
    subtotal: 61899,
    shipping: 0,
    tax: 3094,
    discount: 1000,
    couponCode: 'NEXORA1000',
    total: 63993,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    orderStatus: 'OUT_FOR_DELIVERY',
    deliverySpeed: 'EXPRESS',
    shippingAddress: {
      fullName: 'Karan Malhotra',
      street: 'Flat 402, Quantum Heights, Silicon Valley Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560103',
      country: 'India',
      phone: '+91 98765 43210'
    },
    trackingNumber: 'NEX-TRK-78829104',
    estimatedDelivery: '2026-09-02T18:00:00Z',
    timeline: [
      {
        status: 'PLACED',
        timestamp: '2026-08-30T10:14:00Z',
        title: 'Order Placed & Payment Verified',
        description: 'Payment of ₹63,993 received securely via UPI.',
        completed: true,
        current: false
      },
      {
        status: 'CONFIRMED',
        timestamp: '2026-08-30T11:00:00Z',
        title: 'Order Confirmed by Fulfillment Center',
        description: 'Inventory allocated at Bengaluru Hub-04.',
        completed: true,
        current: false
      },
      {
        status: 'PACKED',
        timestamp: '2026-08-31T08:30:00Z',
        title: 'Item Packed with Tamper-Proof Seal',
        description: 'QC passed and prepared for high-speed transit.',
        completed: true,
        current: false
      },
      {
        status: 'SHIPPED',
        timestamp: '2026-08-31T14:45:00Z',
        title: 'Dispatched via HyperExpress Logistics',
        description: 'Airway Bill generated (AWB: NEX-TRK-78829104).',
        completed: true,
        current: false
      },
      {
        status: 'OUT_FOR_DELIVERY',
        timestamp: '2026-09-01T07:15:00Z',
        title: 'Out for Delivery',
        description: 'Courier partner is en route to your shipping address.',
        completed: false,
        current: true
      },
      {
        status: 'DELIVERED',
        timestamp: '',
        title: 'Delivered',
        description: 'Package delivered to recipient.',
        completed: false,
        current: false
      }
    ],
    createdAt: '2026-08-30T10:14:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'NEX-77192-B',
    userId: 'usr-demo-01',
    customerName: 'Karan Malhotra',
    customerEmail: 'karan.malhotra@techuniv.edu',
    items: [
      {
        productId: 'prod-aud-02',
        productName: 'SonicPod ANC Studio Wireless',
        price: 4499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
        brand: 'AuraSound'
      }
    ],
    subtotal: 4499,
    shipping: 0,
    tax: 225,
    discount: 0,
    total: 4724,
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    deliverySpeed: 'STANDARD',
    shippingAddress: {
      fullName: 'Karan Malhotra',
      street: 'Flat 402, Quantum Heights, Silicon Valley Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560103',
      country: 'India',
      phone: '+91 98765 43210'
    },
    trackingNumber: 'NEX-TRK-66190283',
    estimatedDelivery: '2026-08-25T17:00:00Z',
    timeline: [
      {
        status: 'PLACED',
        timestamp: '2026-08-22T09:00:00Z',
        title: 'Order Placed',
        description: 'Payment received.',
        completed: true,
        current: false
      },
      {
        status: 'CONFIRMED',
        timestamp: '2026-08-22T09:30:00Z',
        title: 'Order Confirmed',
        description: 'Order details verified.',
        completed: true,
        current: false
      },
      {
        status: 'PACKED',
        timestamp: '2026-08-22T15:00:00Z',
        title: 'Packed',
        description: 'Package ready for pickup.',
        completed: true,
        current: false
      },
      {
        status: 'SHIPPED',
        timestamp: '2026-08-23T08:00:00Z',
        title: 'Shipped',
        description: 'In transit to delivery city.',
        completed: true,
        current: false
      },
      {
        status: 'OUT_FOR_DELIVERY',
        timestamp: '2026-08-25T08:30:00Z',
        title: 'Out for Delivery',
        description: 'Courier out for delivery.',
        completed: true,
        current: false
      },
      {
        status: 'DELIVERED',
        timestamp: '2026-08-25T14:10:00Z',
        title: 'Delivered',
        description: 'Handed over directly to customer.',
        completed: true,
        current: true
      }
    ],
    createdAt: '2026-08-22T09:00:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'NEX-55401-C',
    userId: 'usr-demo-02',
    customerName: 'Meera Nambiar',
    customerEmail: 'meera.nambiar@domain.com',
    items: [
      {
        productId: 'prod-foot-02',
        productName: 'Veloce College Daily Glide 5',
        price: 2199,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
        brand: 'Veloce'
      },
      {
        productId: 'prod-wear-02',
        productName: 'PulseTrack Active 3 Fitness Watch',
        price: 3899,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
        brand: 'Vanguard'
      }
    ],
    subtotal: 6098,
    shipping: 0,
    tax: 304,
    discount: 500,
    total: 5902,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    orderStatus: 'PACKED',
    deliverySpeed: 'EXPRESS',
    shippingAddress: {
      fullName: 'Meera Nambiar',
      street: '12-B Coral Residency, MG Road',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411001',
      country: 'India',
      phone: '+91 99887 76655'
    },
    trackingNumber: 'NEX-TRK-99018471',
    estimatedDelivery: '2026-09-03T16:00:00Z',
    timeline: [
      {
        status: 'PLACED',
        timestamp: '2026-08-31T18:00:00Z',
        title: 'Order Placed',
        description: 'Payment confirmed.',
        completed: true,
        current: false
      },
      {
        status: 'CONFIRMED',
        timestamp: '2026-08-31T18:45:00Z',
        title: 'Order Confirmed',
        description: 'Inventory reserved.',
        completed: true,
        current: false
      },
      {
        status: 'PACKED',
        timestamp: '2026-09-01T06:00:00Z',
        title: 'Packed',
        description: 'Awaiting courier pickup.',
        completed: true,
        current: true
      },
      {
        status: 'SHIPPED',
        timestamp: '',
        title: 'Shipped',
        description: 'Handover to courier.',
        completed: false,
        current: false
      },
      {
        status: 'OUT_FOR_DELIVERY',
        timestamp: '',
        title: 'Out for Delivery',
        description: 'Out for final delivery.',
        completed: false,
        current: false
      },
      {
        status: 'DELIVERED',
        timestamp: '',
        title: 'Delivered',
        description: 'Package delivered.',
        completed: false,
        current: false
      }
    ],
    createdAt: '2026-08-31T18:00:00Z'
  }
];
