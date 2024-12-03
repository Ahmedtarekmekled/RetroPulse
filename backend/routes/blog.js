const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const upload = multer({ storage: multer.memoryStorage() });

// Get all blogs (public)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate('author', 'email username')
      .lean();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blog count (protected)
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create blog (protected)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = new Blog({
      title,
      content,
      author: req.user.id
    });

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'blog_featured'
      });
      blog.image = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    await blog.save();
    await blog.populate('author', 'email username');
    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update blog (protected)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.title = title;
    blog.content = content;

    if (req.file) {
      if (blog.image?.publicId) {
        await cloudinary.uploader.destroy(blog.image.publicId);
      }
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'blog_featured'
      });
      blog.image = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    await blog.save();
    await blog.populate('author', 'email username');
    res.json(blog);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete blog (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.image?.publicId) {
      await cloudinary.uploader.destroy(blog.image.publicId);
    }

    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    while ((match = imgRegex.exec(blog.content)) !== null) {
      const url = match[1];
      if (url.includes('cloudinary')) {
        const publicId = url.split('/').slice(-1)[0].split('.')[0];
        try {
          await cloudinary.uploader.destroy(`blog_content/${publicId}`);
        } catch (err) {
          console.error('Error deleting content image:', err);
        }
      }
    }

    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this route for handling image uploads
router.post('/upload-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'blog_content'
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// Get single blog post by slug
router.get('/post/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Try to find post by slug first
    let post = await Blog.findOne({ slug })
      .populate('author', 'username email')
      .lean();

    // If not found by slug, try to find by ID (in case slug is actually an ID)
    if (!post && mongoose.Types.ObjectId.isValid(slug)) {
      post = await Blog.findById(slug)
        .populate('author', 'username email')
        .lean();
    }

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update view count
router.patch('/:id/views', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Use the increment method
    await post.incrementViews();
    
    // Fetch the updated post
    const updatedPost = await Blog.findById(req.params.id).lean();
    
    res.json({ 
      views: updatedPost.views,
      lastVisited: updatedPost.lastVisited 
    });
  } catch (error) {
    console.error('Error updating views:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get visit statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const posts = await Blog.find()
      .select('title views lastVisited createdAt updatedAt')
      .sort('-views')
      .lean();

    const total = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayViews = posts.reduce((sum, post) => {
      const lastVisited = new Date(post.lastVisited);
      return lastVisited >= today ? sum + 1 : sum;
    }, 0);

    res.json({
      total,
      todayViews,
      posts: posts.map(post => ({
        ...post,
        lastVisited: post.lastVisited || post.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching visit stats:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
