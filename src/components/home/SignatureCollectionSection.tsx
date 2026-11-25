import { Link } from 'react-router-dom';
import { COLLECTIONS } from '@/data/catalog';
import { Button } from '@/components/ui/Button';

export function SignatureCollectionSection() {
  const signature = COLLECTIONS[0];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-y border-border">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Editorial Photography */}
          <div className="lg:col-span-7">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-[4px] border border-border bg-[#F1EFE4]">
              <img
                src={signature.image}
                alt={signature.name}
                loading="lazy"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Editorial Copy */}
          <div className="lg:col-span-5 space-y-5">
            <p className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-brand-secondary">
              {signature.tagline}
            </p>
            <h2 className="font-serif text-[32px] sm:text-[40px] lg:text-[44px] font-medium leading-[1.1] text-ink">
              {signature.name}
            </h2>
            <p className="font-sans text-sm sm:text-base leading-relaxed text-ink-secondary">
              {signature.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button asChild variant="primary" size="lg">
                <Link to={`/collection/${signature.slug}`}>{signature.ctaText}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/shop?collection=heritage-chanderi">Browse Pieces</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
