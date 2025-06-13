import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { 
  ComponentSize, 
  DisableableProps,
  BaseComponentProps,
  ValidationState
} from '../types';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: LucideIcon;
  description?: string;
}

export interface SelectProps extends BaseComponentProps, DisableableProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  size?: ComponentSize;
  state?: ValidationState;
  fullWidth?: boolean;
  required?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  loading?: boolean;
  options: SelectOption[];
  value?: string | number | Array<string | number>;
  onChange?: (value: string | number | Array<string | number>) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  renderOption?: (option: SelectOption) => ReactNode;
  renderValue?: (option: SelectOption | SelectOption[]) => ReactNode;
  maxHeight?: number;
  emptyMessage?: string;
  searchPlaceholder?: string;
}

export interface SelectGroupProps extends BaseComponentProps {
  label: string;
  children: ReactNode;
}

export type { ComponentSize, ValidationState };