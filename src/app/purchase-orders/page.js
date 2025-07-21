'use client';
import { useState, useEffect } from 'react';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import PurchaseOrderForm from '../components/PurchaseOrderForm';
import PurchaseOrderCard from '../components/PurchaseOrderCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const PurchaseOrdersPage = () => {
  const { orders, loading, error, fetchOrders, createOrder, updateOrder, deleteOrder } = usePurchaseOrders();
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingOrder) {
        await updateOrder({ ...formData, _id: editingOrder._id });
      } else {
        await createOrder(formData);
      }
      setShowForm(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error saving purchase order:', error);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleMarkAsArrived = async (order) => {
    if (window.confirm(`Mark order ${order.orderNumber} as arrived? This will automatically update your inventory.`)) {
      try {
        await updateOrder({ ...order, status: 'arrived' });
        alert('Order marked as arrived and inventory has been updated!');
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
  };

  const handleDelete = async (order) => {
    if (window.confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
      try {
        await deleteOrder(order._id);
      } catch (error) {
        console.error('Error deleting purchase order:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.dealerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const arrivedOrders = orders.filter(o => o.status === 'arrived').length;
  const totalSpent = orders.filter(o => o.status === 'arrived').reduce((sum, order) => sum + order.totalCost, 0);

  if (loading && orders.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-6 lg:mb-0">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl text-white">📦</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                Purchase Orders
              </h1>
              <p className="text-lg text-gray-600 mt-1">Manage orders from dealers and suppliers</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-indigo-500/25 flex items-center space-x-3"
          >
            <span className="text-2xl">➕</span>
            <span>New Purchase Order</span>
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl">⏳</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Arrived</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{arrivedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Spent</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Search Orders</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by order number or dealer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/50 backdrop-blur-xl text-gray-900 placeholder-gray-500 transition-all duration-300"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-xl">🔍</span>
                </div>
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/50 backdrop-blur-xl text-gray-900 transition-all duration-300"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="arrived">Arrived</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Purchase Order Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                    <span className="text-4xl">📝</span>
                    <span>{editingOrder ? 'Edit Purchase Order' : 'New Purchase Order'}</span>
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <span className="text-gray-500 text-xl">✕</span>
                  </button>
                </div>
                <PurchaseOrderForm
                  initialData={editingOrder}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl text-gray-400">📦</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No orders found' : 'No purchase orders yet'}
            </h3>
            <p className="text-gray-500 mb-8 text-lg">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first purchase order to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Create First Order
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredOrders.map(order => (
              <PurchaseOrderCard
                key={order._id}
                order={order}
                onEdit={() => handleEdit(order)}
                onMarkAsArrived={() => handleMarkAsArrived(order)}
                onDelete={() => handleDelete(order)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrdersPage;
