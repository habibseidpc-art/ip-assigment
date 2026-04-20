const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropType: {
      type: String,
      required: [true, 'Crop type is required'],
      trim: true,
    },
    problemDescription: {
      type: String,
      required: [true, 'Problem description is required'],
      trim: true,
    },
    farmSize: {
      type: String,
      required: [true, 'Farm size is required'],
      trim: true,
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Solved'],
      default: 'Pending',
    },
    // Advisory fields filled by Extension Officer
    advice: {
      type: String,
      default: '',
    },
    fertilizerRecommendation: {
      type: String,
      default: '',
    },
    pestControlTips: {
      type: String,
      default: '',
    },
    alertDate: {
      type: Date,
      default: null,
    },
    advisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
