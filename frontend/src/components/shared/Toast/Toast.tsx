import { forwardRef, useEffect, useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  X 
} from 'lucide-react';
import type { ToastProps } from './types';
import type { AlertVariant } from '../types';

const Toast = forwardRef<HTMLDivElement, ToastProps>(({
  toast,
  position = 'top-right',
  onDismiss,
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Auto-dismiss timer
  useEffect(() => {
    if (!toast.persistent && toast.duration !== 0) {
      const duration = toast.duration || 5000;
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.persistent]);

  // Animation timing
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Default icons for each variant
  const defaultIcons: Record<AlertVariant, any> = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  // Variant styles
  const variantStyles: Record<AlertVariant, string> = {
    success: [
      'bg-white border-green-200 shadow-lg',
      'text-green-800',
      '[&_svg]:text-green-600'
    ].join(' '),
    
    error: [
      'bg-white border-red-200 shadow-lg',
      'text-red-800',
      '[&_svg]:text-red-600'
    ].join(' '),
    
    warning: [
      'bg-white border-yellow-200 shadow-lg',
      'text-yellow-800',
      '[&_svg]:text-yellow-600'
    ].join(' '),
    
    info: [
      'bg-white border-blue-200 shadow-lg',
      'text-blue-800',
      '[&_svg]:text-blue-600'
    ].join(' ')
  };

  // Animation classes based on position
  const getAnimationClasses = () => {
    const base = 'transition-all duration-300 ease-in-out';
    
    if (isLeaving) {
      // Exit animations
      if (position.includes('right')) {
        return `${base} transform translate-x-full opacity-0`;
      } else if (position.includes('left')) {
        return `${base} transform -translate-x-full opacity-0`;
      } else {
        return `${base} transform -translate-y-full opacity-0`;
      }
    }
    
    if (isVisible) {
      // Enter animations
      return `${base} transform translate-x-0 translate-y-0 opacity-100`;
    }
    
    // Initial state
    if (position.includes('right')) {
      return `${base} transform translate-x-full opacity-0`;
    } else if (position.includes('left')) {
      return `${base} transform -translate-x-full opacity-0`;
    } else {
      return `${base} transform -translate-y-full opacity-0`;
    }
  };

  // Toast classes
  const toastClasses = [
    'relative p-4 border rounded-lg max-w-md w-full',
    'pointer-events-auto',
    variantStyles[toast.variant || 'info'],
    getAnimationClasses(),
    className
  ].filter(Boolean).join(' ');

  // Get icon to display
  const IconComponent = toast.icon || defaultIcons[toast.variant || 'info'];
  const isCustomIcon = !!toast.icon;

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300); // Match animation duration
  };

  const handleAction = () => {
    toast.action?.onClick();
    handleDismiss();
  };

  return (
    <div
      ref={ref}
      className={toastClasses}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-testid={testId}
      {...props}
    >
      <div className="flex gap-3">
        {/* Icon */}
        {IconComponent && (
          <div className="flex-shrink-0 mt-0.5">
            {isCustomIcon && typeof IconComponent !== 'function' ? (
              IconComponent
            ) : (
              <IconComponent size={20} aria-hidden="true" />
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h3 className="text-sm font-medium mb-1">
              {toast.title}
            </h3>
          )}
          
          {toast.description && (
            <div className="text-sm">
              {toast.description}
            </div>
          )}
          
          {/* Action button */}
          {toast.action && (
            <div className="mt-3">
              <button
                type="button"
                onClick={handleAction}
                className={[
                  'text-sm font-medium underline',
                  'hover:no-underline focus:outline-none',
                  'transition-colors duration-200'
                ].join(' ')}
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
        
        {/* Dismiss button */}
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            className={[
              'inline-flex rounded-md p-1.5',
              'transition-colors duration-200',
              'hover:bg-black hover:bg-opacity-10',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              toast.variant === 'success' ? 'focus:ring-green-500' : '',
              toast.variant === 'error' ? 'focus:ring-red-500' : '',
              toast.variant === 'warning' ? 'focus:ring-yellow-500' : '',
              (toast.variant === 'info' || !toast.variant) ? 'focus:ring-blue-500' : ''
            ].filter(Boolean).join(' ')}
            aria-label="Dismiss notification"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
});

Toast.displayName = 'Toast';

export { Toast };
export type { ToastProps };