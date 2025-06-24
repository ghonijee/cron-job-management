import { CategoryList } from '../../components/categories/category-list';

export function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryList />
      </div>
    </div>
  );
}

export default CategoriesPage;