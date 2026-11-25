import { CATEGORIES, COLLECTIONS, PRODUCTS } from '@/data/catalog';
import type { CategorySlug, OccasionType, Product, ProductSize } from '@/types';

export type SortOption =
  | 'featured'
  | 'newest'
  | 'bestseller'
  | 'price-asc'
  | 'price-desc'
  | 'rating';

export interface ProductFilterCriteria {
  query?: string;
  categories?: CategorySlug[];
  collections?: string[];
  minPrice?: number;
  maxPrice?: number;
  sizes?: ProductSize[];
  colors?: string[];
  fabrics?: string[];
  occasions?: OccasionType[];
  inStockOnly?: boolean;
  newArrivalsOnly?: boolean;
  sort?: SortOption;
}

const FABRIC_FAMILIES = ['Chanderi', 'Cotton', 'Silk', 'Linen', 'Banarasi', 'Velvet'] as const;

export const catalogService = {
  getAllProducts(): Product[] {
    return PRODUCTS;
  },

  getNewArrivals(limit = 4): Product[] {
    return PRODUCTS.filter((p) => p.isNewArrival).slice(0, limit);
  },

  getBestSellers(limit = 4): Product[] {
    return PRODUCTS.filter((p) => p.isBestSeller).slice(0, limit);
  },

  getProductsByCategory(slug: CategorySlug): Product[] {
    return PRODUCTS.filter((p) => p.categorySlug === slug);
  },

  getProductBySlug(slug: string): Product | undefined {
    return PRODUCTS.find((p) => p.slug === slug);
  },

  getProductsByIds(ids: string[]): Product[] {
    const map = new Map(PRODUCTS.map((p) => [p.id, p]));
    return ids.map((id) => map.get(id)).filter((p): p is Product => Boolean(p));
  },

  getRelatedProducts(product: Product, limit = 4): Product[] {
    const sameCategory = PRODUCTS.filter(
      (p) => p.id !== product.id && p.categorySlug === product.categorySlug
    );
    const others = PRODUCTS.filter(
      (p) => p.id !== product.id && p.categorySlug !== product.categorySlug
    );
    return [...sameCategory, ...others].slice(0, limit);
  },

  getCategories() {
    return CATEGORIES;
  },

  getCategoryBySlug(slug: string) {
    return CATEGORIES.find((c) => c.slug === slug);
  },

  getCollections() {
    return COLLECTIONS;
  },

  getCollectionBySlug(slug: string) {
    return COLLECTIONS.find((c) => c.slug === slug);
  },

  getFilterFacets() {
    const colorMap = new Map<string, string>();
    const sizeSet = new Set<ProductSize>();

    for (const p of PRODUCTS) {
      for (const c of p.colors) {
        if (!colorMap.has(c.name)) colorMap.set(c.name, c.hex);
      }
      for (const s of p.sizes) {
        sizeSet.add(s.size);
      }
    }

    const orderedSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
    return {
      categories: CATEGORIES,
      collections: COLLECTIONS,
      colors: Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex })),
      sizes: orderedSizes.filter((s) => sizeSet.has(s)),
      fabrics: [...FABRIC_FAMILIES],
      occasions: ['Daily Wear', 'Festive Wear', 'Party Wear', 'Wedding Wear'] as OccasionType[],
    };
  },

  filterProducts(criteria: ProductFilterCriteria): Product[] {
    let result = [...PRODUCTS];

    if (criteria.newArrivalsOnly) {
      result = result.filter((p) => p.isNewArrival);
    }

    if (criteria.query?.trim()) {
      const q = criteria.query.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortSubtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.occasion.some((o) => o.toLowerCase().includes(q))
      );
    }

    if (criteria.categories && criteria.categories.length > 0) {
      result = result.filter((p) => criteria.categories!.includes(p.categorySlug));
    }

    if (criteria.collections && criteria.collections.length > 0) {
      result = result.filter(
        (p) => p.collectionSlug && criteria.collections!.includes(p.collectionSlug)
      );
    }

    if (typeof criteria.minPrice === 'number') {
      result = result.filter((p) => p.price >= criteria.minPrice!);
    }

    if (typeof criteria.maxPrice === 'number') {
      result = result.filter((p) => p.price <= criteria.maxPrice!);
    }

    if (criteria.sizes && criteria.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => s.inStock && criteria.sizes!.includes(s.size))
      );
    }

    if (criteria.colors && criteria.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => criteria.colors!.includes(c.name))
      );
    }

    if (criteria.fabrics && criteria.fabrics.length > 0) {
      result = result.filter((p) =>
        criteria.fabrics!.some((fab) => p.fabric.toLowerCase().includes(fab.toLowerCase()))
      );
    }

    if (criteria.occasions && criteria.occasions.length > 0) {
      result = result.filter((p) =>
        p.occasion.some((occ) => criteria.occasions!.includes(occ))
      );
    }

    if (criteria.inStockOnly) {
      result = result.filter((p) => p.sizes.some((s) => s.inStock && s.stockCount > 0));
    }

    switch (criteria.sort) {
      case 'newest':
        result.sort((a, b) => Number(Boolean(b.isNewArrival)) - Number(Boolean(a.isNewArrival)));
        break;
      case 'bestseller':
        result.sort((a, b) => Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller)));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        break;
    }

    return result;
  },
};
