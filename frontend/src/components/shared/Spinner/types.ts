import type { 
  ComponentSize,
  BaseComponentProps,
  ColorType
} from '../types';

export interface SpinnerProps extends BaseComponentProps {
  size?: ComponentSize | number;
  color?: ColorType | 'current' | 'white';
  thickness?: number;
  speed?: 'slow' | 'normal' | 'fast';
  label?: string;
  overlay?: boolean;
  centered?: boolean;
}

export type { ComponentSize, ColorType };