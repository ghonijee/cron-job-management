import { forwardRef } from 'react';
import { TableCell } from './TableCell';
import type { TableRowProps } from './types';

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({
  row,
  columns,
  index,
  selected = false,
  selectable = false,
  onSelect,
  onClick,
  onDoubleClick,
  hoverable = true,
  striped = false,
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  const isEven = index % 2 === 0;
  
  const rowClasses = [
    'transition-colors duration-150',
    
    // Selection state
    selected ? 'bg-blue-50 border-blue-200' : '',
    
    // Striped rows
    striped && !selected 
      ? isEven 
        ? 'bg-white' 
        : 'bg-gray-50'
      : !selected ? 'bg-white' : '',
    
    // Hover effects
    hoverable && !selected ? 'hover:bg-gray-50' : '',
    
    // Clickable cursor
    onClick ? 'cursor-pointer' : '',
    
    className
  ].filter(Boolean).join(' ');

  const handleRowClick = () => {
    onClick?.();
  };

  const handleRowDoubleClick = () => {
    onDoubleClick?.();
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onSelect?.(event.target.checked);
  };

  return (
    <tr
      ref={ref}
      className={rowClasses}
      onClick={handleRowClick}
      onDoubleClick={handleRowDoubleClick}
      data-testid={testId}
      {...props}
    >
      {/* Selection checkbox */}
      {selectable && (
        <TableCell
          column={{ key: '__select__', title: '', align: 'center' }}
          width="48px"
          className="w-12"
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            aria-label={`Select row ${index + 1}`}
          />
        </TableCell>
      )}
      
      {/* Data cells */}
      {columns.map((column) => {
        const cellValue = (row as any)[column.key];
        const cellContent = column.render 
          ? column.render(cellValue, row, index)
          : cellValue;

        return (
          <TableCell
            key={column.key}
            column={column}
          >
            {cellContent}
          </TableCell>
        );
      })}
    </tr>
  );
});

TableRow.displayName = 'TableRow';

export { TableRow };
export type { TableRowProps };