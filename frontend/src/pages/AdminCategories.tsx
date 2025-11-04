import React, { useState, useEffect } from 'react';
import { 
  Folder, Plus, Search, Edit, Trash2, Package, 
  TrendingUp, Calendar, Users, BarChart3 
} from 'lucide-react';
import { 
  getCategories, createCategory, updateCategory, deleteCategory, 
  deleteCategoryWithDependencies, getProducts, getSubcategories 
} from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import FeedbackToast from '../components/FeedbackToast';

interface CategoryData {
  id?: number;
  name: string;
  product_count?: number;
  subcategory_count?: number;
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });

  const [newCategory, setNewCategory] = useState<CategoryData>({
    name: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesData, productsData, subcategoriesData] = await Promise.all([
        getCategories(),
        getProducts(),
        getSubcategories()
      ]);
      
      const categoriesWithCounts = Array.isArray(categoriesData) ? categoriesData.map(cat => ({
        ...cat,
        product_count: Array.isArray(productsData) ? productsData.filter(p => p.category_id === cat.id).length : 0,
        subcategory_count: Array.isArray(subcategoriesData) ? subcategoriesData.filter(s => s.category_id === cat.id).length : 0
      })) : [];
      
      setCategories(categoriesWithCounts);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => setToast(t => ({ ...t, isVisible: false })), 3000);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createCategory(newCategory);
      if (result && !result.detail) {
        setNewCategory({ name: '' });
        setShowAddForm(false);
        await fetchData();
        showToast('Category added successfully!');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      showToast('Failed to add category', 'error');
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.id) return;
    
    try {
      const result = await updateCategory(editingCategory.id, editingCategory.name);
      if (result && !result.detail) {
        setEditingCategory(null);
        await fetchData();
        showToast('Category updated successfully!');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      showToast('Failed to update category', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
    const hasProducts = products.some(p => p.category_id === categoryId);
    const hasSubcategories = subcategories.some(s => s.category_id === categoryId);
    
    if (hasProducts || hasSubcategories) {
      const confirmDelete = window.confirm(
        `Category "${categoryName}" has ${hasSubcategories ? 'subcategories' : 'products'}. Do you want to delete it with all dependencies?`
      );
      
      if (confirmDelete) {
        try {
          await deleteCategoryWithDependencies(categoryId);
          await fetchData();
          showToast('Category and dependencies deleted successfully!');
        } catch (error) {
          console.error('Error deleting category with dependencies:', error);
          showToast('Failed to delete category', 'error');
        }
      }
    } else {
      const confirmDelete = window.confirm(`Are you sure you want to delete category "${categoryName}"?`);
      
      if (confirmDelete) {
        try {
          await deleteCategory(categoryId);
          await fetchData();
          showToast('Category deleted successfully!');
        } catch (error) {
          console.error('Error deleting category:', error);
          showToast('Failed to delete category', 'error');
        }
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Category Management</h1>
            <p className="text-gray-600">Organize your products with categories and subcategories</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{categories.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Folder className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subcategories</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{subcategories.length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Products/Category</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {categories.length > 0 ? Math.round(products.length / categories.length) : 0}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Folder className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">Category ID: {category.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{category.product_count || 0}</p>
                  <p className="text-xs text-green-600 font-medium">Products</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{category.subcategory_count || 0}</p>
                  <p className="text-xs text-purple-600 font-medium">Subcategories</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCategory(category)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id!, category.name)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500">Try adjusting your search or add a new category</p>
          </div>
        )}

        {/* Add Category Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Category</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleCategorySubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ name: e.target.value })}
                    placeholder="Enter category name"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Add Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Category</h2>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleUpdateCategory}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    placeholder="Enter category name"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Update Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <FeedbackToast
          message={toast.message}
          type={toast.type as any}
          isVisible={toast.isVisible}
          onClose={() => setToast(t => ({ ...t, isVisible: false }))}
        />
      </div>
    </div>
  );
};

export default AdminCategories;
