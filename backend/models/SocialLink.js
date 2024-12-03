const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: [
      'github',
      'linkedin',
      'twitter',
      'facebook',
      'instagram',
      'youtube',
      'twitch',
      'discord',
      'email',
      'website',
      'other'
    ]
  },
  url: {
    type: String,
    required: true
  },
  label: String,
  icon: String,
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SocialLink', socialLinkSchema); 