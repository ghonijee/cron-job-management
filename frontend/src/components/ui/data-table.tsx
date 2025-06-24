import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  emptyMessage = 'No data available',
  className = ''
}: DataTableProps<T>) {
  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key);
    }
  };

  const renderCellContent = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return String(item[column.accessor] || '');
  };

  if (loading) {
    return (
      <div className={`border rounded-lg ${className}`}>
        <div className="animate-pulse">
          <div className="bg-gray-50 h-12 rounded-t-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t h-16 bg-white"></div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`border rounded-lg p-8 text-center text-gray-500 ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                } ${column.className || ''}`}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && sortBy === column.key && (
                    <span className="text-blue-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
                >
                  {renderCellContent(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}