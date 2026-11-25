import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="py-16 sm:py-24 bg-ivory min-h-[70vh] flex items-center">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 w-full">
        <div className="mx-auto max-w-xl bg-white border border-border rounded-[6px] p-8 sm:p-12 text-center space-y-6">
          <div>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-brand-secondary">
              Error 404
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-medium text-ink">
              Page Not Found
            </h1>
            <p className="mt-3 font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
              The silhouette or page you requested could not be found. Search our ethnic catalog or
              return to the curated homepage.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <label htmlFor="notfound-search" className="sr-only">
              Search Smart Fashion Stores
            </label>
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="notfound-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Chanderi suits, kurtis..."
                className="w-full h-11 pl-10 pr-3.5 rounded-[4px] border border-border bg-ivory/40 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
              />
            </div>
            <Button type="submit" variant="outline" className="h-11 px-5">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Button asChild variant="primary" size="lg">
              <Link to="/">Return to Home</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
