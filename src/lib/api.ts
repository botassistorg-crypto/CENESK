const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxIavOjm5UQZwDP2EBaPBSURs0LSrSaFJReQM6F5y6r3iO2QOz1UEaulbBX-Ik3mANc/exec";

export interface OrderData {
  customerName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  division: string;
  district: string;
  paymentMethod: string;
  transactionId?: string;
  items: any[];
  total: number;
  deliveryFee: number;
  subtotal: number;
  discount: number;
  notes?: string;
}

// Helper to handle API requests
const fetchFromScript = async (action: string, params: any = {}) => {
  try {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('action', action);
    
    // Append other params for GET requests
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });

    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error (${action}):`, error);
    return null;
  }
};

// --- PUBLIC API ---

export const getProducts = async () => {
  const response = await fetchFromScript('getProducts');
  return response?.data || [];
};

export const getProductById = async (id: string) => {
  const response = await fetchFromScript('getProduct', { id });
  return response?.data || null;
};

export const getCategories = async () => {
  const response = await fetchFromScript('getCategories');
  return response?.data || [];
};

export const submitOrder = async (orderData: OrderData) => {
  try {
    // We use no-cors for POST to avoid CORS issues with Google Apps Script
    // This means we won't get a readable response, but the data is sent.
    const formData = new FormData();
    formData.append('action', 'placeOrder');
    formData.append('data', JSON.stringify(orderData));

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });

    return { success: true };
  } catch (error) {
    console.error("Order submission failed:", error);
    return { success: false, message: "Network error occurred." };
  }
};

// --- ADMIN API ---

export const adminLogin = async (password: string) => {
  const response = await fetchFromScript('adminLogin', { password });
  return response || { success: false, message: "Connection failed" };
};

export const getDashboardStats = async () => {
  const response = await fetchFromScript('getDashboard');
  return response || null;
};

export const getOrders = async () => {
  const response = await fetchFromScript('getOrders');
  return response?.data || [];
};

export const addProduct = async (productData: any) => {
  try {
    const formData = new FormData();
    formData.append('action', 'addProduct');
    formData.append('data', JSON.stringify(productData));

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to add product:", error);
    return { success: false, message: "Network error" };
  }
};

export const uploadImageToImgBB = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    // Use a public key or ask user to provide one. For now, we'll ask the user.
    // Ideally, this should be in an environment variable.
    const apiKey = localStorage.getItem('imgbb_api_key');
    
    if (!apiKey) {
      return { success: false, message: "Please set your ImgBB API Key in Settings first." };
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      return { success: true, url: data.data.url };
    } else {
      return { success: false, message: data.error?.message || "Upload failed" };
    }
  } catch (error) {
    console.error("Image upload failed:", error);
    return { success: false, message: "Network error" };
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const formData = new FormData();
    formData.append('action', 'updateOrderStatus');
    formData.append('data', JSON.stringify({ orderId, status }));

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
