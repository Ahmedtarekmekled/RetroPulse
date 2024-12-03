const express = require('express');
const router = express.Router();
const Technology = require('../models/Technology');
const auth = require('../middleware/auth');

// Get all technologies
router.get('/', async (req, res) => {
  try {
    const technologies = await Technology.find().sort('name');
    res.json(technologies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new technology (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, category } = req.body;
    const technology = new Technology({ name, category });
    await technology.save();
    res.status(201).json(technology);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete technology (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Technology.deleteOne({ _id: req.params.id });
    res.json({ message: 'Technology deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 