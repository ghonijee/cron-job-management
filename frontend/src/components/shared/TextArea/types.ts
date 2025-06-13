import type { TextareaHTMLAttributes } from 'react';
import type { 
  ComponentSize, 
  DisableableProps,
  BaseComponentProps,
  ValidationState
} from '../types';

export interface TextAreaProps 
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>,
          BaseComponentProps,
          DisableableProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  size?: ComponentSize;
  state?: ValidationState;
  fullWidth?: boolean;
  required?: boolean;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export type { ComponentSize, ValidationState };