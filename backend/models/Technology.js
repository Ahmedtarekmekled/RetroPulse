const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'devops', 'other'],
    default: 'other'
  }
}, { timestamps: true });

module.exports = mongoose.model('Technology', technologySchema); 