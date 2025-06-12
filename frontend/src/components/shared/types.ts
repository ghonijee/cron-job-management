// Shared component types and interfaces
import type { ReactNode } from 'react';

// Base component size types
export type ComponentSize = 'sm' | 'md' | 'lg';
export type ExtendedComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Base component variant types
export type ComponentVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type AlertVariant = 'success' | 'error' | 'warning' | 'info';
export type BadgeVariant = 'solid' | 'outline' | 'soft';

// Color palette types
export type ColorType = 
  | 'blue' 
  | 'gray' 
  | 'red' 
  | 'green' 
  | 'yellow' 
  | 'indigo' 
  | 'purple' 
  | 'pink';

// Status types
export type StatusType = 'active' | 'inactive' | 'pending' | 'success' | 'error';

// Common base props
export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
}

// Component props with children
export interface ComponentWithChildren extends BaseComponentProps {
  children: ReactNode;
}

// Size-aware component props
export interface SizedComponentProps extends BaseComponentProps {
  size?: ComponentSize;
}

// Variant-aware component props
export interface VariantComponentProps extends BaseComponentProps {
  variant?: ComponentVariant;
}

// Disabled state props
export interface DisableableProps {
  disabled?: boolean;
}

// Loading state props
export interface LoadableProps {
  loading?: boolean;
}

// Position types for icons, tooltips, etc.
export type Position = 'top' | 'right' | 'bottom' | 'left';
export type ExtendedPosition = Position | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// Common event handler types
export type ClickHandler = () => void;
export type ChangeHandler<T = string> = (value: T) => void;

// Form field states
export type ValidationState = 'default' | 'error' | 'success';

// Animation duration types
export type AnimationDuration = 'fast' | 'normal' | 'slow';

// Responsive breakpoint types
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Table sort direction
export type SortDirection = 'asc' | 'desc' | null;

// Modal sizes
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Toast position
export type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

// Generic API response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isValid: boolean;
  isSubmitting: boolean;
  errors: ValidationError[];
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

// Icon props (for use with lucide-react or similar)
export interface IconProps {
  size?: number | ComponentSize;
  color?: string;
  className?: string;
}

// Common utility types
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Component ref types (for forwardRef components)
export type ComponentRef<T = HTMLElement> = T | null;