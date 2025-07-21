'use client';
import { useState, useEffect } from 'react';
import { useClients } from '../hooks/useClients';
import ClientForm from '../components/ClientForm';
import ClientCard from '../components/ClientCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ClientsPage = () => {
  const { clients, loading, error, fetchClients, createClient, updateClient, deleteClient } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingClient) {
        await updateClient({ ...formData, _id: editingClient._id });
      } else {
        await createClient(formData);
      }
      setShowForm(false);
      setEditingClient(null);
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = async (client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      try {
        await deleteClient(client._id);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  if (loading && clients.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-4xl">👥</span>
              Client Management
            </h1>
            <p className="mt-2 text-gray-600">Manage your customer database</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Add New Client
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/90 backdrop-blur-xl"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xl">🔍</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${clients.reduce((sum, client) => sum + (client.totalSpent || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">🛒</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.reduce((sum, client) => sum + (client.totalPurchases || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {editingClient ? 'Edit Client' : 'Add New Client'}
                </h2>
                <ClientForm
                  initialData={editingClient}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Clients Grid */}
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">👥</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Add your first client to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Add First Client
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map(client => (
              <ClientCard
                key={client._id}
                client={client}
                onEdit={() => handleEdit(client)}
                onDelete={() => handleDelete(client)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
