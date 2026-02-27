const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
  uploadCourseImage
} = require('../controllers/courseController');
const { enrollInCourse, updateProgress, getMyEnrollment, issueCertificate, getMyCertificates } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists in your root
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File Type Filter
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Supported files are Images, PDFs, and Docs only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// --- ROUTES ---

// Upload Route (Used for Thumbnails AND potentially Resource Files)
router.post('/upload', protect, upload.single('image'), uploadCourseImage);

// Public Routes
router.route('/')
  .get(getCourses)
  .post(protect, authorize('instructor', 'admin'), createCourse);

// Private Instructor Routes
router.route('/mycourses')
  .get(protect, authorize('instructor', 'admin'), getMyCourses);

router.route('/:id')
  .get(getCourseById)
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

// ── Enrollment & Certificates ────────────────────────────────────────────────
router.post('/:id/enroll', protect, enrollInCourse);
router.put('/:id/progress', protect, updateProgress);
router.get('/:id/my-enrollment', protect, getMyEnrollment);
router.post('/:id/certificate', protect, issueCertificate);
router.get('/user/my-certificates', protect, getMyCertificates);

module.exports = router;