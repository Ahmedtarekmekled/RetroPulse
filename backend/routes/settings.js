const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const auth = require('../middleware/auth');

// Configure multer for favicon upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../frontend/public');
    try {
      await fs.access(uploadPath);
    } catch {
      await fs.mkdir(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Always save as favicon.ico
    cb(null, 'favicon.ico');
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/x-icon', 'image/png', 'image/ico'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only .ico and .png files are allowed.'));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 // 1MB max
  }
});

// Update favicon
router.post('/favicon', auth, async (req, res) => {
  try {
    const uploadMiddleware = upload.single('favicon');
    
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ 
          message: err.message || 'Error uploading favicon'
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          message: 'No file uploaded'
        });
      }

      try {
        // Update manifest.json
        const manifestPath = path.join(__dirname, '../../frontend/public/manifest.json');
        const manifest = require(manifestPath);
        
        manifest.icons = [{
          src: '/favicon.ico',
          sizes: '64x64 32x32 24x24 16x16',
          type: 'image/x-icon'
        }];

        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

        // Force browser cache refresh by adding timestamp
        const timestamp = Date.now();
        
        res.json({ 
          message: 'Favicon updated successfully',
          path: `/favicon.ico?v=${timestamp}`
        });
      } catch (error) {
        console.error('Error updating manifest:', error);
        res.status(500).json({ 
          message: 'Error updating favicon configuration'
        });
      }
    });
  } catch (error) {
    console.error('Error handling favicon upload:', error);
    res.status(500).json({ 
      message: 'Server error while updating favicon'
    });
  }
});

module.exports = router; 