  'use client';
  import { useState } from 'react';

  const ItemForm = ({ form, setForm, editingId, onSubmit, onCancel }) => {
    const [imagePreview, setImagePreview] = useState(form.image || null);
    const [uploading, setUploading] = useState(false);

    // This function handles changes for all text inputs.
    const handleChange = (e) => {
      const { name, value, type } = e.target;
      // For number inputs, convert the value to a number.
      const newValue = type === 'number' ? parseFloat(value) : value;
      setForm(prev => ({ ...prev, [name]: newValue }));
    };

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setUploading(true);
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setForm(prev => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
      } finally {
        setUploading(false);
      }
    };

    const removeImage = () => {
      setImagePreview(null);
      setForm(prev => ({ ...prev, image: '' }));
    };

    const handleSubmit = () => {
      // Basic validation checks
      if (!form.name || !form.name.trim()) {
        alert('Please enter an item name');
        return;
      }
      // Ensure barcode exists and is not just whitespace
      if (!form.barcode || !form.barcode.trim()) {
        alert('Please enter a barcode');
        return;
      }
      if (form.quantity < 1) {
        alert('Quantity must be at least 1');
        return;
      }
      if (form.price < 0.01) {
        alert('Price cannot be negative');
        return;
      }

      // --- DEBUGGING STEP ---
      // Log the form data right before submitting it.
      // Check your browser's developer console for this log.
      console.log('Submitting form data:', form);

      // Call the parent component's submit handler.
      onSubmit();
    };

    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            {editingId ? '✏️ Edit Item' : '✨ Add New Item'}
          </h2>
        </div>

        <div className="p-8 space-y-6">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
            <input
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 bg-gray-50 focus:bg-white"
              placeholder="Enter item name"
            />
          </div>

          {/* Barcode */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Barcode</label>
            <input
    type="text"
    name="barcode"
    value={form.barcode || ''}
    onChange={handleChange}
    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 bg-gray-50 focus:bg-white"
    placeholder="Enter or scan barcode"
  />

          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Item Image</label>
            {imagePreview && (
              <div className="mb-4 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl shadow-lg border-2 border-gray-200"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-200"
                >
                  ×
                </button>
              </div>
            )}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                  uploading
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    <span className="text-gray-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">📸</span>
                    <span className="text-gray-600 font-medium">
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </span>
                  </>
                )}
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
            </p>
          </div>


          {/* Quantity and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
              <input
                name="quantity"
                type="number"
                value={form.quantity || 1}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
              <input
                name="price"
                type="number"
                value={form.price || 0}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none"
            >
              {editingId ? '🔄 Update Item' : '✨ Add Item'}
            </button>
            {editingId && (
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default ItemForm;