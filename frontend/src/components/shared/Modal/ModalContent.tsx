import { forwardRef } from 'react';
import type { ModalContentProps } from './types';

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const contentClasses = [
    'relative bg-white rounded-lg shadow-xl',
    'max-h-full overflow-y-auto',
    'transform transition-all duration-300 ease-out',
    'animate-zoom-in',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={contentClasses}
      role="dialog"
      aria-modal="true"
      {...props}
    >
      {children}
    </div>
  );
});

ModalContent.displayName = 'ModalContent';

export { ModalContent };
export type { ModalContentProps };