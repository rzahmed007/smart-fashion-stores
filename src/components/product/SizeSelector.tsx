import type { ProductSize, SizeStock } from '@/types';
import { cn } from '@/utils/cn';

interface SizeSelectorProps {
  sizes: SizeStock[];
  selectedSize: ProductSize | null;
  onSelect: (size: ProductSize) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-xs uppercase tracking-[0.12em] text-ink-secondary">
          Select Size
        </span>
        {selectedSize && (
          <span className="font-sans text-xs font-medium text-brand-green">
            Size: {selectedSize}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((item) => {
          const isSelected = selectedSize === item.size;
          return (
            <button
              key={item.size}
              type="button"
              disabled={!item.inStock}
              onClick={() => onSelect(item.size)}
              aria-pressed={isSelected}
              className={cn(
                'min-w-[44px] h-10 px-3 rounded-[4px] border font-sans text-xs font-medium tracking-[0.06em] transition-colors relative',
                !item.inStock &&
                  'border-border/70 bg-ivory/60 text-ink-secondary/50 line-through cursor-not-allowed',
                item.inStock &&
                  !isSelected &&
                  'border-border bg-white text-ink hover:border-brand-green',
                item.inStock &&
                  isSelected &&
                  'border-brand-green bg-brand-green text-white'
              )}
            >
              {item.size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
