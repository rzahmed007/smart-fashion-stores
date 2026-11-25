import { CATEGORIES } from '@/data/catalog';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CategoryCard } from '@/components/home/CategoryCard';

export function ShopByCategorySection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-ivory">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Curated Silhouettes"
          title="Shop by Category"
          subtitle="Thoughtfully crafted ethnic staples, tailored workwear, and heirloom festive weaves."
          actionLabel="View All Categories"
          actionTo="/shop"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
