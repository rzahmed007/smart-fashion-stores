import { Headphones, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { SHOPPING_BENEFITS } from '@/data/homepage';

const ICON_MAP = {
  ShieldCheck,
  Sparkles,
  Truck,
  Headphones,
} as const;

export function ShoppingBenefitsSection() {
  return (
    <section
      aria-label="Shopping Benefits"
      className="py-10 sm:py-12 bg-white border-y border-border"
    >
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {SHOPPING_BENEFITS.map((benefit) => {
            const IconComponent = ICON_MAP[benefit.icon];
            return (
              <div key={benefit.id} className="flex items-start gap-4">
                <div className="h-11 w-11 shrink-0 rounded-[4px] border border-border bg-ivory flex items-center justify-center text-brand-green">
                  <IconComponent className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-ink">{benefit.title}</h3>
                  <p className="mt-1 font-sans text-xs sm:text-[13px] leading-relaxed text-ink-secondary">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
