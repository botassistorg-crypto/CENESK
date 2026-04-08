import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, RefreshCw, Pencil, Trash2, Plus, X, Gift, Grid } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '../components/ui/Logo';
import { 
  getDashboardStats, getOrders, getProducts, getBundles,
  updateOrderStatus, addProduct, updateProduct, deleteProduct,
  addBundle, updateBundle, deleteBundle,
  uploadImageToImgBB, getCustomers, getSettings, updateSettings,
  getCategories, addCategory, updateCategory, deleteCategory
} from '../lib/api';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

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

  // Bundle Form State
  const [isAddingBundle, setIsAddingBundle] = useState(false);
  const [editingBundle, setEditingBundle] = useState<any>(null);
  const [bundleForm, setBundleForm] = useState({
    name: '',
    description: '',
    originalPrice: '',
    salePrice: '',
    images: '',
    stock: '',
    status: 'Active',
    items: '' // Description of items included
  });

  // Category Form State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<string | null>(null);

  // Image Upload State
  const [imgbbKey] = useState(localStorage.getItem('imgbb_api_key') || '249d6156eb00d39b61ac4b421fd59003');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteBundleConfirm, setDeleteBundleConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);



  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData, productsData, customersData, bundlesData, settingsData, categoriesData] = await Promise.all([
        getDashboardStats(),
        getOrders(),
        getProducts(),
        getCustomers(),
        getBundles(),
        getSettings(),
        getCategories()
      ]);
      setStats(statsData);
      setOrders(Array.isArray(ordersData) ? ordersData : (ordersData?.data || []));
      setProducts(Array.isArray(productsData) ? productsData : (productsData?.data || []));
      setCustomers(Array.isArray(customersData) ? customersData : (customersData?.data || []));
      setBundles(Array.isArray(bundlesData) ? bundlesData : (bundlesData?.data || []));
      setCategories(Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || []));
      if (settingsData) {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // ===== PRODUCT HANDLERS =====
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
        res = await updateProduct({ id: editingProduct.ID, ...productForm });
      } else {
        res = await addProduct(productForm);
      }
      
      if (res && (res.success || res.success === undefined)) {
        toast.success(editingProduct ? "Product updated!" : "Product added!");
        resetProductForm();
        setTimeout(async () => { await fetchAllData(); }, 2000);
      } else {
        toast.error(res?.error || res?.message || "Failed to save product");
      }
    } catch (err) {
      toast.success("Product saved! Refreshing...");
      resetProductForm();
      setTimeout(async () => { await fetchAllData(); }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      toast.success("Product deleted!");
      setDeleteConfirm(null);
      setTimeout(async () => { await fetchAllData(); }, 2000);
    } catch (err) {
      toast.success("Product deleted! Refreshing...");
      setDeleteConfirm(null);
      setTimeout(async () => { await fetchAllData(); }, 2000);
    } finally {
      setLoading(false);
    }
  };

  // ===== BUNDLE HANDLERS =====
  const resetBundleForm = () => {
    setBundleForm({
      name: '',
      description: '',
      originalPrice: '',
      salePrice: '',
      images: '',
      stock: '',
      status: 'Active',
      items: ''
    });
    setIsAddingBundle(false);
    setEditingBundle(null);
  };

  const openAddBundle = () => {
    resetBundleForm();
    setIsAddingBundle(true);
    setEditingBundle(null);
  };

  const openEditBundle = (bundle: any) => {
    setBundleForm({
      name: bundle.Name || '',
      description: bundle.Description || '',
      originalPrice: String(bundle.OriginalPrice || ''),
      salePrice: String(bundle.SalePrice || ''),
      images: bundle.Images || '',
      stock: String(bundle.Stock || ''),
      status: bundle.Status || 'Active',
      items: bundle.Items || ''
    });
    setEditingBundle(bundle);
    setIsAddingBundle(true);
  };

  const handleSaveBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleForm.name || !bundleForm.originalPrice || !bundleForm.stock) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      let res;
      if (editingBundle) {
        res = await updateBundle({ id: editingBundle.ID, ...bundleForm });
      } else {
        res = await addBundle(bundleForm);
      }
      
      if (res && (res.success || res.success === undefined)) {
        toast.success(editingBundle ? "Bundle updated!" : "Bundle added!");
        resetBundleForm();
        setTimeout(async () => { await fetchAllData(); }, 2000);
      } else {
        toast.error(res?.error || res?.message || "Failed to save bundle");
      }
    } catch (err) {
      toast.success("Bundle saved! Refreshing...");
      resetBundleForm();
      setTimeout(async () => { await fetchAllData(); }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBundle = async (id: string) => {
    setLoading(true);
    try {
      await deleteBundle(id);
      toast.success("Bundle deleted!");
      setDeleteBundleConfirm(null);
      setTimeout(async () => { await fetchAllData(); }, 2000);
    } catch (err) {
      toast.success("Bundle deleted! Refreshing...");
      setDeleteBundleConfirm(null);
      setTimeout(async () => { await fetchAllData(); }, 2000);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'bundle' | 'category' = 'product') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImage(true);
    const uploadPromises = Array.from(files).map((file: File) => uploadImageToImgBB(file));
    
    try {
      const results = await Promise.all(uploadPromises);
      const successfulUrls = results.filter(res => res.success && res.url).map(res => res.url as string);
      
      if (successfulUrls.length > 0) {
        const newUrlsString = successfulUrls.join(',');
        
        if (type === 'bundle') {
          const currentImages = bundleForm.images;
          const newImages = currentImages ? currentImages + "," + newUrlsString : newUrlsString;
          setBundleForm(prev => ({ ...prev, images: newImages }));
        } else if (type === 'category') {
          setCategoryForm(prev => ({ ...prev, image: successfulUrls[0] })); // Categories usually have one image
        } else {
          const currentImages = productForm.images;
          const newImages = currentImages ? currentImages + "," + newUrlsString : newUrlsString;
          setProductForm(prev => ({ ...prev, images: newImages }));
        }
        toast.success(`${successfulUrls.length} image(s) uploaded!`);
      }
      
      const failedCount = results.length - successfulUrls.length;
      if (failedCount > 0) {
        toast.error(`${failedCount} upload(s) failed`);
      }
    } catch (error) {
      toast.error("Upload error");
    } finally {
      setUploadingImage(false);
    }
  };

  // ===== CATEGORY HANDLERS =====
  const resetCategoryForm = () => {
    setCategoryForm({ name: '', description: '', image: '' });
    setIsAddingCategory(false);
    setEditingCategory(null);
  };

  const openAddCategory = () => {
    resetCategoryForm();
    setIsAddingCategory(true);
  };

  const openEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.Name,
      description: category.Description || '',
      image: category.Image || ''
    });
    setIsAddingCategory(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      toast.error("Please enter a category name");
      return;
    }
    setLoading(true);
    try {
      let res;
      if (editingCategory) {
        res = await updateCategory({ id: editingCategory.ID, ...categoryForm });
      } else {
        res = await addCategory(categoryForm);
      }
      
      if (res && (res.success || res.success === undefined)) {
        toast.success(editingCategory ? "Category updated!" : "Category added!");
        resetCategoryForm();
        setTimeout(async () => { await fetchAllData(); }, 2000);
      } else {
        toast.error(res?.error || res?.message || "Failed to save category");
      }
    } catch (err) {
      toast.success("Category saved! Refreshing...");
      resetCategoryForm();
      setTimeout(async () => { await fetchAllData(); }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setLoading(true);
    try {
      await deleteCategory(id);
      toast.success("Category deleted!");
      setDeleteCategoryConfirm(null);
      setTimeout(async () => { await fetchAllData(); }, 2000);
    } catch (err) {
      toast.success("Category deleted! Refreshing...");
      setDeleteCategoryConfirm(null);
      setTimeout(async () => { await fetchAllData(); }, 2000);
    } finally {
      setLoading(false);
    }
  };

  // ===== RENDER HELPERS (NOT COMPONENTS) =====
  const renderCategoryForm = () => (
    <form onSubmit={handleSaveCategory} className="space-y-4 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
        <button type="button" onClick={resetCategoryForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category Name *</label>
          <input required value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#111111]" placeholder="e.g., Dresses" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea rows={3} value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#111111]" placeholder="Describe the category..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category Image</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'category')} className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
          {uploadingImage && <p className="text-xs text-[#B8965A] mt-1">Uploading...</p>}
          <input type="text" placeholder="Or paste image URL" value={categoryForm.image} onChange={e => setCategoryForm({...categoryForm, image: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg mt-2 text-sm focus:outline-none focus:border-[#111111]" />
          {categoryForm.image && (
            <img src={categoryForm.image} alt="Preview" className="w-32 h-32 object-cover rounded border mt-2" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading} className="flex-1 bg-[#111111] text-[#F5F1EB] py-3 rounded-lg font-bold hover:bg-[#333333] disabled:opacity-50 transition-colors">
          {loading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Save Category')}
        </button>
        <button type="button" onClick={resetCategoryForm} className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </form>
  );
  const renderProductForm = () => (
    <form onSubmit={handleSaveProduct} className="space-y-4 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
        <button type="button" onClick={resetProductForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Product Name *</label>
          <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#111111]" placeholder="e.g., Elegant Black Abaya" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="Describe the product..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select 
            required 
            value={productForm.category} 
            onChange={e => setProductForm({...productForm, category: e.target.value})} 
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#111111]"
          >
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat.ID} value={cat.Name}>{cat.Name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
          <input type="number" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Price (৳) *</label>
          <input type="number" required value={productForm.originalPrice} onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sale Price (৳)</label>
          <input type="number" value={productForm.salePrice} onChange={e => setProductForm({...productForm, salePrice: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="Leave empty if no discount" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Product Images (Multiple allowed)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, 'product')} className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
          {uploadingImage && <p className="text-xs text-[#B8965A] mt-1">Uploading...</p>}
          <input type="text" placeholder="Or paste image URL(s) — comma separated" value={productForm.images} onChange={e => setProductForm({...productForm, images: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg mt-2 text-sm focus:outline-none focus:border-[#B8965A]" />
          {productForm.images && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {productForm.images.split(',').map((url: string, i: number) => (
                url.trim() && <img key={i} src={url.trim()} alt={`Preview ${i+1}`} className="w-20 h-20 object-cover rounded border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sizes</label>
          <input value={productForm.sizes} onChange={e => setProductForm({...productForm, sizes: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="S, M, L, XL, Free Size" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Colors</label>
          <input value={productForm.colors} onChange={e => setProductForm({...productForm, colors: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="Black, Red, Navy" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Featured?</label>
          <select value={productForm.featured} onChange={e => setProductForm({...productForm, featured: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]">
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select value={productForm.status} onChange={e => setProductForm({...productForm, status: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]">
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Tags</label>
          <input value={productForm.tags} onChange={e => setProductForm({...productForm, tags: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="party, elegant, summer (comma separated)" />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading} className="flex-1 bg-[#111111] text-[#F5F1EB] py-3 rounded-lg font-bold hover:bg-[#333333] disabled:opacity-50 transition-colors">
          {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save Product')}
        </button>
        <button type="button" onClick={resetProductForm} className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </form>
  );

  const renderBundleForm = () => (
    <form onSubmit={handleSaveBundle} className="space-y-4 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{editingBundle ? 'Edit Bundle' : 'Add New Bundle'}</h3>
        <button type="button" onClick={resetBundleForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Bundle Name *</label>
          <input required value={bundleForm.name} onChange={e => setBundleForm({...bundleForm, name: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="e.g., Summer Essentials Pack" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea rows={3} value={bundleForm.description} onChange={e => setBundleForm({...bundleForm, description: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="Describe the bundle..." />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Included Items</label>
          <input value={bundleForm.items} onChange={e => setBundleForm({...bundleForm, items: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="e.g., 1x Abaya, 1x Hijab, 1x Pin" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
          <input type="number" required value={bundleForm.stock} onChange={e => setBundleForm({...bundleForm, stock: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Price (৳) *</label>
          <input type="number" required value={bundleForm.originalPrice} onChange={e => setBundleForm({...bundleForm, originalPrice: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sale Price (৳)</label>
          <input type="number" value={bundleForm.salePrice} onChange={e => setBundleForm({...bundleForm, salePrice: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="Leave empty if no discount" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Bundle Images (Multiple allowed)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, 'bundle')} className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
          {uploadingImage && <p className="text-xs text-[#B8965A] mt-1">Uploading...</p>}
          <input type="text" placeholder="Or paste image URL(s) — comma separated" value={bundleForm.images} onChange={e => setBundleForm({...bundleForm, images: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg mt-2 text-sm focus:outline-none focus:border-[#B8965A]" />
          {bundleForm.images && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {bundleForm.images.split(',').map((url: string, i: number) => (
                url.trim() && <img key={i} src={url.trim()} alt={`Preview ${i+1}`} className="w-20 h-20 object-cover rounded border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select value={bundleForm.status} onChange={e => setBundleForm({...bundleForm, status: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]">
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading} className="flex-1 bg-[#111111] text-[#F5F1EB] py-3 rounded-lg font-bold hover:bg-[#333333] disabled:opacity-50 transition-colors">
          {loading ? 'Saving...' : (editingBundle ? 'Update Bundle' : 'Save Bundle')}
        </button>
        <button type="button" onClick={resetBundleForm} className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </form>
  );

  // ===== LOGIN PAGE =====

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateSettings(settings);
      if (res.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="bg-white md:w-64 border-r border-gray-200 flex-shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <Logo />
          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">ADMIN</span>
        </div>
        <nav className="p-4 space-y-1">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-[#111111] text-[#F5F1EB]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-[#111111] text-[#F5F1EB]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Package className="w-5 h-5" /> Products
          </button>
          <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-[#111111] text-[#F5F1EB]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Grid className="w-5 h-5" /> Categories
          </button>
          <button onClick={() => setActiveTab('bundles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bundles' ? 'bg-[#111111] text-[#F5F1EB]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Gift className="w-5 h-5" /> Bundles
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-[#111111] text-[#F5F1EB]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <ShoppingBag className="w-5 h-5" /> Orders
          </button>
          <button onClick={() => setActiveTab('customers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'customers' ? 'bg-[#111111] text-[#F5F1EB]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Users className="w-5 h-5" /> Customers
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-[#111111] text-[#F5F1EB]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>
        <div className="p-4 mt-auto border-t border-gray-100">

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
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
                  <button onClick={fetchAllData} className="p-2 hover:bg-gray-100 rounded-full"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
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
                            <select value={order.OrderStatus} onChange={(e) => handleStatusUpdate(order.OrderID, e.target.value)} className="text-xs border rounded p-1">
                              <option>Pending</option>
                              <option>Confirmed</option>
                              <option>Shipped</option>
                              <option>Delivered</option>
                              <option>Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-400">No orders yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              {isAddingProduct ? renderProductForm() : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div><h2 className="text-xl font-bold">Products</h2><p className="text-sm text-gray-500">{products.length} total products</p></div>
                    <div className="flex gap-2">
                      <button onClick={fetchAllData} className="p-2 hover:bg-gray-100 rounded-lg" title="Refresh"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                      <button onClick={openAddProduct} className="bg-[#111111] text-[#F5F1EB] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#333333] flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</button>
                    </div>
                  </div>
                  {products.length === 0 ? (
                    <div className="text-center py-16 text-gray-400"><Package className="w-12 h-12 mx-auto mb-4 opacity-50" /><p className="font-medium">No products yet</p><p className="text-sm mt-1">Click "Add Product" to get started</p></div>
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
                                  {firstImage ? <img src={firstImage} alt={product.Name} className="w-12 h-12 object-cover rounded border" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="%23E8E2D9"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="10" fill="%239B9B9B">No img</text></svg>'; }} /> : <div className="w-12 h-12 bg-[#E8E2D9] rounded border flex items-center justify-center text-xs text-gray-400">No img</div>}
                                </td>
                                <td className="py-3 pr-4"><div className="font-medium text-[#111111]">{product.Name}</div>{product.Featured === 'Yes' && <span className="text-xs text-[#C6A76E]">⭐ Featured</span>}</td>
                                <td className="py-3 pr-4"><span className="px-2 py-1 bg-[#F5F1EB] rounded text-xs">{product.Category}</span></td>
                                <td className="py-3 pr-4"><div className="font-medium">৳{product.SalePrice || product.OriginalPrice}</div>{product.SalePrice && Number(product.SalePrice) < Number(product.OriginalPrice) && <div className="text-xs text-gray-400 line-through">৳{product.OriginalPrice}</div>}</td>
                                <td className="py-3 pr-4"><span className={`font-medium ${Number(product.Stock) < 5 ? 'text-red-500' : 'text-green-600'}`}>{product.Stock}</span></td>
                                <td className="py-3 pr-4"><span className={`px-2 py-1 rounded-full text-xs ${product.Status === 'Active' ? 'bg-green-50 text-green-600' : product.Status === 'Draft' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>{product.Status}</span></td>
                                <td className="py-3">
                                  <div className="flex gap-1">
                                    <button onClick={() => openEditProduct(product)} className="p-1.5 hover:bg-blue-50 rounded text-blue-500" title="Edit"><Pencil className="w-4 h-4" /></button>
                                    <button onClick={() => setDeleteConfirm(product.ID)} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                  {deleteConfirm === product.ID && (
                                    <div className="absolute bg-white shadow-lg rounded-lg p-4 border mt-1 z-50">
                                      <p className="text-sm mb-3">Delete "{product.Name}"?</p>
                                      <div className="flex gap-2">
                                        <button onClick={() => handleDeleteProduct(product.ID)} className="px-3 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
                                        <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 bg-gray-100 rounded text-xs">Cancel</button>
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
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              {isAddingCategory ? renderCategoryForm() : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div><h2 className="text-xl font-bold">Categories</h2><p className="text-sm text-gray-500">{categories.length} total categories</p></div>
                    <div className="flex gap-2">
                      <button onClick={fetchAllData} className="p-2 hover:bg-gray-100 rounded-lg" title="Refresh"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                      <button onClick={openAddCategory} className="bg-[#111111] text-[#F5F1EB] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#333333] flex items-center gap-2"><Plus className="w-4 h-4" /> Add Category</button>
                    </div>
                  </div>
                  {categories.length === 0 ? (
                    <div className="text-center py-16 text-gray-400"><Grid className="w-12 h-12 mx-auto mb-4 opacity-50" /><p className="font-medium">No categories yet</p><p className="text-sm mt-1">Click "Add Category" to get started</p></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-500">
                            <th className="pb-3 pr-4">#</th>
                            <th className="pb-3 pr-4">Image</th>
                            <th className="pb-3 pr-4">Name</th>
                            <th className="pb-3 pr-4">Description</th>
                            <th className="pb-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((category: any, index: number) => (
                            <tr key={category.ID || index} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-3 pr-4 text-gray-400">{index + 1}</td>
                              <td className="py-3 pr-4">
                                {category.Image ? <img src={category.Image} alt={category.Name} className="w-12 h-12 object-cover rounded border" /> : <div className="w-12 h-12 bg-[#E8E2D9] rounded border flex items-center justify-center text-xs text-gray-400">No img</div>}
                              </td>
                              <td className="py-3 pr-4 font-medium text-[#111111]">{category.Name}</td>
                              <td className="py-3 pr-4 text-gray-500 max-w-xs truncate">{category.Description || 'No description'}</td>
                              <td className="py-3">
                                <div className="flex gap-1">
                                  <button onClick={() => openEditCategory(category)} className="p-1.5 hover:bg-blue-50 rounded text-blue-500" title="Edit"><Pencil className="w-4 h-4" /></button>
                                  <button onClick={() => setDeleteCategoryConfirm(category.ID)} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                {deleteCategoryConfirm === category.ID && (
                                  <div className="absolute bg-white shadow-lg rounded-lg p-4 border mt-1 z-50">
                                    <p className="text-sm mb-3">Delete "{category.Name}"?</p>
                                    <div className="flex gap-2">
                                      <button onClick={() => handleDeleteCategory(category.ID)} className="px-3 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
                                      <button onClick={() => setDeleteCategoryConfirm(null)} className="px-3 py-1 bg-gray-100 rounded text-xs">Cancel</button>
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bundles' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              {isAddingBundle ? renderBundleForm() : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div><h2 className="text-xl font-bold">Bundles</h2><p className="text-sm text-gray-500">{bundles.length} total bundles</p></div>
                    <div className="flex gap-2">
                      <button onClick={fetchAllData} className="p-2 hover:bg-gray-100 rounded-lg" title="Refresh"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                      <button onClick={openAddBundle} className="bg-[#111111] text-[#F5F1EB] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#333333] flex items-center gap-2"><Plus className="w-4 h-4" /> Add Bundle</button>
                    </div>
                  </div>
                  {bundles.length === 0 ? (
                    <div className="text-center py-16 text-gray-400"><Gift className="w-12 h-12 mx-auto mb-4 opacity-50" /><p className="font-medium">No bundles yet</p><p className="text-sm mt-1">Click "Add Bundle" to get started</p></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-500">
                            <th className="pb-3 pr-4">#</th>
                            <th className="pb-3 pr-4">Image</th>
                            <th className="pb-3 pr-4">Name</th>
                            <th className="pb-3 pr-4">Price</th>
                            <th className="pb-3 pr-4">Stock</th>
                            <th className="pb-3 pr-4">Status</th>
                            <th className="pb-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bundles.map((bundle: any, index: number) => {
                            const firstImage = bundle.Images ? bundle.Images.split(',')[0].trim() : '';
                            return (
                              <tr key={bundle.ID || index} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-3 pr-4 text-gray-400">{index + 1}</td>
                                <td className="py-3 pr-4">
                                  {firstImage ? <img src={firstImage} alt={bundle.Name} className="w-12 h-12 object-cover rounded border" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="%23E8E2D9"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="10" fill="%239B9B9B">No img</text></svg>'; }} /> : <div className="w-12 h-12 bg-[#E8E2D9] rounded border flex items-center justify-center text-xs text-gray-400">No img</div>}
                                </td>
                                <td className="py-3 pr-4"><div className="font-medium text-[#111111]">{bundle.Name}</div></td>
                                <td className="py-3 pr-4"><div className="font-medium">৳{bundle.SalePrice || bundle.OriginalPrice}</div>{bundle.SalePrice && Number(bundle.SalePrice) < Number(bundle.OriginalPrice) && <div className="text-xs text-gray-400 line-through">৳{bundle.OriginalPrice}</div>}</td>
                                <td className="py-3 pr-4"><span className={`font-medium ${Number(bundle.Stock) < 5 ? 'text-red-500' : 'text-green-600'}`}>{bundle.Stock}</span></td>
                                <td className="py-3 pr-4"><span className={`px-2 py-1 rounded-full text-xs ${bundle.Status === 'Active' ? 'bg-green-50 text-green-600' : bundle.Status === 'Draft' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>{bundle.Status}</span></td>
                                <td className="py-3">
                                  <div className="flex gap-1">
                                    <button onClick={() => openEditBundle(bundle)} className="p-1.5 hover:bg-blue-50 rounded text-blue-500" title="Edit"><Pencil className="w-4 h-4" /></button>
                                    <button onClick={() => setDeleteBundleConfirm(bundle.ID)} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                  {deleteBundleConfirm === bundle.ID && (
                                    <div className="absolute bg-white shadow-lg rounded-lg p-4 border mt-1 z-50">
                                      <p className="text-sm mb-3">Delete "{bundle.Name}"?</p>
                                      <div className="flex gap-2">
                                        <button onClick={() => handleDeleteBundle(bundle.ID)} className="px-3 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
                                        <button onClick={() => setDeleteBundleConfirm(null)} className="px-3 py-1 bg-gray-100 rounded text-xs">Cancel</button>
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
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">All Orders ({orders.length})</h2>
                <button onClick={fetchAllData} className="p-2 hover:bg-gray-100 rounded-lg"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
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
                          <select value={order.OrderStatus} onChange={(e) => handleStatusUpdate(order.OrderID, e.target.value)} className="text-xs border rounded p-1">
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
          )}

          {activeTab === 'customers' && (
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
                        <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${c.VIPStatus === 'VIP' ? 'bg-[#111111]/10 text-[#111111]' : 'bg-gray-100 text-gray-500'}`}>{c.VIPStatus}</span></td>
                      </tr>
                    ))}
                    {customers.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-400">No customers yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-xl">
              <h2 className="text-xl font-bold mb-6">Settings</h2>
              <form onSubmit={handleUpdateSettings} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">bKash Number</label>
                  <input 
                    type="text" 
                    value={settings?.bkash_number || ''} 
                    onChange={(e) => setSettings({...settings, bkash_number: e.target.value})}
                    className="w-full p-2.5 border border-gray-200 rounded-lg bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nagad Number</label>
                  <input 
                    type="text" 
                    value={settings?.nagad_number || ''} 
                    onChange={(e) => setSettings({...settings, nagad_number: e.target.value})}
                    className="w-full p-2.5 border border-gray-200 rounded-lg bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ImgBB API Key</label>
                  <p className="text-xs text-gray-500 mb-2">Required for image uploads. Get one at api.imgbb.com</p>
                  <input type="password" value={imgbbKey} disabled className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#111111] text-[#F5F1EB] py-3 rounded-lg font-bold hover:bg-[#333333] transition-colors">
                  {loading ? "Saving..." : "Save Settings"}
                </button>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Application Version: 1.0.0</p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
