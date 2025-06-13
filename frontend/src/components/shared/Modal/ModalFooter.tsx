import { forwardRef } from 'react';
import type { ModalFooterProps } from './types';

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const footerClasses = [
    'flex items-center justify-end gap-3',
    'px-6 py-4 border-t border-gray-200 bg-gray-50',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={footerClasses} {...props}>
      {children}
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';

export { ModalFooter };
export type { ModalFooterProps };