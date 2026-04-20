const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Request = require('../models/Request');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/dashboard
// @desc    Officer views dashboard statistics
// @access  Private (Officer only)
router.get('/', protect, authorize('officer'), async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalRequests = await Request.countDocuments();
    const activeRequests = await Request.countDocuments({
      status: { $in: ['Pending', 'In Progress'] },
    });
    const solvedCases = await Request.countDocuments({ status: 'Solved' });
    const pendingRequests = await Request.countDocuments({ status: 'Pending' });
    const inProgressRequests = await Request.countDocuments({ status: 'In Progress' });

    // Recent requests (last 5)
    const recentRequests = await Request.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('farmer', 'fullName location');

    res.json({
      stats: {
        totalFarmers,
        totalRequests,
        activeRequests,
        solvedCases,
        pendingRequests,
        inProgressRequests,
      },
      recentRequests,
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

module.exports = router;
