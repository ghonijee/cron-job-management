import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { 
  BaseComponentProps,
  AlertVariant
} from '../types';

export interface AlertProps extends BaseComponentProps {
  variant?: AlertVariant;
  title?: string;
  description?: ReactNode;
  icon?: LucideIcon | ReactNode;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  children?: ReactNode;
}

export type { AlertVariant };