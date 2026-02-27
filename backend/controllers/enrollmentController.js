const Course = require('../models/Course');
const User = require('../models/User');
const crypto = require('crypto');

// Helper: generate certificate ID
const generateCertificateId = () => `TG-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

// ─────────────────────────────────────────────────────────────────────────────
// ENROLLMENT
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/courses/:id/enroll
const enrollInCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (course.approvalStatus !== 'approved')
            return res.status(400).json({ message: 'This course is not available yet' });

        // Check already enrolled
        const alreadyEnrolled = course.enrollments.some(
            e => e.student.toString() === req.user._id.toString()
        );
        if (alreadyEnrolled) return res.status(400).json({ message: 'Already enrolled in this course' });

        // Add enrollment
        course.enrollments.push({ student: req.user._id });
        course.studentsEnrolled = course.enrollments.length;
        await course.save();

        // Add to user enrolled list
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { enrolledCourses: course._id }
        });

        res.json({ message: 'Successfully enrolled', courseId: course._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/courses/:id/progress
const updateProgress = async (req, res) => {
    try {
        const { progress } = req.body;
        if (progress === undefined) return res.status(400).json({ message: 'Progress value required' });

        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const enrollment = course.enrollments.find(
            e => e.student.toString() === req.user._id.toString()
        );
        if (!enrollment) return res.status(400).json({ message: 'Not enrolled in this course' });

        enrollment.progress = Math.min(100, Math.max(0, Number(progress)));

        // Auto-mark completed at 100%
        if (enrollment.progress === 100 && !enrollment.completed) {
            enrollment.completed = true;
            enrollment.completedAt = new Date();
        }
        await course.save();
        res.json({ message: 'Progress updated', progress: enrollment.progress, completed: enrollment.completed });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/courses/:id/my-enrollment
const getMyEnrollment = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).lean();
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const enrollment = course.enrollments?.find(
            e => e.student.toString() === req.user._id.toString()
        );
        if (!enrollment) return res.status(200).json({ enrolled: false });
        res.json({ enrolled: true, ...enrollment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATE ISSUANCE
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/courses/:id/certificate
// Issue certificate after course completion
const issueCertificate = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name');
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const enrollment = course.enrollments.find(
            e => e.student.toString() === req.user._id.toString()
        );
        if (!enrollment) return res.status(400).json({ message: 'Not enrolled in this course' });
        if (!enrollment.completed) return res.status(400).json({ message: 'Course not completed yet. Complete 100% of lessons first.' });
        if (enrollment.certificateIssued) return res.status(400).json({ message: 'Certificate already issued' });

        const certId = generateCertificateId();
        const certData = {
            certificateId: certId,
            course: course._id,
            issuedAt: new Date(),
            certificateUrl: `/certificates/${certId}`,
        };

        // Mark certificate issued on enrollment
        enrollment.certificateIssued = true;
        await course.save();

        // Add to user profile + award points
        const user = await User.findById(req.user._id);
        user.earnedCertificates.push(certData);
        user.completedCourses.addToSet?.(course._id) || user.completedCourses.push(course._id);
        user.profilePoints += 100; // 100 points per certificate

        // Bonus badge for milestones
        const certCount = user.earnedCertificates.length;
        if (certCount === 1) user.badges.push('First Certificate');
        if (certCount === 5) user.badges.push('Knowledge Seeker');
        if (certCount === 10) user.badges.push('Learning Champion');

        await user.save({ validateModifiedOnly: true });

        res.status(201).json({
            message: 'Certificate issued successfully!',
            certificate: certData,
            pointsEarned: 100,
            totalPoints: user.profilePoints,
            newBadges: certCount === 1 ? ['First Certificate'] : certCount === 5 ? ['Knowledge Seeker'] : certCount === 10 ? ['Learning Champion'] : []
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/users/me/certificates — All my certificates
const getMyCertificates = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('earnedCertificates.course', 'title thumbnail instructor category')
            .lean();
        res.json(user?.earnedCertificates || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { enrollInCourse, updateProgress, getMyEnrollment, issueCertificate, getMyCertificates };
