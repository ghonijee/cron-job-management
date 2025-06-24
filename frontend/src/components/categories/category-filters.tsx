import type { CategoryFilter } from '../../types';

interface CategoryFiltersProps {
  filters: CategoryFilter;
  onFiltersChange: (filters: CategoryFilter) => void;
  onReset: () => void;
}

export function CategoryFilters({ filters, onFiltersChange, onReset }: CategoryFiltersProps) {
  const handleFilterChange = (key: keyof CategoryFilter, value: unknown) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1 // Reset to first page when filtering
    });
  };

  const hasActiveFilters = filters.isActive !== undefined || filters.sortBy !== 'name' || filters.sortOrder !== 'asc';

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('isActive', value === 'all' ? undefined : value === 'active');
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'name'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Name</option>
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
          </select>
        </div>

        {/* Sort Order Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort Order
          </label>
          <select
            value={filters.sortOrder || 'asc'}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Page Size Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Items per Page
          </label>
          <select
            value={filters.limit || 10}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}