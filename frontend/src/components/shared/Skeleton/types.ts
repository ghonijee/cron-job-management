import type { 
  BaseComponentProps,
  AnimationDuration
} from '../types';

export interface SkeletonProps extends BaseComponentProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  lines?: number;
  spacing?: string;
  animation?: 'pulse' | 'wave' | 'none';
  speed?: AnimationDuration;
}

export interface SkeletonTextProps extends BaseComponentProps {
  lines?: number;
  spacing?: string;
  lastLineWidth?: string | number;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  animation?: 'pulse' | 'wave' | 'none';
  speed?: AnimationDuration;
}

export interface SkeletonCardProps extends BaseComponentProps {
  showAvatar?: boolean;
  avatarSize?: number;
  lines?: number;
  showActions?: boolean;
  animation?: 'pulse' | 'wave' | 'none';
  speed?: AnimationDuration;
}

export interface SkeletonTableProps extends BaseComponentProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  animation?: 'pulse' | 'wave' | 'none';
  speed?: AnimationDuration;
}

export type { AnimationDuration };