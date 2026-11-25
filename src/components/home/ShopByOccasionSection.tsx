import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { OCCASIONS } from '@/data/homepage';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function ShopByOccasionSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-ivory">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Dressed for Every Moment"
          title="Shop by Occasion"
          subtitle="From breathable daytime cottons to luminous Banarasi festive ensembles."
          align="center"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {OCCASIONS.map((occasion) => (
            <Link
              key={occasion.id}
              to={`/shop?occasion=${encodeURIComponent(occasion.name)}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-[4px] border border-border bg-[#F1EFE4]"
            >
              <img
                src={occasion.image}
                alt={occasion.name}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-brand-green/90 via-brand-green/25 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-ivory">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-medium leading-tight">
                    {occasion.name}
                  </h3>
                  <ArrowUpRight
                    className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-1 font-sans text-xs text-ivory/85 line-clamp-2">
                  {occasion.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
