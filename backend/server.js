const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

// Programmatic DNS fix for Node.js resolver issues with MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  console.log('DNS resolver successfully set to Google (8.8.8.8) and Cloudflare (1.1.1.1) for robust Atlas SRV lookup.');
} catch (dnsErr) {
  console.warn('Failed to set custom DNS servers, using system default:', dnsErr.message);
}

// Load environment variables
dotenv.config();

// Global Exception and Rejection Handlers
process.on('uncaughtException', (err) => {
  console.error('CRITICAL UNCAUGHT EXCEPTION:', err);
  // Keep process alive but log the issue
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED PROMISE REJECTION:', reason);
});

// Validate environment variables
const requiredEnvVars = ['MONGODB_URI', 'GEMINI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
}

const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Diagnostics Route
app.get('/api/diagnostics', (req, res) => {
  res.status(200).json({
    vercel: !!process.env.VERCEL,
    mongodb_uri_exists: !!process.env.MONGODB_URI,
    gemini_api_key_exists: !!process.env.GEMINI_API_KEY,
    database_connected: mongoose.connection.readyState === 1
  });
});

// Test / Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'API is running successfully!' });
});

// Expense Routes
app.use('/api/expenses', expenseRoutes);

// Database Connection and Server Startup
const MONGODB_URI = process.env.MONGODB_URI;
let cachedDb = null;

function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }
  
  console.log('Attempting to connect to MongoDB Atlas...');
  // Redact password in console log
  const redactedURI = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
  console.log(`Connection URI: ${redactedURI}`);

  return mongoose.connect(MONGODB_URI)
    .then((db) => {
      cachedDb = db;
      console.log('MongoDB Connected');
      return db;
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      if (!process.env.VERCEL) {
        console.log('Keeping backend process alive. Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
      }
      throw err;
    });
}

// Start server locally or initialize for Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
} else {
  // On Vercel, connect database immediately on import
  connectDB();
}

module.exports = app;
