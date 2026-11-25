import type { ColorVariant } from '@/types';
import { cn } from '@/utils/cn';

interface ColorSelectorProps {
  colors: ColorVariant[];
  selectedColor: ColorVariant;
  onSelect: (color: ColorVariant) => void;
  compact?: boolean;
}

export function ColorSelector({
  colors,
  selectedColor,
  onSelect,
  compact = false,
}: ColorSelectorProps) {
  return (
    <div>
      {!compact && (
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs uppercase tracking-[0.12em] text-ink-secondary">
            Color
          </span>
          <span className="font-sans text-xs font-medium text-ink">
            {selectedColor.name}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2.5 flex-wrap">
        {colors.map((color) => {
          const isSelected = selectedColor.name === color.name;
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelect(color)}
              title={color.name}
              aria-label={`Select color ${color.name}`}
              aria-pressed={isSelected}
              className={cn(
                'relative flex items-center justify-center rounded-full transition-all',
                compact ? 'h-5 w-5' : 'h-7 w-7',
                isSelected
                  ? 'ring-2 ring-brand-green ring-offset-2 ring-offset-ivory'
                  : 'ring-1 ring-border hover:ring-brand-secondary'
              )}
            >
              <span
                className="block h-full w-full rounded-full border border-black/10"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
