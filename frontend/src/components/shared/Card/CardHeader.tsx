import { forwardRef } from 'react';
import type { CardHeaderProps } from './types';

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
  children,
  avatar,
  action,
  subheader,
  className = '',
  ...props
}, ref) => {
  const headerClasses = [
    'flex items-start gap-3',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={headerClasses} {...props}>
      {/* Avatar */}
      {avatar && (
        <div className="flex-shrink-0">
          {avatar}
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Main content */}
            <div className="text-lg font-semibold text-gray-900 truncate">
              {children}
            </div>
            
            {/* Subheader */}
            {subheader && (
              <div className="mt-1 text-sm text-gray-500">
                {subheader}
              </div>
            )}
          </div>
          
          {/* Action */}
          {action && (
            <div className="flex-shrink-0 ml-3">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export { CardHeader };
export type { CardHeaderProps };