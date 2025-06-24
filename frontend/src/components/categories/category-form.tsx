import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ColorPicker } from "../ui/color-picker";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  isActive: z.boolean().default(true).optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onAutoSave?: (data: Partial<CategoryFormData>) => void;
  isLoading?: boolean;
}

interface CategoryPreviewProps {
  data: Partial<CategoryFormData>;
}

const CategoryPreview: React.FC<CategoryPreviewProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
        <span className="mr-2">👁</span>
        Live Preview
      </h3>
      <div className="bg-white rounded-lg p-3 shadow-sm border">
        <div className="flex items-center space-x-3">
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: data.color || "#3b82f6" }}
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 text-sm">
              {data.name || "Category Name"}
            </div>
            {data.description && (
              <div className="text-sm text-gray-600 mt-1">
                {data.description}
              </div>
            )}
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                data.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {data.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  onAutoSave,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      color: initialData?.color || "#3b82f6",
      isActive: initialData?.isActive ?? true,
    },
  });

  const watchedData = watch();

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && onAutoSave) {
      const timer = setTimeout(() => {
        onAutoSave(watchedData);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [watchedData, isDirty, onAutoSave]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Category Name */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Category Name *
        </label>
        <input
          {...register("name")}
          type="text"
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Enter category name"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠</span>
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Description
          <span className="text-gray-500 font-normal ml-1">(Optional)</span>
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          placeholder="Enter category description..."
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠</span>
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Color Picker */}
      <div>
        <ColorPicker
          label="Category Color"
          value={watchedData.color}
          onChange={(color) => setValue("color", color, { shouldDirty: true })}
        />
        {errors.color && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠</span>
            {errors.color.message}
          </p>
        )}
      </div>

      {/* Active Status */}
      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
        <input
          {...register("isActive")}
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-3 text-sm font-medium text-gray-900">
          Active Category
        </label>
        <div className="ml-auto">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            watchedData.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {watchedData.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Live Preview */}
      <div className="border-t pt-6">
        <CategoryPreview data={watchedData} />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isLoading
            ? "Saving..."
            : initialData
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
};
