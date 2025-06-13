import { forwardRef } from 'react';
import { X } from 'lucide-react';
import type { ModalHeaderProps } from './types';

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(({
  children,
  onClose,
  showCloseButton = true,
  className = '',
  ...props
}, ref) => {
  const headerClasses = [
    'flex items-center justify-between',
    'px-6 py-4 border-b border-gray-200',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={headerClasses} {...props}>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {children}
        </h3>
      </div>
      
      {showCloseButton && onClose && (
        <button
          type="button"
          onClick={onClose}
          className={[
            'ml-4 flex-shrink-0',
            'p-2 rounded-md text-gray-400',
            'hover:text-gray-600 hover:bg-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'transition-colors duration-200'
          ].join(' ')}
          aria-label="Close modal"
        >
          <X size={20} aria-hidden="true" />
        </button>
      )}
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

export { ModalHeader };
export type { ModalHeaderProps };