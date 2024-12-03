const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadImage, deleteImage } = require('../config/cloudinary');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Get featured projects
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching featured projects' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Create project (Admin only)
router.post('/',
  protect,
  authorize('admin'),
  upload.single('image'),
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('technologies').isArray(),
    body('githubUrl').optional().isURL(),
    body('liveUrl').optional().isURL(),
    body('featured').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let imageData = null;
      if (req.file) {
        imageData = await uploadImage(req.file.buffer.toString('base64'));
      }

      const project = new Project({
        ...req.body,
        image: imageData
      });

      await project.save();
      res.status(201).json(project);
    } catch (err) {
      res.status(500).json({ message: 'Error creating project' });
    }
  }
);

// Update project (Admin only)
router.put('/:id',
  protect,
  authorize('admin'),
  upload.single('image'),
  [
    body('title').trim().optional(),
    body('description').trim().optional(),
    body('technologies').optional().isArray(),
    body('githubUrl').optional().isURL(),
    body('liveUrl').optional().isURL(),
    body('featured').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (req.file) {
        if (project.image?.publicId) {
          await deleteImage(project.image.publicId);
        }
        const imageData = await uploadImage(req.file.buffer.toString('base64'));
        project.image = imageData;
      }

      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
          project[key] = req.body[key];
        }
      });

      await project.save();
      res.json(project);
    } catch (err) {
      res.status(500).json({ message: 'Error updating project' });
    }
  }
);

// Delete project (Admin only)
router.delete('/:id',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.image?.publicId) {
        await deleteImage(project.image.publicId);
      }

      await project.deleteOne();
      res.json({ message: 'Project deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting project' });
    }
  }
);

module.exports = router;
