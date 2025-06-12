import { forwardRef } from 'react';
import { Skeleton } from './Skeleton';
import type { SkeletonTableProps } from './types';

const SkeletonTable = forwardRef<HTMLDivElement, SkeletonTableProps>(({
  rows = 5,
  columns = 4,
  showHeader = true,
  animation = 'pulse',
  speed = 'normal',
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  const containerClasses = [
    'w-full overflow-hidden border border-gray-200 rounded-lg',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={containerClasses} data-testid={testId} {...props}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          {showHeader && (
            <thead className="bg-gray-50">
              <tr>
                {Array.from({ length: columns }, (_, colIndex) => (
                  <th
                    key={colIndex}
                    className="px-4 py-3 text-left"
                    data-testid={`${testId}-header-${colIndex}`}
                  >
                    <Skeleton
                      variant="text"
                      width={`${60 + Math.random() * 40}%`}
                      height="1rem"
                      animation={animation}
                      speed={speed}
                    />
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }, (_, rowIndex) => (
              <tr key={rowIndex} data-testid={`${testId}-row-${rowIndex}`}>
                {Array.from({ length: columns }, (_, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-3"
                    data-testid={`${testId}-cell-${rowIndex}-${colIndex}`}
                  >
                    <Skeleton
                      variant="text"
                      width={`${50 + Math.random() * 50}%`}
                      height="1rem"
                      animation={animation}
                      speed={speed}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

SkeletonTable.displayName = 'SkeletonTable';

export { SkeletonTable };
export type { SkeletonTableProps };