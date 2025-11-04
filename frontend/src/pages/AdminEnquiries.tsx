import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Mail, Phone, Calendar, User, Package, 
  Filter, Download, RefreshCw, Eye, MessageSquare, Clock
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import AdminForm from '../components/AdminForm';
import { getEnquiries } from '../api';

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  product_name: string;
  message: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await getEnquiries();
      setEnquiries(response || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (enquiryId: number, newStatus: string) => {
    try {
      // Update the enquiries list
      setEnquiries(prev => prev.map(enquiry => 
        enquiry.id === enquiryId 
          ? { ...enquiry, status: newStatus as any, updated_at: new Date().toISOString() }
          : enquiry
      ));
      
      // Update the selected enquiry if it's the one being modified
      if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
        setSelectedEnquiry(prev => prev ? {
          ...prev,
          status: newStatus as any,
          updated_at: new Date().toISOString()
        } : null);
      }
    } catch (error) {
      console.error('Error updating enquiry status:', error);
    }
  };

  const handleViewEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <MessageSquare className="w-4 h-4" />;
      case 'completed': return <Eye className="w-4 h-4" />;
      case 'cancelled': return <Mail className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const filteredEnquiries = filterStatus === 'all' 
    ? enquiries 
    : enquiries.filter(enquiry => enquiry.status === filterStatus);

  const enquiryColumns = [
    { 
      key: 'name', 
      label: 'Customer', 
      sortable: true,
      render: (value: string, row: Enquiry) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    { 
      key: 'product_name', 
      label: 'Product', 
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-gray-400 mr-2" />
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {getStatusIcon(value)}
          <span className="ml-1 capitalize">{value.replace('_', ' ')}</span>
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Date', 
      sortable: true,
      render: (value: string) => (
        <div className="text-sm text-gray-900">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enquiry Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and respond to customer enquiries and inquiries.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={fetchEnquiries}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Enquiries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{enquiries.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {enquiries.filter(e => e.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {enquiries.filter(e => e.status === 'in_progress').length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {enquiries.filter(e => e.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="mb-8">
        <DataTable
          title="Customer Enquiries"
          columns={enquiryColumns}
          data={filteredEnquiries}
          searchable={true}
          filterable={true}
          downloadable={true}
          onView={handleViewEnquiry}
          emptyMessage="No enquiries found"
        />
      </div>

      {/* Enquiry Detail Modal */}
      {showForm && selectedEnquiry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Enquiry Details</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.product_name}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedEnquiry.message}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) => handleStatusUpdate(selectedEnquiry.id, e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedEnquiry.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Handle reply functionality
                      console.log('Reply to enquiry:', selectedEnquiry.id);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
