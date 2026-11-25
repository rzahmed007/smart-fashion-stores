import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <section className="py-20 sm:py-28 bg-ivory">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.22em] text-brand-secondary">404</p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-medium text-ink">
          Page Not Found
        </h1>
        <p className="mt-3 mx-auto max-w-md font-sans text-sm sm:text-base text-ink-secondary">
          The ensemble or page you are looking for may have moved. Explore our curated collections
          from the homepage.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button asChild variant="primary" size="lg">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/shop">Browse Catalog</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
