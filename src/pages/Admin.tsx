import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '../components/ui/Logo';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'cenesk2024') {
      setIsAuthenticated(true);
      toast.success("Welcome back, Admin!");
    } else {
      toast.error("Invalid password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Logo className="text-[#1A1A1A]" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-center mb-6 text-[#1A1A1A]">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]"
            />
            <button
              type="submit"
              className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:bg-[#333] transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Today's Orders", value: "12", color: "bg-blue-50 text-blue-600" },
              { label: "Today's Revenue", value: "৳24,500", color: "bg-green-50 text-green-600" },
              { label: "Total Products", value: "45", color: "bg-purple-50 text-purple-600" },
              { label: "Total Customers", value: "1,204", color: "bg-orange-50 text-orange-600" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
              </div>
            ))}
            
            <div className="col-span-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
              <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-sm">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                        <td className="py-3 font-medium">#CENESK-{1000 + i}</td>
                        <td className="py-3">Customer {i}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            i === 1 ? 'bg-yellow-100 text-yellow-700' : 
                            i === 2 ? 'bg-blue-100 text-blue-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {i === 1 ? 'Pending' : i === 2 ? 'Shipped' : 'Delivered'}
                          </span>
                        </td>
                        <td className="py-3">৳{1500 * i}</td>
                        <td className="py-3 text-gray-500">Oct {10 + i}, 2024</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Products</h2>
              <button className="bg-[#B8965A] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#9A7D4B]">
                + Add New Product
              </button>
            </div>
            <p className="text-gray-500 text-center py-10">Product management interface would go here.</p>
          </div>
        );
      default:
        return <div className="text-center py-20 text-gray-500">Select a tab from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6">
          <Logo className="text-white mb-2" />
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'orders', icon: ShoppingBag, label: 'Orders' },
            { id: 'customers', icon: Users, label: 'Customers' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id ? 'bg-[#B8965A] text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-8 md:hidden">
          <div className="flex items-center gap-2">
            <Logo className="h-8 text-[#1A1A1A]" />
            <span className="text-xl font-serif font-bold text-[#1A1A1A]">Admin</span>
          </div>
          <button onClick={() => setIsAuthenticated(false)}><LogOut className="w-5 h-5" /></button>
        </header>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}
