import { forwardRef } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { TableHeaderProps } from './types';
import type { SortDirection } from '../types';

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(({
  columns,
  selectable = false,
  selectedRows = [],
  allRowKeys = [],
  onSelectAll,
  sortBy,
  sortDirection,
  onSort,
  className = '',
  ...props
}, ref) => {
  const isAllSelected = allRowKeys.length > 0 && selectedRows.length === allRowKeys.length;
  const isPartiallySelected = selectedRows.length > 0 && selectedRows.length < allRowKeys.length;

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll?.(event.target.checked);
  };

  const handleSort = (column: any) => {
    if (!column.sortable || !onSort) return;
    
    const sortKey = column.sortKey || column.key;
    let newDirection: SortDirection = 'asc';
    
    if (sortBy === sortKey) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newDirection = null;
      } else {
        newDirection = 'asc';
      }
    }
    
    onSort(sortKey, newDirection);
  };

  const getSortIcon = (column: any) => {
    if (!column.sortable) return null;
    
    const sortKey = column.sortKey || column.key;
    const isCurrentSort = sortBy === sortKey;
    
    if (!isCurrentSort) {
      return <ChevronsUpDown size={14} className="text-gray-400" />;
    }
    
    if (sortDirection === 'asc') {
      return <ChevronUp size={14} className="text-blue-600" />;
    } else if (sortDirection === 'desc') {
      return <ChevronDown size={14} className="text-blue-600" />;
    }
    
    return <ChevronsUpDown size={14} className="text-gray-400" />;
  };

  const headerClasses = [
    'bg-gray-50 border-b border-gray-200',
    className
  ].filter(Boolean).join(' ');

  return (
    <thead ref={ref} className={headerClasses} {...props}>
      <tr>
        {/* Selection header */}
        {selectable && (
          <th className="w-12 px-4 py-3 text-center">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = isPartiallySelected;
                }
              }}
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-label="Select all rows"
            />
          </th>
        )}
        
        {/* Column headers */}
        {columns.map((column) => {
          const sortKey = column.sortKey || column.key;
          const isCurrentSort = sortBy === sortKey;
          const isSortable = column.sortable;
          
          const headerClasses = [
            'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
            isSortable ? 'cursor-pointer select-none hover:bg-gray-100' : '',
            isCurrentSort ? 'bg-gray-100' : '',
            column.headerClassName
          ].filter(Boolean).join(' ');

          const alignClasses = {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right'
          };

          const headerAlign = column.align || 'left';

          const headerStyle = {
            width: column.width,
            minWidth: column.minWidth,
            maxWidth: column.maxWidth,
          };

          return (
            <th
              key={column.key}
              className={`${headerClasses} ${alignClasses[headerAlign]}`}
              style={headerStyle}
              onClick={() => handleSort(column)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSort(column);
                }
              }}
              tabIndex={isSortable ? 0 : -1}
              role={isSortable ? 'button' : undefined}
              aria-sort={
                isCurrentSort
                  ? sortDirection === 'asc'
                    ? 'ascending'
                    : sortDirection === 'desc'
                    ? 'descending'
                    : 'none'
                  : undefined
              }
            >
              <div className="flex items-center gap-1">
                <span className="flex-1">
                  {column.headerRender ? column.headerRender() : column.title}
                </span>
                {isSortable && (
                  <span className="flex-shrink-0">
                    {getSortIcon(column)}
                  </span>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
});

TableHeader.displayName = 'TableHeader';

export { TableHeader };
export type { TableHeaderProps };