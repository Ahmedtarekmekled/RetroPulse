const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const auth = require('../middleware/auth');

// Get analytics overview
router.get('/overview', auth, async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalVisits,
      todayVisits,
      monthlyVisits,
      lastMonthVisits,
      topPages,
      recentVisits,
      bounceRate,
      avgDuration
    ] = await Promise.all([
      Visit.countDocuments(),
      Visit.countDocuments({ startTime: { $gte: today } }),
      Visit.countDocuments({ startTime: { $gte: thisMonth } }),
      Visit.countDocuments({ 
        startTime: { 
          $gte: lastMonth,
          $lt: thisMonth 
        } 
      }),
      Visit.aggregate([
        { $group: { 
          _id: '$page',
          count: { $sum: 1 },
          bounceRate: { $avg: { $cond: ['$bounced', 1, 0] } }
        }},
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Visit.find()
        .sort('-startTime')
        .limit(20)
        .select('page visitor startTime duration'),
      Visit.aggregate([
        { $group: {
          _id: null,
          bounceRate: { $avg: { $cond: ['$bounced', 1, 0] } }
        }}
      ]),
      Visit.aggregate([
        { $group: {
          _id: null,
          avgDuration: { $avg: '$duration' }
        }}
      ])
    ]);

    res.json({
      overview: {
        total: totalVisits,
        today: todayVisits,
        thisMonth: monthlyVisits,
        monthlyGrowth: ((monthlyVisits - lastMonthVisits) / lastMonthVisits) * 100,
        bounceRate: bounceRate[0]?.bounceRate || 0,
        avgDuration: avgDuration[0]?.avgDuration || 0
      },
      topPages,
      recentVisits
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get visits by date range
router.get('/visits', auth, async (req, res) => {
  try {
    const { start, end, groupBy = 'day' } = req.query;
    const query = {};

    if (start && end) {
      query.startTime = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }

    const format = {
      hour: { $dateToString: { format: '%Y-%m-%d %H:00', date: '$startTime' } },
      day: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
      week: { $dateToString: { format: '%Y-W%V', date: '$startTime' } },
      month: { $dateToString: { format: '%Y-%m', date: '$startTime' } }
    };

    const visits = await Visit.aggregate([
      { $match: query },
      { $group: {
        _id: format[groupBy],
        count: { $sum: 1 },
        bounces: { $sum: { $cond: ['$bounced', 1, 0] } },
        totalDuration: { $sum: '$duration' }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get visitor locations
router.get('/locations', auth, async (req, res) => {
  try {
    const locations = await Visit.aggregate([
      { $group: {
        _id: {
          country: '$visitor.country',
          city: '$visitor.city'
        },
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 