import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionTo?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  actionLabel,
  actionTo,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={cn(
        'mb-8 md:mb-10 flex flex-col gap-3',
        isCentered
          ? 'items-center text-center'
          : 'md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className={cn(isCentered ? 'max-w-2xl' : 'max-w-xl')}>
        {eyebrow && (
          <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-secondary mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[42px] font-medium leading-[1.12] tracking-[-0.01em] text-ink">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2.5 font-sans text-sm sm:text-[15px] leading-relaxed text-ink-secondary">
            {subtitle}
          </p>
        )}
      </div>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 font-sans text-xs sm:text-sm font-medium uppercase tracking-[0.12em] text-brand-green border-b border-brand-green/40 pb-1 hover:border-brand-green transition-colors self-start md:self-auto"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
