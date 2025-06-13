import { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalOverlay } from './ModalOverlay';
import { ModalContent } from './ModalContent';
import { useFocusTrap } from './useFocusTrap';
import type { ModalProps } from './types';
import type { ModalSize } from '../types';

const Modal = forwardRef<HTMLDivElement, ModalProps>(({
  isOpen,
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  preventBodyScroll = true,
  children,
  initialFocus,
  finalFocus,
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  // Focus trap hook
  const focusTrapRef = useFocusTrap({
    isActive: isOpen,
    initialFocus,
    finalFocus
  });

  // Body scroll lock
  useEffect(() => {
    if (!preventBodyScroll) return;

    if (isOpen) {
      // Store original overflow
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Lock body scroll and compensate for scrollbar
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        // Restore original values
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen, preventBodyScroll]);

  // ESC key handler
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Size styles
  const sizeStyles: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4 my-4 h-full max-h-[calc(100vh-2rem)]'
  };

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <ModalOverlay onClick={handleOverlayClick}>
      <div className="flex items-center justify-center min-h-full p-4">
        <ModalContent 
          ref={(element) => {
            // Combine refs
            if (element) {
              focusTrapRef.current = element;
              if (typeof ref === 'function') {
                ref(element);
              } else if (ref) {
                ref.current = element;
              }
            }
          }}
          className={[
            'w-full',
            sizeStyles[size],
            size === 'full' ? 'h-full flex flex-col' : '',
            className
          ].filter(Boolean).join(' ')}
          data-testid={testId}
          {...props}
        >
          {children}
        </ModalContent>
      </div>
    </ModalOverlay>
  );

  return createPortal(modalContent, document.body);
});

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps };