import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('🔐 Attempting login with:', formData.email);

    const result = await login(formData);
    
    if (!result.success) {
      setError(result.error);
      console.log('❌ Login failed:', result.error);
    } else {
      console.log('✅ Login successful!');
    }
    
    setIsLoading(false);
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '40px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '30px' }}>
        Welcome Back!
      </h2>
      
      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '10px 15px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #e1e5e9',
              borderRadius: '10px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #e1e5e9',
              borderRadius: '10px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        Don't have an account?{' '}
        <button 
          type="button" 
          onClick={onSwitchToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            fontWeight: '600',
            textDecoration: 'underline'
          }}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;
