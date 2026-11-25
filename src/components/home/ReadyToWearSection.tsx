import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { COLLECTIONS } from '@/data/catalog';
import { Button } from '@/components/ui/Button';

const RTW_QUICK_LINKS = [
  { label: 'Kurta & Palazzo Sets', to: '/category/ready-to-wear?style=palazzo' },
  { label: 'Tailored Smart Workwear', to: '/category/smart-collection' },
  { label: 'Breathable Linen Co-ords', to: '/category/ready-to-wear?style=linen' },
];

export function ReadyToWearSection() {
  const rtw = COLLECTIONS[1];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-y border-border">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Copy & Direct Shopping Links */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-5">
            <p className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-brand-secondary">
              {rtw.tagline}
            </p>
            <h2 className="font-serif text-[32px] sm:text-[40px] lg:text-[44px] font-medium leading-[1.1] text-ink">
              {rtw.name}
            </h2>
            <p className="font-sans text-sm sm:text-base leading-relaxed text-ink-secondary">
              {rtw.description}
            </p>

            <ul className="divide-y divide-border border-y border-border">
              {RTW_QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="py-3 flex items-center justify-between font-sans text-sm font-medium text-ink hover:text-brand-green transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-brand-green" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-1">
              <Button asChild variant="primary" size="lg">
                <Link to="/category/ready-to-wear">{rtw.ctaText}</Link>
              </Button>
            </div>
          </div>

          {/* Lookbook Image */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-[4px] border border-border bg-[#F1EFE4]">
              <img
                src={rtw.image}
                alt={rtw.name}
                loading="lazy"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
