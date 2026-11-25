import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 font-sans text-xs text-ink-secondary">
        <li>
          <Link to="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-ink-secondary/60" aria-hidden="true" />
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-brand-green transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
