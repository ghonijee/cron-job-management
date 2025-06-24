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

  const renderCellContent = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return String(item[column.accessor] || '');
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => onSort?.(column.key)}
                      className="group inline-flex items-center space-x-1 hover:text-gray-700 transition-colors"
                    >
                      <span>{column.header}</span>
                      <svg className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors ${
                        sortBy === column.key ? 'text-blue-600' : ''
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {sortBy === column.key ? (
                          sortOrder === 'asc' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          )
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        )}
                      </svg>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}
                  >
                    {renderCellContent(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
          <p className="text-gray-400 text-sm mt-1">Create your first category to get started</p>
        </div>
      )}
    </div>
  );
}