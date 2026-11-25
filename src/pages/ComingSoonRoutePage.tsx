import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ComingSoonRoutePageProps {
  title: string;
  eyebrow?: string;
  description?: string;
}

export default function ComingSoonRoutePage({
  title,
  eyebrow = 'Smart Fashion Stores · Phase 2 Module',
  description = 'This route is wired into the application router and navigation architecture. Its dedicated full-page experience will be built in the next implementation phase once the homepage foundation is approved.',
}: ComingSoonRoutePageProps) {
  const params = useParams();
  const detailLabel = params.slug ? params.slug.replace(/-/g, ' ') : null;

  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl bg-white border border-border rounded-[6px] p-8 sm:p-12 text-center">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-secondary">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-medium text-ink capitalize">
            {detailLabel ? `${title}: ${detailLabel}` : title}
          </h1>
          <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-ink-secondary">
            {description}
          </p>
          <div className="mt-7 flex justify-center">
            <Button asChild variant="primary" size="lg">
              <Link to="/">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Homepage</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
