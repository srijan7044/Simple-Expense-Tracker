import React, { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import { expenseAPI } from './services/api';
import { Menu } from '@headlessui/react';
import { Fragment } from 'react';


const uuid = () => Math.random().toString(36).substr(2, 9);

// Main App Content (Protected - requires login)
const AppContent = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load expenses when component mounts
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await expenseAPI.getExpenses();
      setExpenses(response.data.expenses || []);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setError('Failed to load expenses');
      // Fallback to localStorage
      const saved = localStorage.getItem("expenses");
      if (saved) {
        setExpenses(JSON.parse(saved));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async () => {
    if (!desc || !amount || !date) {
      setError('Please fill all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      const response = await expenseAPI.createExpense({
        description: desc,
        amount: parseFloat(amount),
        date: date,
        category: 'Other'
      });

      setExpenses(prev => [response.data.expense, ...prev]);
      setDesc("");
      setAmount("");
      setDate("");
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('Failed to add expense');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpenses = async () => {
    if (selected.length === 0) return;

    try {
      setIsLoading(true);
      await expenseAPI.deleteMultipleExpenses(selected);
      setExpenses(prev => prev.filter(exp => !selected.includes(exp._id)));
      setSelected([]);
    } catch (error) {
      console.error('Error deleting expenses:', error);
      setError('Failed to delete expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected((curr) =>
      curr.includes(id) ? curr.filter((i) => i !== id) : [...curr, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === expenses.length) {
      setSelected([]);
    } else {
      setSelected(expenses.map(exp => exp._id)); // Note: _id for MongoDB
    }
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="content-wrapper">
        
        {/* Header with User Info */}
        <div className="header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <h1 className="app-title">💰 ExpenseFlow</h1>
              <p className="app-subtitle">Welcome back, {user?.name}!</p>
            </div>
            <button 
              onClick={logout}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '15px 20px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1px solid #ffcdd2',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            {error}
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#c62828', cursor: 'pointer' }}>×</button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon total-icon">💳</div>
              <div className="stat-info">
                <p className="stat-label">TOTAL EXPENSES</p>
                <p className="stat-value">₹{total.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon entries-icon">📊</div>
              <div className="stat-info">
                <p className="stat-label">TOTAL ENTRIES</p>
                <p className="stat-value">{expenses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          
          {/* Add Form */}
          <div className="form-container">
            <h2 className="form-title">✨ Quick Add</h2>
            <div className="input-group">
              <input
                type="text"
                className="form-input"
                placeholder="What did you spend on?"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <input
                type="number"
                className="form-input"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button 
              className="submit-button" 
              onClick={addExpense}
              disabled={isLoading}
            >
              {isLoading ? '💾 Saving...' : '💾 Save Expense'}
            </button>
          </div>

          {/* Expenses List */}
          <div className="list-container">
            <div className="list-header">
              <h2 className="list-title">📋 Your Expenses</h2>
              {expenses.length > 0 && (
                <div className="action-buttons">
                  <button className="select-all-button" onClick={toggleSelectAll}>
                    {selected.length === expenses.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button 
                    className={`delete-button ${selected.length === 0 ? 'disabled' : ''}`}
                    disabled={selected.length === 0 || isLoading}
                    onClick={deleteExpenses}
                  >
                    🗑️ Delete ({selected.length})
                  </button>
                </div>
              )}
            </div>

            <div className="expenses-list">
              {expenses.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💸</div>
                  <h3 className="empty-title">No expenses yet!</h3>
                  <p className="empty-text">Add your first expense to save for later</p>
                </div>
              ) : (
                <div className="expenses-container">
                  {expenses.sort((a, b) => b.date.localeCompare(a.date)).map((exp) => (
                    <div key={exp._id || exp.id} className={`expense-item ${selected.includes(exp._id || exp.id) ? 'selected' : ''}`}>
                      <div className="expense-left">
                        <input
                          type="checkbox"
                          className="expense-checkbox"
                          checked={selected.includes(exp._id || exp.id)}
                          onChange={() => toggleSelect(exp._id || exp.id)}
                        />
                        <div className="expense-details">
                          <h3 className="expense-description">{exp.description}</h3>
                          <p className="expense-date">
                            {new Date(exp.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="expense-amount">₹{exp.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Auth Screen Component
const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px' 
    }}>
      {isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

// App Router Component
const AppRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <AppContent /> : <AuthScreen />;
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
