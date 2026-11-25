import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[4px] font-sans text-sm font-medium tracking-[0.04em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-green text-white hover:bg-brand-green-hover border border-brand-green',
        outline:
          'border border-brand-green bg-transparent text-brand-green hover:bg-brand-green hover:text-white',
        secondary:
          'border border-border bg-white text-ink hover:border-brand-green hover:text-brand-green',
        ivory:
          'bg-ivory text-brand-green border border-ivory hover:bg-white',
        ghost:
          'text-ink hover:bg-brand-green/5 hover:text-brand-green',
      },
      size: {
        sm: 'h-9 px-4 text-xs uppercase tracking-[0.08em]',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-7 text-[15px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
