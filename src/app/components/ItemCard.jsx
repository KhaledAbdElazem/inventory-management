import React from 'react';

const ItemCard = ({ item, onEdit, onDelete, isEditing }) => (
  <div className={`relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${isEditing ? 'ring-2 ring-indigo-500' : ''}`}>
    {isEditing && (
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
        Editing
      </div>
    )}

    <div className="flex gap-4 mb-4">
      <div className="flex-shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-gray-400 text-3xl">📦</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg text-gray-800 truncate mb-1">{item.name}</h3>

        <div className="flex flex-wrap gap-2 mb-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Qty: {item.quantity}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            ${Number(item.price).toFixed(2)}
          </span>
          {item.barcode && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              Barcode: {item.barcode}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500">
          Added: {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>

    <div className="flex gap-2 mt-2">
      <button
        onClick={() => onEdit(item)}
        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(item._id)}
        className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Delete
      </button>
    </div>
  </div>
);

export default ItemCard;
