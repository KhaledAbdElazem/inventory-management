'use client';
import { useEffect, useState } from 'react';
import ItemForm from '../components/ItemForm';
import ItemFilter from '../components/ItemFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useItems } from '../hooks/useItems';

export default function Home() {
  const { items, loading, error, fetchItems, addItem, updateItem, deleteItem } = useItems();
  const [form, setForm] = useState({
    name: '',
    image: '',
    quantity: 1,
    price: 0,
    barcode: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async () => {
    const success = editingId
      ? await updateItem(editingId, form)
      : await addItem(form);

    if (success) {
      setForm({ name: '', image: '', quantity: 1, price: 0, barcode: '' });
      setEditingId(null);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
      barcode: item.barcode || ''
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', image: '', quantity: 1, price: 0, barcode: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorMessage message={error} />}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <ItemForm
              form={form}
              setForm={setForm}
              editingId={editingId}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>

          {/* Items List */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  Inventory ({items.length} items)
                </h2>
              </div>

              <div className="p-8">
                {loading ? (
                  <LoadingSpinner />
                ) : items.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-gray-400 mb-2">No items yet</h3>
                    <p className="text-gray-500">Add your first item to get started!</p>
                  </div>
                ) : (
                  <ItemFilter 
                    items={items}
                    onEdit={handleEdit}
                    onDelete={deleteItem}
                    editingId={editingId}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
