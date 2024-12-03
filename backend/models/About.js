const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['PERSONAL_PROFILE', 'TECHNICAL_EXPERTISE', 'CAREER_TIMELINE']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = { About: mongoose.model('About', aboutSchema) }; 