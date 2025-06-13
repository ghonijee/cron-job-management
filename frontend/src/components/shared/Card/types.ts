import type { ReactNode, HTMLAttributes } from 'react';
import type { BaseComponentProps } from '../types';

export interface CardProps extends BaseComponentProps {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  avatar?: ReactNode;
  action?: ReactNode;
  subheader?: ReactNode;
  className?: string;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}