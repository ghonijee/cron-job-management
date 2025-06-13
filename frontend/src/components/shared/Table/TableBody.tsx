import { forwardRef } from 'react';
import { Inbox } from 'lucide-react';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import type { TableBodyProps } from './types';

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  emptyIcon: EmptyIcon = Inbox,
  keyExtractor,
  selectable = false,
  selectedRows = [],
  onRowSelect,
  selectMode = 'multiple',
  onRowClick,
  onRowDoubleClick,
  rowClassName,
  hoverable = true,
  striped = false,
  className = '',
  ...props
}, ref) => {
  const getRowKey = (row: any, index: number): string | number => {
    if (keyExtractor) {
      return keyExtractor(row, index);
    }
    
    // Try to find an id field
    if (row.id !== undefined) return row.id;
    if (row._id !== undefined) return row._id;
    if (row.key !== undefined) return row.key;
    
    // Fallback to index
    return index;
  };

  const handleRowSelect = (rowKey: string | number, selected: boolean) => {
    if (!onRowSelect) return;
    
    let newSelection: Array<string | number>;
    
    if (selectMode === 'single') {
      newSelection = selected ? [rowKey] : [];
    } else {
      if (selected) {
        newSelection = [...selectedRows, rowKey];
      } else {
        newSelection = selectedRows.filter(key => key !== rowKey);
      }
    }
    
    onRowSelect(newSelection);
  };

  const handleRowClick = (row: any, index: number) => {
    onRowClick?.(row, index);
  };

  const handleRowDoubleClick = (row: any, index: number) => {
    onRowDoubleClick?.(row, index);
  };

  // Loading state
  if (loading) {
    return (
      <tbody ref={ref} className={className} {...props}>
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index} className="animate-pulse">
            {selectable && (
              <TableCell column={{ key: '__select__', title: '' }} width="48px">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell key={column.key} column={column}>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </TableCell>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    const colSpan = columns.length + (selectable ? 1 : 0);
    
    return (
      <tbody ref={ref} className={className} {...props}>
        <tr>
          <td 
            colSpan={colSpan} 
            className="px-4 py-12 text-center text-gray-500"
          >
            <div className="flex flex-col items-center gap-3">
              <EmptyIcon size={48} className="text-gray-300" />
              <div className="text-sm font-medium">{emptyMessage}</div>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  // Data rows
  return (
    <tbody ref={ref} className={className} {...props}>
      {data.map((row, index) => {
        const rowKey = getRowKey(row, index);
        const isSelected = selectedRows.includes(rowKey);
        const customRowClassName = rowClassName ? rowClassName(row, index) : '';

        return (
          <TableRow
            key={rowKey}
            row={row}
            columns={columns}
            index={index}
            selected={isSelected}
            selectable={selectable}
            onSelect={(selected) => handleRowSelect(rowKey, selected)}
            onClick={() => handleRowClick(row, index)}
            onDoubleClick={() => handleRowDoubleClick(row, index)}
            hoverable={hoverable}
            striped={striped}
            className={customRowClassName}
            data-testid={`table-row-${rowKey}`}
          />
        );
      })}
    </tbody>
  );
});

TableBody.displayName = 'TableBody';

export { TableBody };
export type { TableBodyProps };