export type Role = 'customer' | 'admin';

export type CoffeeCategory =
  | 'Hot Coffee'
  | 'Cold Coffee'
  | 'Espresso'
  | 'Cappuccino'
  | 'Latte'
  | 'Mocha'
  | 'Tea'
  | 'Snacks'
  | 'Desserts'
  | 'Coffee Beans'
  | 'Coffee Accessories';

export type RoastLevel = 'Light Roast' | 'Medium Roast' | 'Dark Roast' | 'Espresso Roast' | 'French Roast';

export interface ProductVariantOptions {
  sizes?: { name: 'Small' | 'Medium' | 'Large'; priceOffset: number; volume: string }[];
  milkOptions?: string[];
  sugarLevels?: string[];
  extraToppings?: { name: string; price: number }[];
  grindOptions?: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  adminReply?: string;
  status: 'approved' | 'pending';
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: CoffeeCategory;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  roastLevel?: RoastLevel;
  flavorNotes: string[];
  origin?: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    caffeineMg: number;
    fatG: number;
    carbsG: number;
    sugarG: number;
    proteinG: number;
  };
  variants: ProductVariantOptions;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isSeasonal?: boolean;
  isNewArrival?: boolean;
  brewTime?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize: string;
  selectedMilk?: string;
  selectedSugar?: string;
  selectedToppings?: string[];
  selectedGrind?: string;
  itemTotalPrice: number;
}

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export type OrderStatus = 'pending' | 'roasting' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'stripe' | 'razorpay' | 'paypal' | 'upi' | 'netbanking' | 'cod';
export type ShippingMethod = 'standard' | 'express' | 'pickup';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size: string;
  optionsSummary?: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: SavedAddress;
  shippingMethod: ShippingMethod;
  shippingCost: number;
  subtotal: number;
  tax: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar: string;
  bio?: string;
  rewardPoints: number;
  joinedDate: string;
  notificationPreferences: {
    orderUpdates: boolean;
    roastAlerts: boolean;
    promotionalOffers: boolean;
    newsletter: boolean;
  };
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscount?: number;
  minSpend?: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
}
