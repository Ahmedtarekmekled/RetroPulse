const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

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
const settingsRoutes = require('./routes/settings');

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
    ? ['https://retropulse.onrender.com', 'https://your-app-name.onrender.com']
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add preflight handling
app.options('*', cors());

// Add security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/technologies', technologiesRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from frontend build
  const buildPath = path.join(__dirname, '../frontend/build');
  
  try {
    // Check if build directory exists
    if (fs.existsSync(buildPath)) {
      app.use(express.static(buildPath));
      
      app.get('*', (req, res) => {
        // Don't serve index.html for API routes
        if (!req.path.startsWith('/api/')) {
          res.sendFile(path.join(buildPath, 'index.html'));
        }
      });
    } else {
      console.error('Build directory not found:', buildPath);
    }
  } catch (err) {
    console.error('Error checking build directory:', err);
  }
} else {
  // Handle 404 for API routes in development
  app.use((req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
  });
}

// Start server first, then connect to MongoDB
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('MongoDB Connected Successfully');
    
    // Test the connection
    const collections = await mongoose.connection.db.collections();
    console.log('Available collections:', collections.map(c => c.collectionName));
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Log more details in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Full error:', error);
    }
  }
};

// Call connectDB and handle errors
connectDB().catch(console.error);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message 
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

const visitTracker = require('./middleware/visitTracker');

// Add after your other middleware
app.use(visitTracker);

// Add this near the top with other middleware imports
const enforceHttps = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
};

// Add this before your routes
app.use(enforceHttps);

// Update CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://ahmedmakled.com',
      'https://www.ahmedmakled.com',
      'http://localhost:3000'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Add security headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && corsOptions.origin(origin, () => true)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// Force HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
});

// Add this before your routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Add this after your routes
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Add this near your other security headers
app.use((req, res, next) => {
  // Force HTTPS
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    const secureUrl = `https://${req.headers.host}${req.url}`;
    return res.redirect(301, secureUrl);
  }

  // HSTS header
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  next();
});
