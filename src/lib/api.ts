const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx8EmNERNn7BChL0qxpTlHenoVw9krZ7ZmYl0YlVeZXoscctrR61ExLCA6KvJnh12Gy/exec";

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
  senderNumber?: string;
}

// Helper for GET requests
const fetchGet = async (action: string, params: any = {}) => {
  try {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('action', action);
    
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

// Helper for POST requests
const fetchPost = async (action: string, data: any) => {
  try {
    const response = await fetch(
      `${GOOGLE_SCRIPT_URL}?action=${action}`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
        mode: 'no-cors',
      }
    );
    return { success: true };
  } catch (error) {
    console.error(`API Post Error (${action}):`, error);
    return { success: false, message: "Network error occurred." };
  }
};

// --- PUBLIC API ---

export const getProducts = async () => {
  const response = await fetchGet('getProducts');
  return response?.data || [];
};

export const getProductById = async (id: string) => {
  const response = await fetchGet('getProduct', { id });
  return response?.data || null;
};

export const getCategories = async () => {
  const response = await fetchGet('getCategories');
  return response?.data || [];
};

export const submitOrder = async (orderData: OrderData) => {
  return await fetchPost('placeOrder', orderData);
};

// --- ADMIN API ---

export const adminLogin = async (password: string) => {
  const response = await fetchGet('adminLogin', { password });
  return response || { success: false, message: "Connection failed" };
};

export const getDashboardStats = async () => {
  const response = await fetchGet('getDashboard');
  return response || null;
};

export const getOrders = async () => {
  const response = await fetchGet('getOrders');
  return response?.data || [];
};

export const addProduct = async (productData: any) => {
  return await fetchPost('addProduct', productData);
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  return await fetchPost('updateOrderStatus', { orderId, status });
};

export const uploadImageToImgBB = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
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
