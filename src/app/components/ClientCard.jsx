const ClientCard = ({ client, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6 hover:shadow-2xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
            {client.email && (
              <p className="text-sm text-gray-500">{client.email}</p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit Client"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Client"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Client Info */}
      <div className="space-y-2 mb-4">
        {client.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-5 text-center">📞</span>
            <span className="ml-2">{client.phone}</span>
          </div>
        )}
        
        {client.address && (
          <div className="flex items-start text-sm text-gray-600">
            <span className="w-5 text-center mt-0.5">📍</span>
            <span className="ml-2">{client.address}</span>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <p className="text-2xl font-bold text-green-600">{client.totalPurchases || 0}</p>
          <p className="text-xs text-green-700 font-medium">Orders</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <p className="text-2xl font-bold text-blue-600">${(client.totalSpent || 0).toFixed(2)}</p>
          <p className="text-xs text-blue-700 font-medium">Spent</p>
        </div>
      </div>

      {/* Last Purchase */}
      <div className="text-xs text-gray-500 text-center">
        Last purchase: {formatDate(client.lastPurchase)}
      </div>

      {/* Notes Preview */}
      {client.notes && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-1">Notes:</p>
          <p className="text-sm text-gray-700 line-clamp-2">
            {client.notes.length > 100 
              ? `${client.notes.substring(0, 100)}...` 
              : client.notes
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientCard;
