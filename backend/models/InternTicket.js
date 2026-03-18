const mongoose = require('mongoose');

const internTicketSchema = new mongoose.Schema({
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InternshipApplication',
    required: true,
  },
  assignedSubHR: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  subject:     { type: String, required: true, trim: true },
  description: { type: String, required: true },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open',
  },
  resolution:  { type: String, default: '' },
  resolvedAt:  { type: Date },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // SubHR can resolve; Head HR can close/reopen
  removalRequested:     { type: Boolean, default: false },
  removalRequestedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  removalRequestReason: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('InternTicket', internTicketSchema);