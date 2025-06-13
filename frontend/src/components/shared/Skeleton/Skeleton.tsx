import { forwardRef } from 'react';
import type { SkeletonProps } from './types';
import type { AnimationDuration } from '../types';

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(({
  width,
  height,
  variant = 'rectangular',
  lines = 1,
  spacing = '0.5rem',
  animation = 'pulse',
  speed = 'normal',
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  // Animation classes
  const animationMap = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const speedMap: Record<AnimationDuration, string> = {
    fast: '[animation-duration:1s]',
    normal: '',
    slow: '[animation-duration:3s]'
  };

  // Variant classes
  const variantMap = {
    text: 'h-4 rounded',
    rectangular: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg'
  };

  // Base skeleton classes
  const baseClasses = [
    'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200',
    'bg-[length:200%_100%]',
    animationMap[animation],
    speedMap[speed],
    variantMap[variant]
  ].filter(Boolean).join(' ');

  // Single skeleton element
  const createSkeleton = (index?: number) => {
    const elementClasses = [
      baseClasses,
      className
    ].filter(Boolean).join(' ');

    const style = {
      width: width,
      height: height,
      marginBottom: index !== undefined && index < lines - 1 ? spacing : undefined
    };

    return (
      <div
        key={index}
        className={elementClasses}
        style={style}
        data-testid={index !== undefined ? `${testId}-${index}` : testId}
      />
    );
  };

  // Multiple lines
  if (lines > 1) {
    return (
      <div ref={ref} className="space-y-2" {...props}>
        {Array.from({ length: lines }, (_, index) => createSkeleton(index))}
      </div>
    );
  }

  // Single skeleton
  return (
    <div ref={ref} {...props}>
      {createSkeleton()}
    </div>
  );
});

Skeleton.displayName = 'Skeleton';

export { Skeleton };
export type { SkeletonProps };