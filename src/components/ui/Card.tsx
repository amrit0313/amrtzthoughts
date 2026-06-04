import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] p-6 hover:-translate-y-0.5 hover:shadow-sm transition-all',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
