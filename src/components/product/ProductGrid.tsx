import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { cn } from '@/utils/cn';

interface ProductGridProps {
  products: Product[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6',
        className
      )}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priorityImage={index < 2} />
      ))}
    </div>
  );
}
