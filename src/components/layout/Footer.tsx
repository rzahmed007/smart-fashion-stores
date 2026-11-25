import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

const SHOP_LINKS = [
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Salwar Suits', to: '/category/salwar-suits' },
  { label: 'Kurtis', to: '/category/kurtis' },
  { label: 'Smart Collection', to: '/category/smart-collection' },
  { label: 'Ready to Wear', to: '/category/ready-to-wear' },
  { label: 'Unstitched', to: '/category/unstitched' },
  { label: 'Festive Wear', to: '/category/festive-wear' },
];

const SUPPORT_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Track Order', to: '/track-order' },
  { label: 'Customer Support', to: '/contact' },
];

const POLICY_LINKS = [
  { label: 'Shipping Policy', to: '/shipping-policy' },
  { label: 'Returns & Refund Policy', to: '/returns-policy' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms' },
];

const PAYMENT_LABELS = ['UPI', 'Visa', 'Mastercard', 'RuPay', 'Razorpay', 'COD'];

export function Footer() {
  return (
    <footer className="bg-brand-green text-ivory pb-20 lg:pb-0">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/15">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="light" showTagline />
            <p className="font-sans text-sm leading-relaxed text-ivory/80 max-w-sm">
              Contemporary Indian ethnic wear designed with heritage weaves, refined silhouettes,
              and thoughtful tailoring for the sharp modern woman.
            </p>
            <div className="space-y-1.5 pt-1 font-sans text-xs text-ivory/75">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>+91 98200 00000 (Concierge Demo)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>concierge@smartfashionstores.com</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Mumbai · Jaipur · New Delhi</span>
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Smart Fashion Stores on Instagram"
                className="h-9 w-9 rounded-[4px] border border-white/25 flex items-center justify-center text-ivory hover:bg-white hover:text-brand-green transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Smart Fashion Stores on Facebook"
                className="h-9 w-9 rounded-[4px] border border-white/25 flex items-center justify-center text-ivory hover:bg-white hover:text-brand-green transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919820000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Smart Fashion Stores on WhatsApp"
                className="h-9 w-9 rounded-[4px] border border-white/25 flex items-center justify-center text-ivory hover:bg-white hover:text-brand-green transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="lg:col-span-3">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ivory/90 mb-4">
              Shop Categories
            </h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sans text-sm text-ivory/75 hover:text-ivory transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-2">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ivory/90 mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sans text-sm text-ivory/75 hover:text-ivory transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="lg:col-span-3">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ivory/90 mb-4">
              Policies & Terms
            </h3>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sans text-sm text-ivory/75 hover:text-ivory transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-sans text-xs text-ivory/70">
            © {new Date().getFullYear()} Smart Fashion Stores. Smart Looks for Sharp Women. Client
            Demonstration Storefront.
          </p>

          {/* Payment Method Badges */}
          <div className="flex flex-wrap items-center gap-2" aria-label="Supported payment methods">
            {PAYMENT_LABELS.map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 rounded-[4px] border border-white/20 bg-white/5 font-sans text-[11px] font-medium tracking-[0.06em] text-ivory/90"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
