import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AlertCircle, Search, SlidersHorizontal, X } from 'lucide-react';
import { catalogService, type SortOption } from '@/services/catalogService';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/product/ProductGrid';
import {
  FilterContent,
  PRICE_RANGES,
  type ActiveFiltersState,
} from '@/components/product/FilterContent';
import { FilterDrawer } from '@/components/product/FilterDrawer';
import type { CategorySlug, OccasionType, ProductSize } from '@/types';

export type ShopPageMode = 'shop' | 'new-arrivals' | 'category' | 'collection' | 'search';

interface ShopPageProps {
  mode: ShopPageMode;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'bestseller', label: 'Best Sellers' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

function parseListParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function ShopPage({ mode }: ShopPageProps) {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setLoadError(null);
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [mode, slug]);

  const categoryInfo =
    mode === 'category' && slug ? catalogService.getCategoryBySlug(slug) : undefined;
  const collectionInfo =
    mode === 'collection' && slug ? catalogService.getCollectionBySlug(slug) : undefined;

  const query = searchParams.get('q') ?? '';
  const sort = (searchParams.get('sort') as SortOption) || 'featured';

  const filters: ActiveFiltersState = {
    categories:
      mode === 'category' && categoryInfo
        ? [categoryInfo.slug]
        : (parseListParam(searchParams.get('category')) as CategorySlug[]),
    collections:
      mode === 'collection' && collectionInfo
        ? [collectionInfo.slug]
        : parseListParam(searchParams.get('collection')),
    priceRange: searchParams.get('price') ?? '',
    sizes: parseListParam(searchParams.get('size')) as ProductSize[],
    colors: parseListParam(searchParams.get('color')),
    fabrics: parseListParam(searchParams.get('fabric')),
    occasions: parseListParam(searchParams.get('occasion')) as OccasionType[],
    inStockOnly: searchParams.get('inStock') === 'true',
  };

  const updateParam = (key: string, value: string | string[] | boolean | null) => {
    const next = new URLSearchParams(searchParams);
    if (
      value === null ||
      value === '' ||
      value === false ||
      (Array.isArray(value) && value.length === 0)
    ) {
      next.delete(key);
    } else if (Array.isArray(value)) {
      next.set(key, value.join(','));
    } else if (typeof value === 'boolean') {
      next.set(key, 'true');
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const toggleArrayParam = <T extends string>(key: string, current: T[], item: T) => {
    const next = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    updateParam(key, next);
  };

  const clearAllFilters = () => {
    const next = new URLSearchParams();
    if (mode === 'search' && query) next.set('q', query);
    setSearchParams(next, { replace: true });
  };

  const selectedPriceObj = PRICE_RANGES.find((r) => r.id === filters.priceRange);

  const products = useMemo(() => {
    try {
      return catalogService.filterProducts({
        query,
        categories: filters.categories,
        collections: filters.collections,
        minPrice: selectedPriceObj?.min,
        maxPrice: selectedPriceObj?.max,
        sizes: filters.sizes,
        colors: filters.colors,
        fabrics: filters.fabrics,
        occasions: filters.occasions,
        inStockOnly: filters.inStockOnly,
        newArrivalsOnly: mode === 'new-arrivals',
        sort,
      });
    } catch {
      return [];
    }
  }, [filters, mode, query, selectedPriceObj, sort]);

  // Build active filter chips for display
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (query.trim()) {
    activeChips.push({
      label: `Search: "${query.trim()}"`,
      onRemove: () => updateParam('q', null),
    });
  }
  if (mode !== 'category') {
    filters.categories.forEach((c) => {
      const cat = catalogService.getCategoryBySlug(c);
      activeChips.push({
        label: cat?.name || c,
        onRemove: () => toggleArrayParam('category', filters.categories, c),
      });
    });
  }
  if (mode !== 'collection') {
    filters.collections.forEach((colSlug) => {
      const col = catalogService.getCollectionBySlug(colSlug);
      activeChips.push({
        label: col?.name || colSlug,
        onRemove: () => toggleArrayParam('collection', filters.collections, colSlug),
      });
    });
  }
  if (selectedPriceObj) {
    activeChips.push({
      label: selectedPriceObj.label,
      onRemove: () => updateParam('price', null),
    });
  }
  filters.sizes.forEach((s) =>
    activeChips.push({
      label: `Size: ${s}`,
      onRemove: () => toggleArrayParam('size', filters.sizes, s),
    })
  );
  filters.colors.forEach((c) =>
    activeChips.push({
      label: `Color: ${c}`,
      onRemove: () => toggleArrayParam('color', filters.colors, c),
    })
  );
  filters.fabrics.forEach((f) =>
    activeChips.push({
      label: `Fabric: ${f}`,
      onRemove: () => toggleArrayParam('fabric', filters.fabrics, f),
    })
  );
  filters.occasions.forEach((o) =>
    activeChips.push({
      label: o,
      onRemove: () => toggleArrayParam('occasion', filters.occasions, o),
    })
  );
  if (filters.inStockOnly) {
    activeChips.push({
      label: 'In Stock Only',
      onRemove: () => updateParam('inStock', false),
    });
  }

  let pageTitle = 'All Ethnic Wear';
  let pageDescription =
    'Explore handcrafted salwar suits, artisanal cotton kurtis, ready-to-wear ensembles, and festive weaves.';
  let breadcrumbItems: BreadcrumbItem[] = [{ label: 'Shop All' }];

  if (mode === 'new-arrivals') {
    pageTitle = 'New Arrivals';
    pageDescription = 'Freshly crafted silhouettes from our latest seasonal ateliers.';
    breadcrumbItems = [{ label: 'New Arrivals' }];
  } else if (mode === 'category') {
    pageTitle = categoryInfo?.name ?? 'Category';
    pageDescription =
      categoryInfo?.description ?? 'Curated pieces from Smart Fashion Stores.';
    breadcrumbItems = [
      { label: 'Shop', to: '/shop' },
      { label: pageTitle },
    ];
  } else if (mode === 'collection') {
    pageTitle = collectionInfo?.name ?? 'Collection';
    pageDescription =
      collectionInfo?.description ?? 'Signature editorial capsules in natural weaves.';
    breadcrumbItems = [
      { label: 'Shop', to: '/shop' },
      { label: pageTitle },
    ];
  } else if (mode === 'search') {
    pageTitle = query.trim() ? `Search Results for “${query.trim()}”` : 'Search Catalog';
    pageDescription = 'Filter across silhouettes, fabrics, colors, and occasions.';
    breadcrumbItems = [{ label: 'Search' }];
  }

  const filterProps = {
    filters,
    hideCategoryFilter: mode === 'category',
    hideCollectionFilter: mode === 'collection',
    onToggleCategory: (c: CategorySlug) => toggleArrayParam('category', filters.categories, c),
    onToggleCollection: (c: string) => toggleArrayParam('collection', filters.collections, c),
    onSelectPriceRange: (r: string) => updateParam('price', r || null),
    onToggleSize: (s: ProductSize) => toggleArrayParam('size', filters.sizes, s),
    onToggleColor: (c: string) => toggleArrayParam('color', filters.colors, c),
    onToggleFabric: (f: string) => toggleArrayParam('fabric', filters.fabrics, f),
    onToggleOccasion: (o: OccasionType) => toggleArrayParam('occasion', filters.occasions, o),
    onToggleInStock: () => updateParam('inStock', !filters.inStockOnly),
    onClearAll: clearAllFilters,
  };

  return (
    <section className="py-8 sm:py-12 bg-ivory min-h-[75vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header + Inline Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
          <div className="max-w-2xl">
            <h1 className="font-serif text-[30px] sm:text-[38px] lg:text-[44px] font-medium leading-[1.1] text-ink">
              {pageTitle}
            </h1>
            <p className="mt-2 font-sans text-sm sm:text-[15px] text-ink-secondary">
              {pageDescription}
            </p>
          </div>

          <div className="w-full md:w-72">
            <label htmlFor="listing-search" className="sr-only">
              Search within results
            </label>
            <div className="flex items-center h-10 px-3 bg-white border border-border rounded-[4px] focus-within:border-brand-green">
              <Search className="w-4 h-4 text-ink-secondary shrink-0" aria-hidden="true" />
              <input
                id="listing-search"
                type="search"
                value={query}
                onChange={(e) => updateParam('q', e.target.value)}
                placeholder="Search silhouettes, fabric..."
                className="flex-1 bg-transparent px-2.5 font-sans text-sm text-ink placeholder:text-ink-secondary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Mobile Sticky Filter & Sort Toolbar */}
        <div className="sticky top-[100px] z-20 -mx-4 px-4 py-3 bg-ivory/95 backdrop-blur-sm border-b border-border flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 h-10 px-3.5 rounded-[4px] border border-border bg-white flex items-center justify-center gap-2 font-sans text-xs font-medium uppercase tracking-[0.1em] text-ink"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-green" />
            <span>Filters</span>
            {activeChips.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-brand-green text-white text-[10px] leading-none">
                {activeChips.length}
              </span>
            )}
          </button>

          <div className="flex-1">
            <label htmlFor="mobile-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="mobile-sort"
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="w-full h-10 px-3 rounded-[4px] border border-border bg-white font-sans text-xs font-medium text-ink focus:outline-none focus:border-brand-green"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Filter Sidebar */}
          <aside aria-label="Product filters" className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 bg-white border border-border rounded-[4px] p-5">
              <FilterContent {...filterProps} />
            </div>
          </aside>

          {/* Main Catalog Grid Area */}
          <div className="lg:col-span-9">
            {/* Desktop Meta + Sort Bar */}
            <div className="hidden lg:flex items-center justify-between gap-4 mb-5">
              <p className="font-sans text-sm text-ink-secondary">
                Showing <span className="font-medium text-ink">{products.length}</span>{' '}
                {products.length === 1 ? 'style' : 'styles'}
              </p>

              <div className="flex items-center gap-2.5">
                <label
                  htmlFor="desktop-sort"
                  className="font-sans text-xs uppercase tracking-[0.12em] text-ink-secondary"
                >
                  Sort by
                </label>
                <select
                  id="desktop-sort"
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="h-10 px-3 rounded-[4px] border border-border bg-white font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeChips.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-white border border-border font-sans text-xs text-ink hover:border-brand-green transition-colors"
                  >
                    <span>{chip.label}</span>
                    <X className="w-3 h-3 text-ink-secondary" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-2 py-1 font-sans text-xs font-medium text-brand-green hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Loading / Error / Empty / Results States */}
            {loadError ? (
              <div className="bg-white border border-border rounded-[4px] p-10 text-center">
                <AlertCircle className="w-8 h-8 text-red-700 mx-auto mb-3" />
                <h2 className="font-serif text-2xl text-ink">Unable to load products</h2>
                <p className="mt-1 font-sans text-sm text-ink-secondary">{loadError}</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-border rounded-[4px] overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[3/4] bg-[#ECE9DC]" />
                    <div className="p-4 space-y-2.5">
                      <div className="h-3 w-1/2 bg-[#ECE9DC] rounded" />
                      <div className="h-4 w-5/6 bg-[#ECE9DC] rounded" />
                      <div className="h-4 w-1/3 bg-[#ECE9DC] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-border rounded-[4px] px-6 py-14 text-center">
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
                  No matching silhouettes found
                </h2>
                <p className="mt-2 mx-auto max-w-md font-sans text-sm text-ink-secondary">
                  Try removing one or more filters or clearing your search query to browse all
                  available ethnic wear.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  className="mt-6"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <ProductGrid
                products={products}
                className="lg:grid-cols-3 xl:grid-cols-4"
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        open={isMobileFilterOpen}
        onOpenChange={setIsMobileFilterOpen}
        totalResults={products.length}
        {...filterProps}
      />
    </section>
  );
}
