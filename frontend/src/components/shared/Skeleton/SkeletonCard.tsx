import { forwardRef } from 'react';
import { Skeleton } from './Skeleton';
import { SkeletonText } from './SkeletonText';
import type { SkeletonCardProps } from './types';

const SkeletonCard = forwardRef<HTMLDivElement, SkeletonCardProps>(({
  showAvatar = false,
  avatarSize = 40,
  lines = 3,
  showActions = false,
  animation = 'pulse',
  speed = 'normal',
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  const cardClasses = [
    'p-6 border border-gray-200 rounded-lg bg-white',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={cardClasses} data-testid={testId} {...props}>
      {/* Header with avatar */}
      {showAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <Skeleton
            variant="circular"
            width={avatarSize}
            height={avatarSize}
            animation={animation}
            speed={speed}
            data-testid={`${testId}-avatar`}
          />
          <div className="flex-1">
            <Skeleton
              variant="text"
              width="60%"
              height="1rem"
              animation={animation}
              speed={speed}
              className="mb-2"
              data-testid={`${testId}-title`}
            />
            <Skeleton
              variant="text"
              width="40%"
              height="0.75rem"
              animation={animation}
              speed={speed}
              data-testid={`${testId}-subtitle`}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className={showAvatar ? '' : 'mb-4'}>
        <SkeletonText
          lines={lines}
          fontSize="sm"
          animation={animation}
          speed={speed}
          data-testid={`${testId}-content`}
        />
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Skeleton
            variant="rounded"
            width="80px"
            height="32px"
            animation={animation}
            speed={speed}
            data-testid={`${testId}-action-1`}
          />
          <Skeleton
            variant="rounded"
            width="80px"
            height="32px"
            animation={animation}
            speed={speed}
            data-testid={`${testId}-action-2`}
          />
        </div>
      )}
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

export { SkeletonCard };
export type { SkeletonCardProps };