const User = require('../models/User');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const StudentCertificate = require('../models/StudentCertificate');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/student/dashboard
const getStudentDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('enrolledCourses', 'title thumbnail category level price studentsEnrolled')
            .populate('earnedCertificates.course', 'title thumbnail category')
            .populate('redirectedCertificates.certId', 'title genre thumbnail points')
            .populate('unlockedCourses', 'title thumbnail category price')
            .select('-password')
            .lean();

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Get enrollment progress for each enrolled course
        const enrolledCoursesWithProgress = await Promise.all(
            (user.enrolledCourses || []).map(async (course) => {
                const courseDoc = await Course.findById(course._id).lean();
                const enrollment = courseDoc?.enrollments?.find(
                    e => e.student.toString() === req.user._id.toString()
                );
                return {
                    ...course,
                    progress: enrollment?.progress || 0,
                    completed: enrollment?.completed || false,
                    completedAt: enrollment?.completedAt,
                    certificateIssued: enrollment?.certificateIssued || false,
                    enrolledAt: enrollment?.enrolledAt,
                };
            })
        );

        // Get student uploaded certs
        const uploadedCerts = await StudentCertificate.find({ student: req.user._id })
            .populate('certificateProgram', 'title genre thumbnail points')
            .lean();

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                title: user.title,
                role: user.role,
                profilePoints: user.profilePoints || 0,
                badges: user.badges || [],
                createdAt: user.createdAt,
            },
            enrolledCourses: enrolledCoursesWithProgress,
            earnedCertificates: user.earnedCertificates || [],
            redirectedCertificates: user.redirectedCertificates || [],
            unlockedCourses: user.unlockedCourses || [],
            uploadedCerts,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATE REDIRECT TRACKING
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/student/cert-redirect/:certId
const trackCertRedirect = async (req, res) => {
    try {
        const { certId } = req.params;

        // Verify certificate exists
        const cert = await Certificate.findById(certId);
        if (!cert) return res.status(404).json({ message: 'Certificate program not found' });

        // Check if already tracked
        const user = await User.findById(req.user._id);
        const alreadyTracked = user.redirectedCertificates?.some(
            r => r.certId.toString() === certId
        );

        if (!alreadyTracked) {
            user.redirectedCertificates = user.redirectedCertificates || [];
            user.redirectedCertificates.push({ certId, redirectedAt: new Date() });
            await user.save({ validateModifiedOnly: true });
        }

        res.json({
            message: 'Redirect tracked successfully',
            certLink: cert.link,
            alreadyTracked
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT CERTIFICATE UPLOAD
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/student/upload-cert/:certId
const uploadStudentCertificate = async (req, res) => {
    try {
        const { certId } = req.params;

        // Check redirect exists
        const user = await User.findById(req.user._id);
        const hasRedirected = user.redirectedCertificates?.some(
            r => r.certId.toString() === certId
        );

        if (!hasRedirected) {
            return res.status(403).json({
                message: 'You must visit the certificate program link before uploading'
            });
        }

        // Check for existing upload (one-per-cert rule)
        const existingUpload = await StudentCertificate.findOne({
            student: req.user._id,
            certificateProgram: certId
        });

        if (existingUpload) {
            return res.status(400).json({
                message: 'You have already uploaded a certificate for this program',
                existing: existingUpload
            });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const ext = path.extname(req.file.originalname).toLowerCase();
        const fileType = ext === '.pdf' ? 'pdf' : 'image';
        const filePath = `/${req.file.path.replace(/\\/g, '/')}`;

        const cert = await Certificate.findById(certId);
        if (!cert) return res.status(404).json({ message: 'Certificate program not found' });

        const studentCert = new StudentCertificate({
            student: req.user._id,
            certificateProgram: certId,
            uploadUrl: filePath,
            fileName: req.file.originalname,
            fileType,
            status: 'pending',
        });

        await studentCert.save();

        res.status(201).json({
            message: 'Certificate uploaded! Awaiting admin approval.',
            studentCert
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Certificate already uploaded for this program' });
        }
        res.status(500).json({ message: err.message });
    }
};

// GET /api/student/my-certs
const getMyStudentCertificates = async (req, res) => {
    try {
        const certs = await StudentCertificate.find({ student: req.user._id })
            .populate('certificateProgram', 'title genre thumbnail points description')
            .sort({ createdAt: -1 })
            .lean();

        res.json(certs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// COURSE UNLOCK WITH POINTS
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/student/unlock-course/:courseId
const unlockCourseWithPoints = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (!course.pointsRequired || course.pointsRequired === 0) {
            return res.status(400).json({ message: 'This course does not require points to unlock' });
        }

        const user = await User.findById(req.user._id);

        // Check if already unlocked
        if (user.unlockedCourses?.some(id => id.toString() === courseId)) {
            return res.status(400).json({ message: 'Course already unlocked' });
        }

        if (user.profilePoints < course.pointsRequired) {
            return res.status(400).json({
                message: `Insufficient points. Need ${course.pointsRequired}, you have ${user.profilePoints}`,
                required: course.pointsRequired,
                current: user.profilePoints
            });
        }

        // Deduct points and unlock
        user.profilePoints -= course.pointsRequired;
        user.unlockedCourses = user.unlockedCourses || [];
        user.unlockedCourses.push(courseId);

        // Also enroll them
        const alreadyEnrolled = course.enrollments?.some(
            e => e.student.toString() === req.user._id.toString()
        );
        if (!alreadyEnrolled) {
            course.enrollments.push({ student: req.user._id });
            course.studentsEnrolled = course.enrollments.length;
            await course.save();
            user.enrolledCourses = user.enrolledCourses || [];
            user.enrolledCourses.push(courseId);
        }

        await user.save({ validateModifiedOnly: true });

        res.json({
            message: 'Course unlocked successfully!',
            pointsSpent: course.pointsRequired,
            remainingPoints: user.profilePoints
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getStudentDashboard,
    trackCertRedirect,
    uploadStudentCertificate,
    getMyStudentCertificates,
    unlockCourseWithPoints,
};
