const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const auth = require('../middleware/auth');
const generateCSV = require('../utils/generateCSV');

// Get visit statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Group visits by specified interval
    const groupByFormat = {
      day: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
      week: { $dateToString: { format: '%Y-W%V', date: '$startTime' } },
      month: { $dateToString: { format: '%Y-%m', date: '$startTime' } }
    };

    const stats = await Visit.aggregate([
      { $match: query },
      {
        $group: {
          _id: groupByFormat[groupBy],
          count: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
          bounceRate: {
            $avg: { $cond: [{ $eq: ['$bounced', true] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top pages
    const topPages = await Visit.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$page',
          count: { $sum: 1 },
          avgDuration: { $avg: '$duration' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      stats,
      topPages,
      summary: {
        total: stats.reduce((sum, stat) => sum + stat.count, 0),
        avgDuration: stats.reduce((sum, stat) => sum + stat.avgDuration, 0) / stats.length,
        bounceRate: stats.reduce((sum, stat) => sum + stat.bounceRate, 0) / stats.length
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: error.message });
  }
});

// Export visit data
router.get('/export', auth, async (req, res) => {
  try {
    const { format = 'csv', startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const visits = await Visit.find(query)
      .sort('-startTime')
      .lean();

    if (format === 'csv') {
      const csv = generateCSV(visits);
      res.header('Content-Type', 'text/csv');
      res.attachment('visit-history.csv');
      return res.send(csv);
    }

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 