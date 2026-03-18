const mongoose = require('mongoose');

const internshipApplicationSchema = new mongoose.Schema({
  // Applicant info
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName:    { type: String, required: true, trim: true },
  email:       { type: String, required: true, trim: true, lowercase: true },
  phone:       { type: String, required: true, trim: true },
  college:     { type: String, required: true, trim: true },
  branch:      { type: String, required: true, trim: true },
  year:        { type: String, required: true },           // 1st/2nd/3rd/4th/Graduated
  role:        { type: String, required: true, trim: true }, // e.g. "Full Stack Developer"
  experience:  { type: String, default: '' },              // brief background
  skills:      { type: String, default: '' },              // comma-separated or paragraph
  whyUs:       { type: String, default: '' },              // motivation

  resumeUrl:   { type: String, required: true },           // uploaded file path
  resumeName:  { type: String, default: '' },

  // Workflow status
  status: {
    type: String,
    enum: [
      'pending',           // just applied
      'shortlisted',       // HR viewed & shortlisted
      'interview_scheduled', // interview link sent
      'interviewed',       // interview done, awaiting decision
      'selected',          // selected for internship
      'rejected',          // rejected at any stage
      'offer_sent',        // offer letter sent
      'enrolled',          // actively interning
      'completed',         // internship completed
      'certificate_issued',// certificate issued
    ],
    default: 'pending',
  },

  // Interview
  interviewLink:       { type: String, default: '' },
  interviewScheduledAt:{ type: Date },
  interviewNotes:      { type: String, default: '' },

  // HR assignment
  headHR:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subHR:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Offer letter & certificate
  offerLetterUrl:     { type: String, default: '' },  // uploaded or generated
  offerLetterSentAt:  { type: Date },
  certificateUrl:     { type: String, default: '' },
  certificateApproved:{ type: Boolean, default: false },
  certificateApprovedAt: { type: Date },
  certificateApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Admin / HR notes
  hrNotes: { type: String, default: '' },

  // Rejection reason (shown in email)
  rejectionReason: { type: String, default: '' },

  internshipStartDate: { type: Date },
  internshipEndDate:   { type: Date },
  durationMonths:      { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model('InternshipApplication', internshipApplicationSchema);