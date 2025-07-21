const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Properties API
export const propertiesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${REACT_APP_API_BASE_URL}/properties?${queryString}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/properties/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (propertyData) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/properties`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData)
    });
    return handleResponse(response);
  },

  update: async (id, propertyData) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Tenants API
export const tenantsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${REACT_APP_API_BASE_URL}/tenants?${queryString}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/tenants/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (tenantData) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/tenants`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tenantData)
    });
    return handleResponse(response);
  },

  update: async (id, tenantData) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/tenants/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(tenantData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/tenants/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Payments API
export const paymentsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${REACT_APP_API_BASE_URL}/payments?${queryString}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/payments/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (paymentData) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/payments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData)
    });
    return handleResponse(response);
  },

  update: async (id, paymentData) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/payments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/payments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createBulk: async (data) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/payments/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getRevenue: async (year) => {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/dashboard/revenue?year=${year}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};