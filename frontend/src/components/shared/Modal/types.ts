import type { ReactNode, HTMLAttributes } from 'react';
import type { 
  BaseComponentProps,
  ModalSize
} from '../types';

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  preventBodyScroll?: boolean;
  children: ReactNode;
  initialFocus?: React.RefObject<HTMLElement>;
  finalFocus?: React.RefObject<HTMLElement>;
}

export interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export interface ModalOverlayProps extends HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
  className?: string;
}

export type { ModalSize };