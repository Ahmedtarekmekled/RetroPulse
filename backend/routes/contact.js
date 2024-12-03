const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// Get all messages (protected)
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get message count
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Contact.countDocuments({ read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = new Contact({
      name,
      email,
      message,
      read: false
    });
    await contact.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark message as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    message.read = true;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete message
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    await message.remove();
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
