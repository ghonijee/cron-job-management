import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Toast } from './Toast';
import type { 
  ToastProviderProps, 
  ToastContextValue, 
  ToastData 
} from './types';
import type { ToastPosition } from '../types';

// Create context
const ToastContext = createContext<ToastContextValue | null>(null);

// Provider component
export const ToastProvider = ({ 
  children, 
  position = 'top-right',
  maxToasts = 5,
  defaultDuration = 5000
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Generate unique ID
  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  // Add toast
  const addToast = useCallback((toast: Omit<ToastData, 'id'>): string => {
    const id = generateId();
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration ?? defaultDuration
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      // Limit number of toasts
      return updated.slice(0, maxToasts);
    });

    return id;
  }, [generateId, defaultDuration, maxToasts]);

  // Remove toast
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((message: string, options?: Partial<ToastData>): string => {
    return addToast({
      variant: 'success',
      description: message,
      ...options
    });
  }, [addToast]);

  const error = useCallback((message: string, options?: Partial<ToastData>): string => {
    return addToast({
      variant: 'error',
      description: message,
      persistent: true, // Errors should be persistent by default
      ...options
    });
  }, [addToast]);

  const warning = useCallback((message: string, options?: Partial<ToastData>): string => {
    return addToast({
      variant: 'warning',
      description: message,
      ...options
    });
  }, [addToast]);

  const info = useCallback((message: string, options?: Partial<ToastData>): string => {
    return addToast({
      variant: 'info',
      description: message,
      ...options
    });
  }, [addToast]);

  // Context value
  const value: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info
  };

  // Position classes
  const getPositionClasses = (position: ToastPosition): string => {
    const positionMap: Record<ToastPosition, string> = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4'
    };
    
    return positionMap[position];
  };

  // Toast container
  const toastContainer = toasts.length > 0 ? createPortal(
    <div
      className={[
        'fixed z-50 pointer-events-none',
        'flex flex-col gap-2',
        getPositionClasses(position)
      ].join(' ')}
      aria-live="assertive"
      aria-label="Notifications"
    >
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          position={position}
          onDismiss={removeToast}
          data-testid={`toast-${toast.id}`}
        />
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toastContainer}
    </ToastContext.Provider>
  );
};

// Hook to use toast context
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Export context for advanced usage
export { ToastContext };