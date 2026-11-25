import { Star } from 'lucide-react';
import { SAMPLE_TESTIMONIALS } from '@/data/homepage';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-ivory">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Client Impressions · Sample Testimonials"
          title="Worn with Quiet Confidence"
          subtitle="Illustrative sample testimonials displayed for client demonstration until verified customer reviews are connected."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {SAMPLE_TESTIMONIALS.map((review) => (
            <article
              key={review.id}
              className="flex flex-col justify-between bg-white border border-border rounded-[4px] p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-brand-green" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <span className="px-2 py-0.5 rounded-[2px] bg-ivory border border-border font-sans text-[10px] uppercase tracking-[0.12em] text-ink-secondary">
                    Sample Review
                  </span>
                </div>

                <blockquote className="font-serif text-lg sm:text-[19px] leading-relaxed text-ink italic">
                  “{review.quote}”
                </blockquote>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="font-sans text-sm font-medium text-ink">
                  {review.customerName} · <span className="text-ink-secondary font-normal">{review.city}</span>
                </p>
                <p className="mt-0.5 font-sans text-xs text-brand-secondary">
                  {review.purchasedItem}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
