import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for JWT
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration (401)
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      // Redirect to login or refresh page if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper to transform _id to id for frontend compatibility
const transformProduct = (p: any) => ({ ...p, id: p._id });

// API Endpoints
export const productService = {
  getAll: async () => {
    const { data } = await api.get('/products');
    return { data: Array.isArray(data) ? data.map(transformProduct) : [] };
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return { data: transformProduct(data) };
  },
  getByStore: async (storeId: string) => {
    const { data } = await api.get(`/stores/${storeId}/products`);
    return { data: Array.isArray(data) ? data.map(transformProduct) : [] };
  },
  create: async (productData: any) => {
    const { data } = await api.post('/products', productData);
    return { data: transformProduct(data) };
  },
  update: async (id: string, productData: any) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return { data: transformProduct(data) };
  }
};

export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
};

export const orderService = {
  create: (orderData: any) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/myorders'),
};

export const storeService = {
  getAll: () => api.get('/stores'),
  getById: (id: string) => api.get(`/stores/${id}`),
};

export default api;
