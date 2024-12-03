const express = require('express');
const router = express.Router();
const SocialLink = require('../models/SocialLink');
const auth = require('../middleware/auth');

// Get all social links (public)
router.get('/', async (req, res) => {
  try {
    const links = await SocialLink.find({ isActive: true })
      .sort('order')
      .lean();

    // Add platform info to each link
    const enrichedLinks = links.map(link => {
      const platformInfo = getPlatformInfo(link.platform);
      return {
        ...link,
        icon: platformInfo.icon,
        color: platformInfo.color
      };
    });

    res.json(enrichedLinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create social link (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { platform, url, label, order } = req.body;
    const socialLink = new SocialLink({
      platform,
      url,
      label: label || platform,
      order,
      icon: getPlatformIcon(platform)
    });
    await socialLink.save();
    res.status(201).json(socialLink);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update social link (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { platform, url, label, order, isActive } = req.body;
    const socialLink = await SocialLink.findById(req.params.id);
    
    if (!socialLink) {
      return res.status(404).json({ message: 'Social link not found' });
    }

    socialLink.platform = platform;
    socialLink.url = url;
    socialLink.label = label || platform;
    socialLink.order = order;
    socialLink.isActive = isActive;
    socialLink.icon = getPlatformIcon(platform);

    await socialLink.save();
    res.json(socialLink);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete social link (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await SocialLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Social link deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to get platform icon
function getPlatformIcon(platform) {
  const icons = {
    github: 'fab fa-github',
    linkedin: 'fab fa-linkedin',
    twitter: 'fab fa-twitter',
    facebook: 'fab fa-facebook',
    instagram: 'fab fa-instagram',
    youtube: 'fab fa-youtube',
    twitch: 'fab fa-twitch',
    discord: 'fab fa-discord',
    email: 'fas fa-envelope',
    website: 'fas fa-globe',
    other: 'fas fa-link'
  };
  return icons[platform] || icons.other;
}

// Helper function to get platform icon and color
function getPlatformInfo(platform) {
  const platforms = {
    github: {
      icon: 'fab fa-github',
      color: '#333'
    },
    linkedin: {
      icon: 'fab fa-linkedin',
      color: '#0077B5'
    },
    twitter: {
      icon: 'fab fa-twitter',
      color: '#1DA1F2'
    },
    facebook: {
      icon: 'fab fa-facebook',
      color: '#1877F2'
    },
    instagram: {
      icon: 'fab fa-instagram',
      color: '#E4405F'
    },
    youtube: {
      icon: 'fab fa-youtube',
      color: '#FF0000'
    },
    twitch: {
      icon: 'fab fa-twitch',
      color: '#9146FF'
    },
    discord: {
      icon: 'fab fa-discord',
      color: '#7289DA'
    },
    email: {
      icon: 'fas fa-envelope',
      color: '#EA4335'
    },
    website: {
      icon: 'fas fa-globe',
      color: '#4CAF50'
    },
    other: {
      icon: 'fas fa-link',
      color: '#757575'
    }
  };

  return platforms[platform] || platforms.other;
}

module.exports = router; 