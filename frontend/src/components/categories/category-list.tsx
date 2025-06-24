import { useState, useCallback } from "react";
import toast from 'react-hot-toast';
import { DataTable } from "../ui/data-table";
import { SearchInput } from "../ui/search-input";
import { CategoryFilters } from "./category-filters";
import { CategoryModal } from "./category-modal";
import { Pagination } from "../ui/pagination";
import { CategoryListSkeleton } from "../ui/skeleton";
import { useCategories, useToggleCategory, useDeleteCategory } from "../../hooks/use-categories";
import type { Category, CategoryFilter } from "../../types";

export function CategoryList() {
  const [filters, setFilters] = useState<CategoryFilter>({
    page: 1,
    limit: 10,
    sortBy: "name",
    sortOrder: "asc",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();

  const { data: categoriesData, isLoading, error } = useCategories(filters);
  const toggleCategory = useToggleCategory();
  const deleteCategory = useDeleteCategory();

  // Memoized handlers to prevent unnecessary re-renders
  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({
      ...prev,
      search: search || undefined,
      page: 1, // Reset to page 1 when searching
    }));
  }, []);

  const handleSort = useCallback((key: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: key as CategoryFilter["sortBy"],
      sortOrder:
        prev.sortBy === key && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1, // Reset to page 1 when sorting
    }));
  }, []);

  const handleToggleStatus = useCallback(async (category: Category) => {
    if (
      window.confirm(
        `Are you sure you want to ${category.isActive ? "deactivate" : "activate"} this category?`
      )
    ) {
      try {
        await toggleCategory.mutateAsync(category.id);
      } catch (error) {
        console.error("Failed to toggle category status:", error);
      }
    }
  }, [toggleCategory]);

  const handleDeleteCategory = useCallback(async (category: Category) => {
    const jobsCount = category.cronJobsCount || 0;
    
    // Enhanced confirmation message
    const confirmMessage = jobsCount > 0 
      ? `Delete "${category.name}"? ${jobsCount} job(s) will become uncategorized.`
      : `Delete "${category.name}"?`;
    
    const confirmed = window.confirm(confirmMessage);

    if (confirmed) {
      try {
        const result = await deleteCategory.mutateAsync(category.id);
        
        // Show success message with job impact
        if (result.affectedJobs > 0) {
          toast.success(`${result.message} ${result.note}`);
        } else {
          toast.success(result.message);
        }
      } catch (error) {
        toast.error('Failed to delete category');
        console.error("Failed to delete category:", error);
      }
    }
  }, [deleteCategory]);

  // Fixed pagination handler - no page reset
  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ 
      ...prev, 
      page: Math.max(1, page) // Ensure page is at least 1
    }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: Partial<CategoryFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to page 1 when filters change
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "name",
      sortOrder: "asc",
    });
  }, []);

  // Rest of the component handlers...
  const handleCreateCategory = useCallback(() => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEditCategory = useCallback((category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingCategory(undefined);
    const draftKey = editingCategory
      ? `category-draft-${editingCategory.id}`
      : "category-draft-new";
    localStorage.removeItem(draftKey);
  }, [editingCategory]);

  const columns = [
    {
      key: "color",
      header: "",
      accessor: (category: Category) => (
        <div
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{ backgroundColor: category.color }}
        />
      ),
      className: "w-12",
    },
    {
      key: "name",
      header: "Name",
      accessor: "name" as keyof Category,
      sortable: true,
      className: "font-medium",
    },
    {
      key: "description",
      header: "Description",
      accessor: (category: Category) => category.description || "-",
      className: "text-gray-600",
    },
    {
      key: "cronJobsCount",
      header: "Jobs",
      accessor: (category: Category) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {category.cronJobsCount || 0}
        </span>
      ),
      className: "text-center",
    },
    {
      key: "isActive",
      header: "Status",
      accessor: (category: Category) => (
        <button
          onClick={() => handleToggleStatus(category)}
          disabled={toggleCategory.isPending}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
            category.isActive
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          } ${toggleCategory.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {category.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      accessor: (category: Category) =>
        new Date(category.createdAt).toLocaleDateString(),
      sortable: true,
      className: "text-gray-600",
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (category: Category) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditCategory(category)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteCategory(category)}
            disabled={deleteCategory.isPending}
            className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
          >
            {deleteCategory.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  // Show skeleton loader while loading
  if (isLoading && !categoriesData) {
    return <CategoryListSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg font-medium">Failed to load categories</p>
          <p className="text-sm text-gray-500 mt-1">Please try again later</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
            <p className="text-gray-600">
              Organize your cron jobs with custom categories
            </p>
            {categoriesData && (
              <div className="flex items-center mt-3 space-x-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {categoriesData.data.filter(cat => cat.isActive).length} Active
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  {categoriesData.data.filter(cat => !cat.isActive).length} Inactive
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  {categoriesData.pagination.total} Total
                </span>
              </div>
            )}
          </div>
          <button
            onClick={handleCreateCategory}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Category
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="space-y-4">
          <SearchInput
            placeholder="Search categories..."
            onSearch={handleSearch}
            className="max-w-md"
          />
          
          <CategoryFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={resetFilters}
          />
        </div>
      </div>

      {/* Table with loading overlay */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          </div>
        )}
        
        <DataTable
          data={categoriesData?.data || []}
          columns={columns}
          loading={isLoading}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSort={handleSort}
          emptyMessage="No categories found"
          className="shadow-sm"
        />
      </div>

      {/* Enhanced Pagination */}
      {categoriesData && categoriesData.pagination.totalPages > 1 && (
        <Pagination
          currentPage={filters.page || 1}
          totalPages={categoriesData.pagination.totalPages}
          totalItems={categoriesData.pagination.total}
          itemsPerPage={filters.limit || 10}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
      />
    </div>
  );
}
