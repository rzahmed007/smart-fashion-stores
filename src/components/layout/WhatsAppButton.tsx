import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  message?: string;
}

export function WhatsAppButton({
  message = 'Hello Smart Fashion Stores, I would like styling and product assistance.',
}: WhatsAppButtonProps) {
  const { pathname } = useLocation();
  const hideOnMobileStickyPages =
    pathname.startsWith('/product/') || pathname.startsWith('/checkout');

  const whatsappUrl = `https://wa.me/919820000000?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Styling Concierge"
      className={
        hideOnMobileStickyPages
          ? 'hidden lg:inline-flex fixed z-30 bottom-6 right-6 items-center gap-2 h-11 px-4 rounded-full bg-brand-green text-white border border-white/20 shadow-md hover:bg-brand-green-hover transition-colors'
          : 'fixed z-30 right-4 bottom-20 lg:bottom-6 lg:right-6 inline-flex items-center gap-2 h-11 px-4 rounded-full bg-brand-green text-white border border-white/20 shadow-md hover:bg-brand-green-hover transition-colors'
      }
    >
      <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span className="font-sans text-xs font-medium tracking-[0.06em] hidden sm:inline">
        WhatsApp Concierge
      </span>
    </a>
  );
}
