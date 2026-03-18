const mongoose = require('mongoose');

const internProgressSchema = new mongoose.Schema({
  intern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InternshipApplication',
    required: true,
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: String,
    enum: ['below_avg', 'avg', 'above_avg'],
    required: true,
  },
  remarks: { type: String, default: '' },
  week:     { type: Number, default: 1 },  // which week of internship
  // SubHR requests removal of an intern
  removalRequested:     { type: Boolean, default: false },
  removalRequestReason: { type: String, default: '' },
  removalApproved:      { type: Boolean, default: false },  // only Head HR can approve
}, { timestamps: true });

module.exports = mongoose.model('InternProgress', internProgressSchema);