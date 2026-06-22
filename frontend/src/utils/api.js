const API_BASE_URL = 'http://localhost:5000/api';

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const api = {
  // Authentication APIs
  auth: {
    register: (userData) => apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    login: (credentials) => apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    getProfile: () => apiFetch('/auth/profile')
  },

  // Product APIs
  products: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          queryParams.append(key, val);
        }
      });
      const queryStr = queryParams.toString();
      return apiFetch(`/products?${queryStr}`);
    },
    getById: (id) => apiFetch(`/products/${id}`),
    create: (productData) => apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    }),
    update: (id, productData) => apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }),
    delete: (id) => apiFetch(`/products/${id}`, {
      method: 'DELETE'
    })
  },

  // Cart APIs
  cart: {
    get: () => apiFetch('/cart'),
    add: (productId, quantity) => apiFetch('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    }),
    update: (productId, quantity) => apiFetch('/cart', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity })
    }),
    remove: (productId) => apiFetch(`/cart/${productId}`, {
      method: 'DELETE'
    })
  },

  // Order APIs
  orders: {
    create: (orderData) => apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),
    getMyOrders: () => apiFetch('/orders/myorders'),
    getById: (id) => apiFetch(`/orders/${id}`)
  },

  // Admin APIs
  admin: {
    getAnalytics: () => apiFetch('/admin/analytics'),
    getOrders: () => apiFetch('/admin/orders'),
    updateOrderStatus: (id, statusData) => apiFetch(`/admin/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(statusData)
    }),
    getUsers: () => apiFetch('/admin/users'),
    updateUserRole: (id, roleData) => apiFetch(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData)
    }),
    deleteUser: (id) => apiFetch(`/admin/users/${id}`, {
      method: 'DELETE'
    })
  }
};
