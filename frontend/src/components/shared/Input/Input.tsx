import { forwardRef } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { InputProps } from './types';
import type { ComponentSize } from '../types';

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  placeholder,
  helperText,
  errorMessage,
  size = 'md',
  state = 'default',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = true,
  required = false,
  clearable = false,
  onClear,
  disabled = false,
  className = '',
  id,
  'data-testid': testId,
  value,
  onChange,
  ...props
}, ref) => {
  // Remove unused isFocused state for now
  // const [isFocused, setIsFocused] = useState(false);
  
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = errorMessage ? `${inputId}-error` : undefined;
  
  const hasValue = value !== undefined && value !== '';
  const hasError = state === 'error' || !!errorMessage;
  const hasSuccess = state === 'success';
  
  // Container classes
  const containerClasses = [
    'relative',
    fullWidth ? 'w-full' : 'w-auto'
  ].join(' ');

  // Label classes
  const labelClasses = [
    'block text-sm font-medium mb-1',
    hasError ? 'text-red-700' : 'text-gray-700',
    disabled ? 'text-gray-400' : ''
  ].filter(Boolean).join(' ');

  // Input wrapper classes
  const wrapperClasses = [
    'relative flex items-center',
    fullWidth ? 'w-full' : 'w-auto'
  ].join(' ');

  // Size styles
  const sizeClasses: Record<ComponentSize, string> = {
    sm: 'h-8 px-3 py-1.5 text-sm',
    md: 'h-10 px-3 py-2 text-base',
    lg: 'h-12 px-4 py-3 text-lg'
  };

  // Icon size mapping
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  const iconSize = iconSizes[size];

  // Input classes
  const inputClasses = [
    'w-full rounded-lg border transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'disabled:cursor-not-allowed disabled:bg-gray-50',
    'placeholder:text-gray-400',
    sizeClasses[size],
    
    // Border and focus states
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : hasSuccess
      ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    
    // Background states
    disabled ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-900',
    
    // Icon padding adjustments
    LeftIcon ? 'pl-10' : '',
    (RightIcon || clearable || hasError || hasSuccess) ? 'pr-10' : '',
    
    className
  ].filter(Boolean).join(' ');

  // Icon container classes
  const iconContainerClasses = 'absolute inset-y-0 flex items-center pointer-events-none';
  const leftIconClasses = `${iconContainerClasses} left-0 pl-3`;
  const rightIconClasses = `${iconContainerClasses} right-0 pr-3`;

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={wrapperClasses}>
        {LeftIcon && (
          <div className={leftIconClasses}>
            <LeftIcon size={iconSize} className="text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type="text"
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          aria-invalid={hasError}
          aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
          data-testid={testId}
          {...props}
        />
        
        <div className={rightIconClasses}>
          {/* Status icons */}
          {hasError && !clearable && (
            <AlertCircle size={iconSize} className="text-red-500" />
          )}
          {hasSuccess && !clearable && (
            <CheckCircle2 size={iconSize} className="text-green-500" />
          )}
          
          {/* Clear button */}
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 pointer-events-auto"
              aria-label="Clear input"
            >
              <X size={iconSize - 2} />
            </button>
          )}
          
          {/* Custom right icon */}
          {RightIcon && !clearable && !hasError && !hasSuccess && (
            <RightIcon size={iconSize} className="text-gray-400" />
          )}
        </div>
      </div>
      
      {/* Helper text */}
      {helperText && !errorMessage && (
        <p id={helperId} className="mt-1 text-sm text-gray-600">
          {helperText}
        </p>
      )}
      
      {/* Error message */}
      {errorMessage && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
export type { InputProps };