const mongoose = require('mongoose');
const slugify = require('slugify');

// --- A. SUB-SCHEMAS ---

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, default: '' },   // External URL
  fileUrl: { type: String, default: '' }, // Uploaded file path
  fileType: { type: String, enum: ['link', 'pdf', 'doc', 'other'], default: 'link' }
}, { _id: true });

const tutorialLinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  platform: { type: String, default: '' }  // e.g. 'YouTube', 'GitHub'
}, { _id: true });

const codeSnippetSchema = new mongoose.Schema({
  language: { type: String, default: 'javascript' },
  code: { type: String, default: '' }
}, { _id: true });

const quizOptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
}, { _id: true });

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [quizOptionSchema]
}, { _id: true });

// --- B. VIDEO SUB-PART (Nested, supports one level deep of sub-sub-parts) ---
// We define a "leaf" subpart schema first (no further nesting at DB level, but frontend can model it)
const videoSubPartLeafSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  videoKey: { type: String, default: '' },
  duration: { type: String, default: '' },
  description: { type: String, default: '' },
  isFree: { type: Boolean, default: false },
  resources: [resourceSchema],
  codeSnippets: [codeSnippetSchema],
  quizzes: [quizSchema]
}, { _id: true });

// Video Sub-Part schema (with nested sub-sub-parts)
const videoSubPartSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  videoKey: { type: String, default: '' },
  duration: { type: String, default: '' },
  description: { type: String, default: '' },
  isFree: { type: Boolean, default: false },
  resources: [resourceSchema],
  codeSnippets: [codeSnippetSchema],
  quizzes: [quizSchema],
  subParts: [videoSubPartLeafSchema]  // Sub-sub-parts
}, { _id: true });

// --- C. LESSON SCHEMA (Embedded) ---
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['video', 'text', 'quiz'],
    default: 'video'
  },
  videoKey: { type: String },
  videoDuration: { type: Number, default: 0 },
  description: { type: String, trim: true, default: '' },
  isFree: { type: Boolean, default: false },
  resources: [resourceSchema],
  tutorialLinks: [tutorialLinkSchema],
  codeSnippets: [codeSnippetSchema],
  quizzes: [quizSchema],
  // VIDEO SUB-PARTS: A video can contain multiple sub-parts, each with optional sub-sub-parts
  subParts: [videoSubPartSchema]
}, { _id: true });

// --- D. SYLLABUS SUB-TOPIC SCHEMA ---
const syllabusSubTopicSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  duration: { type: String, default: '' },
  // Sub-sub-topics (third level)
  subTopics: [{
    title: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    duration: { type: String, default: '' }
  }]
}, { _id: true });

// --- E. SYLLABUS TOPIC SCHEMA ---
const syllabusTopicSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true },
  description: { type: String, trim: true, default: '' },
  duration: { type: String, default: '' },
  subTopics: [syllabusSubTopicSchema]
}, { _id: true });

// --- F. SECTION SCHEMA ---
const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Section title is required'],
    trim: true
  },
  lessons: [lessonSchema]
}, { _id: true });

// --- G. MAIN COURSE SCHEMA ---
const courseSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: { type: String, unique: true },
  subtitle: { type: String },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Development', 'Business', 'Design', 'Marketing', 'Lifestyle', 'IT & Software']
  },
  level: {
    type: String,
    enum: ['All Levels', 'Beginner', 'Intermediate', 'Expert'],
    default: 'All Levels'
  },
  language: { type: String, default: 'English' },
  price: { type: Number, required: true, default: 0 },
  discountPrice: { type: Number },
  thumbnail: {
    url: { type: String, default: 'https://via.placeholder.com/640x360.png?text=Course+Thumbnail' },
    public_id: String
  },
  learningPoints: [String],
  requirements: [String],
  tags: [String],

  // Curriculum Structure
  sections: [sectionSchema],

  // Syllabus: Course outline with topics and nested sub-topics
  syllabus: [syllabusTopicSchema],

  // ── COURSE APPROVAL SYSTEM ────────────────────────────────────────────────
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'   // All new courses start as pending admin review
  },
  rejectionReason: { type: String, default: '' },
  approvedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // ── ENROLLMENT TRACKING ────────────────────────────────────────────────────
  enrollments: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },      // 0–100 percent
    completed: { type: Boolean, default: false },
    completedAt: Date,
    certificateIssued: { type: Boolean, default: false },
  }],

  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  studentsEnrolled: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Inactive'],
    default: 'Draft'
  },
  // Points required to unlock this paid course (0 = no points required)
  pointsRequired: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

courseSchema.pre('save', async function () {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

courseSchema.virtual('totalDuration').get(function () {
  let totalSeconds = 0;
  if (this.sections && this.sections.length > 0) {
    this.sections.forEach(section => {
      if (section.lessons) {
        section.lessons.forEach(lesson => {
          if (lesson.type === 'video' && lesson.videoDuration) {
            totalSeconds += lesson.videoDuration;
          }
        });
      }
    });
  }
  return totalSeconds;
});

module.exports = mongoose.model('Course', courseSchema);