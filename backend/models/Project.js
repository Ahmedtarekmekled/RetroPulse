const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology'
  }],
  githubLink: String,
  liveLink: String,
  image: {
    url: String,
    publicId: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
