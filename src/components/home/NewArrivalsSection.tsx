import { useMemo } from 'react';
import { catalogService } from '@/services/catalogService';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductGrid } from '@/components/product/ProductGrid';

export function NewArrivalsSection() {
  const newArrivals = useMemo(() => catalogService.getNewArrivals(4), []);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-ivory">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Just Landed"
          title="New Arrivals"
          subtitle="Freshly tailored silhouettes in handwoven Chanderi, botanical cottons, and festive zari."
          actionLabel="Shop All New Arrivals"
          actionTo="/new-arrivals"
        />

        <ProductGrid products={newArrivals} />
      </div>
    </section>
  );
}
