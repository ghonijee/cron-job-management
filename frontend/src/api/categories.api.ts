import { apiClient } from '../lib/api';
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilter,
  PaginatedResponse
} from '../types';

export const categoriesApi = {
  getAll: async (filters?: CategoryFilter): Promise<PaginatedResponse<Category>> => {
    const response = await apiClient.get<PaginatedResponse<Category>>('/categories', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    const response = await apiClient.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },

  toggle: async (id: string): Promise<Category> => {
    const response = await apiClient.patch<Category>(`/categories/${id}/toggle`);
    return response.data;
  }
};