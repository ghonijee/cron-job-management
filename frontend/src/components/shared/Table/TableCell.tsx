import { forwardRef } from 'react';
import type { TableCellProps } from './types';

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({
  children,
  column,
  align,
  width,
  minWidth,
  maxWidth,
  className = '',
  ...props
}, ref) => {
  const cellAlign = align || column.align || 'left';
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const cellClasses = [
    'px-4 py-3 text-sm text-gray-900',
    'whitespace-nowrap overflow-hidden text-ellipsis',
    alignClasses[cellAlign],
    column.className,
    className
  ].filter(Boolean).join(' ');

  const cellStyle = {
    width: width || column.width,
    minWidth: minWidth || column.minWidth,
    maxWidth: maxWidth || column.maxWidth,
  };

  return (
    <td
      ref={ref}
      className={cellClasses}
      style={cellStyle}
      {...props}
    >
      {children}
    </td>
  );
});

TableCell.displayName = 'TableCell';

export { TableCell };
export type { TableCellProps };