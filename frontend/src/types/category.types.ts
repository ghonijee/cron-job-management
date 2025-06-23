// Re-export types from main index for consistency
import type { Category, PaginatedResponse } from './index';

export type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilter as CategoryFilterDto,
  PaginatedResponse
} from './index';

export type CategoriesResponse = PaginatedResponse<Category>;