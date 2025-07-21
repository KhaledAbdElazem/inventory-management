'use client';
import { useState, useEffect } from 'react';
import { useItems } from '../hooks/useItems';
import { useClients } from '../hooks/useClients';
import { useSales } from '../hooks/useSales';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SalesPage = () => {
  const { items, fetchItems } = useItems();
  const { clients, fetchClients } = useClients();
  const { createSale, loading } = useSales();

  // Cart state
  const [cart, setCart] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState('');
  const [showClientForm, setShowClientForm] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchClients();
  }, []);

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.barcode.includes(searchTerm)
  );

  // Add item to cart
  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      if (existingItem.quantity < item.quantity) {
        setCart(cart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ));
      } else {
        alert(`Not enough stock! Available: ${item.quantity}`);
      }
    } else {
      if (item.quantity > 0) {
        setCart([...cart, { ...item, quantity: 1 }]);
      } else {
        alert('Item is out of stock!');
      }
    }
  };

  // Update cart item quantity
  const updateCartQuantity = (itemId, newQuantity) => {
    const item = items.find(i => i._id === itemId);
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else if (newQuantity <= item.quantity) {
      setCart(cart.map(cartItem =>
        cartItem._id === itemId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      ));
    } else {
      alert(`Not enough stock! Available: ${item.quantity}`);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter(cartItem => cartItem._id !== itemId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setSelectedClient('');
    setDiscount(0);
    setTax(0);
    setNotes('');
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + tax - discount;

  // Process sale
  const processSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (!selectedClient) {
      alert('Please select a client!');
      return;
    }

    try {
      const saleData = {
        clientId: selectedClient,
        items: cart.map(item => ({
          itemId: item._id,
          quantity: item.quantity
        })),
        tax,
        discount,
        paymentMethod,
        notes
      };

      await createSale(saleData);
      
      // Refresh items to update stock
      await fetchItems();
      await fetchClients();
      
      // Clear cart
      clearCart();
      
      alert('Sale processed successfully!');
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Error processing sale. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">🛒</span>
            Point of Sale
          </h1>
          <p className="mt-2 text-gray-600">Process customer sales and transactions</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Items */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items by name or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/90 backdrop-blur-xl"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-xl">🔍</span>
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Available Items</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredItems.map(item => (
                  <div
                    key={item._id}
                    className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                      item.quantity === 0
                        ? 'bg-red-50 border-red-200 opacity-50'
                        : 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'
                    }`}
                    onClick={() => item.quantity > 0 && addToCart(item)}
                  >
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">#{item.barcode}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-lg font-bold text-indigo-600">${item.price}</span>
                      <span className={`text-sm ${item.quantity === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        Stock: {item.quantity}
                      </span>
                    </div>
                    {item.quantity === 0 && (
                      <p className="text-red-500 text-xs mt-1">Out of Stock</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Cart & Checkout */}
          <div className="space-y-6">
            {/* Client Selection */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Client</h3>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Choose a client...</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.name} {client.email && `(${client.email})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Cart */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Shopping Cart</h3>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">${item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals & Payment */}
            {cart.length > 0 && (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Details</h3>
                
                {/* Payment Method */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Discount and Tax */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount ($)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax ($)</label>
                    <input
                      type="number"
                      value={tax}
                      onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows="2"
                    placeholder="Additional notes..."
                  />
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tax:</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Process Sale Button */}
                <button
                  onClick={processSale}
                  disabled={loading || !selectedClient || cart.length === 0}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Processing...' : `Process Sale - $${total.toFixed(2)}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
