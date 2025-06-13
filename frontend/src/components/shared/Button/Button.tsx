import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { ButtonProps } from './types';
import type { ComponentVariant, ComponentSize } from '../types';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  iconOnly = false,
  loading = false,
  loadingText,
  disabled = false,
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  // Base classes for all buttons
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed',
    'select-none',
    fullWidth ? 'w-full' : 'w-auto'
  ].join(' ');

  // Variant styles
  const variantClasses: Record<ComponentVariant, string> = {
    primary: [
      'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
      'text-white',
      'border border-transparent',
      'focus:ring-blue-500',
      'disabled:bg-blue-300 disabled:text-blue-100',
      'shadow-sm hover:shadow-md'
    ].join(' '),
    
    secondary: [
      'bg-white hover:bg-gray-50 active:bg-gray-100',
      'text-gray-700 hover:text-gray-900',
      'border border-gray-300',
      'focus:ring-gray-500',
      'disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200',
      'shadow-sm hover:shadow-md'
    ].join(' '),
    
    danger: [
      'bg-red-600 hover:bg-red-700 active:bg-red-800',
      'text-white',
      'border border-transparent',
      'focus:ring-red-500',
      'disabled:bg-red-300 disabled:text-red-100',
      'shadow-sm hover:shadow-md'
    ].join(' '),
    
    ghost: [
      'bg-transparent hover:bg-gray-100 active:bg-gray-200',
      'text-gray-700 hover:text-gray-900',
      'border border-transparent',
      'focus:ring-gray-500',
      'disabled:text-gray-400 disabled:hover:bg-transparent'
    ].join(' ')
  };

  // Size styles
  const sizeClasses: Record<ComponentSize, string> = {
    sm: iconOnly ? 'h-8 w-8 p-1' : 'h-8 px-3 py-1.5 text-sm gap-1.5',
    md: iconOnly ? 'h-10 w-10 p-2' : 'h-10 px-4 py-2 text-base gap-2',
    lg: iconOnly ? 'h-12 w-12 p-2.5' : 'h-12 px-6 py-3 text-lg gap-2.5'
  };

  // Icon size mapping
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  const iconSize = iconSizes[size];

  // Combine all classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type="button"
      className={buttonClasses}
      disabled={isDisabled}
      data-testid={testId}
      aria-disabled={isDisabled}
      aria-describedby={loading ? `${testId || 'button'}-loading` : undefined}
      {...props}
    >
      {loading && (
        <>
          <Loader2 
            size={iconSize} 
            className="animate-spin" 
            aria-hidden="true" 
          />
          {!iconOnly && (
            <span className="sr-only" id={`${testId || 'button'}-loading`}>
              {loadingText || 'Loading...'}
            </span>
          )}
        </>
      )}
      
      {!loading && LeftIcon && (
        <LeftIcon size={iconSize} aria-hidden="true" />
      )}
      
      {!iconOnly && (
        <span className={loading ? 'opacity-0' : 'opacity-100'}>
          {loading && loadingText ? loadingText : children}
        </span>
      )}
      
      {!loading && RightIcon && (
        <RightIcon size={iconSize} aria-hidden="true" />
      )}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };