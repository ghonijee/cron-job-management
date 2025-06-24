import React from "react";
import { Modal } from "../ui/modal";
import { CategoryForm } from "./category-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../../api/categories.api";
import { useAuth } from "../../hooks/use-auth";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../types/index";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditing = !!category;

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onMutate: async (newCategory: CreateCategoryDto) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData(["categories"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["categories"], (old: unknown) => {
        if (!old || typeof old !== "object" || !("data" in old)) return old;
        const oldData = old as { data: Category[]; total: number };

        const optimisticCategory: Category = {
          id: `temp-${Date.now()}`,
          name: newCategory.name,
          description: newCategory.description,
          color: newCategory.color,
          isActive: true,
          userId: newCategory.userId || user?.id || "unknown",
          cronJobsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          ...oldData,
          data: [optimisticCategory, ...oldData.data],
          total: oldData.total + 1,
        };
      });

      // Return a context object with the snapshotted value
      return { previousCategories };
    },
    onError: (_err, _newCategory, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["categories"], context?.previousCategories);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onSuccess: () => {
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoriesApi.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData(["categories"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["categories"], (old: unknown) => {
        if (!old || typeof old !== "object" || !("data" in old)) return old;
        const oldData = old as { data: Category[] };

        return {
          ...oldData,
          data: oldData.data.map((cat: Category) =>
            cat.id === id
              ? { ...cat, ...data, updatedAt: new Date().toISOString() }
              : cat
          ),
        };
      });

      return { previousCategories };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["categories"], context?.previousCategories);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmit = async (data: CreateCategoryDto | UpdateCategoryDto) => {
    if (isEditing) {
      await updateMutation.mutateAsync({ id: category.id, data });
    } else {
      // Ensure user is available before creating
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Include userId in the create request
      const createData: CreateCategoryDto = {
        ...(data as CreateCategoryDto),
        userId: user.id,
      };

      await createMutation.mutateAsync(createData);
    }
  };

  const handleAutoSave = (
    data: Partial<CreateCategoryDto | UpdateCategoryDto>
  ) => {
    // Save draft to localStorage for recovery
    const draftKey = isEditing
      ? `category-draft-${category.id}`
      : "category-draft-new";
    localStorage.setItem(draftKey, JSON.stringify(data));
  };

  const handleClose = () => {
    // Clear auto-save draft when closing
    const draftKey = isEditing
      ? `category-draft-${category?.id}`
      : "category-draft-new";
    localStorage.removeItem(draftKey);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Category" : "Create Category"}
      size="md"
    >
      <CategoryForm
        initialData={category}
        onSubmit={handleSubmit}
        onAutoSave={handleAutoSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </Modal>
  );
};
