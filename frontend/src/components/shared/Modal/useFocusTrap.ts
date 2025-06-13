import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  isActive: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  finalFocus?: React.RefObject<HTMLElement>;
}

export const useFocusTrap = ({ 
  isActive, 
  initialFocus, 
  finalFocus 
}: UseFocusTrapOptions) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Set initial focus
    const setInitialFocus = () => {
      if (initialFocus?.current) {
        initialFocus.current.focus();
      } else if (containerRef.current) {
        // Find the first focusable element
        const focusableElement = getFocusableElements(containerRef.current)[0];
        focusableElement?.focus();
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(setInitialFocus, 10);

    return () => {
      clearTimeout(timeoutId);
      // Restore focus to the previously focused element
      if (finalFocus?.current) {
        finalFocus.current.focus();
      } else if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, initialFocus, finalFocus]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(containerRef.current!);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return containerRef;
};

// Helper function to get focusable elements
const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]'
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)).filter(
    (element) => {
      const htmlElement = element as HTMLElement;
      return (
        htmlElement.offsetParent !== null && // Element is visible
        !htmlElement.hasAttribute('disabled') &&
        htmlElement.tabIndex !== -1
      );
    }
  ) as HTMLElement[];
};