import { Link } from 'react-router-dom';
import { ArrowRight, Info, Sparkles } from 'lucide-react';
import { ABOUT_PAGE_CONTENT } from '@/data/brandContent';
import { CATEGORIES } from '@/data/catalog';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="bg-ivory">
      {/* Editorial Hero Banner */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 sm:pb-16">
          <Breadcrumb items={[{ label: 'About Us' }]} />

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <p className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-brand-secondary">
                {ABOUT_PAGE_CONTENT.eyebrow}
              </p>
              <h1 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] font-medium leading-[1.08] text-ink">
                {ABOUT_PAGE_CONTENT.headline}
              </h1>
              <p className="font-sans text-sm sm:text-base leading-relaxed text-ink-secondary">
                {ABOUT_PAGE_CONTENT.intro}
              </p>

              <div className="rounded-[4px] border border-border bg-ivory px-4 py-3 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
                <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                  Provisional brand story copy prepared for client demonstration. Final heritage
                  story, atelier details, and brand milestones will be updated upon client review.
                </p>
              </div>

              <div className="pt-1 flex flex-wrap gap-3">
                <Button asChild variant="primary" size="lg">
                  <Link to="/collection/heritage-chanderi">Shop Signature Collection</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/shop">Browse All Styles</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-[16/10] overflow-hidden rounded-[4px] border border-border bg-[#F1EFE4]">
                <img
                  src="/images/signature-editorial.jpg"
                  alt="Smart Fashion Stores ethnic wear editorial campaign"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Philosophy & Craftsmanship */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-[4px] border border-border bg-[#F1EFE4]">
              <img
                src="/images/unstitched-chanderi.jpg"
                alt="Handloom Chanderi weave and zari border detail"
                loading="lazy"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-brand-secondary">
                Brand Philosophy
              </p>
              <h2 className="mt-2 font-serif text-[30px] sm:text-[38px] font-medium leading-[1.15] text-ink">
                Designed for Quiet Confidence & Effortless Poise
              </h2>
              <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-ink-secondary">
                {ABOUT_PAGE_CONTENT.philosophy}
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-serif text-2xl font-medium text-ink flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-green" aria-hidden="true" />
                <span>Quality & Craftsmanship</span>
              </h3>
              <p className="mt-2 font-sans text-sm sm:text-base leading-relaxed text-ink-secondary">
                {ABOUT_PAGE_CONTENT.craftsmanship}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border border-border rounded-[4px] p-5">
                <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-brand-secondary">
                  Our Vision
                </p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-ink">
                  {ABOUT_PAGE_CONTENT.vision}
                </p>
              </div>
              <div className="bg-white border border-border rounded-[4px] p-5">
                <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-brand-secondary">
                  Our Mission
                </p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-ink">
                  {ABOUT_PAGE_CONTENT.mission}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ethnic Fashion Collections Showcase */}
      <section className="py-12 sm:py-16 bg-white border-t border-border">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-brand-secondary">
                Explore Our World
              </p>
              <h2 className="mt-1.5 font-serif text-[30px] sm:text-[38px] font-medium text-ink">
                Ethnic Fashion Collections
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 font-sans text-xs font-medium uppercase tracking-[0.12em] text-brand-green hover:underline"
            >
              <span>Shop All Collections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group bg-ivory border border-border rounded-[4px] overflow-hidden hover:border-brand-green transition-colors"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#F1EFE4]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <p className="font-serif text-base font-medium text-ink group-hover:text-brand-green">
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
