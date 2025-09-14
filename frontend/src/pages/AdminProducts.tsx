import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Filter, Edit, Trash2, Eye, 
  Star, TrendingUp, Calendar, Tag, Grid, List 
} from 'lucide-react';
import { 
  getProducts, createProduct, updateProduct, deleteProduct, 
  getCategories, getSubcategories 
} from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageUpload from '../components/ImageUpload';
import FeedbackToast from '../components/FeedbackToast';

interface ProductData {
  id?: number;
  name: string;
  grade: string;
  moq: string;
  origin: string;
  image_url: string;
  certifications: string;
  details: string;
  category_id: string | number;
  subcategory_id?: string | number | null;
  specs: Record<string, any>;
  highlights: string;
  private_label_options: string;
  use_cases: string;
  additional_info?: string;
  is_featured?: boolean;
  status?: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });

  const [newProduct, setNewProduct] = useState<ProductData>({
    name: '',
    grade: '',
    moq: '',
    origin: '',
    image_url: '',
    certifications: '',
    details: '',
    category_id: '',
    subcategory_id: '',
    specs: {},
    highlights: '',
    private_label_options: '',
    use_cases: '',
    additional_info: '',
    is_featured: false,
    status: 'In Stock'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData, subcategoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
        getSubcategories()
      ]);
      
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
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

  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        specs: newProduct.specs || {},
        category_id: parseInt(newProduct.category_id as string),
        subcategory_id: newProduct.subcategory_id ? parseInt(newProduct.subcategory_id as string) : null
      };

      const result = await createProduct(productData);
      if (result && !result.detail) {
        setNewProduct({
          name: '', grade: '', moq: '', origin: '', image_url: '', certifications: '', details: '',
          category_id: '', subcategory_id: '', specs: {}, highlights: '', private_label_options: '',
          use_cases: '', additional_info: '', is_featured: false, status: 'In Stock'
        });
        setShowAddForm(false);
        await fetchData();
        showToast('Product added successfully!');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showToast('Failed to add product', 'error');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        await fetchData();
        showToast('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.details?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id?.toString() === selectedCategory;
    const matchesStatus = !selectedStatus || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
            <p className="text-gray-600">Manage your product catalog with real-time updates</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
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

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Available Soon">Available Soon</option>
              <option value="Discontinued">Discontinued</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                <img
                  src={product.image_url || 'https://via.placeholder.com/400x300?text=Product'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.is_featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Featured
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                    product.status === 'Out of Stock' ? 'bg-red-100 text-red-700' :
                    product.status === 'Available Soon' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.details}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Grade</p>
                    <p className="text-sm font-medium">{product.grade || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">MOQ</p>
                    <p className="text-sm font-medium">{product.moq || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Origin</p>
                    <p className="text-sm font-medium">{product.origin || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-medium">
                      {categories.find(c => c.id === product.category_id)?.name || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id!)}
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="name"
                  value={newProduct.name}
                  onChange={handleNewProductChange}
                  placeholder="Product Name *"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                
                <input
                  name="grade"
                  value={newProduct.grade}
                  onChange={handleNewProductChange}
                  placeholder="Grade"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                
                <input
                  name="moq"
                  value={newProduct.moq}
                  onChange={handleNewProductChange}
                  placeholder="MOQ"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                
                <input
                  name="origin"
                  value={newProduct.origin}
                  onChange={handleNewProductChange}
                  placeholder="Origin"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <ImageUpload
                    value={newProduct.image_url}
                    onChange={(imageData) => setNewProduct(prev => ({ ...prev, image_url: imageData }))}
                    placeholder="Upload Product Image"
                    className="w-full"
                  />
                </div>
                
                <input
                  name="certifications"
                  value={newProduct.certifications}
                  onChange={handleNewProductChange}
                  placeholder="Certifications"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                
                <textarea
                  name="details"
                  value={newProduct.details}
                  onChange={handleNewProductChange}
                  placeholder="Details"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent md:col-span-2"
                  rows={3}
                />
                
                <select
                  name="category_id"
                  value={newProduct.category_id}
                  onChange={handleNewProductChange}
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Category *</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                
                <select
                  name="subcategory_id"
                  value={newProduct.subcategory_id}
                  onChange={handleNewProductChange}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Subcategory (Optional)</option>
                  {subcategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                
                <textarea
                  name="highlights"
                  value={newProduct.highlights}
                  onChange={handleNewProductChange}
                  placeholder="Highlights"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent md:col-span-2"
                  rows={2}
                />
                
                <textarea
                  name="private_label_options"
                  value={newProduct.private_label_options}
                  onChange={handleNewProductChange}
                  placeholder="Private Label Options"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent md:col-span-2"
                  rows={2}
                />
                
                <textarea
                  name="use_cases"
                  value={newProduct.use_cases}
                  onChange={handleNewProductChange}
                  placeholder="Use Cases"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent md:col-span-2"
                  rows={2}
                />
                
                <textarea
                  name="additional_info"
                  value={newProduct.additional_info}
                  onChange={handleNewProductChange}
                  placeholder="Additional Information"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent md:col-span-2"
                  rows={2}
                />
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technical Specifications (JSON format)</label>
                  <textarea
                    name="specs"
                    value={typeof newProduct.specs === 'object' ? JSON.stringify(newProduct.specs, null, 2) : ''}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setNewProduct(prev => ({ ...prev, specs: parsed }));
                      } catch {
                        setNewProduct(prev => ({ ...prev, specs: e.target.value }));
                      }
                    }}
                    placeholder='{"moisture": "12%", "protein": "8.5%", "ash": "2.1%"}'
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter specifications in JSON format (key-value pairs)</p>
                </div>
                
                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={newProduct.is_featured || false}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Featured Product</label>
                </div>
                
                <select
                  name="status"
                  value={newProduct.status}
                  onChange={handleNewProductChange}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Available Soon">Available Soon</option>
                  <option value="Discontinued">Discontinued</option>
                </select>
                
                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Add Product
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

export default AdminProducts;
