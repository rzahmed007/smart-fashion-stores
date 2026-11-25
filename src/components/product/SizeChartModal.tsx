import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Ruler, X } from 'lucide-react';

interface SizeChartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SIZE_ROWS = [
  { size: 'XS', bust: '32', waist: '26', hip: '35', shoulder: '13.5' },
  { size: 'S', bust: '34', waist: '28', hip: '37', shoulder: '14.0' },
  { size: 'M', bust: '36', waist: '30', hip: '39', shoulder: '14.5' },
  { size: 'L', bust: '38', waist: '32', hip: '41', shoulder: '15.0' },
  { size: 'XL', bust: '40', waist: '34', hip: '43', shoulder: '15.5' },
  { size: 'XXL', bust: '42', waist: '36', hip: '45', shoulder: '16.0' },
];

export function SizeChartModal({ open, onOpenChange }: SizeChartModalProps) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const formatMeasure = (inchesStr: string) => {
    const val = parseFloat(inchesStr);
    if (unit === 'in') return `${inchesStr}"`;
    return `${Math.round(val * 2.54)} cm`;
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] max-w-2xl max-h-[88vh] overflow-y-auto bg-ivory border border-border rounded-[6px] p-5 sm:p-7 shadow-xl focus:outline-none">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
            <div>
              <Dialog.Title className="font-serif text-2xl sm:text-3xl font-medium text-ink flex items-center gap-2">
                <Ruler className="w-5 h-5 text-brand-green" />
                <span>Size Chart & Fit Guide</span>
              </Dialog.Title>
              <Dialog.Description className="mt-1 font-sans text-xs text-ink-secondary">
                Garment measurements allow ~2 inches of ease over body measurements for effortless drape.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close size chart"
              className="h-9 w-9 rounded-[4px] border border-border bg-white flex items-center justify-center text-ink"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {/* Unit Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <span className="font-sans text-xs uppercase tracking-[0.14em] text-ink-secondary">
              Body Measurement Guide
            </span>
            <div className="inline-flex rounded-[4px] border border-border bg-white p-0.5">
              {(['in', 'cm'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={
                    unit === u
                      ? 'px-3 py-1 rounded-[3px] bg-brand-green text-white font-sans text-xs font-medium'
                      : 'px-3 py-1 font-sans text-xs text-ink-secondary hover:text-ink'
                  }
                >
                  {u === 'in' ? 'Inches' : 'CM'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="mt-3 overflow-x-auto border border-border rounded-[4px] bg-white">
            <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border bg-ivory/70 text-ink-secondary uppercase text-[11px] tracking-[0.1em]">
                  <th className="py-3 px-4 font-semibold">Size</th>
                  <th className="py-3 px-4 font-semibold">Bust</th>
                  <th className="py-3 px-4 font-semibold">Waist</th>
                  <th className="py-3 px-4 font-semibold">Hip</th>
                  <th className="py-3 px-4 font-semibold">Shoulder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SIZE_ROWS.map((row) => (
                  <tr key={row.size} className="hover:bg-ivory/40">
                    <td className="py-2.5 px-4 font-semibold text-brand-green">{row.size}</td>
                    <td className="py-2.5 px-4 text-ink">{formatMeasure(row.bust)}</td>
                    <td className="py-2.5 px-4 text-ink">{formatMeasure(row.waist)}</td>
                    <td className="py-2.5 px-4 text-ink">{formatMeasure(row.hip)}</td>
                    <td className="py-2.5 px-4 text-ink">{formatMeasure(row.shoulder)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure Guide */}
          <div className="mt-6 bg-white border border-border rounded-[4px] p-4 sm:p-5 space-y-3">
            <h3 className="font-serif text-xl font-medium text-ink">How to Measure</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs text-ink-secondary leading-relaxed">
              <div>
                <p className="font-semibold text-ink">1. Bust</p>
                <p>Measure horizontally around the fullest part of your chest, keeping the tape level.</p>
              </div>
              <div>
                <p className="font-semibold text-ink">2. Waist</p>
                <p>Measure around your natural waistline, just above the navel without pulling tight.</p>
              </div>
              <div>
                <p className="font-semibold text-ink">3. Hip</p>
                <p>Stand with feet together and measure around the widest part of your hips.</p>
              </div>
              <div>
                <p className="font-semibold text-ink">4. Shoulder</p>
                <p>Measure across the back from one shoulder seam edge straight across to the other.</p>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
