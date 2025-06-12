import { forwardRef } from 'react';
import { Skeleton } from './Skeleton';
import type { SkeletonTextProps } from './types';

const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(({
  lines = 3,
  spacing = '0.5rem',
  lastLineWidth = '75%',
  fontSize = 'base',
  animation = 'pulse',
  speed = 'normal',
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  const fontSizeMap = {
    xs: 'h-3',
    sm: 'h-3.5',
    base: 'h-4',
    lg: 'h-5',
    xl: 'h-6'
  };

  const lineHeight = fontSizeMap[fontSize];

  return (
    <div ref={ref} className={className} data-testid={testId} {...props}>
      {Array.from({ length: lines }, (_, index) => {
        const isLastLine = index === lines - 1;
        const width = isLastLine && lines > 1 ? lastLineWidth : '100%';
        
        return (
          <Skeleton
            key={index}
            variant="text"
            width={width}
            height={lineHeight}
            animation={animation}
            speed={speed}
            className={index < lines - 1 ? `mb-2` : ''}
            data-testid={`${testId}-line-${index}`}
          />
        );
      })}
    </div>
  );
});

SkeletonText.displayName = 'SkeletonText';

export { SkeletonText };
export type { SkeletonTextProps };