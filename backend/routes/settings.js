const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const auth = require('../middleware/auth');

// Configure multer for favicon upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../frontend/public'));
  },
  filename: (req, file, cb) => {
    cb(null, 'favicon.ico');
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/x-icon', 'image/png', 'image/ico'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 // 1MB max
  }
});

// Update favicon
router.post('/favicon', auth, upload.single('favicon'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // If file is PNG, convert to ICO (you'll need to implement this)
    if (req.file.mimetype === 'image/png') {
      // Implement PNG to ICO conversion here
    }

    // Update manifest.json if needed
    const manifestPath = path.join(__dirname, '../../frontend/public/manifest.json');
    const manifest = require(manifestPath);
    manifest.icons = [{
      src: '/favicon.ico',
      sizes: '64x64 32x32 24x24 16x16',
      type: 'image/x-icon'
    }];
    
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    res.json({ 
      message: 'Favicon updated successfully',
      path: '/favicon.ico'
    });
  } catch (error) {
    console.error('Error updating favicon:', error);
    res.status(500).json({ message: 'Error updating favicon' });
  }
});

module.exports = router; 