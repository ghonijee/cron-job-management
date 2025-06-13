import { forwardRef } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  X 
} from 'lucide-react';
import type { AlertProps } from './types';
import type { AlertVariant } from '../types';

const Alert = forwardRef<HTMLDivElement, AlertProps>(({
  variant = 'info',
  title,
  description,
  icon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  children,
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
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
      'bg-green-50 border-green-200',
      'text-green-800',
      '[&_svg]:text-green-600'
    ].join(' '),
    
    error: [
      'bg-red-50 border-red-200',
      'text-red-800',
      '[&_svg]:text-red-600'
    ].join(' '),
    
    warning: [
      'bg-yellow-50 border-yellow-200',
      'text-yellow-800',
      '[&_svg]:text-yellow-600'
    ].join(' '),
    
    info: [
      'bg-blue-50 border-blue-200',
      'text-blue-800',
      '[&_svg]:text-blue-600'
    ].join(' ')
  };

  // Base alert classes
  const alertClasses = [
    'relative p-4 border rounded-lg',
    'transition-all duration-200',
    variantStyles[variant],
    className
  ].filter(Boolean).join(' ');

  // Get icon to display
  const IconComponent = icon || (showIcon ? defaultIcons[variant] : null);
  const isCustomIcon = !!icon;

  const handleDismiss = () => {
    onDismiss?.();
  };

  return (
    <div
      ref={ref}
      className={alertClasses}
      role="alert"
      aria-live="polite"
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
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          
          {description && (
            <div className="text-sm">
              {description}
            </div>
          )}
          
          {children && (
            <div className="text-sm">
              {children}
            </div>
          )}
        </div>
        
        {/* Dismiss button */}
        {dismissible && (
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleDismiss}
              className={[
                'inline-flex rounded-md p-1.5',
                'transition-colors duration-200',
                'hover:bg-black hover:bg-opacity-10',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                variant === 'success' ? 'focus:ring-green-500' : '',
                variant === 'error' ? 'focus:ring-red-500' : '',
                variant === 'warning' ? 'focus:ring-yellow-500' : '',
                variant === 'info' ? 'focus:ring-blue-500' : ''
              ].filter(Boolean).join(' ')}
              aria-label="Dismiss alert"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

Alert.displayName = 'Alert';

export { Alert };
export type { AlertProps };