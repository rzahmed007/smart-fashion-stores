import { HeroBanner } from '@/components/home/HeroBanner';
import { ShopByCategorySection } from '@/components/home/ShopByCategorySection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { SignatureCollectionSection } from '@/components/home/SignatureCollectionSection';
import { BestSellersSection } from '@/components/home/BestSellersSection';
import { ShopByOccasionSection } from '@/components/home/ShopByOccasionSection';
import { ReadyToWearSection } from '@/components/home/ReadyToWearSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ShoppingBenefitsSection } from '@/components/home/ShoppingBenefitsSection';
import { WhatsAppSubscriptionSection } from '@/components/home/WhatsAppSubscriptionSection';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <ShopByCategorySection />
      <NewArrivalsSection />
      <SignatureCollectionSection />
      <BestSellersSection />
      <ShopByOccasionSection />
      <ReadyToWearSection />
      <TestimonialsSection />
      <ShoppingBenefitsSection />
      <WhatsAppSubscriptionSection />
    </>
  );
}
