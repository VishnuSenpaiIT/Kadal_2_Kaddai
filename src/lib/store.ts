import { useState, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
  image: string;
  origin: string;
  rating: number;
  reviews: number;
  stock: number;
  incomingStock: number;
  soldToday: number;
  price: number;
  b2bPrice: number;
  previousPrice: number;
  lastPriceUpdate: string;
  isVisibleConsumer: boolean;
  isVisibleB2B: boolean;
  bulkPricing?: { minQty: number; price: number }[];
  userReviews: { name: string; rating: number; comment: string }[];
  description?: string;
  details?: string;
  specs?: Record<string, string>;
}

export interface Category {
  id: number;
  name: string;
  status: 'Active' | 'Disabled';
  isVisibleConsumer: boolean;
  isVisibleB2B: boolean;
  order: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  priceAtOrder: number;
}

export interface Order {
  id: string;
  customerName: string;
  businessName?: string;
  type: 'Consumer' | 'B2B';
  items: OrderItem[];
  totalQuantity: number;
  totalPrice: number;
  deliverySlot: string;
  status: OrderStatus;
  createdAt: string;
}

export type SupplierType = 'Fisherman' | 'Agent' | 'Wholesaler';

export interface Vendor {
  id: number;
  name: string;
  location: string;
  type: SupplierType;
  fishTypes: string[];
  status: 'Active' | 'Inactive';
  contact?: string;
}

export interface SupplyEntry {
  id: number;
  vendorId: number;
  vendorName: string;
  fishName: string;
  pricePerKg: number;
  availableQty: number;
  supplyTime: 'Morning' | 'Evening';
  lastUpdated: string;
}

export interface VendorPerformance {
  vendorId: number;
  reliabilityScore: number;
  onTimeDelivery: number;
  avgPriceConsistency: number;
  lastStatus: 'Excellent' | 'Good' | 'Poor' | 'Critically Low';
}

export interface MediaItem {
  id: string;
  url: string;
  fileName: string;
  productId?: number;
  productName?: string;
  uploadDate: string;
}

export interface DeliverySlot {
  id: string;
  name: string;
  enabled: boolean;
  maxOrders?: number;
}

export interface Settings {
  platformName: string;
  defaultLanguage: string;
  contactEmail: string;
  contactPhone: string;
  deliverySlots: DeliverySlot[];
  defaultUnit: string;
  currency: string;
  priceRounding: boolean;
  consumerEnabled: boolean;
  b2bEnabled: boolean;
  autoHideOutOfStock: boolean;
  globalCategoryVisibility: boolean;
  enableNotifications: boolean;
  enableQuickEditMode: boolean;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Seafood (Regular Fish)', status: 'Active', isVisibleConsumer: true, isVisibleB2B: true, order: 1 },
  { id: 2, name: 'Shell Products (Prawns, Crab, Lobster)', status: 'Active', isVisibleConsumer: true, isVisibleB2B: true, order: 2 },
  { id: 3, name: 'Exotic Seafood', status: 'Active', isVisibleConsumer: true, isVisibleB2B: true, order: 3 },
  { id: 4, name: 'Freshwater / River Fish', status: 'Active', isVisibleConsumer: true, isVisibleB2B: true, order: 4 },
  { id: 5, name: 'Dry Fish', status: 'Active', isVisibleConsumer: true, isVisibleB2B: true, order: 5 },
  { id: 6, name: 'Small / Special Variants', status: 'Active', isVisibleConsumer: true, isVisibleB2B: true, order: 6 },
];

const INITIAL_PRODUCTS: Product[] = [
  // SEAFOOD (Regular Fish)
  { id: 1, name: 'Sankara', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.8, reviews: 0, stock: 100, incomingStock: 0, soldToday: 0, price: 450, b2bPrice: 400, previousPrice: 450, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 2, name: 'Black Pomfret', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.9, reviews: 0, stock: 50, incomingStock: 0, soldToday: 0, price: 850, b2bPrice: 800, previousPrice: 850, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 3, name: 'White Pomfret', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.9, reviews: 0, stock: 40, incomingStock: 0, soldToday: 0, price: 1100, b2bPrice: 1000, previousPrice: 1100, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 4, name: 'Sea Bass', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.7, reviews: 0, stock: 60, incomingStock: 0, soldToday: 0, price: 550, b2bPrice: 500, previousPrice: 550, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 5, name: 'Anchovy', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.5, reviews: 0, stock: 120, incomingStock: 0, soldToday: 0, price: 320, b2bPrice: 280, previousPrice: 320, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 6, name: 'Emperor', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.6, reviews: 0, stock: 45, incomingStock: 0, soldToday: 0, price: 680, b2bPrice: 620, previousPrice: 680, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 7, name: 'Lady Fish', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.4, reviews: 0, stock: 70, incomingStock: 0, soldToday: 0, price: 420, b2bPrice: 380, previousPrice: 420, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 8, name: 'Seer Fish', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 5.0, reviews: 0, stock: 35, incomingStock: 0, soldToday: 0, price: 1250, b2bPrice: 1150, previousPrice: 1250, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 9, name: 'Diamond Trevally', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.6, reviews: 0, stock: 55, incomingStock: 0, soldToday: 0, price: 480, b2bPrice: 440, previousPrice: 480, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 10, name: 'Grouper / Kalava', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.7, reviews: 0, stock: 40, incomingStock: 0, soldToday: 0, price: 720, b2bPrice: 650, previousPrice: 720, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 11, name: 'Indian Mackerel (Ayla)', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.5, reviews: 0, stock: 200, incomingStock: 0, soldToday: 0, price: 280, b2bPrice: 240, previousPrice: 280, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 12, name: 'Indian Salmon (Kala)', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.8, reviews: 0, stock: 50, incomingStock: 0, soldToday: 0, price: 950, b2bPrice: 880, previousPrice: 950, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 13, name: 'Mathi (Sardine)', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.4, reviews: 0, stock: 250, incomingStock: 0, soldToday: 0, price: 220, b2bPrice: 180, previousPrice: 220, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 14, name: 'Baby Shark', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.3, reviews: 0, stock: 30, incomingStock: 0, soldToday: 0, price: 580, b2bPrice: 520, previousPrice: 580, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 15, name: 'Milk Shark', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.4, reviews: 0, stock: 25, incomingStock: 0, soldToday: 0, price: 620, b2bPrice: 550, previousPrice: 620, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 16, name: 'Cat Fish', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.2, reviews: 0, stock: 80, incomingStock: 0, soldToday: 0, price: 380, b2bPrice: 340, previousPrice: 380, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 17, name: 'Karal Fish', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.3, reviews: 0, stock: 60, incomingStock: 0, soldToday: 0, price: 350, b2bPrice: 310, previousPrice: 350, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 18, name: 'Sole', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.5, reviews: 0, stock: 45, incomingStock: 0, soldToday: 0, price: 480, b2bPrice: 430, previousPrice: 480, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 19, name: 'Tuna', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Deep Sea', rating: 4.7, reviews: 0, stock: 90, incomingStock: 0, soldToday: 0, price: 550, b2bPrice: 500, previousPrice: 550, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 20, name: 'Colia', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.4, reviews: 0, stock: 55, incomingStock: 0, soldToday: 0, price: 420, b2bPrice: 380, previousPrice: 420, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 21, name: 'White Snapper', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.7, reviews: 0, stock: 40, incomingStock: 0, soldToday: 0, price: 780, b2bPrice: 720, previousPrice: 780, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 22, name: 'Red Snapper', category: 'Seafood (Regular Fish)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.8, reviews: 0, stock: 35, incomingStock: 0, soldToday: 0, price: 820, b2bPrice: 750, previousPrice: 820, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },

  // SHELL PRODUCTS (Prawns, Crab, Lobster)
  { id: 23, name: 'Tiger Prawns Jumbo', category: 'Shell Products (Prawns, Crab, Lobster)', unit: 'kg', image: '', origin: 'Coastal', rating: 5.0, reviews: 0, stock: 40, incomingStock: 0, soldToday: 0, price: 1450, b2bPrice: 1350, previousPrice: 1450, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 24, name: 'Tiger Prawns Tail On', category: 'Shell Products (Prawns, Crab, Lobster)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.9, reviews: 0, stock: 50, incomingStock: 0, soldToday: 0, price: 1150, b2bPrice: 1050, previousPrice: 1150, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 25, name: 'Sea White Prawns', category: 'Shell Products (Prawns, Crab, Lobster)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.8, reviews: 0, stock: 60, incomingStock: 0, soldToday: 0, price: 850, b2bPrice: 780, previousPrice: 850, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 26, name: 'Sea Prawns (Pink)', category: 'Shell Products (Prawns, Crab, Lobster)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.7, reviews: 0, stock: 80, incomingStock: 0, soldToday: 0, price: 650, b2bPrice: 600, previousPrice: 650, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 27, name: 'Tiger Prawns', category: 'Shell Products (Prawns, Crab, Lobster)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.8, reviews: 0, stock: 100, incomingStock: 0, soldToday: 0, price: 950, b2bPrice: 880, previousPrice: 950, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 28, name: 'Jinga Prawns', category: 'Shell Products (Prawns, Crab, Lobster)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.6, reviews: 0, stock: 120, incomingStock: 0, soldToday: 0, price: 550, b2bPrice: 500, previousPrice: 550, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 29, name: 'White Prawns (Sea)', category: 'Shell Products (Prawns, Crab, Lobster)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.8, reviews: 0, stock: 70, incomingStock: 0, soldToday: 0, price: 880, b2bPrice: 820, previousPrice: 880, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 30, name: 'Spotted Crab', category: 'Shell Products (Prawns, Crab, Lobster)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.7, reviews: 0, stock: 55, incomingStock: 0, soldToday: 0, price: 620, b2bPrice: 580, previousPrice: 620, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 31, name: 'Blue Crab Big', category: 'Shell Products (Prawns, Crab, Lobster)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.9, reviews: 0, stock: 45, incomingStock: 0, soldToday: 0, price: 850, b2bPrice: 780, previousPrice: 850, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 32, name: 'Small Lobster', category: 'Shell Products (Prawns, Crab, Lobster)', unit: 'kg', image: '', origin: 'Coastal', rating: 4.8, reviews: 0, stock: 20, incomingStock: 0, soldToday: 0, price: 1800, b2bPrice: 1650, previousPrice: 1800, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 33, name: 'Lobster', category: 'Shell Products (Prawns, Crab, Lobster)', unit: 'kg', image: '', origin: 'Coastal', rating: 5.0, reviews: 0, stock: 15, incomingStock: 0, soldToday: 0, price: 2500, b2bPrice: 2300, previousPrice: 2500, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },

  // EXOTIC SEAFOOD
  { id: 34, name: 'Green Mussel', category: 'Exotic Seafood', unit: 'kg', image: '', origin: 'Coastal', rating: 4.8, reviews: 0, stock: 30, incomingStock: 0, soldToday: 0, price: 1200, b2bPrice: 1100, previousPrice: 1200, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 35, name: 'Squid', category: 'Exotic Seafood', unit: 'kg', image: '', origin: 'Coastal', rating: 4.7, reviews: 0, stock: 50, incomingStock: 0, soldToday: 0, price: 750, b2bPrice: 700, previousPrice: 750, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },

  // FRESHWATER / RIVER FISH
  { id: 36, name: 'Katmeen (Pearl Spot)', category: 'Freshwater / River Fish', unit: 'kg', image: '', origin: 'Backwaters', rating: 4.9, reviews: 0, stock: 60, incomingStock: 0, soldToday: 0, price: 850, b2bPrice: 780, previousPrice: 850, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 37, name: 'Rohu (Koora)', category: 'Freshwater / River Fish', unit: 'kg', image: '', origin: 'River', rating: 4.5, reviews: 0, stock: 150, incomingStock: 0, soldToday: 0, price: 280, b2bPrice: 250, previousPrice: 280, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 38, name: 'Tilapia', category: 'Freshwater / River Fish', unit: 'kg', image: '', origin: 'Farm', rating: 4.4, reviews: 0, stock: 200, incomingStock: 0, soldToday: 0, price: 240, b2bPrice: 210, previousPrice: 240, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 39, name: 'Basa', category: 'Freshwater / River Fish', unit: 'kg', image: '', origin: 'Farm', rating: 4.6, reviews: 0, stock: 180, incomingStock: 0, soldToday: 0, price: 350, b2bPrice: 320, previousPrice: 350, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 40, name: 'Catla', category: 'Freshwater / River Fish', unit: 'kg', image: '', origin: 'River', rating: 4.5, reviews: 0, stock: 140, incomingStock: 0, soldToday: 0, price: 300, b2bPrice: 270, previousPrice: 300, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },

  // DRY FISH
  { id: 41, name: 'Nethili (Dry)', category: 'Dry Fish', unit: 'kg', image: '', origin: 'Local', rating: 4.6, reviews: 0, stock: 80, incomingStock: 0, soldToday: 0, price: 450, b2bPrice: 400, previousPrice: 450, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 42, name: 'Dry Prawns', category: 'Dry Fish', unit: 'kg', image: '', origin: 'Local', rating: 4.7, reviews: 0, stock: 70, incomingStock: 0, soldToday: 0, price: 650, b2bPrice: 600, previousPrice: 650, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 43, name: 'Dry Ribbon Fish', category: 'Dry Fish', unit: 'kg', image: '', origin: 'Local', rating: 4.4, reviews: 0, stock: 50, incomingStock: 0, soldToday: 0, price: 380, b2bPrice: 340, previousPrice: 380, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },
  { id: 44, name: 'Vanjiram Pieces', category: 'Dry Fish', unit: 'kg', image: '', origin: 'Local', rating: 4.9, reviews: 0, stock: 40, incomingStock: 0, soldToday: 0, price: 1200, b2bPrice: 1100, previousPrice: 1200, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] },

  // SMALL / SPECIAL VARIANTS
  { id: 45, name: 'Nethili (Small)', category: 'Small / Special Variants', unit: 'kg', image: '', origin: 'Coastal', rating: 4.5, reviews: 0, stock: 100, incomingStock: 0, soldToday: 0, price: 320, b2bPrice: 280, previousPrice: 320, lastPriceUpdate: new Date().toISOString(), isVisibleConsumer: true, isVisibleB2B: true, userReviews: [] }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    customerName: 'Aiden Smith',
    type: 'Consumer',
    items: [{ productId: 1, name: 'Wild Atlantic Salmon', quantity: 2, priceAtOrder: 24.99 }],
    totalQuantity: 2,
    totalPrice: 49.98,
    deliverySlot: 'Morning (9 AM - 12 PM)',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'ORD-1002',
    customerName: 'Coastal Delights LLC',
    businessName: 'Coastal Delights LLC',
    type: 'B2B',
    items: [
      { productId: 2, name: 'Jumbo Tiger Prawns', quantity: 15, priceAtOrder: 28.00 },
      { productId: 3, name: 'Fresh Bluefin Tuna', quantity: 5, priceAtOrder: 42.00 }
    ],
    totalQuantity: 20,
    totalPrice: 630.00,
    deliverySlot: 'Evening (4 PM - 7 PM)',
    status: 'Processing',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'ORD-1003',
    customerName: 'Emma Watson',
    type: 'Consumer',
    items: [{ productId: 4, name: 'Maine Lobster Tails', quantity: 1, priceAtOrder: 58.00 }],
    totalQuantity: 1,
    totalPrice: 58.00,
    deliverySlot: 'Afternoon (1 PM - 4 PM)',
    status: 'Delivered',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const INITIAL_VENDORS: Vendor[] = [
  { id: 1, name: 'Arctic Seafarms', location: 'Norway', type: 'Wholesaler', fishTypes: ['Salmon', 'Cod'], status: 'Active' },
  { id: 2, name: 'Vietnam Fresh LTD', location: 'Vietnam', type: 'Wholesaler', fishTypes: ['Prawns', 'Shrimp'], status: 'Active' },
  { id: 3, name: 'Tsukiji Direct', location: 'Japan', type: 'Agent', fishTypes: ['Tuna', 'Yellowtail'], status: 'Active' },
  { id: 4, name: 'Local Fisherman Group', location: 'USA', type: 'Fisherman', fishTypes: ['Lobster', 'Crab'], status: 'Active' },
  { id: 5, name: 'Atlantic Catch', location: 'Spain', type: 'Wholesaler', fishTypes: ['Octopus', 'Squid'], status: 'Active' },
];

const INITIAL_SUPPLY: SupplyEntry[] = [
  { id: 1, vendorId: 1, vendorName: 'Arctic Seafarms', fishName: 'Wild Atlantic Salmon', pricePerKg: 18.50, availableQty: 1500, supplyTime: 'Morning', lastUpdated: new Date().toISOString() },
  { id: 2, vendorId: 2, vendorName: 'Vietnam Fresh LTD', fishName: 'Jumbo Tiger Prawns', pricePerKg: 22.00, availableQty: 2500, supplyTime: 'Evening', lastUpdated: new Date().toISOString() },
  { id: 3, vendorId: 3, vendorName: 'Tsukiji Direct', fishName: 'Fresh Bluefin Tuna', pricePerKg: 38.00, availableQty: 400, supplyTime: 'Morning', lastUpdated: new Date().toISOString() },
  { id: 4, vendorId: 4, vendorName: 'Local Fisherman Group', fishName: 'Maine Lobster Tails', pricePerKg: 45.00, availableQty: 800, supplyTime: 'Morning', lastUpdated: new Date().toISOString() },
];

const INITIAL_PERFORMANCE: VendorPerformance[] = [
  { vendorId: 1, reliabilityScore: 98, onTimeDelivery: 99, avgPriceConsistency: 95, lastStatus: 'Excellent' },
  { vendorId: 2, reliabilityScore: 92, onTimeDelivery: 90, avgPriceConsistency: 88, lastStatus: 'Good' },
  { vendorId: 3, reliabilityScore: 100, onTimeDelivery: 100, avgPriceConsistency: 92, lastStatus: 'Excellent' },
  { vendorId: 4, reliabilityScore: 85, onTimeDelivery: 82, avgPriceConsistency: 90, lastStatus: 'Good' },
  { vendorId: 5, reliabilityScore: 78, onTimeDelivery: 75, avgPriceConsistency: 80, lastStatus: 'Poor' },
];

const INITIAL_SETTINGS: Settings = {
  platformName: 'Kadal 2 Kadaai',
  defaultLanguage: 'English',
  contactEmail: 'support@kadal2kadaai.com',
  contactPhone: '+91 9876543210',
  deliverySlots: [
    { id: '1', name: 'Morning (9 AM - 12 PM)', enabled: true, maxOrders: 50 },
    { id: '2', name: 'Afternoon (1 PM - 4 PM)', enabled: true, maxOrders: 30 },
    { id: '3', name: 'Evening (4 PM - 7 PM)', enabled: true, maxOrders: 40 },
  ],
  defaultUnit: 'kg',
  currency: '₹',
  priceRounding: true,
  consumerEnabled: true,
  b2bEnabled: true,
  autoHideOutOfStock: false,
  globalCategoryVisibility: true,
  enableNotifications: true,
  enableQuickEditMode: true,
};

// Simple global state using an event emitter pattern for prototype
type Listener = () => void;
const listeners = new Set<Listener>();

let currentProducts = [...INITIAL_PRODUCTS];
let currentCategories = [...INITIAL_CATEGORIES];
let currentOrders = [...INITIAL_ORDERS];
let currentVendors = [...INITIAL_VENDORS];
let currentSupply = [...INITIAL_SUPPLY];
let currentPerformance = [...INITIAL_PERFORMANCE];
let currentSettings = { ...INITIAL_SETTINGS };
let currentMedia: MediaItem[] = INITIAL_PRODUCTS.map(p => ({
  id: `media-${p.id}`,
  url: p.image,
  fileName: `${p.name.replace(/\s+/g, '_').toLowerCase()}.jpg`,
  productId: p.id,
  productName: p.name,
  uploadDate: new Date(Date.now() - Math.random() * 10000000000).toISOString()
}));

const notify = () => {
  listeners.forEach(l => l());
};

const getFishCategory = (name: string): string => {
  const fishKeywords = ['tuna', 'salmon', 'prawns', 'shrimp', 'crab', 'lobster', 'fish', 'cod', 'mackerel', 'sardine', 'squid', 'octopus', 'shellfish', 'crustaceans', 'mollusks'];
  const lowercaseName = name.toLowerCase();
  if (fishKeywords.some(keyword => lowercaseName.includes(keyword))) {
    return 'Fish';
  }
  return 'Others';
};

export const useStore = () => {
  const [products, setProducts] = useState(currentProducts);
  const [categories, setCategories] = useState(currentCategories);
  const [orders, setOrders] = useState(currentOrders);
  const [vendors, setVendors] = useState(currentVendors);
  const [supply, setSupply] = useState(currentSupply);
  const [performance, setPerformance] = useState(currentPerformance);
  const [settings, setSettings] = useState(currentSettings);
  const [media, setMedia] = useState(currentMedia);

  useEffect(() => {
    const listener = () => {
      setProducts([...currentProducts]);
      setCategories([...currentCategories]);
      setOrders([...currentOrders]);
      setVendors([...currentVendors]);
      setSupply([...currentSupply]);
      setPerformance([...currentPerformance]);
      setSettings({ ...currentSettings });
      setMedia([...currentMedia]);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const updateProduct = (id: number, updates: Partial<Product>) => {
    currentProducts = currentProducts.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    notify();
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Math.max(0, ...currentProducts.map(p => p.id)) + 1
    };
    currentProducts = [...currentProducts, newProduct];
    notify();
  };

  const deleteProduct = (id: number) => {
    currentProducts = currentProducts.filter(p => p.id !== id);
    notify();
  };

  const updateCategory = (id: number, updates: Partial<Category>) => {
    currentCategories = currentCategories.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ).sort((a, b) => a.order - b.order);
    notify();
  };

  const addCategory = (category: Omit<Category, 'id' | 'order'>) => {
    const newCategory = {
      ...category,
      id: Math.max(0, ...currentCategories.map(c => c.id)) + 1,
      order: Math.max(0, ...currentCategories.map(c => c.order)) + 1
    };
    currentCategories = [...currentCategories, newCategory].sort((a, b) => a.order - b.order);
    notify();
  };

  const deleteCategory = (id: number) => {
    // Check if products exist for this category
    const categoryToDelete = currentCategories.find(c => c.id === id);
    if (!categoryToDelete) return;
    
    const hasProducts = currentProducts.some(p => p.category === categoryToDelete.name);
    if (hasProducts) {
      throw new Error(`Cannot delete category "${categoryToDelete.name}" because it contains products. Reassign them first.`);
    }

    currentCategories = currentCategories.filter(c => c.id !== id);
    notify();
  };

  const reorderCategories = (newOrder: Category[]) => {
    currentCategories = newOrder.map((c, index) => ({ ...c, order: index + 1 }));
    notify();
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    
    // Reduce stock immediately
    order.items.forEach(item => {
      const product = currentProducts.find(p => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        product.soldToday += item.quantity;
      }
    });

    currentOrders = [newOrder, ...currentOrders];
    notify();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return;

    const oldStatus = order.status;
    if (oldStatus === newStatus) return;

    // Handle inventory logic
    if (newStatus === 'Cancelled' && oldStatus !== 'Cancelled') {
      // Restore stock
      order.items.forEach(item => {
        const product = currentProducts.find(p => p.id === item.productId);
        if (product) {
          product.stock += item.quantity;
          product.soldToday = Math.max(0, product.soldToday - item.quantity);
        }
      });
    } else if (oldStatus === 'Cancelled' && newStatus !== 'Cancelled') {
      // Re-reduce stock (e.g. if un-cancelled)
      order.items.forEach(item => {
        const product = currentProducts.find(p => p.id === item.productId);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          product.soldToday += item.quantity;
        }
      });
    }

    currentOrders = currentOrders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    notify();
  };

  const addVendor = (vendor: Omit<Vendor, 'id'>) => {
    const newVendor = {
      ...vendor,
      id: Math.max(0, ...currentVendors.map(v => v.id)) + 1
    };
    currentVendors = [...currentVendors, newVendor];
    currentPerformance = [...currentPerformance, {
      vendorId: newVendor.id,
      reliabilityScore: 0,
      onTimeDelivery: 0,
      avgPriceConsistency: 0,
      lastStatus: 'Good'
    }];
    notify();
  };

  const updateVendor = (id: number, updates: Partial<Vendor>) => {
    currentVendors = currentVendors.map(v => v.id === id ? { ...v, ...updates } : v);
    notify();
  };

  const deleteVendor = (id: number) => {
    currentVendors = currentVendors.filter(v => v.id !== id);
    currentSupply = currentSupply.filter(s => s.vendorId !== id);
    currentPerformance = currentPerformance.filter(p => p.vendorId !== id);
    notify();
  };

  const addSupplyEntry = (entry: Omit<SupplyEntry, 'id' | 'lastUpdated'>) => {
    const newEntry = {
      ...entry,
      id: Math.max(0, ...currentSupply.map(s => s.id)) + 1,
      lastUpdated: new Date().toISOString()
    };
    currentSupply = [...currentSupply, newEntry];
    
    // Inventory Connection Simulation: 
    // Link to incoming stock if the product exists
    const product = currentProducts.find(p => p.name === entry.fishName);
    if (product) {
       product.incomingStock += entry.availableQty;
    }
    
    notify();
  };

  const updateSupplyEntry = (id: number, updates: Partial<SupplyEntry>) => {
    const oldEntry = currentSupply.find(s => s.id === id);
    currentSupply = currentSupply.map(s => s.id === id ? { ...s, ...updates, lastUpdated: new Date().toISOString() } : s);
    
    // If quantity updated, adjust incoming stock
    if (updates.availableQty !== undefined && oldEntry) {
       const product = currentProducts.find(p => p.name === oldEntry.fishName);
       if (product) {
          product.incomingStock = Math.max(0, product.incomingStock - oldEntry.availableQty + updates.availableQty);
       }
    }
    
    notify();
  };

  const deleteSupplyEntry = (id: number) => {
    const entry = currentSupply.find(s => s.id === id);
    if (entry) {
       const product = currentProducts.find(p => p.name === entry.fishName);
       if (product) {
          product.incomingStock = Math.max(0, product.incomingStock - entry.availableQty);
       }
    }
    currentSupply = currentSupply.filter(s => s.id !== id);
    notify();
  };

  const addMedia = (files: { url: string; fileName: string }[]) => {
    const newItems: MediaItem[] = files.map(f => ({
      id: `media-${Math.random().toString(36).substr(2, 9)}`,
      url: f.url,
      fileName: f.fileName,
      uploadDate: new Date().toISOString()
    }));
    currentMedia = [...newItems, ...currentMedia];
    notify();
  };

  const updateMedia = (id: string, updates: Partial<MediaItem>) => {
    currentMedia = currentMedia.map(m => m.id === id ? { ...m, ...updates } : m);
    notify();
  };

  const deleteMedia = (id: string) => {
    const item = currentMedia.find(m => m.id === id);
    if (item?.productId) {
      // If linked to product, remove from product too
      currentProducts = currentProducts.map(p => 
        p.id === item.productId ? { ...p, image: 'https://picsum.photos/seed/placeholder/800/600' } : p
      );
    }
    currentMedia = currentMedia.filter(m => m.id !== id);
    notify();
  };

  const assignMediaToProduct = (mediaId: string, productId: number) => {
    const mediaItem = currentMedia.find(m => m.id === mediaId);
    const product = currentProducts.find(p => p.id === productId);
    
    if (mediaItem && product) {
      // Update media item link
      currentMedia = currentMedia.map(m => {
        // Unlink previous media from this product if any
        if (m.productId === productId) return { ...m, productId: undefined, productName: undefined };
        if (m.id === mediaId) return { ...m, productId, productName: product.name };
        return m;
      });
      
      // Update product image
      currentProducts = currentProducts.map(p => 
        p.id === productId ? { ...p, image: mediaItem.url } : p
      );
      
      notify();
    }
  };

  const updateSettings = (updates: Partial<Settings>) => {
    currentSettings = { ...currentSettings, ...updates };
    notify();
  };

  const resetSettings = () => {
    currentSettings = { ...INITIAL_SETTINGS };
    notify();
  };

  const bulkAddProducts = (newProducts: any[]) => {
    const existingCategories = new Set(currentCategories.map(c => c.name));
    
    newProducts.forEach(p => {
      let category = p.category;
      if (!category) {
        category = getFishCategory(p.name);
      }

      if (!existingCategories.has(category)) {
        const newCat = {
          id: Math.max(0, ...currentCategories.map(c => c.id)) + 1,
          name: category,
          status: 'Active' as const,
          isVisibleConsumer: true,
          isVisibleB2B: true,
          order: Math.max(0, ...currentCategories.map(c => c.order)) + 1
        };
        currentCategories = [...currentCategories, newCat];
        existingCategories.add(category);
      }

      const product: Product = {
        id: Math.max(0, ...currentProducts.map(prod => prod.id)) + 1,
        name: p.name,
        category: category,
        unit: p.unit || 'kg',
        image: p.image || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
        origin: p.origin || 'Unknown',
        rating: 5.0,
        reviews: 0,
        stock: p.stock || 0,
        incomingStock: 0,
        soldToday: 0,
        price: p.price || 0,
        b2bPrice: p.b2bPrice || p.price || 0,
        previousPrice: p.price || 0,
        lastPriceUpdate: new Date().toISOString(),
        isVisibleConsumer: true,
        isVisibleB2B: true,
        description: p.description || '',
        userReviews: []
      };
      currentProducts = [...currentProducts, product];
    });
    notify();
  };

  return {
    products,
    categories,
    orders,
    vendors,
    supply,
    performance,
    media,
    settings,
    updateProduct,
    addProduct,
    bulkAddProducts,
    deleteProduct,
    updateCategory,
    addCategory,
    deleteCategory,
    reorderCategories,
    addOrder,
    updateOrderStatus,
    addVendor,
    updateVendor,
    deleteVendor,
    addSupplyEntry,
    updateSupplyEntry,
    deleteSupplyEntry,
    addMedia,
    updateMedia,
    deleteMedia,
    assignMediaToProduct,
    updateSettings,
    resetSettings
  };
};
