import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { 
  ComponentVariant, 
  ComponentSize, 
  DisableableProps,
  LoadableProps,
  BaseComponentProps
} from '../types';

export interface ButtonProps 
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>,
          BaseComponentProps,
          DisableableProps,
          LoadableProps {
  children: ReactNode;
  variant?: ComponentVariant;
  size?: ComponentSize;
  fullWidth?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  iconOnly?: boolean;
  loadingText?: string;
}

export type { ComponentVariant, ComponentSize };