import { forwardRef } from 'react';
import type { SpinnerProps } from './types';
import type { ComponentSize, ColorType } from '../types';

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({
  size = 'md',
  color = 'blue',
  thickness = 2,
  speed = 'normal',
  label = 'Loading...',
  overlay = false,
  centered = false,
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  // Size mapping
  const sizeMap: Record<ComponentSize, number> = {
    sm: 16,
    md: 24,
    lg: 32
  };

  const spinnerSize = typeof size === 'number' ? size : sizeMap[size];

  // Color mapping
  const colorMap: Record<ColorType | 'current' | 'white', string> = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    red: 'text-red-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    pink: 'text-pink-600',
    current: 'text-current',
    white: 'text-white'
  };

  // Speed mapping
  const speedMap = {
    slow: 'animate-spin [animation-duration:2s]',
    normal: 'animate-spin',
    fast: 'animate-spin [animation-duration:0.5s]'
  };

  // Container classes
  const containerClasses = [
    overlay ? 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25' : '',
    centered && !overlay ? 'flex items-center justify-center' : '',
    className
  ].filter(Boolean).join(' ');

  // Spinner classes
  const spinnerClasses = [
    speedMap[speed],
    colorMap[color]
  ].join(' ');

  // Create SVG spinner
  const spinnerElement = (
    <svg
      className={spinnerClasses}
      width={spinnerSize}
      height={spinnerSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      data-testid={testId}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray="62.83"
        strokeDashoffset="47.12"
        fill="none"
        opacity="0.25"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray="15.71"
        strokeDashoffset="0"
        fill="none"
        transform="rotate(-90 12 12)"
      />
    </svg>
  );

  // If overlay or centered, wrap in container
  if (overlay || centered) {
    return (
      <div ref={ref} className={containerClasses} {...props}>
        <div className="flex flex-col items-center gap-2">
          {spinnerElement}
          {label && !overlay && (
            <span className="text-sm text-gray-600 sr-only sm:not-sr-only">
              {label}
            </span>
          )}
        </div>
        {/* Screen reader announcement */}
        <span className="sr-only" aria-live="polite">
          {label}
        </span>
      </div>
    );
  }

  // Return just the spinner for inline use
  return (
    <span ref={ref} className={className} {...props}>
      {spinnerElement}
      <span className="sr-only" aria-live="polite">
        {label}
      </span>
    </span>
  );
});

Spinner.displayName = 'Spinner';

export { Spinner };
export type { SpinnerProps };