import { forwardRef, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { TextAreaProps } from './types';
import type { ComponentSize } from '../types';

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  placeholder,
  helperText,
  errorMessage,
  size = 'md',
  state = 'default',
  fullWidth = true,
  required = false,
  autoResize = false,
  minRows = 3,
  maxRows = 10,
  resize = 'vertical',
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
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = errorMessage ? `${inputId}-error` : undefined;
  
  const hasError = state === 'error' || !!errorMessage;
  const hasSuccess = state === 'success';
  
  // Auto-resize functionality
  useEffect(() => {
    if (autoResize && textAreaRef.current) {
      const textarea = textAreaRef.current;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
      const paddingTop = parseInt(getComputedStyle(textarea).paddingTop, 10);
      const paddingBottom = parseInt(getComputedStyle(textarea).paddingBottom, 10);
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height based on content
      const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
      const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      
      textarea.style.height = `${newHeight}px`;
    }
  }, [value, autoResize, minRows, maxRows]);

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

  // Size styles
  const sizeClasses: Record<ComponentSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  // Resize classes
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };

  // TextArea classes
  const textAreaClasses = [
    'w-full rounded-lg border transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'disabled:cursor-not-allowed disabled:bg-gray-50',
    'placeholder:text-gray-400',
    sizeClasses[size],
    autoResize ? 'resize-none overflow-hidden' : resizeClasses[resize],
    
    // Border and focus states
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : hasSuccess
      ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    
    // Background states
    disabled ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-900',
    
    // Add padding for status icons
    (hasError || hasSuccess) ? 'pr-10' : '',
    
    className
  ].filter(Boolean).join(' ');

  // Icon size mapping
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  const iconSize = iconSizes[size];

  const handleRef = (element: HTMLTextAreaElement | null) => {
    textAreaRef.current = element;
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
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
      
      <div className="relative">
        <textarea
          ref={handleRef}
          id={inputId}
          className={textAreaClasses}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          value={value}
          rows={autoResize ? minRows : props.rows || minRows}
          onChange={onChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          aria-invalid={hasError}
          aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
          data-testid={testId}
          {...props}
        />
        
        {/* Status icons */}
        {(hasError || hasSuccess) && (
          <div className="absolute top-3 right-3 pointer-events-none">
            {hasError && (
              <AlertCircle size={iconSize} className="text-red-500" />
            )}
            {hasSuccess && (
              <CheckCircle2 size={iconSize} className="text-green-500" />
            )}
          </div>
        )}
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

TextArea.displayName = 'TextArea';

export { TextArea };
export type { TextAreaProps };