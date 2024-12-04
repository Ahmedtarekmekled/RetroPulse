const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Set strictQuery to false
mongoose.set('strictQuery', false);

// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
  } catch (err) {
    console.log('Warning: No .env file found');
  }
}

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');
const technologiesRoutes = require('./routes/technologies');
const aboutRoutes = require('./routes/about');
const socialRoutes = require('./routes/social');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

// Add this near the top of your file
const logError = (error) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};

// Basic health check endpoint (add this first, before any middleware)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-app-name.onrender.com'
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/technologies', technologiesRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Start server first, then connect to MongoDB
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// MongoDB Connection
const connectDB = async () => {
  try {
    // Ensure MONGODB_URI starts with mongodb:// or mongodb+srv://
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB URI format. URI must start with mongodb:// or mongodb+srv://');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Log additional details for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.error('Full error:', error);
    }
    // Don't exit process on failed connection
  }
};

connectDB();

// Error handling
app.use((err, req, res, next) => {
  logError(err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle server shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  server.close(() => {
    console.log('Server closed. Exiting process...');
    process.exit(0);
  });
});

// Add this after your health check route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});
