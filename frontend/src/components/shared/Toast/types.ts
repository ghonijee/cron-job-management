import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { 
  BaseComponentProps,
  AlertVariant,
  ToastPosition
} from '../types';

export interface ToastData {
  id: string;
  variant?: AlertVariant;
  title?: string;
  description?: ReactNode;
  icon?: LucideIcon | ReactNode;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastProps extends BaseComponentProps {
  toast: ToastData;
  position?: ToastPosition;
  onDismiss: (id: string) => void;
}

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
  defaultDuration?: number;
}

export interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  success: (message: string, options?: Partial<ToastData>) => string;
  error: (message: string, options?: Partial<ToastData>) => string;
  warning: (message: string, options?: Partial<ToastData>) => string;
  info: (message: string, options?: Partial<ToastData>) => string;
}

export type { AlertVariant, ToastPosition };