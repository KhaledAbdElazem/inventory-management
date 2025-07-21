'use client';
import { useState, useEffect } from 'react';
import { useItems } from './hooks/useItems';
import { useRouter } from 'next/navigation';
import { useSales } from './hooks/useSales';
import { useClients } from './hooks/useClients';

const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
  <div className={`bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="text-4xl opacity-80">{icon}</div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.positive ? '↗' : '↘'} {trend.value}
        </span>
        <span className="text-gray-500 text-sm ml-2">from last month</span>
      </div>
    )}
  </div>
);

const InventoryStatusCard = ({ items }) => {
  const availableItems = items.filter(item => item.quantity > 5);
  const lowStockItems = items.filter(item => item.quantity > 0 && item.quantity <= 5);
  const outOfStockItems = items.filter(item => item.quantity === 0);

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        Inventory Status
      </h3>
      
      <div className="space-y-4">
        {/* Available Items */}
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="font-semibold text-green-800">Available</span>
          </div>
          <span className="text-green-600 font-bold text-lg">{availableItems.length}</span>
        </div>
        
        {/* Low Stock Items */}
        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="font-semibold text-yellow-800">Low Stock</span>
          </div>
          <span className="text-yellow-600 font-bold text-lg">{lowStockItems.length}</span>
        </div>
        
        {/* Out of Stock Items */}
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="font-semibold text-red-800">Out of Stock</span>
          </div>
          <span className="text-red-600 font-bold text-lg">{outOfStockItems.length}</span>
        </div>
      </div>
    </div>
  );
};

const RecentActivityCard = ({ items }) => {
  const recentItems = items.slice(0, 5);

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-2xl">🕐</span>
        Recent Activity
      </h3>
      
      <div className="space-y-4">
        {recentItems.map((item, index) => (
          <div key={item._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">
                Added {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">${item.price}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LowStockAlert = ({ items }) => {
  const lowStockItems = items.filter(item => item.quantity <= 5 && item.quantity > 0);
  const outOfStockItems = items.filter(item => item.quantity === 0);

  if (lowStockItems.length === 0 && outOfStockItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-6">
      <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">⚠️</span>
        Stock Alerts
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {outOfStockItems.length > 0 && (
          <div className="bg-white/80 rounded-xl p-4">
            <h4 className="font-semibold text-red-700 mb-2">Out of Stock ({outOfStockItems.length})</h4>
            <div className="space-y-2">
              {outOfStockItems.slice(0, 3).map(item => (
                <div key={item._id} className="text-sm text-red-600">
                  • {item.name}
                </div>
              ))}
              {outOfStockItems.length > 3 && (
                <div className="text-sm text-red-500">
                  +{outOfStockItems.length - 3} more items
                </div>
              )}
            </div>
          </div>
        )}
        
        {lowStockItems.length > 0 && (
          <div className="bg-white/80 rounded-xl p-4">
            <h4 className="font-semibold text-orange-700 mb-2">Low Stock ({lowStockItems.length})</h4>
            <div className="space-y-2">
              {lowStockItems.slice(0, 3).map(item => (
                <div key={item._id} className="text-sm text-orange-600">
                  • {item.name} (Qty: {item.quantity})
                </div>
              ))}
              {lowStockItems.length > 3 && (
                <div className="text-sm text-orange-500">
                  +{lowStockItems.length - 3} more items
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TopItemsChart = ({ items }) => {
  const topItems = items
    .sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price))
    .slice(0, 5);

  const maxValue = Math.max(...topItems.map(item => item.quantity * item.price));

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-2xl">📈</span>
        Top Items by Value
      </h3>
      
      <div className="space-y-4">
        {topItems.map((item, index) => {
          const value = item.quantity * item.price;
          const percentage = (value / maxValue) * 100;
          
          return (
            <div key={item._id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{item.name}</span>
                <span className="text-sm text-gray-600">${value.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const { items, loading: itemsLoading, error, fetchItems } = useItems();
  const { sales, fetchSales } = useSales();
  const { clients, fetchClients } = useClients();
  const router = useRouter();

  useEffect(() => {
    fetchItems();
    fetchSales();
    fetchClients();
  }, []);

  // Calculate statistics
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const averageItemValue = totalItems > 0 ? totalValue / totalItems : 0;
  
  // Sales statistics
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const avgSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  // Client statistics
  const totalClients = clients.length;

  if (itemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-xl text-gray-600">Loading inventory...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header removed as it's now in the layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stock Alerts */}
        <LowStockAlert items={items} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Items"
            value={totalItems}
            subtitle="Different products"
            icon="📦"
            color="hover:shadow-blue-200"
          />
          <StatCard
            title="Inventory Value"
            value={`$${totalValue.toFixed(2)}`}
            subtitle="Stock worth"
            icon="💰"
            color="hover:shadow-yellow-200"
          />
          <StatCard
            title="Total Sales"
            value={totalSales}
            subtitle="Completed orders"
            icon="🛒"
            color="hover:shadow-green-200"
          />
          <StatCard
            title="Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            subtitle="Total earned"
            icon="💵"
            color="hover:shadow-purple-200"
          />
          <StatCard
            title="Clients"
            value={totalClients}
            subtitle="Registered customers"
            icon="👥"
            color="hover:shadow-indigo-200"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <TopItemsChart items={items} />
            <RecentActivityCard items={items} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <InventoryStatusCard items={items} />
            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/sales')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  🛒 Start Sale
                </button>
                <button
                  onClick={() => router.push('/purchase-orders')}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  📦 Order from Dealer
                </button>
                <button
                  onClick={() => router.push('/clients')}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  👥 Manage Clients
                </button>
                <button
                  onClick={() => router.push('/New-item')}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  ➕ Add New Item
                </button>
                <button
                  onClick={() => router.push('/reports')}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  📊 View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardHome;