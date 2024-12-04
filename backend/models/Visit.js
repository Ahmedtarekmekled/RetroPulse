const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true
  },
  visitor: {
    ip: String,
    userAgent: String,
    referrer: String,
    country: String,
    city: String
  },
  duration: {
    type: Number,
    default: 0
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  bounced: {
    type: Boolean,
    default: true
  },
  path: String,
  query: Object
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
visitSchema.index({ startTime: -1 });
visitSchema.index({ page: 1, startTime: -1 });

module.exports = mongoose.model('Visit', visitSchema); 