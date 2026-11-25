import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col bg-white border border-border rounded-[4px] overflow-hidden hover:border-brand-green transition-colors"
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-[#F1EFE4]">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="px-3.5 py-3 flex items-center justify-between gap-2 bg-white">
        <div className="min-w-0">
          <h3 className="font-serif text-[17px] sm:text-[18px] font-medium text-ink truncate group-hover:text-brand-green transition-colors">
            {category.name}
          </h3>
          <p className="font-sans text-[11px] text-ink-secondary">
            {category.productCount} Styles
          </p>
        </div>
        <ArrowRight
          className="w-4 h-4 text-brand-green shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
