import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { POLICY_DOCUMENTS } from '@/data/brandContent';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';

interface PolicyPageProps {
  policyKey: keyof typeof POLICY_DOCUMENTS;
}

export default function PolicyPage({ policyKey }: PolicyPageProps) {
  const doc = POLICY_DOCUMENTS[policyKey];

  return (
    <section className="py-8 sm:py-12 bg-ivory min-h-[75vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: doc.title }]} />

        <article className="mx-auto max-w-3xl bg-white border border-border rounded-[6px] p-6 sm:p-10 space-y-7">
          <header className="border-b border-border pb-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-ivory border border-brand-green/30 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-brand-green">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{doc.subtitle}</span>
            </div>
            <h1 className="font-serif text-[32px] sm:text-[42px] font-medium leading-[1.1] text-ink">
              {doc.title}
            </h1>
            <p className="font-sans text-xs text-ink-secondary">{doc.lastUpdatedLabel}</p>
          </header>

          <div className="space-y-6">
            {doc.sections.map((section) => (
              <section key={section.heading} className="space-y-2.5">
                <h2 className="font-serif text-2xl font-medium text-ink">{section.heading}</h2>
                {section.paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="font-sans text-sm sm:text-[15px] leading-relaxed text-ink-secondary"
                  >
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <footer className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <p className="font-sans text-xs text-ink-secondary">
              Questions regarding this draft policy?
            </p>
            <div className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="primary" size="sm">
                <Link to="/shop">Return to Shop</Link>
              </Button>
            </div>
          </footer>
        </article>
      </div>
    </section>
  );
}
