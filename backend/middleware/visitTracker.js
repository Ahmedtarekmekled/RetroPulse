const Visit = require('../models/Visit');

const visitTracker = async (req, res, next) => {
  // Skip tracking for assets and API calls
  if (req.path.startsWith('/api/') || req.path.match(/\.(js|css|png|jpg|ico)$/)) {
    return next();
  }

  try {
    const visit = new Visit({
      page: req.path,
      visitor: {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        referrer: req.get('referrer'),
        country: req.get('cf-ipcountry'),
        city: req.get('cf-ipcity')
      },
      path: req.path,
      query: req.query
    });

    await visit.save();
    req.visitId = visit._id;

  } catch (error) {
    console.error('Error tracking visit:', error);
  }

  next();
};

module.exports = visitTracker; 