import { forwardRef } from 'react';
import type { CardProps } from './types';

const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  shadow = 'sm',
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-white',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white'
  };

  // Padding styles
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  // Shadow styles
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  // Base card classes
  const cardClasses = [
    'rounded-lg overflow-hidden transition-all duration-200',
    variantStyles[variant],
    paddingStyles[padding],
    shadowStyles[shadow],
    
    // Interactive states
    hoverable || clickable ? 'hover:shadow-lg' : '',
    clickable ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : '',
    hoverable && !clickable ? 'hover:shadow-md' : '',
    
    // Focus states for keyboard navigation
    clickable ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : '',
    
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (clickable && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={ref}
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      aria-pressed={clickable ? false : undefined}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export { Card };
export type { CardProps };