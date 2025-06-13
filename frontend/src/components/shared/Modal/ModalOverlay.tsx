import { forwardRef } from 'react';
import type { ModalOverlayProps } from './types';

const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(({
  onClick,
  className = '',
  children,
  ...props
}, ref) => {
  const overlayClasses = [
    'fixed inset-0 z-50',
    'bg-black bg-opacity-50 backdrop-blur-sm',
    'transition-all duration-300 ease-out',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger onClick if the clicked element is the overlay itself
    if (event.target === event.currentTarget) {
      onClick?.();
    }
  };

  return (
    <div
      ref={ref}
      className={overlayClasses}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
});

ModalOverlay.displayName = 'ModalOverlay';

export { ModalOverlay };
export type { ModalOverlayProps };