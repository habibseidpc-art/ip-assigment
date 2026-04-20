const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/requests
// @desc    Farmer submits a new farming problem
// @access  Private (Farmer only)
router.post('/', protect, authorize('farmer'), async (req, res) => {
  try {
    const { cropType, problemDescription, farmSize, requestDate } = req.body;

    if (!cropType || !problemDescription || !farmSize) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const request = await Request.create({
      farmer: req.user._id,
      cropType,
      problemDescription,
      farmSize,
      requestDate: requestDate || Date.now(),
      status: 'Pending',
    });

    res.status(201).json({ message: 'Request submitted successfully', request });
  } catch (error) {
    console.error('Create request error:', error.message);
    res.status(500).json({ message: 'Server error while submitting request' });
  }
});

// @route   GET /api/requests/my
// @desc    Farmer views their own requests
// @access  Private (Farmer only)
router.get('/my', protect, authorize('farmer'), async (req, res) => {
  try {
    const requests = await Request.find({ farmer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('advisedBy', 'fullName phoneNumber');

    res.json({ requests });
  } catch (error) {
    console.error('Get my requests error:', error.message);
    res.status(500).json({ message: 'Server error while fetching requests' });
  }
});

// @route   GET /api/requests
// @desc    Officer views all farmer requests (with optional status filter)
// @access  Private (Officer only)
router.get('/', protect, authorize('officer'), async (req, res) => {
  try {
    const { status, farmerId } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const requests = await Request.find(filter)
      .sort({ createdAt: -1 })
      .populate('farmer', 'fullName phoneNumber location farmType farmerId')
      .populate('advisedBy', 'fullName');

    res.json({ requests });
  } catch (error) {
    console.error('Get all requests error:', error.message);
    res.status(500).json({ message: 'Server error while fetching requests' });
  }
});

// @route   PUT /api/requests/:id/advise
// @desc    Officer provides advice on a request
// @access  Private (Officer only)
router.put('/:id/advise', protect, authorize('officer'), async (req, res) => {
  try {
    const { advice, fertilizerRecommendation, pestControlTips, alertDate } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.advice = advice || request.advice;
    request.fertilizerRecommendation = fertilizerRecommendation || request.fertilizerRecommendation;
    request.pestControlTips = pestControlTips || request.pestControlTips;
    request.alertDate = alertDate || request.alertDate;
    request.advisedBy = req.user._id;
    request.status = 'In Progress';

    await request.save();

    res.json({ message: 'Advice submitted successfully', request });
  } catch (error) {
    console.error('Advise request error:', error.message);
    res.status(500).json({ message: 'Server error while submitting advice' });
  }
});

// @route   PUT /api/requests/:id/status
// @desc    Officer updates request status
// @access  Private (Officer only)
router.put('/:id/status', protect, authorize('officer'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Solved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    await request.save();

    res.json({ message: 'Status updated successfully', request });
  } catch (error) {
    console.error('Update status error:', error.message);
    res.status(500).json({ message: 'Server error while updating status' });
  }
});

module.exports = router;
