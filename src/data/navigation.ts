export interface NavSubcategory {
  label: string;
  to: string;
}

export interface NavItem {
  label: string;
  to: string;
  hasMegaMenu?: boolean;
  featuredImage?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
  columns?: {
    heading: string;
    links: NavSubcategory[];
  }[];
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  {
    label: 'Salwar Suits',
    to: '/category/salwar-suits',
    hasMegaMenu: true,
    featuredImage: '/images/salwar-suit-emerald.jpg',
    featuredTitle: 'Heritage Salwar Suits',
    featuredSubtitle: 'Anarkalis, straight cuts & sharara sets',
    columns: [
      {
        heading: 'By Silhouette',
        links: [
          { label: 'Anarkali Salwar Suits', to: '/category/salwar-suits?style=anarkali' },
          { label: 'Chanderi Straight Suits', to: '/category/salwar-suits?style=straight' },
          { label: 'Sharara & Gharara Sets', to: '/category/salwar-suits?style=sharara' },
          { label: 'Unstitched Suit Sets', to: '/category/unstitched' },
        ],
      },
      {
        heading: 'By Occasion',
        links: [
          { label: 'Festive Celebrations', to: '/shop?occasion=Festive+Wear' },
          { label: 'Wedding Guests', to: '/shop?occasion=Wedding+Wear' },
          { label: 'Evening Gatherings', to: '/shop?occasion=Party+Wear' },
        ],
      },
    ],
  },
  {
    label: 'Kurtis',
    to: '/category/kurtis',
    hasMegaMenu: true,
    featuredImage: '/images/kurti-ivory-sage.jpg',
    featuredTitle: 'Artisanal Kurtis',
    featuredSubtitle: 'Hand-block cottons & Chanderi tunics',
    columns: [
      {
        heading: 'Curated Styles',
        links: [
          { label: 'Straight Cotton Kurtis', to: '/category/kurtis?style=straight' },
          { label: 'Hand-Block Prints', to: '/category/kurtis?style=hand-block' },
          { label: 'Embroidered Chanderi', to: '/category/kurtis?style=embroidered' },
          { label: 'Everyday Tunics', to: '/shop?occasion=Daily+Wear' },
        ],
      },
      {
        heading: 'Explore Fabrics',
        links: [
          { label: 'Cotton Silk', to: '/shop?fabric=Cotton-Silk' },
          { label: 'Pure Chanderi', to: '/shop?fabric=Chanderi' },
          { label: 'Breathable Linen', to: '/shop?fabric=Linen' },
        ],
      },
    ],
  },
  {
    label: 'Smart Collection',
    to: '/category/smart-collection',
    hasMegaMenu: true,
    featuredImage: '/images/smart-moss-kurta.jpg',
    featuredTitle: 'Smart Looks for Sharp Women',
    featuredSubtitle: 'Structured ethnic tailoring for work & beyond',
    columns: [
      {
        heading: 'Work-to-Evening',
        links: [
          { label: 'Mandarin Collar Sets', to: '/category/smart-collection' },
          { label: 'Tailored Kurta Trousers', to: '/category/smart-collection?style=tailored' },
          { label: 'Minimalist Solids', to: '/shop?category=smart-collection' },
        ],
      },
      {
        heading: 'Highlights',
        links: [
          { label: 'Best Sellers', to: '/shop?sort=bestseller' },
          { label: 'New Arrivals', to: '/new-arrivals' },
        ],
      },
    ],
  },
  { label: 'Ready to Wear', to: '/category/ready-to-wear' },
  { label: 'Shop All', to: '/shop' },
];
