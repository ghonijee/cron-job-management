import { forwardRef } from 'react';
import { X } from 'lucide-react';
import type { BadgeProps } from './types';
import type { BadgeVariant, ComponentSize, ColorType } from '../types';

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({
  children,
  variant = 'solid',
  color = 'blue',
  size = 'md',
  dot = false,
  icon,
  iconPosition = 'left',
  removable = false,
  onRemove,
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  // Size styles
  const sizeStyles: Record<ComponentSize, string> = {
    sm: dot ? 'h-2 w-2' : 'px-2 py-0.5 text-xs',
    md: dot ? 'h-2.5 w-2.5' : 'px-2.5 py-1 text-sm',
    lg: dot ? 'h-3 w-3' : 'px-3 py-1.5 text-base'
  };

  // Icon sizes
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  // Color and variant combinations
  const getVariantStyles = (variant: BadgeVariant, color: ColorType): string => {
    const colorMap: Record<ColorType, { solid: string; outline: string; soft: string }> = {
      blue: {
        solid: 'bg-blue-600 text-white border-blue-600',
        outline: 'bg-transparent text-blue-700 border-blue-300',
        soft: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      gray: {
        solid: 'bg-gray-600 text-white border-gray-600',
        outline: 'bg-transparent text-gray-700 border-gray-300',
        soft: 'bg-gray-100 text-gray-800 border-gray-200'
      },
      red: {
        solid: 'bg-red-600 text-white border-red-600',
        outline: 'bg-transparent text-red-700 border-red-300',
        soft: 'bg-red-100 text-red-800 border-red-200'
      },
      green: {
        solid: 'bg-green-600 text-white border-green-600',
        outline: 'bg-transparent text-green-700 border-green-300',
        soft: 'bg-green-100 text-green-800 border-green-200'
      },
      yellow: {
        solid: 'bg-yellow-600 text-white border-yellow-600',
        outline: 'bg-transparent text-yellow-700 border-yellow-300',
        soft: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      indigo: {
        solid: 'bg-indigo-600 text-white border-indigo-600',
        outline: 'bg-transparent text-indigo-700 border-indigo-300',
        soft: 'bg-indigo-100 text-indigo-800 border-indigo-200'
      },
      purple: {
        solid: 'bg-purple-600 text-white border-purple-600',
        outline: 'bg-transparent text-purple-700 border-purple-300',
        soft: 'bg-purple-100 text-purple-800 border-purple-200'
      },
      pink: {
        solid: 'bg-pink-600 text-white border-pink-600',
        outline: 'bg-transparent text-pink-700 border-pink-300',
        soft: 'bg-pink-100 text-pink-800 border-pink-200'
      }
    };

    return colorMap[color][variant];
  };

  // Base classes
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-full border',
    'transition-all duration-200',
    dot ? '' : 'gap-1',
    dot ? 'rounded-full' : '',
    sizeStyles[size],
    getVariantStyles(variant, color),
    className
  ].filter(Boolean).join(' ');

  const IconComponent = icon && typeof icon === 'function' ? icon : null;
  const isCustomIcon = icon && typeof icon !== 'function';

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    onRemove?.();
  };

  // Dot badge (just a colored dot)
  if (dot) {
    return (
      <span
        ref={ref}
        className={baseClasses}
        data-testid={testId}
        {...props}
      />
    );
  }

  // Regular badge with content
  return (
    <span
      ref={ref}
      className={baseClasses}
      data-testid={testId}
      {...props}
    >
      {/* Left icon */}
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">
          {isCustomIcon ? (
            icon
          ) : IconComponent ? (
            <IconComponent size={iconSizes[size]} aria-hidden="true" />
          ) : null}
        </span>
      )}

      {/* Content */}
      <span className="truncate">{children}</span>

      {/* Right icon */}
      {icon && iconPosition === 'right' && !removable && (
        <span className="flex-shrink-0">
          {isCustomIcon ? (
            icon
          ) : IconComponent ? (
            <IconComponent size={iconSizes[size]} aria-hidden="true" />
          ) : null}
        </span>
      )}

      {/* Remove button */}
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className={[
            'flex-shrink-0 ml-1 rounded-full',
            'hover:bg-black hover:bg-opacity-10',
            'focus:outline-none focus:bg-black focus:bg-opacity-10',
            'transition-colors duration-200',
            size === 'sm' ? 'p-0.5' : 'p-1'
          ].join(' ')}
          aria-label="Remove"
        >
          <X size={iconSizes[size] - 2} aria-hidden="true" />
        </button>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };