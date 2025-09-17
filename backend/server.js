const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


// Load environment variables first
dotenv.config();

// Connect to database
connectDB();
dotenv.config();
const app = express();

// Middleware: CORS should be set **before** routes

app.use(cors({
  origin: [
    'simple-expense-tracker-23kij066g-kushs-projects-1c4830b0.vercel.app',   // Your frontend URL on Render or Vercel
    'http://localhost:5173'                                 // For local development
  ],
  credentials: true
}));



app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth routes ready!`);
});
