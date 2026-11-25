import type { HeroSlide, OccasionItem, Testimonial } from '@/types';

export const ANNOUNCEMENTS: string[] = [
  'The Heritage Chanderi Edit ’26 — Explore Handcrafted New Arrivals',
  'Complimentary Pan-India Shipping on Select Orders · Interactive Client Demo',
  'Smart Looks for Sharp Women — Tailored Work-to-Evening Ethnic Wear',
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    collectionName: 'Autumn / Festive Edit ’26',
    headline: 'Heirloom Craft for the Modern Woman',
    description:
      'Handwoven Chanderi silks, breathable mulmuls, and tailored silhouettes designed in signature botanical tones.',
    image: '/images/hero-1.jpg',
    primaryCta: { label: 'Shop Collection', to: '/collection/heritage-chanderi' },
    secondaryCta: { label: 'Shop New Arrivals', to: '/new-arrivals' },
  },
  {
    id: 'slide-2',
    collectionName: 'Smart Collection',
    headline: 'Effortless Poise, Every Single Day',
    description:
      'Refined ivory and olive handloom salwar sets crafted to move seamlessly from morning studio hours to evening celebrations.',
    image: '/images/hero-2.jpg',
    primaryCta: { label: 'Explore Smart Edit', to: '/category/smart-collection' },
    secondaryCta: { label: 'Shop All', to: '/shop' },
  },
];

export const OCCASIONS: OccasionItem[] = [
  {
    id: 'occ-daily',
    name: 'Daily Wear',
    slug: 'daily-wear',
    subtitle: 'Breathable cottons & effortless workwear',
    image: '/images/kurti-ivory-sage.jpg',
  },
  {
    id: 'occ-festive',
    name: 'Festive Wear',
    slug: 'festive-wear',
    subtitle: 'Luminous Chanderi & antique gota trims',
    image: '/images/festive-banarasi-sharara.jpg',
  },
  {
    id: 'occ-party',
    name: 'Party Wear',
    slug: 'party-wear',
    subtitle: 'Tailored silk-cotton & evening drapes',
    image: '/images/salwar-suit-emerald.jpg',
  },
  {
    id: 'occ-wedding',
    name: 'Wedding Wear',
    slug: 'wedding-wear',
    subtitle: 'Heirloom Banarasi weaves & silk velvet',
    image: '/images/wedding-olive-velvet.jpg',
  },
];

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    customerName: 'Ananya Deshmukh',
    city: 'Pune',
    rating: 5,
    quote:
      'The Chanderi drape feels featherlight yet regal. I wore the emerald anarkali to my sister’s sangeet and received endless compliments.',
    purchasedItem: 'Maharani Emerald Chanderi Anarkali Set',
    isSample: true,
  },
  {
    id: 'rev-2',
    customerName: 'Meenakshi Iyer',
    city: 'Bengaluru',
    rating: 5,
    quote:
      'Finally an ethnic label that understands structured tailoring for work. The Smart Collection moss kurta holds its crisp silhouette all day.',
    purchasedItem: 'Veda Moss Mandarin Collar Kurta Set',
    isSample: true,
  },
  {
    id: 'rev-3',
    customerName: 'Rituja Kapoor',
    city: 'New Delhi',
    rating: 5,
    quote:
      'Quick Shop made choosing my size effortless, and the fabric craftsmanship genuinely rivals boutique ateliers.',
    purchasedItem: 'Aaranya Ivory Botanical Kurti Set',
    isSample: true,
  },
];

export const SHOPPING_BENEFITS = [
  {
    id: 'ben-checkout',
    title: 'Secure Checkout',
    description: 'Encrypted demo ordering flow with transparent pricing and instant summary.',
    icon: 'ShieldCheck',
  },
  {
    id: 'ben-quality',
    title: 'Quality Fashion',
    description: 'Curated handloom fabrics, natural dyes, and inspected artisanal finishes.',
    icon: 'Sparkles',
  },
  {
    id: 'ben-delivery',
    title: 'Delivery Support',
    description: 'Pan-India dispatch coordination and live order tracking assistance.',
    icon: 'Truck',
  },
  {
    id: 'ben-support',
    title: 'Customer Support',
    description: 'Dedicated styling guidance, sizing help, and direct WhatsApp concierge.',
    icon: 'Headphones',
  },
] as const;
