const PurchaseOrderCard = ({ order, onEdit, onMarkAsArrived, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'arrived':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'arrived':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {order.orderNumber.slice(-4)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${getStatusColor(order.status)}`}>
          <span>{getStatusIcon(order.status)}</span>
          <span>{order.status.toUpperCase()}</span>
        </div>
      </div>

      {/* Dealer Information */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
          <span className="text-lg mr-2">🏪</span>
          {order.dealerName}
        </h4>
        {order.dealerContact && (
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <span className="w-4 text-center mr-2">📞</span>
            <span>{order.dealerContact}</span>
          </div>
        )}
        {order.dealerEmail && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-4 text-center mr-2">✉️</span>
            <span>{order.dealerEmail}</span>
          </div>
        )}
      </div>

      {/* Items Summary */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
          <span className="text-lg mr-2">📦</span>
          Items ({order.items.length})
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm bg-white/70 rounded-xl p-3 border border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.itemName}</p>
                <p className="text-gray-500 text-xs">#{item.itemBarcode}</p>
              </div>
              <div className="text-right ml-2">
                <p className="font-semibold text-gray-900">×{item.quantity}</p>
                <p className="text-gray-500 text-xs">${item.unitCost.toFixed(2)} each</p>
              </div>
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="text-center text-sm text-gray-500 py-2">
              +{order.items.length - 3} more items
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Subtotal</p>
            <p className="font-semibold text-gray-900">${order.subtotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Cost</p>
            <p className="font-bold text-lg text-emerald-700">${order.totalCost.toFixed(2)}</p>
          </div>
        </div>
        {(order.tax > 0 || order.shippingCost > 0) && (
          <div className="mt-2 pt-2 border-t border-green-200 grid grid-cols-2 gap-4 text-xs text-gray-600">
            {order.tax > 0 && (
              <div>Tax: ${order.tax.toFixed(2)}</div>
            )}
            {order.shippingCost > 0 && (
              <div>Shipping: ${order.shippingCost.toFixed(2)}</div>
            )}
          </div>
        )}
      </div>

      {/* Delivery Information */}
      {order.expectedDeliveryDate && (
        <div className="mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <span className="w-4 text-center mr-2">📅</span>
            <span>Expected: {formatDate(order.expectedDeliveryDate)}</span>
          </div>
          {order.actualDeliveryDate && (
            <div className="flex items-center text-gray-600 mt-1">
              <span className="w-4 text-center mr-2">✅</span>
              <span>Delivered: {formatDate(order.actualDeliveryDate)}</span>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Notes:</p>
          <p className="text-sm text-gray-700">{order.notes}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {order.status === 'pending' && (
          <button
            onClick={onMarkAsArrived}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 text-sm shadow-lg flex items-center justify-center space-x-2"
          >
            <span>✅</span>
            <span>Mark Arrived</span>
          </button>
        )}
        
        <button
          onClick={onEdit}
          className="px-4 py-3 bg-white/80 hover:bg-white text-indigo-600 hover:text-indigo-700 font-semibold rounded-2xl transition-all duration-300 border-2 border-indigo-200 hover:border-indigo-300 flex items-center justify-center space-x-1 shadow-md"
          title="Edit Order"
        >
          <span>✏️</span>
          <span className="hidden sm:inline">Edit</span>
        </button>
        
        <button
          onClick={onDelete}
          className="px-4 py-3 bg-white/80 hover:bg-red-50 text-red-600 hover:text-red-700 font-semibold rounded-2xl transition-all duration-300 border-2 border-red-200 hover:border-red-300 flex items-center justify-center space-x-1 shadow-md"
          title="Delete Order"
        >
          <span>🗑️</span>
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>

      {/* Processed Badge */}
      {order.processedToInventory && (
        <div className="mt-4 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <span className="mr-1">📦</span>
            Added to Inventory
          </span>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderCard;
