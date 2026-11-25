import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X, ArrowRight } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { catalogService } from '@/services/catalogService';
import { formatPrice } from '@/utils/format';

const QUICK_SEARCH_TERMS = [
  'Chanderi',
  'Salwar Suit',
  'Kurti',
  'Banarasi',
  'Smart Collection',
  'Festive',
];

export function SearchModal() {
  const navigate = useNavigate();
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');

  const allProducts = useMemo(() => catalogService.getAllProducts(), []);

  const matches = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return allProducts.slice(0, 4);
    return allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.fabric.toLowerCase().includes(trimmed)
      )
      .slice(0, 4);
  }, [allProducts, query]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    closeSearch();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <Dialog.Root open={isSearchOpen} onOpenChange={(open) => !open && closeSearch()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-x-0 top-0 z-50 bg-ivory border-b border-border shadow-xl focus:outline-none">
          <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-6">
            <Dialog.Title className="sr-only">Search Smart Fashion Stores</Dialog.Title>
            <Dialog.Description className="sr-only">
              Search ethnic wear by silhouette, fabric, or occasion
            </Dialog.Description>

            <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-brand-green pb-3">
              <Search className="w-5 h-5 text-brand-green shrink-0" />
              <input
                type="search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Chanderi suits, kurtis, festive shararas..."
                className="flex-1 bg-transparent font-sans text-base sm:text-lg text-ink placeholder:text-ink-secondary focus:outline-none"
              />
              <button
                type="submit"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 h-9 rounded-[4px] bg-brand-green text-white font-sans text-xs uppercase tracking-[0.1em]"
              >
                Search
              </button>
              <Dialog.Close
                aria-label="Close search"
                className="h-9 w-9 rounded-[4px] flex items-center justify-center text-ink hover:text-brand-green"
              >
                <X className="w-5 h-5" />
              </Dialog.Close>
            </form>

            {/* Quick Terms */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-ink-secondary mr-1">
                Popular:
              </span>
              {QUICK_SEARCH_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-3 py-1 rounded-[4px] border border-border bg-white font-sans text-xs text-ink hover:border-brand-green hover:text-brand-green transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Instant Preview Grid */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-sans text-xs uppercase tracking-[0.14em] text-ink-secondary">
                  {query.trim() ? 'Matching Silhouettes' : 'Curated Highlights'}
                </p>
                <Link
                  to={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={closeSearch}
                  className="inline-flex items-center gap-1 font-sans text-xs font-medium text-brand-green hover:underline"
                >
                  View all results <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {matches.length === 0 ? (
                <p className="py-6 font-sans text-sm text-ink-secondary">
                  No pieces matched “{query}”. Try searching for Chanderi, Kurtis, or Olive.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {matches.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={closeSearch}
                      className="group flex flex-col bg-white border border-border rounded-[4px] overflow-hidden hover:border-brand-green transition-colors"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-[#F1EFE4]">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-2.5">
                        <p className="font-serif text-sm font-medium text-ink line-clamp-1">
                          {product.name}
                        </p>
                        <p className="font-sans text-xs font-semibold text-brand-green mt-0.5">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
