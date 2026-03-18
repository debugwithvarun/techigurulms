const mongoose = require('mongoose');

const internTaskSchema = new mongoose.Schema({
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
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  dueDate:     { type: Date },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['assigned', 'in_progress', 'submitted', 'approved', 'revision_needed'],
    default: 'assigned',
  },
  submissionUrl:  { type: String, default: '' },  // intern submits link/file
  submissionNote: { type: String, default: '' },
  feedbackNote:   { type: String, default: '' },  // SubHR feedback
}, { timestamps: true });

module.exports = mongoose.model('InternTask', internTaskSchema);