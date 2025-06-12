import { forwardRef, useMemo } from 'react';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import type { TableProps } from './types';

const Table = forwardRef<HTMLTableElement, TableProps>(({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  emptyIcon,
  keyExtractor,
  
  // Selection
  selectable = false,
  selectedRows = [],
  onRowSelect,
  selectMode = 'multiple',
  
  // Sorting
  sortBy,
  sortDirection,
  onSort,
  
  // Styling
  striped = false,
  bordered = false,
  hoverable = true,
  stickyHeader = false,
  size = 'md',
  
  // Row interactions
  onRowClick,
  onRowDoubleClick,
  rowClassName,
  
  // Responsive
  responsive = true,
  mobileBreakpoint = 768,
  
  className = '',
  'data-testid': testId,
  ...props
}, ref) => {
  // Get all row keys for select all functionality
  const allRowKeys = useMemo(() => {
    if (!data || !selectable) return [];
    
    return data.map((row, index) => {
      if (keyExtractor) {
        return keyExtractor(row, index);
      }
      
      // Try to find an id field
      if ((row as any).id !== undefined) return (row as any).id;
      if ((row as any)._id !== undefined) return (row as any)._id;
      if ((row as any).key !== undefined) return (row as any).key;
      
      // Fallback to index
      return index;
    });
  }, [data, keyExtractor, selectable]);

  const handleSelectAll = (selected: boolean) => {
    if (!onRowSelect) return;
    
    onRowSelect(selected ? allRowKeys : []);
  };

  // Size styles
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Container classes
  const containerClasses = [
    'w-full',
    responsive ? 'overflow-x-auto' : '',
    bordered ? 'border border-gray-200 rounded-lg' : '',
    className
  ].filter(Boolean).join(' ');

  // Table classes
  const tableClasses = [
    'min-w-full divide-y divide-gray-200',
    sizeClasses[size],
    stickyHeader ? 'table-fixed' : '',
    bordered ? 'border-collapse' : 'border-separate border-spacing-0'
  ].filter(Boolean).join(' ');

  // Sticky header styles
  const stickyHeaderStyle = stickyHeader ? {
    position: 'sticky' as const,
    top: 0,
    zIndex: 10
  } : undefined;

  return (
    <div 
      className={containerClasses}
      style={responsive ? { maxWidth: '100%' } : undefined}
      data-testid={testId}
    >
      <table
        ref={ref}
        className={tableClasses}
        {...props}
      >
        <TableHeader
          columns={columns}
          selectable={selectable}
          selectedRows={selectedRows}
          allRowKeys={allRowKeys}
          onSelectAll={handleSelectAll}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={onSort}
          style={stickyHeaderStyle}
        />
        
        <TableBody
          columns={columns}
          data={data}
          loading={loading}
          emptyMessage={emptyMessage}
          emptyIcon={emptyIcon}
          keyExtractor={keyExtractor}
          selectable={selectable}
          selectedRows={selectedRows}
          onRowSelect={onRowSelect}
          selectMode={selectMode}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
          rowClassName={rowClassName}
          hoverable={hoverable}
          striped={striped}
        />
      </table>
    </div>
  );
});

Table.displayName = 'Table';

export { Table };
export type { TableProps };