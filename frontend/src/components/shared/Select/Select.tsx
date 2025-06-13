import { forwardRef, useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  X, 
  Search, 
  Check, 
  AlertCircle, 
  CheckCircle2,
  Loader2 
} from 'lucide-react';
import type { SelectProps, SelectOption } from './types';
import type { ComponentSize } from '../types';

const Select = forwardRef<HTMLDivElement, SelectProps>(({
  label,
  placeholder = 'Select an option...',
  helperText,
  errorMessage,
  size = 'md',
  state = 'default',
  fullWidth = true,
  required = false,
  searchable = false,
  clearable = false,
  multiple = false,
  loading = false,
  options = [],
  value,
  onChange,
  onSearch,
  onClear,
  renderOption,
  renderValue,
  maxHeight = 200,
  emptyMessage = 'No options available',
  searchPlaceholder = 'Search...',
  disabled = false,
  className = '',
  id,
  'data-testid': testId,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = helperText ? `${selectId}-helper` : undefined;
  const errorId = errorMessage ? `${selectId}-error` : undefined;
  
  const hasError = state === 'error' || !!errorMessage;
  const hasSuccess = state === 'success';
  
  // Filter options based on search query
  const filteredOptions = searchable && searchQuery
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get selected options
  const selectedOptions = multiple
    ? options.filter(option => 
        Array.isArray(value) && value.includes(option.value)
      )
    : options.find(option => option.value === value);

  const hasValue = multiple 
    ? Array.isArray(value) && value.length > 0
    : value !== undefined && value !== '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            handleOptionSelect(filteredOptions[focusedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, filteredOptions]);

  const handleOptionSelect = (option: SelectOption) => {
    if (option.disabled || disabled) return;

    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(option.value)
        ? currentValue.filter(v => v !== option.value)
        : [...currentValue, option.value];
      onChange?.(newValue);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleClear = () => {
    if (multiple) {
      onChange?.([]);
    } else {
      onChange?.(undefined as any);
    }
    onClear?.();
    setSearchQuery('');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
    setFocusedIndex(-1);
  };

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

  // Container classes
  const containerClasses = [
    'relative',
    fullWidth ? 'w-full' : 'w-auto',
    className
  ].filter(Boolean).join(' ');

  // Label classes
  const labelClasses = [
    'block text-sm font-medium mb-1',
    hasError ? 'text-red-700' : 'text-gray-700',
    disabled ? 'text-gray-400' : ''
  ].filter(Boolean).join(' ');

  // Trigger classes
  const triggerClasses = [
    'w-full flex items-center justify-between',
    'rounded-lg border transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'cursor-pointer select-none',
    sizeClasses[size],
    
    // States
    disabled ? 'cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white text-gray-900',
    isOpen ? 'ring-2 ring-blue-500 border-blue-500' : '',
    
    // Border colors
    hasError && !isOpen
      ? 'border-red-300 hover:border-red-400'
      : hasSuccess && !isOpen
      ? 'border-green-300 hover:border-green-400'
      : !isOpen
      ? 'border-gray-300 hover:border-gray-400'
      : ''
  ].filter(Boolean).join(' ');

  // Dropdown classes
  const dropdownClasses = [
    'absolute z-50 w-full mt-1',
    'bg-white border border-gray-200 rounded-lg shadow-lg',
    'overflow-hidden'
  ].join(' ');

  const renderSelectedValue = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
          <Loader2 size={iconSize} className="animate-spin text-gray-400" />
          <span className="text-gray-500">Loading...</span>
        </div>
      );
    }

    if (!hasValue) {
      return <span className="text-gray-400">{placeholder}</span>;
    }

    if (renderValue) {
      return renderValue(selectedOptions as any);
    }

    if (multiple && Array.isArray(selectedOptions)) {
      if (selectedOptions.length === 1) {
        return selectedOptions[0].label;
      }
      return `${selectedOptions.length} selected`;
    }

    return (selectedOptions as SelectOption)?.label || placeholder;
  };

  return (
    <div ref={ref} className={containerClasses} {...props}>
      {label && (
        <label htmlFor={selectId} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div ref={selectRef} className="relative">
        <div
          id={selectId}
          className={triggerClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              !disabled && setIsOpen(!isOpen);
            }
          }}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={hasError}
          aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
          data-testid={testId}
        >
          <div className="flex-1 truncate">
            {renderSelectedValue()}
          </div>
          
          <div className="flex items-center gap-1">
            {/* Status icons */}
            {hasError && (
              <AlertCircle size={iconSize} className="text-red-500" />
            )}
            {hasSuccess && (
              <CheckCircle2 size={iconSize} className="text-green-500" />
            )}
            
            {/* Clear button */}
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear selection"
              >
                <X size={iconSize - 2} />
              </button>
            )}
            
            {/* Dropdown arrow */}
            <ChevronDown 
              size={iconSize} 
              className={`text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </div>
        </div>
        
        {/* Dropdown */}
        {isOpen && (
          <div className={dropdownClasses}>
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
            )}
            
            {/* Options list */}
            <ul
              ref={listRef}
              className="max-h-60 overflow-y-auto py-1"
              style={{ maxHeight: maxHeight }}
              role="listbox"
              aria-multiselectable={multiple}
            >
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-500 text-center">
                  {emptyMessage}
                </li>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = multiple
                    ? Array.isArray(value) && value.includes(option.value)
                    : value === option.value;
                  const isFocused = index === focusedIndex;
                  
                  return (
                    <li
                      key={option.value}
                      className={[
                        'flex items-center px-3 py-2 text-sm cursor-pointer select-none',
                        option.disabled 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-900',
                        isFocused && !option.disabled ? 'bg-blue-50' : '',
                        isSelected ? 'bg-blue-100 text-blue-900' : '',
                        !isFocused && !isSelected ? 'hover:bg-gray-50' : ''
                      ].filter(Boolean).join(' ')}
                      onClick={() => handleOptionSelect(option)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {renderOption ? (
                        renderOption(option)
                      ) : (
                        <>
                          {option.icon && (
                            <option.icon size={iconSize} className="mr-2 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{option.label}</div>
                            {option.description && (
                              <div className="text-xs text-gray-500 truncate">
                                {option.description}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <Check size={iconSize} className="ml-2 flex-shrink-0 text-blue-600" />
                          )}
                        </>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
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

Select.displayName = 'Select';

export { Select };
export type { SelectProps, SelectOption };