import type { InputHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { 
  ComponentSize, 
  DisableableProps,
  BaseComponentProps,
  ValidationState
} from '../types';

export interface InputProps 
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'>,
          BaseComponentProps,
          DisableableProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  size?: ComponentSize;
  state?: ValidationState;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
  required?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

export interface InputGroupProps extends BaseComponentProps {
  children: ReactNode;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
}

export type { ComponentSize, ValidationState };