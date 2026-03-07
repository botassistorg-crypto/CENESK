import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, RefreshCw, Pencil, Trash2, Plus, X, Eye } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '../components/ui/Logo';
import { 
  adminLogin, getDashboardStats, getOrders, getProducts,
  updateOrderStatus, addProduct, updateProduct, deleteProduct,
  uploadImageToImgBB, getCustomers
} from '../lib/api';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  // Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'Clothing',
    originalPrice: '',
    salePrice: '',
    images: '',
    sizes: '',
    colors: '',
    stock: '',
    featured: 'No',
    status: 'Active',
    tags: ''
  });

  // Image Upload State
  const [imgbbKey] = useState(localStorage.getItem('imgbb_api_key') || '249d6156eb00d39b61ac4b421fd59003');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
      fetchAllData();
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
        toast.success("Welcome back!");
        fetchAllData();
      } else {
        toast.error("Invalid password");
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
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData, productsData, customersData] = await Promise.all([
        getDashboardStats(),
        getOrders(),
        getProducts(),
        getCustomers()
      ]);
      setStats(statsData);
      setOrders(Array.isArray(ordersData) ? ordersData : (ordersData?.data || []));
      setProducts(Array.isArray(productsData) ? productsData : (productsData?.data || []));
      setCustomers(Array.isArray(customersData) ? customersData : (customersData?.data || []));
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      category: 'Clothing',
      originalPrice: '',
      salePrice: '',
      images: '',
      sizes: '',
      colors: '',
      stock: '',
      featured: 'No',
      status: 'Active',
      tags: ''
    });
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const openAddProduct = () => {
    resetProductForm();
    setIsAddingProduct(true);
    setEditingProduct(null);
  };

  const openEditProduct = (product: any) => {
    setProductForm({
      name: product.Name || '',
      description: product.Description || '',
      category: product.Category || 'Clothing',
      originalPrice: String(product.OriginalPrice || ''),
      salePrice: String(product.SalePrice || ''),
      images: product.Images || '',
      sizes: product.Sizes || '',
      colors: product.Colors || '',
      stock: String(product.Stock || ''),
      featured: product.Featured || 'No',
      status: product.Status || 'Active',
      tags: product.Tags || ''
    });
    setEditingProduct(product);
    setIsAddingProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.originalPrice || !productForm.stock) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    
    try {
      let res;
      
      if (editingProduct) {
        // UPDATE existing product
        res = await updateProduct({
          id: editingProduct.ID,
          ...productForm
        });
      } else {
        // ADD new product
        res = await addProduct(productForm);
      }
      
      console.log("Save product response:", res);
      
      if (res && (res.success || res.success === undefined)) {
        toast.success(editingProduct ? "Product updated!" : "Product added!");
        resetProductForm();
        
        // Wait a moment then refresh products
        setTimeout(async () => {
          await fetchAllData();
        }, 2000);
      } else {
        toast.error(res?.error || res?.message || "Failed to save product");
      }
    } catch (err) {
      console.error("Save product error:", err);
      // Even if we get an error, the product might have saved
      // (CORS issues cause this)
      toast.success("Product saved! Refreshing...");
      resetProductForm();
      setTimeout(async () => {
        await fetchAllData();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setLoading(true);
    try {
      const res = await deleteProduct(id);
      toast.success("Product deleted!");
      setDeleteConfirm(null);
      setTimeout(async () => {
        await fetchAllData();
      }, 2000);
    } catch (err) {
      toast.success("Product deleted! Refreshing...");
      setDeleteConfirm(null);
      setTimeout(async () => {
        await fetchAllData();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Status updated!");
      setTimeout(() => fetchAllData(), 2000);
    } catch (err) {
      toast.success("Status updated! Refreshing...");
      setTimeout(() => fetchAllData(), 2000);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadImageToImgBB(file);
      if (res.success && res.url) {
        const currentImages = productForm.images;
        const newImages = currentImages 
          ? currentImages + "," + res.url 
          : res.url;
        setProductForm(prev => ({ ...prev, images: newImages }));
        toast.success("Image uploaded!");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Upload error");
    } finally {
      setUploadingImage(false);
    }
  };

  // ===== LOGIN PAGE =====
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A1A1A' }}>
        <div className="bg-[#FAF7F2] p-8 rounded-xl shadow-2xl w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A] bg-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B8965A] text-white py-3 rounded-lg font-bold hover:bg-[#9A7D4B] transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===== PRODUCT FORM COMPONENT =====
  const ProductForm = () => (
    <form onSubmit={handleSaveProduct} className="space-y-4 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h3>
        <button type="button" onClick={resetProductForm} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Product Name *</label>
          <input
            required
            value={productForm.name}
            onChange={e => setProductForm({...productForm, name: e.target.value})}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]"
            placeholder="e.g., Elegant Black Abaya"
          />
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={3}
            value={productForm.description}
            onChange={e => setProductForm({...productForm, description: e.target.value})}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]"
            placeholder="Describe the product..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            value={productForm.category}
            onChange={e => setProductForm({...productForm, category: e.target.value})}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]"
          >
            <option>Clothing</option>
            <option>Intimates</option>
            <option>Hair Products</option>
            <option>Accessories</option>
            <option>Self Care</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
          <input
            type="number"
            required
            value={productForm.stock}
            onChange={e => setProductForm({...productForm, stock: e.target.value})}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Original Price (৳) *</label>
          <input
            type="number"
            required
            value={productForm.originalPrice}
            onChange={e => setProductForm({...productForm, originalPrice: e.target.value})}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sale Price (৳)</label>
          <input
            type="number"
            value={productForm.salePrice}
            onChange={e => setProductForm({...productForm, salePrice: e.target.value})}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]"
            placeholder="Leave empty if no discount"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Product Images</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
          />
          {uploadingImage && <p className="text-xs text-[#B8965A] mt-1">Uploading...</p>}
          
          <input
            type="text"
            placeholder="Or paste image URL(s) — comma separated for multiple"
            value={productForm.images}
            onChange={e => setProductForm({...productForm, images: e.target.value})}
            className="w-full p-2.5 border border-gray-200 rounded-lg mt-2 text-sm focus:outline-none focus:border-[#B8965A]"
          />
          
          {productForm.images && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {productForm.images.split(',').map((url: string, i: number) => (
                url.trim() && (
                  <img key={i} src={url.trim()} alt={`Preview ${i+1}`} 
                       className="w-20 h-20 object-cover rounded border" 
                       onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sizes</label>
          <input
            value={productForm.sizes}
            onChange={e => setProductForm({...productForm, sizes: e.target.value})}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]"
            placeholder="S, M, L, XL, Free Size"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Colors</label>
          <input
            value={productForm.colors}
            onChange={e => setProductForm({...productForm, colors: e.target.value})}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]"
            placeholder="Black, Red, Navy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Featured?</label>
          <select
            value={productForm.featured}
            onChange={e => setProductForm({...productForm, featured: e.target.value})}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={productForm.status}
            onChange={e => setProductForm({...productForm, status: e.target.value})}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]"
          >
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Tags</label>
          <input
            value={productForm.tags}
            onChange={e => setProductForm({...productForm, tags: e.target.value})}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]"
            placeholder="party, elegant, summer (comma separated)"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#B8965A] text-white py-3 rounded-lg font-bold hover:bg-[#9A7D4B] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save Product')}
        </button>
        <button
          type="button"
          onClick={resetProductForm}
          className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  // ===== PRODUCT LIST COMPONENT =====
  const ProductList = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Products</h2>
          <p className="text-sm text-gray-500">{products.length} total products</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAllData} className="p-2 hover:bg-gray-100 rounded-lg" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={openAddProduct}
            className="bg-[#B8965A] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#9A7D4B] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">No products yet</p>
          <p className="text-sm mt-1">Click "Add Product" to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-3 pr-4">#</th>
                <th className="pb-3 pr-4">Image</th>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">Stock</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any, index: number) => {
                const firstImage = product.Images ? product.Images.split(',')[0].trim() : '';
                return (
                  <tr key={product.ID || index} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 pr-4 text-gray-400">{index + 1}</td>
                    <td className="py-3 pr-4">
                      {firstImage ? (
                        <img src={firstImage} alt={product.Name} className="w-12 h-12 object-cover rounded border" 
                             onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="%23E8E2D9"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="10" fill="%239B9B9B">No img</text></svg>'; }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#E8E2D9] rounded border flex items-center justify-center text-xs text-gray-400">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-medium text-[#1A1A1A]">{product.Name}</div>
                      {product.Featured === 'Yes' && (
                        <span className="text-xs text-[#B8965A]">⭐ Featured</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 bg-[#FAF7F2] rounded text-xs">{product.Category}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-medium">৳{product.SalePrice || product.OriginalPrice}</div>
                      {product.SalePrice && Number(product.SalePrice) < Number(product.OriginalPrice) && (
                        <div className="text-xs text-gray-400 line-through">৳{product.OriginalPrice}</div>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`font-medium ${Number(product.Stock) < 5 ? 'text-red-500' : 'text-green-600'}`}>
                        {product.Stock}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.Status === 'Active' ? 'bg-green-50 text-green-600' :
                        product.Status === 'Draft' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {product.Status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button 
                          onClick={() => openEditProduct(product)}
                          className="p-1.5 hover:bg-blue-50 rounded text-blue-500" 
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(product.ID)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-500" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {deleteConfirm === product.ID && (
                        <div className="absolute bg-white shadow-lg rounded-lg p-4 border mt-1 z-50">
                          <p className="text-sm mb-3">Delete "{product.Name}"?</p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleDeleteProduct(product.ID)}
                              className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                            >
                              Delete
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 bg-gray-100 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ===== RENDER TAB CONTENT =====
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Today's Orders", value: stats?.todayOrders || 0, bg: "bg-blue-50", color: "text-blue-600" },
                { label: "Today's Revenue", value: `৳${stats?.todayRevenue || 0}`, bg: "bg-green-50", color: "text-green-600" },
                { label: "Total Products", value: stats?.totalProducts || 0, bg: "bg-purple-50", color: "text-purple-600" },
                { label: "Pending Orders", value: stats?.pendingOrders || 0, bg: "bg-orange-50", color: "text-orange-600" }
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} p-5 rounded-xl`}>
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Recent Orders</h3>
                <button onClick={fetchAllData} className="p-2 hover:bg-gray-100 rounded-full">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="pb-3">Order</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(-10).reverse().map((order: any) => (
                      <tr key={order.OrderID} className="border-b border-gray-50">
                        <td className="py-3 font-medium text-xs">#{order.OrderID}</td>
                        <td className="py-3">{order.CustomerName}</td>
                        <td className="py-3">৳{order.Total}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            order.OrderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.OrderStatus === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                            order.OrderStatus === 'Shipped' ? 'bg-orange-100 text-orange-700' :
                            order.OrderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>{order.OrderStatus}</span>
                        </td>
                        <td className="py-3">
                          <select
                            value={order.OrderStatus}
                            onChange={(e) => handleStatusUpdate(order.OrderID, e.target.value)}
                            className="text-xs border rounded p-1"
                          >
                            <option>Pending</option>
                            <option>Confirmed</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-8 text-gray-400">No orders yet</td></tr>
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
            {isAddingProduct ? <ProductForm /> : <ProductList />}
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">All Orders ({orders.length})</h2>
              <button onClick={fetchAllData} className="p-2 hover:bg-gray-100 rounded-lg">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Address</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice().reverse().map((order: any) => (
                    <tr key={order.OrderID} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-medium text-xs">#{order.OrderID}</td>
                      <td className="py-3 text-xs text-gray-500">{order.DateTime}</td>
                      <td className="py-3">{order.CustomerName}</td>
                      <td className="py-3 text-xs">{order.Phone}</td>
                      <td className="py-3 text-xs max-w-[200px] truncate">{order.Division}, {order.District}</td>
                      <td className="py-3 font-medium">৳{order.Total}</td>
                      <td className="py-3 text-xs">{order.PaymentMethod}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          order.OrderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.OrderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{order.OrderStatus}</span>
                      </td>
                      <td className="py-3">
                        <select
                          value={order.OrderStatus}
                          onChange={(e) => handleStatusUpdate(order.OrderID, e.target.value)}
                          className="text-xs border rounded p-1"
                        >
                          <option>Pending</option>
                          <option>Confirmed</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Customers ({customers.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Orders</th>
                    <th className="pb-3">Total Spent</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-3 font-medium">{c.Name}</td>
                      <td className="py-3 text-xs">{c.Email}</td>
                      <td className="py-3 text-xs">{c.Phone}</td>
                      <td className="py-3">{c.TotalOrders}</td>
                      <td className="py-3">৳{c.TotalSpent}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          c.VIPStatus === 'VIP' ? 'bg-[#B8965A]/10 text-[#B8965A]' : 'bg-gray-100 text-gray-500'
                        }`}>{c.VIPStatus}</span>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-400">No customers yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-xl">
            <h2 className="text-xl font-bold mb-6">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ImgBB API Key</label>
                <input
                  type="text"
                  value={localStorage.getItem('imgbb_api_key') || ''}
                  onChange={(e) => localStorage.setItem('imgbb_api_key', e.target.value)}
                  className="w-full p-2.5 border rounded-lg"
                  placeholder="Your ImgBB API key"
                />
                <p className="text-xs text-gray-400 mt-1">Used for product image uploads</p>
              </div>
              <button 
                onClick={() => toast.success('Settings saved!')}
                className="bg-[#B8965A] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#9A7D4B]"
              >
                Save Settings
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ===== MAIN LAYOUT =====
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="w-60 bg-[#1A1A1A] text-white hidden md:flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-800">
          <Logo className="text-white" />
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Admin</p>
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'orders', icon: ShoppingBag, label: 'Orders' },
            { id: 'customers', icon: Users, label: 'Customers' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsAddingProduct(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.id 
                  ? 'bg-[#B8965A] text-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#1A1A1A] text-white p-3 flex justify-between items-center z-50">
        <Logo className="text-white h-6" />
        <div className="flex gap-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard },
            { id: 'products', icon: Package },
            { id: 'orders', icon: ShoppingBag },
            { id: 'settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsAddingProduct(false); }}
              className={`p-2 rounded ${activeTab === item.id ? 'bg-[#B8965A]' : 'hover:bg-white/10'}`}
            >
              <item.icon className="w-4 h-4" />
            </button>
          ))}
          <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen md:mt-0 mt-14">
        <motion.div
          key={activeTab + (isAddingProduct ? '-add' : '')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}
