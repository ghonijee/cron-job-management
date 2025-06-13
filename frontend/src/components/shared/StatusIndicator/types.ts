import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { 
  BaseComponentProps,
  StatusType,
  ComponentSize
} from '../types';

export interface StatusIndicatorProps extends BaseComponentProps {
  status: StatusType;
  size?: ComponentSize;
  showIcon?: boolean;
  showText?: boolean;
  text?: string;
  icon?: LucideIcon | ReactNode;
  pulse?: boolean;
  dot?: boolean;
  variant?: 'default' | 'minimal' | 'detailed';
}

export type { StatusType, ComponentSize };