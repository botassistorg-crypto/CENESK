const API_URL = "https://script.google.com/macros/s/AKfycbx8EmNERNn7BChL0qxpTlHenoVw9krZ7ZmYl0YlVeZXoscctrR61ExLCA6KvJnh12Gy/exec";

// ===== API HELPERS =====

async function apiGet(action: string, params: Record<string, string> = {}): Promise<any> {
  try {
    const queryParams = new URLSearchParams({ action, ...params });
    const url = `${API_URL}?${queryParams.toString()}`;
    console.log(`[CENESK API] GET: ${action}`, params);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`[CENESK API] GET Response:`, result);
    return result;
  } catch (error: any) {
    console.error(`[CENESK API] GET Error (${action}):`, error.message);
    return { success: false, data: [], count: 0, error: error.message };
  }
}

async function apiPost(action: string, data: any): Promise<any> {
  const payload = JSON.stringify({ action, data });
  console.log(`[CENESK API] POST: ${action}`, data);
  
  // Attempt 1: Normal fetch with redirect follow
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: payload,
      redirect: 'follow',
    });
    
    const text = await response.text();
    console.log(`[CENESK API] POST Raw Response:`, text);
    
    try {
      const result = JSON.parse(text);
      console.log(`[CENESK API] POST Parsed Response:`, result);
      return result;
    } catch {
      // Response wasn't JSON but request may have succeeded
      console.log(`[CENESK API] POST: Non-JSON response, assuming success`);
      return { success: true, message: 'Request completed' };
    }
  } catch (error: any) {
    console.warn(`[CENESK API] POST Normal fetch failed (${action}):`, error.message);
  }
  
  // Attempt 2: no-cors fallback
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: payload,
      mode: 'no-cors',
    });
    
    console.log(`[CENESK API] POST no-cors sent successfully (${action})`);
    return { success: true, message: 'Request sent (no-cors)' };
  } catch (fallbackError: any) {
    console.error(`[CENESK API] POST Both attempts failed (${action}):`, fallbackError.message);
    return { success: false, error: fallbackError.message };
  }
}

// ===== GET FUNCTIONS =====

export async function pingAPI() {
  return apiGet('ping');
}

export async function getProducts() {
  const result = await apiGet('getProducts');
  return result?.data || [];
}

export async function getProduct(id: string) {
  const result = await apiGet('getProduct', { id });
  return result?.data || null;
}

export async function getProductsByCategory(category: string) {
  const result = await apiGet('getProductsByCategory', { category });
  return result?.data || [];
}

export async function getCategories() {
  const result = await apiGet('getCategories');
  return result?.data || [];
}

export async function getBundles() {
  const result = await apiGet('getBundles');
  return result?.data || [];
}

export async function getBundle(id: string) {
  const result = await apiGet('getBundle', { id });
  return result?.data || null;
}

export async function getSettings() {
  return apiGet('getSettings');
}

export async function searchProducts(query: string) {
  const result = await apiGet('searchProducts', { query });
  return result?.data || [];
}

export async function getDashboardStats() {
  return apiGet('getDashboard');
}

export async function getOrders() {
  const result = await apiGet('getOrders');
  return result?.data || [];
}

export async function getCustomers() {
  const result = await apiGet('getCustomers');
  return result?.data || [];
}

export async function getReviews(productId: string) {
  const result = await apiGet('getReviews', { productId });
  return result?.data || [];
}

export async function adminLogin(password: string) {
  return apiGet('adminLogin', { password });
}

export async function trackOrder(orderId: string) {
  return apiGet('trackOrder', { orderId });
}

export async function trackOrderByPhone(phone: string) {
  return apiGet('trackOrder', { phone });
}

// ===== POST FUNCTIONS =====

export async function addProduct(productData: any) {
  return apiPost('addProduct', productData);
}

export async function updateProduct(productData: any) {
  return apiPost('updateProduct', productData);
}

export async function deleteProduct(id: string) {
  return apiPost('deleteProduct', { id });
}

export async function placeOrder(orderData: any) {
  return apiPost('placeOrder', orderData);
}

export async function updateOrderStatus(orderId: string, status: string) {
  return apiPost('updateOrderStatus', { orderId, status });
}

export async function addBundle(bundleData: any) {
  return apiPost('addBundle', bundleData);
}

export async function updateBundle(bundleData: any) {
  return apiPost('updateBundle', bundleData);
}

export async function deleteBundle(id: string) {
  return apiPost('deleteBundle', { id });
}

export async function addCategory(categoryData: any) {
  return apiPost('addCategory', categoryData);
}

export async function updateCategory(categoryData: any) {
  return apiPost('updateCategory', categoryData);
}

export async function deleteCategory(id: string) {
  return apiPost('deleteCategory', { id });
}

export async function addReview(reviewData: any) {
  return apiPost('addReview', reviewData);
}

export async function updateSettings(settingsData: any) {
  return apiPost('updateSettings', settingsData);
}

export async function subscribe(email: string) {
  return apiPost('subscribe', { email });
}

// ===== IMAGE UPLOAD =====

export async function uploadImageToImgBB(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    const apiKey = localStorage.getItem('imgbb_api_key') || '249d6156eb00d39b61ac4b421fd59003';
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (result.success) {
      return { success: true, url: result.data.display_url };
    }
    return { success: false, message: 'Upload failed' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
