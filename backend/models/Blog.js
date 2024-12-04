const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    maxLength: 160
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    url: String,
    publicId: String,
    alt: String
  },
  tags: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    default: 'Uncategorized'
  },
  readTime: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  lastVisited: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  canonicalUrl: String,
  schema: {
    type: Object,
    default: function() {
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": this.title || '',
        "image": this.image?.url || '',
        "author": {
          "@type": "Person",
          "name": "Ahmed Mekled"
        },
        "datePublished": this.createdAt,
        "dateModified": this.updatedAt
      };
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate slug before saving
blogSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  // Generate description if not provided
  if (!this.description) {
    this.description = this.content
      .substring(0, 157)
      .trim() + '...';
  }
  
  next();
});

// Add method to increment views
blogSchema.methods.incrementViews = async function() {
  this.views = (this.views || 0) + 1;
  this.lastVisited = new Date();
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Blog', blogSchema); 