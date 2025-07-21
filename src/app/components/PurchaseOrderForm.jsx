import { useState, useEffect } from 'react';

const PurchaseOrderForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    dealerName: '',
    dealerContact: '',
    dealerEmail: '',
    items: [{ itemName: '', itemBarcode: '', quantity: 0, unitCost: 0, sellingPrice: 0 }],
    tax: 0,
    shippingCost: 0,
    expectedDeliveryDate: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        dealerName: initialData.dealerName,
        dealerContact: initialData.dealerContact,
        dealerEmail: initialData.dealerEmail,
        items: initialData.items.map(item => ({
          itemName: item.itemName,
          itemBarcode: item.itemBarcode,
          quantity: item.quantity,
          unitCost: item.unitCost,
          sellingPrice: item.sellingPrice,
        })),
        tax: initialData.tax,
        shippingCost: initialData.shippingCost,
        expectedDeliveryDate: initialData.expectedDeliveryDate,
        notes: initialData.notes,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = formData.items.map((item, i) => i === index ? { ...item, [name]: value } : item);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleItemAdd = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemName: '', itemBarcode: '', quantity: 0, unitCost: 0, sellingPrice: 0 }]
    }));
  };

  const handleItemRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      items: formData.items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
        sellingPrice: Number(item.sellingPrice),
      })),
      tax: Number(formData.tax),
      shippingCost: Number(formData.shippingCost),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dealer Name</label>
          <input type="text" name="dealerName" value={formData.dealerName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring focus:ring-indigo-500/50" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dealer Contact</label>
          <input type="text" name="dealerContact" value={formData.dealerContact} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring focus:ring-indigo-500/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dealer Email</label>
          <input type="email" name="dealerEmail" value={formData.dealerEmail} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring focus:ring-indigo-500/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date</label>
          <input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring focus:ring-indigo-500/50" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
          <button type="button" onClick={handleItemAdd} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
            Add Item
          </button>
        </div>
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3">
              <input type="text" name="itemName" value={item.itemName} onChange={(e) => handleItemChange(index, e)} placeholder="Item Name" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring focus:ring-indigo-500/50" required />
            </div>
            <div className="col-span-2">
              <input type="text" name="itemBarcode" value={item.itemBarcode} onChange={(e) => handleItemChange(index, e)} placeholder="Barcode" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring focus:ring-indigo-500/50" required />
            </div>
            <div className="col-span-2">
              <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} placeholder="Quantity" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring focus:ring-indigo-500/50" min="1" required />
            </div>
            <div className="col-span-2">
              <input type="number" name="unitCost" value={item.unitCost} onChange={(e) => handleItemChange(index, e)} placeholder="Unit Cost" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring focus:ring-indigo-500/50" step="0.01" min="0" required />
            </div>
            <div className="col-span-2">
              <input type="number" name="sellingPrice" value={item.sellingPrice} onChange={(e) => handleItemChange(index, e)} placeholder="Selling Price" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring focus:ring-indigo-500/50" step="0.01" min="0" required />
            </div>
            <div className="col-span-1 flex justify-center">
              <button type="button" onClick={() => handleItemRemove(index)} className="text-red-500 hover:text-red-700">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tax</label>
          <input type="number" name="tax" value={formData.tax} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring focus:ring-indigo-500/50" step="0.01" min="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost</label>
          <input type="number" name="shippingCost" value={formData.shippingCost} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring focus:ring-indigo-500/50" step="0.01" min="0" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring focus:ring-indigo-500/50" rows="3"></textarea>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} disabled={loading} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300">
          {loading ? 'Saving...' : (initialData ? 'Update Order' : 'Create Order')}
        </button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
