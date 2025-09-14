import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Edit, Trash2, Folder, 
  TrendingUp, Calendar, Users, BarChart3, Image, Star, Crown, Heart
} from 'lucide-react';
import { 
  getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory,
  getCategories, getProducts 
} from '../api';
import { apiCache } from '../utils/apiCache';

// Get API base URL for cache key generation
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
import LoadingSpinner from '../components/LoadingSpinner';
import ImageUpload from '../components/ImageUpload';
import FeedbackToast from '../components/FeedbackToast';

interface SubcategoryData {
  id?: number;
  name: string;
  description?: string;
  image_url?: string;
  category_id: string | number;
  badge_type?: string;
  product_count?: number;
  category_name?: string;
}

const AdminSubcategories: React.FC = () => {
  const [subcategories, setSubcategories] = useState<SubcategoryData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<SubcategoryData | null>(null);
  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });

  // Helper function to get badge styling
  const getBadgeInfo = (badgeType: string | undefined) => {
    switch (badgeType) {
      case 'best_seller':
        return {
          text: 'Best Seller',
          icon: TrendingUp,
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-700',
          iconColor: 'text-orange-600'
        };
      case 'premium':
        return {
          text: 'Premium',
          icon: Crown,
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-700',
          iconColor: 'text-purple-600'
        };
      case 'most_favorite':
        return {
          text: 'Most Favorite',
          icon: Heart,
          bgColor: 'bg-pink-100',
          textColor: 'text-pink-700',
          iconColor: 'text-pink-600'
        };
      default:
        return null;
    }
  };

  const [newSubcategory, setNewSubcategory] = useState<SubcategoryData>({
    name: '',
    description: '',
    image_url: '',
    category_id: '',
    badge_type: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Clear subcategories cache to ensure fresh data
      const cacheKey = `GET:${API_BASE_URL}/subcategories/:`;
      apiCache.delete(cacheKey);
      
      // Fetch subcategories directly without cache
      const subcategoriesResponse = await fetch(`${API_BASE_URL}/subcategories/`);
      const subcategoriesData = await subcategoriesResponse.json();
      
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts()
      ]);
      
      const subcategoriesWithCounts = Array.isArray(subcategoriesData) ? subcategoriesData.map(sub => ({
        ...sub,
        product_count: Array.isArray(productsData) ? productsData.filter(p => p.subcategory_id === sub.id).length : 0,
        category_name: Array.isArray(categoriesData) ? categoriesData.find(c => c.id === sub.category_id)?.name : 'Unknown'
      })) : [];
      
      setSubcategories(subcategoriesWithCounts);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
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

  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subcategoryData = {
        ...newSubcategory,
        category_id: parseInt(newSubcategory.category_id as string),
        badge_type: newSubcategory.badge_type || null
      };

      const result = await createSubcategory(subcategoryData);
      if (result && !result.detail) {
        // Clear the subcategories cache to ensure fresh data
        const cacheKey = `GET:${API_BASE_URL}/subcategories/:`;
        apiCache.delete(cacheKey);
        setNewSubcategory({ name: '', description: '', image_url: '', category_id: '', badge_type: '' });
        setShowAddForm(false);
        await fetchData();
        showToast('Subcategory added successfully!');
      }
    } catch (error) {
      console.error('Error adding subcategory:', error);
      showToast('Failed to add subcategory', 'error');
    }
  };

  const handleUpdateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubcategory?.id) return;
    
    try {
      const subcategoryData = {
        ...editingSubcategory,
        category_id: parseInt(editingSubcategory.category_id as string),
        badge_type: editingSubcategory.badge_type || null
      };

      const result = await updateSubcategory(editingSubcategory.id, subcategoryData);
      
      if (result && !result.detail) {
        // Clear the subcategories cache to ensure fresh data
        const cacheKey = `GET:${API_BASE_URL}/subcategories/:`;
        apiCache.delete(cacheKey);
        setEditingSubcategory(null);
        await fetchData();
        showToast('Subcategory updated successfully!');
      } else {
        showToast('Failed to update subcategory', 'error');
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
      showToast('Failed to update subcategory', 'error');
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: number, subcategoryName: string) => {
    const hasProducts = products.some(p => p.subcategory_id === subcategoryId);
    
    if (hasProducts) {
      const confirmDelete = window.confirm(
        `Subcategory "${subcategoryName}" has products. Are you sure you want to delete it?`
      );
      
      if (confirmDelete) {
        try {
          await deleteSubcategory(subcategoryId);
          // Clear the subcategories cache to ensure fresh data
          const cacheKey = `GET:${API_BASE_URL}/subcategories/:`;
        apiCache.delete(cacheKey);
          await fetchData();
          showToast('Subcategory deleted successfully!');
        } catch (error) {
          console.error('Error deleting subcategory:', error);
          showToast('Failed to delete subcategory', 'error');
        }
      }
    } else {
      const confirmDelete = window.confirm(`Are you sure you want to delete subcategory "${subcategoryName}"?`);
      
      if (confirmDelete) {
        try {
          await deleteSubcategory(subcategoryId);
          // Clear the subcategories cache to ensure fresh data
          const cacheKey = `GET:${API_BASE_URL}/subcategories/:`;
        apiCache.delete(cacheKey);
          await fetchData();
          showToast('Subcategory deleted successfully!');
        } catch (error) {
          console.error('Error deleting subcategory:', error);
          showToast('Failed to delete subcategory', 'error');
        }
      }
    }
  };

  const filteredSubcategories = subcategories.filter(subcategory => {
    const matchesSearch = subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subcategory.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || subcategory.category_id?.toString() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Subcategory Management</h1>
            <p className="text-gray-600">Organize products into subcategories for better navigation</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Subcategory
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subcategories</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{subcategories.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{categories.length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Folder className="w-6 h-6 text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Avg Products/Subcategory</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {subcategories.length > 0 ? Math.round(products.length / subcategories.length) : 0}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search subcategories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubcategories.map((subcategory) => (
            <div key={subcategory.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {subcategory.image_url ? (
                  <img
                    src={subcategory.image_url}
                    alt={subcategory.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{subcategory.name}</h3>
                      {subcategory.badge_type && getBadgeInfo(subcategory.badge_type) && (() => {
                        const badgeInfo = getBadgeInfo(subcategory.badge_type)!;
                        const IconComponent = badgeInfo.icon;
                        return (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badgeInfo.bgColor} ${badgeInfo.textColor}`}>
                            <IconComponent className={`w-3 h-3 ${badgeInfo.iconColor}`} />
                            {badgeInfo.text}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-sm text-gray-500">{subcategory.category_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{subcategory.product_count || 0}</p>
                    <p className="text-xs text-gray-500">Products</p>
                  </div>
                </div>
                
                {subcategory.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{subcategory.description}</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      // Fetch fresh data for this specific subcategory
                      try {
                        const response = await fetch(`${API_BASE_URL}/subcategories/${subcategory.id}`);
                        const freshSubcategory = await response.json();
                        setEditingSubcategory({
                          ...freshSubcategory,
                          category_id: freshSubcategory.category_id.toString()
                        });
                      } catch (error) {
                        console.error('Error fetching fresh subcategory:', error);
                        setEditingSubcategory({
                          ...subcategory,
                          category_id: subcategory.category_id.toString()
                        });
                      }
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSubcategory(subcategory.id!, subcategory.name)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSubcategories.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subcategories found</h3>
            <p className="text-gray-500">Try adjusting your search or add a new subcategory</p>
          </div>
        )}

        {/* Add Subcategory Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Subcategory</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubcategorySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory Name</label>
                    <input
                      type="text"
                      value={newSubcategory.name}
                      onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                      placeholder="Enter subcategory name"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newSubcategory.category_id}
                      onChange={(e) => setNewSubcategory({ ...newSubcategory, category_id: e.target.value })}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge Type (Optional)</label>
                  <select
                    value={newSubcategory.badge_type}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, badge_type: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">No Badge (Normal Display)</option>
                    <option value="best_seller">Best Seller</option>
                    <option value="premium">Premium</option>
                    <option value="most_favorite">Most Favorite</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select a badge to highlight this subcategory on the user side</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newSubcategory.description}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                    placeholder="Enter subcategory description"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory Image</label>
                  <ImageUpload
                    value={newSubcategory.image_url}
                    onChange={(imageData) => setNewSubcategory({ ...newSubcategory, image_url: imageData })}
                    placeholder="Upload Subcategory Image"
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Add Subcategory
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

        {/* Edit Subcategory Modal */}
        {editingSubcategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Subcategory</h2>
                <button
                  onClick={() => setEditingSubcategory(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleUpdateSubcategory} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory Name</label>
                    <input
                      type="text"
                      value={editingSubcategory.name}
                      onChange={(e) => setEditingSubcategory({ ...editingSubcategory, name: e.target.value })}
                      placeholder="Enter subcategory name"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={editingSubcategory.category_id}
                      onChange={(e) => setEditingSubcategory({ ...editingSubcategory, category_id: e.target.value })}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge Type (Optional)</label>
                  <select
                    value={editingSubcategory.badge_type || ''}
                    onChange={(e) => {
                      const newValue = e.target.value === '' ? null : e.target.value;
                      setEditingSubcategory({ ...editingSubcategory, badge_type: newValue });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">No Badge (Normal Display)</option>
                    <option value="best_seller">Best Seller</option>
                    <option value="premium">Premium</option>
                    <option value="most_favorite">Most Favorite</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select a badge to highlight this subcategory on the user side</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editingSubcategory.description}
                    onChange={(e) => setEditingSubcategory({ ...editingSubcategory, description: e.target.value })}
                    placeholder="Enter subcategory description"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory Image</label>
                  <ImageUpload
                    value={editingSubcategory.image_url}
                    onChange={(imageData) => setEditingSubcategory({ ...editingSubcategory, image_url: imageData })}
                    placeholder="Upload Subcategory Image"
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Update Subcategory
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSubcategory(null)}
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

export default AdminSubcategories;
