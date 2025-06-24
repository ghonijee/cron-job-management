import { useState } from "react";
import { DataTable } from "../ui/data-table";
import { SearchInput } from "../ui/search-input";
import { CategoryFilters } from "./category-filters";
import { useCategories, useToggleCategory } from "../../hooks/use-categories";
import type { Category, CategoryFilter } from "../../types";

export function CategoryList() {
  const [filters, setFilters] = useState<CategoryFilter>({
    page: 1,
    limit: 10,
    sortBy: "name",
    sortOrder: "asc",
  });

  const { data: categoriesData, isLoading, error } = useCategories(filters);
  const toggleCategory = useToggleCategory();

  const handleSearch = (search: string) => {
    setFilters((prev) => ({
      ...prev,
      search: search || undefined,
      page: 1,
    }));
  };

  const handleSort = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: key as CategoryFilter["sortBy"],
      sortOrder:
        prev.sortBy === key && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const handleToggleStatus = async (category: Category) => {
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
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "name",
      sortOrder: "asc",
    });
  };

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
  ];

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">Failed to load categories</div>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage your job categories</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Add Category
        </button>
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Search categories..."
        onSearch={handleSearch}
        className="max-w-md"
      />

      {/* Filters */}
      <CategoryFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />

      {/* Table */}
      <DataTable
        data={categoriesData?.data || []}
        columns={columns}
        loading={isLoading}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSort={handleSort}
        emptyMessage="No categories found"
      />

      {/* Pagination */}
      {categoriesData && categoriesData.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 bg-white border rounded-lg">
          <div className="text-sm text-gray-700">
            Showing {((filters.page || 1) - 1) * (filters.limit || 10) + 1} to{" "}
            {Math.min(
              (filters.page || 1) * (filters.limit || 10),
              categoriesData.total
            )}{" "}
            of {categoriesData.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange((filters.page || 1) - 1)}
              disabled={!filters.page || filters.page <= 1}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from(
              { length: Math.min(5, categoriesData.totalPages) },
              (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm border rounded ${
                      (filters.page || 1) === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}
            <button
              onClick={() => handlePageChange((filters.page || 1) + 1)}
              disabled={
                !filters.page || filters.page >= categoriesData.totalPages
              }
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
