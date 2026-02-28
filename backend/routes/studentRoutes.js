const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const {
    getStudentDashboard,
    trackCertRedirect,
    uploadStudentCertificate,
    getMyStudentCertificates,
    unlockCourseWithPoints,
} = require('../controllers/studentController');

// Multer storage for cert uploads
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `student-cert-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/(jpeg|jpg|png|webp)|application\/pdf/.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images and PDFs only!');
    }
}

const upload = multer({
    storage,
    fileFilter(req, file, cb) { checkFileType(file, cb); },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// All routes require auth
router.use(protect);

router.get('/dashboard', getStudentDashboard);
router.post('/cert-redirect/:certId', trackCertRedirect);
router.post('/upload-cert/:certId', upload.single('certificate'), uploadStudentCertificate);
router.get('/my-certs', getMyStudentCertificates);
router.post('/unlock-course/:courseId', unlockCourseWithPoints);

module.exports = router;
