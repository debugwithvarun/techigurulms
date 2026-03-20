const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const { protect, authorize } = require('../middleware/authMiddleware');

const {
  applyForInternship,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  shortlistApplication,
  scheduleInterview,
  rejectApplication,
  selectCandidate,
  assignSubHR,
  sendOfferLetter,
  approveCertificate,
  markCompleted,
  getMyInterns,
  sendMeetLink,
  assignTask,
  getMyTasks,
  getTasksForIntern,
  submitTask,
  reviewTask,
  raiseTicket,
  getMyTickets,
  getTicketsForSubHR,
  getAllTickets,
  resolveTicket,
  closeTicket,
  markProgress,
  getProgressForIntern,
  requestRemoval,
  approveRemoval,
  getAdminInternshipOverview,
  getHRUsers,
  createHRUser,
  deleteHRUser,
} = require('../controllers/internshipController');

// ── Multer for resume + offer letter + certificate uploads ────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/internship/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `intern-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|jpg|jpeg|png/;
  const ext  = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = /application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)|image\/(jpeg|jpg|png)/.test(file.mimetype);
  (ext && mime) ? cb(null, true) : cb(new Error('Only PDF, DOC, DOCX, JPG, PNG files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// ── Helpers: role guards ──────────────────────────────────────────────────────
const isHeadHR  = authorize('headhr', 'admin');
const isSubHR   = authorize('subhr', 'headhr', 'admin');
const isIntern  = authorize('intern', 'student'); // students who applied
const isHR      = authorize('headhr', 'subhr', 'admin');
const isAdmin   = authorize('admin');

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC (requires login, any role)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/apply', protect, upload.single('resume'), applyForInternship);
router.get('/my',     protect, getMyApplications);

// ─────────────────────────────────────────────────────────────────────────────
// HEAD HR + ADMIN
// ─────────────────────────────────────────────────────────────────────────────
router.get('/all',              protect, isHeadHR, getAllApplications);
router.get('/admin/all',        protect, isAdmin,  getAdminInternshipOverview);
router.get('/:id',              protect, isHR,     getApplicationById);
router.put('/:id/shortlist',    protect, isHeadHR, shortlistApplication);
router.put('/:id/schedule-interview', protect, isHeadHR, scheduleInterview);
router.put('/:id/reject',       protect, isHeadHR, rejectApplication);
router.put('/:id/select',       protect, isHeadHR, selectCandidate);
router.put('/:id/assign-subhr', protect, isHeadHR, assignSubHR);
router.put('/:id/offer-letter', protect, isHeadHR, sendOfferLetter);
router.put('/:id/approve-certificate', protect, isHeadHR, approveCertificate);
router.put('/:id/complete',     protect, isHeadHR, markCompleted);
router.post('/:id/send-meet',   protect, isSubHR,  sendMeetLink);

// ─────────────────────────────────────────────────────────────────────────────
// SUB HR
// ─────────────────────────────────────────────────────────────────────────────
router.get('/my-interns',       protect, isSubHR,  getMyInterns);

// ─────────────────────────────────────────────────────────────────────────────
// TASKS
// ─────────────────────────────────────────────────────────────────────────────
router.post('/tasks',                        protect, isSubHR,            assignTask);
router.get('/tasks/my',                      protect,                     getMyTasks);
router.get('/tasks/intern/:applicationId',   protect, isSubHR,            getTasksForIntern);
router.put('/tasks/:id/submit',              protect,                     submitTask);
router.put('/tasks/:id/review',              protect, isSubHR,            reviewTask);

// ─────────────────────────────────────────────────────────────────────────────
// TICKETS
// ─────────────────────────────────────────────────────────────────────────────
router.post('/tickets',          protect,             raiseTicket);
router.get('/tickets/my',        protect,             getMyTickets);
router.get('/tickets/subhr',     protect, isSubHR,    getTicketsForSubHR);
router.get('/tickets/all',       protect, isHeadHR,   getAllTickets);
router.put('/tickets/:id/resolve', protect, isSubHR,  resolveTicket);
router.put('/tickets/:id/close',   protect, isHeadHR, closeTicket);

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS
// ─────────────────────────────────────────────────────────────────────────────
router.post('/progress',                     protect, isSubHR,   markProgress);
router.get('/progress/:applicationId',       protect, isHR,      getProgressForIntern);
router.post('/progress/:id/request-removal', protect, isSubHR,   requestRemoval);
router.put('/progress/:id/approve-removal',  protect, isHeadHR,  approveRemoval);

// ─────────────────────────────────────────────────────────────────────────────
// HR USER MANAGEMENT (Admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/hr-users',      protect, isAdmin, getHRUsers);
router.post('/hr-users',     protect, isAdmin, createHRUser);
router.delete('/hr-users/:id', protect, isAdmin, deleteHRUser);

module.exports = router;