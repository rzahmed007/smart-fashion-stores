import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { FAQ_CATEGORIES } from '@/data/brandContent';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export default function FaqPage() {
  const [openKey, setOpenKey] = useState<string | null>('ordering-0');

  return (
    <section className="py-8 sm:py-12 bg-ivory min-h-[75vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Frequently Asked Questions' }]} />

        <div className="mx-auto max-w-3xl">
          <div className="pb-8 border-b border-border">
            <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-secondary">
              Customer Help Center
            </p>
            <h1 className="mt-2 font-serif text-[32px] sm:text-[42px] font-medium leading-[1.1] text-ink">
              Frequently Asked Questions
            </h1>
            <p className="mt-2 font-sans text-sm sm:text-base text-ink-secondary">
              Helpful guidance on ordering, simulated demo payments, sizing, and tracking.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {FAQ_CATEGORIES.map((category) => (
              <div key={category.id} className="bg-white border border-border rounded-[4px] p-5 sm:p-6">
                <h2 className="font-serif text-2xl font-medium text-ink pb-3 border-b border-border">
                  {category.title}
                </h2>
                <div className="divide-y divide-border">
                  {category.items.map((item, idx) => {
                    const key = `${category.id}-${idx}`;
                    const isOpen = openKey === key;
                    return (
                      <div key={item.question} className="py-3.5 last:pb-0">
                        <button
                          type="button"
                          onClick={() => setOpenKey(isOpen ? null : key)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between gap-4 text-left font-sans text-sm sm:text-[15px] font-medium text-ink hover:text-brand-green"
                        >
                          <span>{item.question}</span>
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 shrink-0 text-ink-secondary transition-transform',
                              isOpen && 'rotate-180'
                            )}
                          />
                        </button>
                        {isOpen && (
                          <div className="mt-2.5 font-sans text-sm leading-relaxed text-ink-secondary space-y-2">
                            <p>{item.answer}</p>
                            {item.linkTo && item.linkLabel && (
                              <Link
                                to={item.linkTo}
                                className="inline-block font-sans text-xs font-medium text-brand-green hover:underline"
                              >
                                {item.linkLabel} →
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white border border-border rounded-[4px] p-6 sm:p-8 text-center">
            <h2 className="font-serif text-2xl font-medium text-ink">Still have a question?</h2>
            <p className="mt-1.5 font-sans text-sm text-ink-secondary">
              Reach out through our customer concierge page or continue browsing the collection.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild variant="primary">
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/shop">Shop All</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
