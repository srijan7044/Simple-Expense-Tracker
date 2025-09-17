// src/services/api.js
import axios from 'axios';

// Base API URL (fallback to localhost for development)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create a single axios instance for all requests
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Attach JWT token to every request if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Expense-related API functions
export const expenseAPI = {
  // Fetch all expenses
  getExpenses: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },

  // Create a new expense
  createExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  // Delete a single expense
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  // Delete multiple expenses
  deleteMultipleExpenses: async (expenseIds) => {
    const response = await api.delete('/expenses/bulk', {
      data: { expenseIds }
    });
    return response.data;
  }
};

// Authentication-related API functions
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
};

// Health check (optional)
export const testAPI = {
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;
