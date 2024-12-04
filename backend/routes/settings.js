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
    // Keep original extension
    const ext = path.extname(file.originalname);
    cb(null, `favicon${ext}`);
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

    const faviconPath = path.join(__dirname, '../../frontend/public/favicon.ico');
    
    // If uploaded file is not .ico, copy it as favicon.ico
    if (req.file.filename !== 'favicon.ico') {
      await fs.copyFile(req.file.path, faviconPath);
      await fs.unlink(req.file.path); // Clean up original file
    }

    // Update manifest.json
    const manifestPath = path.join(__dirname, '../../frontend/public/manifest.json');
    try {
      const manifest = require(manifestPath);
      manifest.icons = [{
        src: '/favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon'
      }];
      
      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    } catch (manifestError) {
      console.error('Error updating manifest:', manifestError);
      // Continue even if manifest update fails
    }

    res.json({ 
      message: 'Favicon updated successfully',
      path: '/favicon.ico'
    });
  } catch (error) {
    console.error('Error updating favicon:', error);
    res.status(500).json({ message: 'Error updating favicon: ' + error.message });
  }
});

module.exports = router; 