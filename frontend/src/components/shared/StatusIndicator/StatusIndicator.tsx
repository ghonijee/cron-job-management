import { forwardRef } from 'react';
import { 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import type { StatusIndicatorProps } from './types';
import type { StatusType, ComponentSize } from '../types';

const StatusIndicator = forwardRef<HTMLDivElement, StatusIndicatorProps>(({
  status,
  size = 'md',
  showIcon = true,
  showText = true,
  text,
  icon,
  pulse = false,
  dot = false,
  variant = 'default',
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  // Status configuration
  const statusConfig: Record<StatusType, {
    color: string;
    dotColor: string;
    icon: any;
    label: string;
  }> = {
    active: {
      color: 'text-green-600',
      dotColor: 'bg-green-500',
      icon: CheckCircle,
      label: 'Active'
    },
    inactive: {
      color: 'text-gray-500',
      dotColor: 'bg-gray-400',
      icon: XCircle,
      label: 'Inactive'
    },
    pending: {
      color: 'text-yellow-600',
      dotColor: 'bg-yellow-500',
      icon: Clock,
      label: 'Pending'
    },
    success: {
      color: 'text-green-600',
      dotColor: 'bg-green-500',
      icon: CheckCircle,
      label: 'Success'
    },
    error: {
      color: 'text-red-600',
      dotColor: 'bg-red-500',
      icon: AlertCircle,
      label: 'Error'
    }
  };

  // Size styles
  const sizeStyles: Record<ComponentSize, {
    dot: string;
    icon: number;
    text: string;
    gap: string;
  }> = {
    sm: {
      dot: 'h-2 w-2',
      icon: 12,
      text: 'text-xs',
      gap: 'gap-1'
    },
    md: {
      dot: 'h-2.5 w-2.5',
      icon: 14,
      text: 'text-sm',
      gap: 'gap-1.5'
    },
    lg: {
      dot: 'h-3 w-3',
      icon: 16,
      text: 'text-base',
      gap: 'gap-2'
    }
  };

  const config = statusConfig[status];
  const sizeConfig = sizeStyles[size];

  // Get display text
  const displayText = text || config.label;

  // Get icon component
  const IconComponent = icon || (showIcon ? config.icon : null);
  const isCustomIcon = !!icon;

  // Container classes for different variants
  const getContainerClasses = () => {
    const base = ['inline-flex items-center', sizeConfig.gap];

    switch (variant) {
      case 'minimal':
        return [...base, className].filter(Boolean).join(' ');
      case 'detailed':
        return [
          ...base,
          'px-3 py-1.5 rounded-full border',
          'bg-white border-gray-200',
          className
        ].filter(Boolean).join(' ');
      default:
        return [...base, className].filter(Boolean).join(' ');
    }
  };

  // Dot classes
  const dotClasses = [
    'rounded-full flex-shrink-0',
    sizeConfig.dot,
    config.dotColor,
    pulse && (status === 'active' || status === 'success') 
      ? 'animate-pulse' 
      : '',
    pulse && status === 'pending' 
      ? 'animate-ping' 
      : ''
  ].filter(Boolean).join(' ');

  // Text classes
  const textClasses = [
    'font-medium',
    sizeConfig.text,
    config.color
  ].join(' ');

  return (
    <div
      ref={ref}
      className={getContainerClasses()}
      data-testid={testId}
      {...props}
    >
      {/* Dot indicator */}
      {dot && (
        <span className={dotClasses} aria-hidden="true" />
      )}

      {/* Icon indicator */}
      {!dot && IconComponent && (
        <span className={`flex-shrink-0 ${config.color}`}>
          {isCustomIcon && typeof IconComponent !== 'function' ? (
            IconComponent
          ) : (
            <IconComponent size={sizeConfig.icon} aria-hidden="true" />
          )}
        </span>
      )}

      {/* Text */}
      {showText && (
        <span className={textClasses}>
          {displayText}
        </span>
      )}

      {/* Screen reader text */}
      <span className="sr-only">
        Status: {displayText}
      </span>
    </div>
  );
});

StatusIndicator.displayName = 'StatusIndicator';

export { StatusIndicator };
export type { StatusIndicatorProps };