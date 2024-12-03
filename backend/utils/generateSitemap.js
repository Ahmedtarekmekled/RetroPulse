const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const Blog = require('../models/Blog');

async function generateSitemap(baseUrl) {
  try {
    // Fetch all published blog posts
    const posts = await Blog.find({ isPublished: true });

    // Create sitemap stream
    const stream = new SitemapStream({ hostname: baseUrl });

    // Add homepage
    stream.write({ url: '/', changefreq: 'daily', priority: 1.0 });

    // Add main pages
    ['about', 'blog', 'projects', 'contact'].forEach(page => {
      stream.write({
        url: `/${page}`,
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    // Add blog posts
    posts.forEach(post => {
      stream.write({
        url: `/blog/${post.slug}`,
        lastmod: post.updatedAt,
        changefreq: 'weekly',
        priority: 0.7
      });
    });

    stream.end();

    // Generate sitemap XML
    const data = await streamToPromise(Readable.from(stream));
    return data.toString();
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

module.exports = generateSitemap; 