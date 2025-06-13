import { forwardRef } from 'react';
import type { CardFooterProps } from './types';

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const footerClasses = [
    'flex items-center justify-between gap-2',
    'pt-4 border-t border-gray-100',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={footerClasses} {...props}>
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

export { CardFooter };
export type { CardFooterProps };