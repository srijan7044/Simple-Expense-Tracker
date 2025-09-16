import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Functions
export const expenseAPI = {
  // Get all expenses
  getExpenses: async (params = {}) => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },

  // Create new expense
  createExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  // Delete multiple expenses
  deleteMultipleExpenses: async (expenseIds) => {
    const response = await api.delete('/expenses/bulk', { data: { expenseIds } });
    return response.data;
  },

  // Test health
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
};

export default api;
// Add this at the end of api.js
export const testAPI = {
  // Test health endpoint
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};
