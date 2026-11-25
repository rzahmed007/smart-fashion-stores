export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';

export type OccasionType = 'Daily Wear' | 'Festive Wear' | 'Party Wear' | 'Wedding Wear';

export type CategorySlug =
  | 'salwar-suits'
  | 'kurtis'
  | 'ready-to-wear'
  | 'unstitched'
  | 'smart-collection'
  | 'festive-wear';

export interface ColorVariant {
  name: string;
  hex: string;
  image?: string;
}

export interface SizeStock {
  size: ProductSize;
  inStock: boolean;
  stockCount: number;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortSubtitle: string;
  description: string;
  category: string;
  categorySlug: CategorySlug;
  collectionSlug?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors: ColorVariant[];
  sizes: SizeStock[];
  fabric: string;
  occasion: OccasionType[];
  badge?: 'New Arrival' | 'Best Seller' | 'Limited Edition';
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  careInstructions: string;
}

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  image: string;
  productCount: number;
  subcategories: { label: string; slug: string }[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  ctaText: string;
}

export interface OccasionItem {
  id: string;
  name: OccasionType;
  slug: string;
  subtitle: string;
  image: string;
}

export interface HeroSlide {
  id: string;
  collectionName: string;
  headline: string;
  description: string;
  image: string;
  mobileImage?: string;
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
}

export interface Testimonial {
  id: string;
  customerName: string;
  city: string;
  rating: number;
  quote: string;
  purchasedItem: string;
  isSample: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  selectedColor: ColorVariant;
  selectedSize: ProductSize;
  quantity: number;
  fabric: string;
}

export interface OrderSummary {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponDiscount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  paymentMethod: 'cod' | 'online-demo';
  deliveryOption: 'standard' | 'express';
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  notes?: string;
  mode: 'cart' | 'buy-now';
  status: 'Confirmed (Demo)' | 'Processing' | 'Dispatched';
}
