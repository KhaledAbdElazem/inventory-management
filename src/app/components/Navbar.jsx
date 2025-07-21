'use client';
import Link from 'next/link';

const Navbar = () => (
  <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">🛒</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Zema Cashier
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg">
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link href="/sales" className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-lg">
            <span className="text-sm font-medium">Point of Sale</span>
          </Link>
          <Link href="/purchase-orders" className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg shadow-lg">
            <span className="text-sm font-medium">Purchase Orders</span>
          </Link>
          <Link href="/clients" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg shadow-lg">
            <span className="text-sm font-medium">Clients</span>
          </Link>
          <Link href="/New-item" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg shadow-lg">
            <span className="text-sm font-medium">New Item</span>
          </Link>
          <Link href="/reports" className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg shadow-lg">
            <span className="text-sm font-medium">Reports</span>
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
