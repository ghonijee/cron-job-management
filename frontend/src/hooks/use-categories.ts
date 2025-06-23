import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';
import type { 
  CategoryFilter, 
  CreateCategoryDto, 
  UpdateCategoryDto
} from '../types';

const CATEGORIES_QUERY_KEY = ['categories'] as const;

// Basic query hooks with proper typing
export const useCategories = (filters?: CategoryFilter) => {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, filters],
    queryFn: () => categoriesApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, id],
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  });
};

// Simple CRUD mutations with cache invalidation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) => 
      categoriesApi.update(id, data),
    onSuccess: (updatedCategory) => {
      // Simple optimistic update - just update the individual cache
      queryClient.setQueryData([...CATEGORIES_QUERY_KEY, updatedCategory.id], updatedCategory);
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

export const useToggleCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => categoriesApi.toggle(id),
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData([...CATEGORIES_QUERY_KEY, updatedCategory.id], updatedCategory);
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

// Enhanced version with retry logic (optional)
export const useCategoriesWithRetry = (filters?: CategoryFilter) => {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, 'with-retry', filters],
    queryFn: () => categoriesApi.getAll(filters),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
  });
};