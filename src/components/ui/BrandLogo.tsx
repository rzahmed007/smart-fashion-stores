import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  showTagline?: boolean;
  className?: string;
}

export function BrandLogo({
  variant = 'dark',
  showTagline = false,
  className,
}: BrandLogoProps) {
  const isLight = variant === 'light';

  return (
    <Link
      to="/"
      className={cn('inline-flex items-center gap-3 group focus:outline-none', className)}
      aria-label="Smart Fashion Stores — Home"
    >
      {/* Botanical Arch Monogram — replaceable with client-provided logo asset */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-[1.03]"
        aria-hidden="true"
      >
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="4"
          stroke={isLight ? '#FAF9F0' : '#263F12'}
          strokeWidth="1.25"
        />
        <path
          d="M12 29V16C12 11.5817 15.5817 8 20 8C24.4183 8 28 11.5817 28 16V29"
          stroke={isLight ? '#FAF9F0' : '#263F12'}
          strokeWidth="1.25"
        />
        <path
          d="M20 12C17.8 14.2 17.2 16.8 19.6 18.8C22.2 20.9 22.8 23.4 20 26C17.4 24.6 16.4 23.1 16 21.5"
          stroke={isLight ? '#DDE2D4' : '#5D852D'}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle
          cx="20"
          cy="10.5"
          r="1.25"
          fill={isLight ? '#FAF9F0' : '#263F12'}
        />
      </svg>

      <div className="flex flex-col">
        <span
          className={cn(
            'font-serif text-[20px] sm:text-[22px] font-semibold tracking-[0.06em] uppercase leading-none',
            isLight ? 'text-ivory' : 'text-brand-green'
          )}
        >
          Smart Fashion
        </span>
        <span
          className={cn(
            'font-sans text-[10px] tracking-[0.26em] uppercase mt-1 leading-none',
            isLight ? 'text-ivory/80' : 'text-ink-secondary'
          )}
        >
          {showTagline ? 'Smart Looks for Sharp Women' : 'Stores'}
        </span>
      </div>
    </Link>
  );
}
