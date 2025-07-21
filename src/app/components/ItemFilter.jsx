'use client';
import { useState } from 'react';
import ItemCard from './ItemCard';

export default function ItemFilter({ items, onEdit, onDelete, editingId }) {
  const [searchName, setSearchName] = useState('');
  const [searchBarcode, setSearchBarcode] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');

  const filteredItems = items
    .filter(item => {
      const matchesName = searchName === '' || item.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesBarcode = searchBarcode === '' || (item.barcode && item.barcode.includes(searchBarcode));
      const matchesQuantity = minQuantity === '' || item.quantity >= Number(minQuantity);
      const matchesPrice = maxPrice === '' || item.price <= Number(maxPrice);
      return matchesName && matchesBarcode && matchesQuantity && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'lowest-price') return a.price - b.price;
      if (sortBy === 'highest-price') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <input
          type="text"
          placeholder="Search by barcode..."
          value={searchBarcode}
          onChange={(e) => setSearchBarcode(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <input
          type="number"
          placeholder="Min quantity"
          value={minQuantity}
          onChange={(e) => setMinQuantity(e.target.value)}
          className="w-32 px-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-32 px-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-48 px-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        >
          <option value="">Sort by</option>
          <option value="lowest-price">Lowest Price</option>
          <option value="highest-price">Highest Price</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredItems.length === 0 ? (
          <p className="text-gray-500 text-center">No matching items found.</p>
        ) : (
          filteredItems.map(item => (
            <ItemCard
              key={item._id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              isEditing={editingId === item._id}
            />
          ))
        )}
      </div>
    </div>
  );
}
