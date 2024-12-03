const Visit = require('../models/Visit');

const visitTracker = async (req, res, next) => {
  // Skip tracking for assets and API calls
  if (req.path.startsWith('/api/') || req.path.match(/\.(js|css|png|jpg|gif|ico)$/)) {
    return next();
  }

  try {
    const visit = new Visit({
      page: req.path,
      visitor: {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        referrer: req.get('referrer')
      },
      path: req.path,
      query: req.query
    });

    await visit.save();
    req.visitId = visit._id;

    // Store visit start time in session
    req.session.visitStart = Date.now();
  } catch (error) {
    console.error('Error tracking visit:', error);
  }

  next();
};

module.exports = visitTracker; 