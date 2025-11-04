import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, Edit, Trash2, Eye, 
  TrendingUp, Calendar, Users, BarChart3, Clock 
} from 'lucide-react';
import { 
  getBlogs, createBlog, updateBlog, deleteBlog, getBlogViewStats 
} from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import FeedbackToast from '../components/FeedbackToast';

interface BlogData {
  id?: number;
  title: string;
  content: string;
  author?: string;
  created_at?: string;
  view_count?: number;
}

const AdminBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [blogViews, setBlogViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogData | null>(null);
  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });

  const [newBlog, setNewBlog] = useState<BlogData>({
    title: '',
    content: '',
    author: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [blogsData, viewsData] = await Promise.all([
        getBlogs(),
        getBlogViewStats()
      ]);
      
      const blogsWithViews = Array.isArray(blogsData) ? blogsData.map(blog => ({
        ...blog,
        view_count: Array.isArray(viewsData) ? 
          viewsData.find(v => v.blog_id === blog.id)?.view_count || 0 : 0
      })) : [];
      
      setBlogs(blogsWithViews);
      setBlogViews(Array.isArray(viewsData) ? viewsData : []);
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

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createBlog(newBlog);
      if (result && !result.detail) {
        setNewBlog({ title: '', content: '', author: '' });
        setShowAddForm(false);
        await fetchData();
        showToast('Blog added successfully!');
      }
    } catch (error) {
      console.error('Error adding blog:', error);
      showToast('Failed to add blog', 'error');
    }
  };

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.id) return;
    
    try {
      const result = await updateBlog(editingBlog.id, editingBlog);
      if (result && !result.detail) {
        setEditingBlog(null);
        await fetchData();
        showToast('Blog updated successfully!');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      showToast('Failed to update blog', 'error');
    }
  };

  const handleDeleteBlog = async (blogId: number, blogTitle: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete blog "${blogTitle}"?`);
    
    if (confirmDelete) {
      try {
        await deleteBlog(blogId);
        await fetchData();
        showToast('Blog deleted successfully!');
      } catch (error) {
        console.error('Error deleting blog:', error);
        showToast('Failed to delete blog', 'error');
      }
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalViews = blogs.reduce((sum, blog) => sum + (blog.view_count || 0), 0);
  const avgViews = blogs.length > 0 ? Math.round(totalViews / blogs.length) : 0;

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
            <p className="text-gray-600">Create and manage your blog content with analytics</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Blog
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{blogs.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalViews}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Views/Blog</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{avgViews}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Posts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {blogs.filter(blog => {
                    const blogDate = new Date(blog.created_at || '');
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return blogDate > weekAgo;
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
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
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{blog.title}</h3>
                      <p className="text-sm text-gray-500">By {blog.author || 'Admin'}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.content}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{blog.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingBlog(blog)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog.id!, blog.title)}
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

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-500">Try adjusting your search or add a new blog</p>
          </div>
        )}

        {/* Add Blog Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Blog</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleBlogSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
                  <input
                    type="text"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    placeholder="Enter blog title"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={newBlog.author}
                    onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                    placeholder="Enter author name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blog Content</label>
                  <textarea
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    placeholder="Enter blog content"
                    required
                    rows={10}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Add Blog
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

        {/* Edit Blog Modal */}
        {editingBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Blog</h2>
                <button
                  onClick={() => setEditingBlog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleUpdateBlog} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
                  <input
                    type="text"
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    placeholder="Enter blog title"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={editingBlog.author}
                    onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                    placeholder="Enter author name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blog Content</label>
                  <textarea
                    value={editingBlog.content}
                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    placeholder="Enter blog content"
                    required
                    rows={10}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Update Blog
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBlog(null)}
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

export default AdminBlogs;
