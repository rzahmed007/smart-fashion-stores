import { useMemo } from 'react';
import { catalogService } from '@/services/catalogService';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductGrid } from '@/components/product/ProductGrid';

export function BestSellersSection() {
  const bestSellers = useMemo(() => catalogService.getBestSellers(4), []);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-ivory">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Most Coveted"
          title="Best Sellers"
          subtitle="Signature Smart Fashion favourites loved for their crisp drape and enduring comfort."
          actionLabel="View All Best Sellers"
          actionTo="/shop?sort=bestseller"
        />

        <ProductGrid products={bestSellers} />
      </div>
    </section>
  );
}
