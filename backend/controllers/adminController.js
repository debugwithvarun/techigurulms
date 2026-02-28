const User = require('../models/User');
const Course = require('../models/Course');
const StudentCertificate = require('../models/StudentCertificate');

const ADMIN_EMAILS = ['vc2802204@gmail.com', 'techiguru.in@gmail.com'];

// ── Middleware check: must be admin ────────────────────────────────────────────
const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || ADMIN_EMAILS.includes(req.user.email))) {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// INSTRUCTOR MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/admin/instructors/pending
const getPendingInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ role: 'instructor', instructorStatus: 'pending' })
            .select('-password').sort({ createdAt: -1 });
        res.json(instructors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/admin/instructors
const getAllInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ role: 'instructor' }).select('-password').sort({ createdAt: -1 });
        res.json(instructors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/admin/instructors/:id/approve
const approveInstructor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role !== 'instructor') return res.status(400).json({ message: 'User is not an instructor' });

        user.instructorStatus = 'approved';
        await user.save({ validateModifiedOnly: true });
        res.json({ message: 'Instructor approved successfully', user: user.getPublicProfile() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/admin/instructors/:id/reject
const rejectInstructor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.instructorStatus = 'rejected';
        await user.save({ validateModifiedOnly: true });
        res.json({ message: 'Instructor rejected', user: user.getPublicProfile() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// COURSE APPROVAL
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/admin/courses/pending
const getPendingCourses = async (req, res) => {
    try {
        const courses = await Course.find({ approvalStatus: 'pending' })
            .populate('instructor', 'name email avatar')
            .sort({ createdAt: -1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/admin/courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({})
            .populate('instructor', 'name email avatar')
            .sort({ createdAt: -1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/admin/courses/:id/approve
const approveCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        course.approvalStatus = 'approved';
        course.approvedAt = new Date();
        course.approvedBy = req.user._id;
        // Auto-set status to Active when approved
        if (course.status === 'Draft') course.status = 'Active';
        await course.save();
        res.json({ message: 'Course approved and published', course });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/admin/courses/:id/reject
const rejectCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        course.approvalStatus = 'rejected';
        course.rejectionReason = req.body.reason || 'Does not meet quality standards';
        course.status = 'Inactive';
        await course.save();
        res.json({ message: 'Course rejected', course });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM STATS
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/admin/stats
const getPlatformStats = async (req, res) => {
    try {
        const [totalUsers, totalStudents, totalInstructors, pendingInstructors,
            totalCourses, pendingCourses, approvedCourses] = await Promise.all([
                User.countDocuments(),
                User.countDocuments({ role: 'student' }),
                User.countDocuments({ role: 'instructor' }),
                User.countDocuments({ role: 'instructor', instructorStatus: 'pending' }),
                Course.countDocuments(),
                Course.countDocuments({ approvalStatus: 'pending' }),
                Course.countDocuments({ approvalStatus: 'approved' }),
            ]);

        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
        const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(5)
            .populate('instructor', 'name').select('title status approvalStatus studentsEnrolled createdAt');

        res.json({
            users: { total: totalUsers, students: totalStudents, instructors: totalInstructors, pendingInstructors },
            courses: { total: totalCourses, pending: pendingCourses, approved: approvedCourses },
            recentUsers, recentCourses
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT CERTIFICATE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/admin/student-certs
const getAllStudentCertificates = async (req, res) => {
    try {
        const certs = await StudentCertificate.find({})
            .populate('student', 'name email avatar')
            .populate('certificateProgram', 'title genre thumbnail points')
            .populate('approvedBy', 'name')
            .sort({ createdAt: -1 });
        res.json(certs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/admin/student-certs/:id/approve
const approveStudentCertificate = async (req, res) => {
    try {
        const cert = await StudentCertificate.findById(req.params.id)
            .populate('certificateProgram', 'title points');
        if (!cert) return res.status(404).json({ message: 'Certificate not found' });
        if (cert.status === 'approved') return res.status(400).json({ message: 'Already approved' });

        const pointsToAward = cert.certificateProgram?.points || 50;

        cert.status = 'approved';
        cert.pointsAwarded = pointsToAward;
        cert.approvedBy = req.user._id;
        cert.approvedAt = new Date();
        cert.adminNote = req.body.note || '';
        await cert.save();

        // Award points to student
        await User.findByIdAndUpdate(cert.student, {
            $inc: { profilePoints: pointsToAward }
        });

        res.json({
            message: `Certificate approved! ${pointsToAward} points awarded to student.`,
            cert
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/admin/student-certs/:id/reject
const rejectStudentCertificate = async (req, res) => {
    try {
        const cert = await StudentCertificate.findById(req.params.id);
        if (!cert) return res.status(404).json({ message: 'Certificate not found' });

        cert.status = 'rejected';
        cert.adminNote = req.body.note || 'Does not meet requirements';
        cert.approvedBy = req.user._id;
        await cert.save();

        res.json({ message: 'Certificate rejected', cert });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    isAdmin,
    getPendingInstructors, getAllInstructors, approveInstructor, rejectInstructor,
    getPendingCourses, getAllCourses, approveCourse, rejectCourse,
    getPlatformStats, getAllUsers,
    getAllStudentCertificates, approveStudentCertificate, rejectStudentCertificate
};
