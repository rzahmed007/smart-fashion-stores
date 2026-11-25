import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { catalogService } from '@/services/catalogService';
import type { CategorySlug, OccasionType, ProductSize } from '@/types';
import { cn } from '@/utils/cn';

export interface ActiveFiltersState {
  categories: CategorySlug[];
  collections: string[];
  priceRange: string;
  sizes: ProductSize[];
  colors: string[];
  fabrics: string[];
  occasions: OccasionType[];
  inStockOnly: boolean;
}

export const PRICE_RANGES = [
  { id: 'under-4000', label: 'Under ₹4,000', min: undefined, max: 3999 },
  { id: '4000-7000', label: '₹4,000 – ₹7,000', min: 4000, max: 7000 },
  { id: 'above-7000', label: 'Above ₹7,000', min: 7001, max: undefined },
] as const;

interface FilterContentProps {
  filters: ActiveFiltersState;
  hideCategoryFilter?: boolean;
  hideCollectionFilter?: boolean;
  onToggleCategory: (slug: CategorySlug) => void;
  onToggleCollection: (slug: string) => void;
  onSelectPriceRange: (rangeId: string) => void;
  onToggleSize: (size: ProductSize) => void;
  onToggleColor: (colorName: string) => void;
  onToggleFabric: (fabric: string) => void;
  onToggleOccasion: (occasion: OccasionType) => void;
  onToggleInStock: () => void;
  onClearAll: () => void;
}

function FilterGroup({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-left font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn('w-4 h-4 text-ink-secondary transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      {open && <div className="mt-3.5">{children}</div>}
    </div>
  );
}

export function FilterContent({
  filters,
  hideCategoryFilter = false,
  hideCollectionFilter = false,
  onToggleCategory,
  onToggleCollection,
  onSelectPriceRange,
  onToggleSize,
  onToggleColor,
  onToggleFabric,
  onToggleOccasion,
  onToggleInStock,
  onClearAll,
}: FilterContentProps) {
  const facets = catalogService.getFilterFacets();

  return (
    <div className="divide-y divide-border/0">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <span className="font-serif text-xl font-medium text-ink">Refine By</span>
        <button
          type="button"
          onClick={onClearAll}
          className="font-sans text-xs font-medium text-brand-green hover:underline"
        >
          Clear All
        </button>
      </div>

      {!hideCategoryFilter && (
        <FilterGroup title="Category">
          <div className="space-y-2">
            {facets.categories.map((cat) => {
              const checked = filters.categories.includes(cat.slug);
              return (
                <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleCategory(cat.slug)}
                    className="h-4 w-4 rounded border-border accent-brand-green"
                  />
                  <span className="font-sans text-sm text-ink">{cat.name}</span>
                </label>
              );
            })}
          </div>
        </FilterGroup>
      )}

      {!hideCollectionFilter && (
        <FilterGroup title="Collection" defaultOpen={false}>
          <div className="space-y-2">
            {facets.collections.map((col) => {
              const checked = filters.collections.includes(col.slug);
              return (
                <label key={col.slug} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleCollection(col.slug)}
                    className="h-4 w-4 rounded border-border accent-brand-green"
                  />
                  <span className="font-sans text-sm text-ink">{col.name}</span>
                </label>
              );
            })}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Price Range">
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => {
            const active = filters.priceRange === range.id;
            return (
              <label key={range.id} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="sfs-price-range"
                  checked={active}
                  onChange={() => onSelectPriceRange(active ? '' : range.id)}
                  onClick={() => active && onSelectPriceRange('')}
                  className="h-4 w-4 border-border accent-brand-green"
                />
                <span className="font-sans text-sm text-ink">{range.label}</span>
              </label>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => onToggleSize(size)}
                aria-pressed={active}
                className={cn(
                  'min-w-[42px] h-9 px-2.5 rounded-[4px] border font-sans text-xs font-medium transition-colors',
                  active
                    ? 'bg-brand-green border-brand-green text-white'
                    : 'bg-white border-border text-ink hover:border-brand-green'
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="space-y-2">
          {facets.colors.map((color) => {
            const active = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => onToggleColor(color.name)}
                aria-pressed={active}
                className="w-full flex items-center gap-2.5 text-left py-0.5 group"
              >
                <span
                  className={cn(
                    'h-4 w-4 rounded-full border border-black/15 shrink-0',
                    active && 'ring-2 ring-brand-green ring-offset-1'
                  )}
                  style={{ backgroundColor: color.hex }}
                />
                <span
                  className={cn(
                    'font-sans text-sm',
                    active ? 'font-medium text-brand-green' : 'text-ink group-hover:text-brand-green'
                  )}
                >
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Fabric" defaultOpen={false}>
        <div className="space-y-2">
          {facets.fabrics.map((fabric) => {
            const checked = filters.fabrics.includes(fabric);
            return (
              <label key={fabric} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleFabric(fabric)}
                  className="h-4 w-4 rounded border-border accent-brand-green"
                />
                <span className="font-sans text-sm text-ink">{fabric}</span>
              </label>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Occasion">
        <div className="space-y-2">
          {facets.occasions.map((occ) => {
            const checked = filters.occasions.includes(occ);
            return (
              <label key={occ} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleOccasion(occ)}
                  className="h-4 w-4 rounded border-border accent-brand-green"
                />
                <span className="font-sans text-sm text-ink">{occ}</span>
              </label>
            );
          })}
        </div>
      </FilterGroup>

      <div className="pt-4">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={onToggleInStock}
            className="h-4 w-4 rounded border-border accent-brand-green"
          />
          <span className="font-sans text-sm font-medium text-ink">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}
