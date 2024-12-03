const express = require('express');
const router = express.Router();
const { About } = require('../models/About');
const auth = require('../middleware/auth');

// Get all about sections (public)
router.get('/', async (req, res) => {
  try {
    const sections = await About.find().sort('order');
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create about section (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { section, title, content, order, isVisible } = req.body;
    
    const newSection = new About({
      section,
      title,
      content,
      order: order || 0,
      isVisible: isVisible ?? true
    });

    await newSection.save();
    res.status(201).json(newSection);
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update about section (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { section, title, content, order, isVisible } = req.body;
    
    const updatedSection = await About.findByIdAndUpdate(
      req.params.id,
      {
        section,
        title,
        content,
        order,
        isVisible
      },
      { new: true }
    );

    if (!updatedSection) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(updatedSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Toggle section visibility (protected)
router.patch('/:id/visibility', auth, async (req, res) => {
  try {
    const { isVisible } = req.body;
    
    const section = await About.findByIdAndUpdate(
      req.params.id,
      { isVisible },
      { new: true }
    );

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(section);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete about section (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const section = await About.findByIdAndDelete(req.params.id);
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 