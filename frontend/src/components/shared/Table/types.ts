import type { ReactNode } from 'react';
import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { 
  BaseComponentProps,
  SortDirection
} from '../types';

export interface TableColumn<T = unknown> {
  key: string;
  title: string;
  sortable?: boolean;
  sortKey?: keyof T | string;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => ReactNode;
  headerRender?: () => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T = unknown> extends BaseComponentProps {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  keyExtractor?: (row: T, index: number) => string | number;
  
  // Selection
  selectable?: boolean;
  selectedRows?: Array<string | number>;
  onRowSelect?: (keys: Array<string | number>) => void;
  selectMode?: 'single' | 'multiple';
  
  // Sorting
  sortBy?: string;
  sortDirection?: SortDirection;
  onSort?: (key: string, direction: SortDirection) => void;
  
  // Styling
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  size?: 'sm' | 'md' | 'lg';
  
  // Row interactions
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  rowClassName?: (row: T, index: number) => string;
  
  // Responsive
  responsive?: boolean;
  mobileBreakpoint?: number;
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  columns: TableColumn[];
  selectable?: boolean;
  selectedRows?: Array<string | number>;
  allRowKeys?: Array<string | number>;
  onSelectAll?: (selected: boolean) => void;
  sortBy?: string;
  sortDirection?: SortDirection;
  onSort?: (key: string, direction: SortDirection) => void;
}

export interface TableBodyProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  keyExtractor?: (row: T, index: number) => string | number;
  selectable?: boolean;
  selectedRows?: Array<string | number>;
  onRowSelect?: (keys: Array<string | number>) => void;
  selectMode?: 'single' | 'multiple';
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  rowClassName?: (row: T, index: number) => string;
  hoverable?: boolean;
  striped?: boolean;
  className?: string;
}

export interface TableRowProps<T = unknown> extends BaseComponentProps {
  row: T;
  columns: TableColumn<T>[];
  index: number;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: (selected: boolean) => void;
  onClick?: () => void;
  onDoubleClick?: () => void;
  hoverable?: boolean;
  striped?: boolean;
}

export interface TableCellProps extends BaseComponentProps {
  children: ReactNode;
  column: TableColumn;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
}

export type { SortDirection };