const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .populate('technologies');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get project count
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Project.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, githubLink, liveLink } = req.body;
    const technologies = JSON.parse(req.body.technologies || '[]');

    const project = new Project({
      title,
      description,
      technologies,
      githubLink,
      liveLink
    });

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI);
      project.image = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update project
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, githubLink, liveLink } = req.body;
    const technologies = JSON.parse(req.body.technologies || '[]');
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.title = title;
    project.description = description;
    project.technologies = technologies;
    project.githubLink = githubLink;
    project.liveLink = liveLink;

    if (req.file) {
      if (project.image?.publicId) {
        await cloudinary.uploader.destroy(project.image.publicId);
      }
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI);
      project.image = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Project update error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.image?.publicId) {
      await cloudinary.uploader.destroy(project.image.publicId);
    }

    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a route to get a single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('technologies');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 