import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { 
  BaseComponentProps,
  ComponentSize,
  BadgeVariant,
  ColorType
} from '../types';

export interface BadgeProps extends BaseComponentProps {
  children: ReactNode;
  variant?: BadgeVariant;
  color?: ColorType;
  size?: ComponentSize;
  dot?: boolean;
  icon?: LucideIcon | ReactNode;
  iconPosition?: 'left' | 'right';
  removable?: boolean;
  onRemove?: () => void;
}

export type { BadgeVariant, ComponentSize, ColorType };