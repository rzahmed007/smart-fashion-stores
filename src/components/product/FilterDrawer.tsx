import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { FilterContent, type ActiveFiltersState } from '@/components/product/FilterContent';
import { Button } from '@/components/ui/Button';
import type { CategorySlug, OccasionType, ProductSize } from '@/types';

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalResults: number;
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

export function FilterDrawer({
  open,
  onOpenChange,
  totalResults,
  ...filterProps
}: FilterDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px] lg:hidden" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[86vh] flex flex-col bg-ivory border-t border-border rounded-t-[6px] shadow-xl focus:outline-none lg:hidden">
          <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-border">
            <div>
              <Dialog.Title className="font-serif text-xl font-medium text-ink">
                Filter & Refine
              </Dialog.Title>
              <Dialog.Description className="font-sans text-xs text-ink-secondary">
                {totalResults} {totalResults === 1 ? 'product' : 'products'} matching
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close filters"
              className="h-9 w-9 rounded-[4px] border border-border flex items-center justify-center text-ink"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <FilterContent {...filterProps} />
          </div>

          <div className="p-4 bg-white border-t border-border flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={filterProps.onClearAll}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Show {totalResults} Results
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
