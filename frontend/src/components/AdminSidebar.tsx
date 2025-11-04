import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, FolderOpen, FileText, Users, 
  Settings, LogOut, ChevronLeft, ChevronRight, BarChart3,
  ShoppingCart, Bell, Search
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Products',
      icon: Package,
      path: '/admin/products',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Categories',
      icon: FolderOpen,
      path: '/admin/categories',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Subcategories',
      icon: FolderOpen,
      path: '/admin/subcategories',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Blogs',
      icon: FileText,
      path: '/admin/blogs',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Enquiries',
      icon: ShoppingCart,
      path: '/admin/enquiries',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-gray-900">Admin Panel</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
              isActive(item.path)
                ? `${item.bgColor} ${item.color} font-medium`
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.path) ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} />
            {!isCollapsed && (
              <span className="text-sm font-medium">{item.title}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="space-y-2">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600">
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Settings</span>
            </div>
          )}
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

