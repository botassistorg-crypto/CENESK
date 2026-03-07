import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '../components/ui/Logo';
import { adminLogin, getDashboardStats, getOrders, updateOrderStatus, addProduct, uploadImageToImgBB } from '../lib/api';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  // Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Clothing',
    originalPrice: '',
    salePrice: '',
    images: '',
    stock: '',
    featured: 'No',
    status: 'Active'
  });

  // Image Upload State
  const [imgbbKey, setImgbbKey] = useState(localStorage.getItem('imgbb_api_key') || '249d6156eb00d39b61ac4b421fd59003');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem('admin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }

    // Auto-save the key if it's the default one provided
    if (!localStorage.getItem('imgbb_api_key')) {
      localStorage.setItem('imgbb_api_key', '249d6156eb00d39b61ac4b421fd59003');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLogin(password);
      if (res.success) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_session', 'true');
        toast.success("Welcome back, Admin!");
        fetchData();
      } else {
        toast.error(res.message || "Invalid password");
      }
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_session');
    toast.success("Logged out successfully");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData] = await Promise.all([
        getDashboardStats(),
        getOrders()
      ]);
      setStats(statsData);
      setOrders(ordersData || []);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    toast.promise(updateOrderStatus(orderId, newStatus), {
      loading: 'Updating status...',
      success: () => {
        fetchData(); // Refresh data
        return 'Order status updated';
      },
      error: 'Failed to update status'
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await addProduct(newProduct);
      if (res.success) {
        toast.success("Product added successfully!");
        setIsAddingProduct(false);
        setNewProduct({
          name: '',
          description: '',
          category: 'Clothing',
          originalPrice: '',
          salePrice: '',
          images: '',
          stock: '',
          featured: 'No',
          status: 'Active'
        });
        fetchData(); // Refresh stats
      } else {
        toast.error("Failed to add product");
      }
    } catch (err) {
      toast.error("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!imgbbKey) {
      toast.error("Please set your ImgBB API Key in Settings tab first!");
      setActiveTab('settings');
      return;
    }

    setUploadingImage(true);
    try {
      const res = await uploadImageToImgBB(file);
      if (res.success && res.url) {
        setNewProduct(prev => ({ ...prev, images: res.url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch (error) {
      toast.error("Upload error");
    } finally {
      setUploadingImage(false);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('imgbb_api_key', imgbbKey);
    toast.success("Settings saved!");
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
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login"}
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
              { label: "Today's Orders", value: stats?.todayOrders || 0, color: "bg-blue-50 text-blue-600" },
              { label: "Today's Revenue", value: `৳${stats?.todayRevenue || 0}`, color: "bg-green-50 text-green-600" },
              { label: "Total Products", value: stats?.totalProducts || 0, color: "bg-purple-50 text-purple-600" },
              { label: "Total Customers", value: stats?.totalCustomers || 0, color: "bg-orange-50 text-orange-600" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
              </div>
            ))}
            
            <div className="col-span-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Recent Orders</h3>
                <button onClick={fetchData} className="p-2 hover:bg-gray-100 rounded-full">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-sm">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {orders.slice(0, 10).map((order: any) => (
                      <tr key={order.OrderID} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                        <td className="py-3 font-medium">#{order.OrderID}</td>
                        <td className="py-3">
                          <div className="font-medium">{order.CustomerName}</div>
                          <div className="text-xs text-gray-400">{order.Phone}</div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.OrderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                            order.OrderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                            order.OrderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.OrderStatus}
                          </span>
                        </td>
                        <td className="py-3">৳{order.Total}</td>
                        <td className="py-3 text-gray-500">{new Date(order.DateTime).toLocaleDateString()}</td>
                        <td className="py-3">
                          <select 
                            value={order.OrderStatus}
                            onChange={(e) => handleStatusUpdate(order.OrderID, e.target.value)}
                            className="text-xs border rounded p-1"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">No orders found</td>
                      </tr>
                    )}
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
              <button 
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="bg-[#B8965A] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#9A7D4B]"
              >
                {isAddingProduct ? 'Cancel' : '+ Add New Product'}
              </button>
            </div>

            {isAddingProduct ? (
              <form onSubmit={handleAddProduct} className="space-y-4 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                      required
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option>Clothing</option>
                      <option>Intimates</option>
                      <option>Hair Products</option>
                      <option>Accessories</option>
                      <option>Self Care</option>
                      <option>Bundles & Offers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Original Price (৳)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.originalPrice}
                      onChange={e => setNewProduct({...newProduct, originalPrice: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Sale Price (৳) (Optional)</label>
                    <input
                      type="number"
                      value={newProduct.salePrice}
                      onChange={e => setNewProduct({...newProduct, salePrice: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Product Image</label>
                    
                    <div className="flex gap-4 items-start">
                      <div className="flex-1">
                         <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full p-2 border rounded text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#B8965A]/10 file:text-[#B8965A] hover:file:bg-[#B8965A]/20"
                        />
                        {uploadingImage && <p className="text-xs text-[#B8965A] mt-1">Uploading image...</p>}
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Or paste URL directly:</p>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={newProduct.images}
                        onChange={e => setNewProduct({...newProduct, images: e.target.value})}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>

                    {newProduct.images && (
                      <div className="mt-4">
                        <p className="text-xs font-medium mb-2">Preview:</p>
                        <img src={newProduct.images} alt="Preview" className="w-32 h-32 object-cover rounded border" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Featured?</label>
                    <select
                      value={newProduct.featured}
                      onChange={e => setNewProduct({...newProduct, featured: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={newProduct.status}
                      onChange={e => setNewProduct({...newProduct, status: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1A1A] text-white py-3 rounded font-bold hover:bg-[#333] disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Product'}
                </button>
              </form>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>Click "Add New Product" to add items to your store.</p>
                <p className="text-sm mt-2">Products added here will instantly appear on your website.</p>
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Admin Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ImgBB API Key (for Image Uploads)</label>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    value={imgbbKey}
                    onChange={(e) => setImgbbKey(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Paste your API key here"
                  />
                  <button 
                    onClick={saveSettings}
                    className="bg-[#1A1A1A] text-white px-4 py-2 rounded font-bold hover:bg-[#333]"
                  >
                    Save
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  To enable image uploads:
                  <br/>1. Go to <a href="https://api.imgbb.com/" target="_blank" rel="noreferrer" className="text-blue-600 underline">api.imgbb.com</a>
                  <br/>2. Sign up / Login (It's free)
                  <br/>3. Click "Get API Key"
                  <br/>4. Copy and paste it here.
                </p>
              </div>
            </div>
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
            onClick={handleLogout}
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
          <button onClick={handleLogout}><LogOut className="w-5 h-5" /></button>
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
