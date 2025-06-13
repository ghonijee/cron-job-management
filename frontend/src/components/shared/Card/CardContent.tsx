import { forwardRef } from 'react';
import type { CardContentProps } from './types';

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const contentClasses = [
    'text-gray-700',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={contentClasses} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

export { CardContent };
export type { CardContentProps };