// const User = require('../models/User');
// const Course = require('../models/Course');
// const StudentCertificate = require('../models/StudentCertificate');
// const crypto = require('crypto');
// const { sendVerificationLinkEmail, sendStatusChangeEmail } = require('../utlis/emailService');

// const ADMIN_EMAILS = ['vc2802204@gmail.com', 'techiguru.in@gmail.com'];

// // ── Middleware check: must be admin ────────────────────────────────────────────
// const isAdmin = (req, res, next) => {
//     if (req.user && (req.user.role === 'admin' || ADMIN_EMAILS.includes(req.user.email))) {
//         next();
//     } else {
//         res.status(403).json({ message: 'Admin access required' });
//     }
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // INSTRUCTOR MANAGEMENT
// // ─────────────────────────────────────────────────────────────────────────────

// // GET /api/admin/instructors/pending
// const getPendingInstructors = async (req, res) => {
//     try {
//         const instructors = await User.find({ role: 'instructor', instructorStatus: 'pending' })
//             .select('-password').sort({ createdAt: -1 });
//         res.json(instructors);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // GET /api/admin/instructors
// const getAllInstructors = async (req, res) => {
//     try {
//         const instructors = await User.find({ role: 'instructor' }).select('-password').sort({ createdAt: -1 });
//         res.json(instructors);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // PUT /api/admin/instructors/:id/approve
// const approveInstructor = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) return res.status(404).json({ message: 'User not found' });
//         if (user.role !== 'instructor') return res.status(400).json({ message: 'User is not an instructor' });

//         user.instructorStatus = 'approved';
//         await user.save({ validateModifiedOnly: true });

//         // Notify instructor via email
//         sendStatusChangeEmail(user.email, user.name, 'instructor', 'approved', 'Instructor Application')
//             .catch(err => console.error('Instructor approve email error:', err));

//         res.json({ message: 'Instructor approved successfully', user: user.getPublicProfile() });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // PUT /api/admin/instructors/:id/reject
// const rejectInstructor = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         user.instructorStatus = 'rejected';
//         await user.save({ validateModifiedOnly: true });

//         // Notify instructor via email
//         const reason = req.body.reason || 'Your application did not meet our current requirements.';
//         sendStatusChangeEmail(user.email, user.name, 'instructor', 'rejected', 'Instructor Application', reason)
//             .catch(err => console.error('Instructor reject email error:', err));

//         res.json({ message: 'Instructor rejected', user: user.getPublicProfile() });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // COURSE APPROVAL
// // ─────────────────────────────────────────────────────────────────────────────

// // GET /api/admin/courses/pending
// const getPendingCourses = async (req, res) => {
//     try {
//         const courses = await Course.find({ approvalStatus: 'pending' })
//             .populate('instructor', 'name email avatar')
//             .sort({ createdAt: -1 });
//         res.json(courses);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // GET /api/admin/courses
// const getAllCourses = async (req, res) => {
//     try {
//         const courses = await Course.find({})
//             .populate('instructor', 'name email avatar')
//             .sort({ createdAt: -1 });
//         res.json(courses);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // PUT /api/admin/courses/:id/approve
// const approveCourse = async (req, res) => {
//     try {
//         const course = await Course.findById(req.params.id).populate('instructor', 'name email');
//         if (!course) return res.status(404).json({ message: 'Course not found' });

//         course.approvalStatus = 'approved';
//         course.approvedAt = new Date();
//         course.approvedBy = req.user._id;
//         if (course.status === 'Draft') course.status = 'Active';
//         await course.save();

//         // Notify instructor/owner via email
//         if (course.instructor?.email) {
//             sendStatusChangeEmail(course.instructor.email, course.instructor.name, 'course', 'approved', course.title)
//                 .catch(err => console.error('Course approve email error:', err));
//         }

//         res.json({ message: 'Course approved and published', course });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // PUT /api/admin/courses/:id/reject
// const rejectCourse = async (req, res) => {
//     try {
//         const course = await Course.findById(req.params.id).populate('instructor', 'name email');
//         if (!course) return res.status(404).json({ message: 'Course not found' });

//         const reason = req.body.reason || 'Does not meet quality standards';
//         course.approvalStatus = 'rejected';
//         course.rejectionReason = reason;
//         course.status = 'Inactive';
//         await course.save();

//         // Notify instructor/owner via email
//         if (course.instructor?.email) {
//             sendStatusChangeEmail(course.instructor.email, course.instructor.name, 'course', 'rejected', course.title, reason)
//                 .catch(err => console.error('Course reject email error:', err));
//         }

//         res.json({ message: 'Course rejected', course });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // PLATFORM STATS
// // ─────────────────────────────────────────────────────────────────────────────

// // GET /api/admin/stats
// const getPlatformStats = async (req, res) => {
//     try {
//         const [totalUsers, totalStudents, totalInstructors, pendingInstructors,
//             totalCourses, pendingCourses, approvedCourses] = await Promise.all([
//                 User.countDocuments(),
//                 User.countDocuments({ role: 'student' }),
//                 User.countDocuments({ role: 'instructor' }),
//                 User.countDocuments({ role: 'instructor', instructorStatus: 'pending' }),
//                 Course.countDocuments(),
//                 Course.countDocuments({ approvalStatus: 'pending' }),
//                 Course.countDocuments({ approvalStatus: 'approved' }),
//             ]);

//         const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
//         const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(5)
//             .populate('instructor', 'name').select('title status approvalStatus studentsEnrolled createdAt');

//         res.json({
//             users: { total: totalUsers, students: totalStudents, instructors: totalInstructors, pendingInstructors },
//             courses: { total: totalCourses, pending: pendingCourses, approved: approvedCourses },
//             recentUsers, recentCourses
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // GET /api/admin/users
// const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find({}).select('-password').sort({ createdAt: -1 });
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // EMAIL VERIFICATION MANAGEMENT
// // ─────────────────────────────────────────────────────────────────────────────

// // GET /api/admin/users/unverified
// // Returns accounts that explicitly have isEmailVerified: false + completed registration
// const getUnverifiedUsers = async (req, res) => {
//     try {
//         const users = await User.find({
//             isEmailVerified: false,
//             name: { $exists: true, $ne: '' },   // has completed the name step
//             password: { $exists: true },         // has completed registration
//         })
//             .select('name email role createdAt lastLogin')
//             .sort({ createdAt: -1 });

//         res.json({ count: users.length, users });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // POST /api/admin/users/:id/resend-verification
// // Generates a secure token and sends a verification link to the user (valid 24h)
// const resendVerificationLink = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).select('+verifyToken +verifyTokenExpire');
//         if (!user) return res.status(404).json({ message: 'User not found' });
//         if (user.isEmailVerified) {
//             return res.status(400).json({ message: 'This user has already verified their email.' });
//         }

//         // Generate cryptographically secure token
//         const rawToken = crypto.randomBytes(32).toString('hex');
//         const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
//         user.verifyToken = hashedToken;
//         user.verifyTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
//         await user.save({ validateModifiedOnly: true });

//         const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
//         const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${rawToken}`;

//         await sendVerificationLinkEmail(user.email, user.name, verifyUrl);

//         res.json({
//             message: `Verification link sent to ${user.email} (valid 24 hours)`,
//             email: user.email
//         });
//     } catch (err) {
//         console.error('resendVerificationLink error:', err);
//         res.status(500).json({ message: 'Failed to send verification link: ' + err.message });
//     }
// };

// // POST /api/admin/users/resend-verification-all
// // Sends a verification link to EVERY account that hasn't verified their email yet
// const resendVerificationToAll = async (req, res) => {
//     try {
//         const unverifiedUsers = await User.find({
//             isEmailVerified: false,
//             name: { $exists: true, $ne: '' },
//             password: { $exists: true },
//         })
//             .select('+verifyToken +verifyTokenExpire name email');

//         if (unverifiedUsers.length === 0) {
//             return res.json({ message: 'No unverified users found.', sent: 0, failed: 0, results: [] });
//         }

//         const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
//         const results = [];
//         let sent = 0;
//         let failed = 0;

//         for (const user of unverifiedUsers) {
//             try {
//                 const rawToken = crypto.randomBytes(32).toString('hex');
//                 const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

//                 await User.findByIdAndUpdate(user._id, {
//                     verifyToken: hashedToken,
//                     verifyTokenExpire: new Date(Date.now() + 24 * 60 * 60 * 1000),
//                 });

//                 const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${rawToken}`;
//                 await sendVerificationLinkEmail(user.email, user.name, verifyUrl);

//                 results.push({ email: user.email, name: user.name || '(no name)', status: 'sent' });
//                 sent++;
//             } catch (emailErr) {
//                 results.push({ email: user.email, name: user.name || '(no name)', status: 'failed', error: emailErr.message });
//                 failed++;
//             }
//         }

//         res.json({
//             message: `Bulk resend complete. Sent: ${sent}, Failed: ${failed}`,
//             sent,
//             failed,
//             results
//         });
//     } catch (err) {
//         console.error('resendVerificationToAll error:', err);
//         res.status(500).json({ message: 'Bulk resend failed: ' + err.message });
//     }
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // STUDENT CERTIFICATE MANAGEMENT
// // ─────────────────────────────────────────────────────────────────────────────

// // GET /api/admin/student-certs
// const getAllStudentCertificates = async (req, res) => {
//     try {
//         const certs = await StudentCertificate.find({})
//             .populate('student', 'name email avatar')
//             .populate('certificateProgram', 'title genre thumbnail points')
//             .populate('approvedBy', 'name')
//             .sort({ createdAt: -1 });
//         res.json(certs);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // PUT /api/admin/student-certs/:id/approve
// const approveStudentCertificate = async (req, res) => {
//     try {
//         const cert = await StudentCertificate.findById(req.params.id)
//             .populate('certificateProgram', 'title points');
//         if (!cert) return res.status(404).json({ message: 'Certificate not found' });
//         if (cert.status === 'approved') return res.status(400).json({ message: 'Already approved' });

//         const pointsToAward = cert.certificateProgram?.points || 50;

//         cert.status = 'approved';
//         cert.pointsAwarded = pointsToAward;
//         cert.approvedBy = req.user._id;
//         cert.approvedAt = new Date();
//         cert.adminNote = req.body.note || '';
//         await cert.save();

//         // Award points to student
//         await User.findByIdAndUpdate(cert.student, {
//             $inc: { profilePoints: pointsToAward }
//         });

//         res.json({
//             message: `Certificate approved! ${pointsToAward} points awarded to student.`,
//             cert
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // PUT /api/admin/student-certs/:id/reject
// const rejectStudentCertificate = async (req, res) => {
//     try {
//         const cert = await StudentCertificate.findById(req.params.id);
//         if (!cert) return res.status(404).json({ message: 'Certificate not found' });

//         cert.status = 'rejected';
//         cert.adminNote = req.body.note || 'Does not meet requirements';
//         cert.approvedBy = req.user._id;
//         await cert.save();

//         res.json({ message: 'Certificate rejected', cert });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// module.exports = {
//     isAdmin,
//     getPendingInstructors, getAllInstructors, approveInstructor, rejectInstructor,
//     getPendingCourses, getAllCourses, approveCourse, rejectCourse,
//     getPlatformStats, getAllUsers,
//     getAllStudentCertificates, approveStudentCertificate, rejectStudentCertificate,
//     getUnverifiedUsers, resendVerificationLink, resendVerificationToAll
// };


const User    = require('../models/User');
const crypto  = require('crypto');
const { sendVerificationLinkEmail, sendStatusChangeEmail, sendHRCredentialsEmail } = require('../utlis/emailService');

// Try to load optional models gracefully
let Course, StudentCertificate;
try { Course = require('../models/Course'); } catch(e) { Course = null; }
try { StudentCertificate = require('../models/StudentCertificate'); } catch(e) { StudentCertificate = null; }

const ADMIN_EMAILS = ['vc2802204@gmail.com', 'techiguru.in@gmail.com'];

// ─────────────────────────────────────────────────────────────────────────────
// ROLE GUARD (used by adminRoutes as middleware)
// ─────────────────────────────────────────────────────────────────────────────
const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || ADMIN_EMAILS.includes(req.user.email))) {
    return next();
  }
  res.status(403).json({ message: 'Not authorized as admin' });
};

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────
const getPlatformStats = async (req, res) => {
  try {
    const [
      totalStudents, totalInstructors, pendingInstructors,
      totalHR,
      recentUsers,
      totalCourses, pendingCourses, approvedCourses,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' }),
      User.countDocuments({ role: 'instructor', instructorStatus: 'pending' }),
      User.countDocuments({ role: { $in: ['headhr', 'subhr'] } }),
      User.find({}).sort({ createdAt: -1 }).limit(8).select('name email role createdAt avatar'),
      Course ? Course.countDocuments({}) : 0,
      Course ? Course.countDocuments({ approvalStatus: 'pending' }) : 0,
      Course ? Course.countDocuments({ approvalStatus: 'approved' }) : 0,
    ]);

    res.json({
      users: {
        students:            totalStudents,
        instructors:         totalInstructors,
        pendingInstructors,
        hrStaff:             totalHR,
      },
      courses: {
        total:    totalCourses,
        pending:  pendingCourses,
        approved: approvedCourses,
      },
      recentUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUnverifiedUsers = async (req, res) => {
  try {
    const users = await User.find({ isEmailVerified: false })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resendVerificationLink = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isEmailVerified) return res.status(400).json({ message: 'User already verified' });

    const rawToken    = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.verifyToken       = hashedToken;
    user.verifyTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save({ validateModifiedOnly: true });

    const verifyUrl = `${process.env.BACKEND_URL || 'https://api.techiguru.in'}/api/auth/verify-email?token=${rawToken}`;
    sendVerificationLinkEmail(user.email, user.name, verifyUrl)
      .catch(err => console.error('Verification email error:', err));

    res.json({ message: `Verification link sent to ${user.email}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resendVerificationToAll = async (req, res) => {
  try {
    const users   = await User.find({ isEmailVerified: false });
    const results = [];

    for (const user of users) {
      try {
        const rawToken    = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.verifyToken       = hashedToken;
        user.verifyTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save({ validateModifiedOnly: true });

        const verifyUrl = `${process.env.BACKEND_URL || 'https://api.techiguru.in'}/api/auth/verify-email?token=${rawToken}`;
        await sendVerificationLinkEmail(user.email, user.name, verifyUrl);
        results.push({ email: user.email, status: 'sent' });
      } catch (e) {
        results.push({ email: user.email, status: 'failed', error: e.message });
      }
    }

    const sent   = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;
    res.json({ message: `Sent ${sent}, failed ${failed}`, sent, failed, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// INSTRUCTORS
// ─────────────────────────────────────────────────────────────────────────────
const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }).select('-password');
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPendingInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor', instructorStatus: 'pending' }).select('-password');
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveInstructor = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { instructorStatus: 'approved' },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'Instructor not found' });
    sendStatusChangeEmail(user.email, user.name, 'instructor', 'approved', 'Instructor Application')
      .catch(err => console.error('Approve email error:', err));
    res.json({ message: 'Instructor approved', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rejectInstructor = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { instructorStatus: 'rejected' },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'Instructor not found' });
    const reason = req.body.reason || 'Your application did not meet our current requirements.';
    sendStatusChangeEmail(user.email, user.name, 'instructor', 'rejected', 'Instructor Application', reason)
      .catch(err => console.error('Reject email error:', err));
    res.json({ message: 'Instructor rejected', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// COURSES
// ─────────────────────────────────────────────────────────────────────────────
const getAllCourses = async (req, res) => {
  try {
    if (!Course) return res.json([]);
    const courses = await Course.find({})
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPendingCourses = async (req, res) => {
  try {
    if (!Course) return res.json([]);
    const courses = await Course.find({ approvalStatus: 'pending' })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveCourse = async (req, res) => {
  try {
    if (!Course) return res.status(503).json({ message: 'Course model not available' });
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: 'approved', approvedAt: new Date(), approvedBy: req.user._id, status: 'Active' },
      { new: true }
    ).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor?.email) {
      sendStatusChangeEmail(course.instructor.email, course.instructor.name, 'course', 'approved', course.title)
        .catch(err => console.error('Course approve email error:', err));
    }
    res.json({ message: 'Course approved', course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rejectCourse = async (req, res) => {
  try {
    if (!Course) return res.status(503).json({ message: 'Course model not available' });
    const { reason } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: 'rejected', rejectionReason: reason || '', status: 'Inactive' },
      { new: true }
    ).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor?.email) {
      sendStatusChangeEmail(course.instructor.email, course.instructor.name, 'course', 'rejected', course.title, reason)
        .catch(err => console.error('Course reject email error:', err));
    }
    res.json({ message: 'Course rejected', course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT CERTIFICATES
// ─────────────────────────────────────────────────────────────────────────────
const getAllStudentCertificates = async (req, res) => {
  try {
    if (!StudentCertificate) return res.json([]);
    const certs = await StudentCertificate.find({})
      .populate('student', 'name email')
      .populate('certificateProgram', 'title points')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveStudentCertificate = async (req, res) => {
  try {
    if (!StudentCertificate) return res.status(503).json({ message: 'StudentCertificate model not available' });
    const { note } = req.body;
    const cert = await StudentCertificate.findByIdAndUpdate(
      req.params.id,
      {
        status:        'approved',
        approvedBy:    req.user._id,
        approvedAt:    new Date(),
        adminNote:     note || '',
        pointsAwarded: 50,
      },
      { new: true }
    );
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });

    // Award points to student
    await User.findByIdAndUpdate(cert.student, {
      $inc: { profilePoints: 50, certificatePoints: 50 },
    });

    res.json({ message: 'Certificate approved', cert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rejectStudentCertificate = async (req, res) => {
  try {
    if (!StudentCertificate) return res.status(503).json({ message: 'StudentCertificate model not available' });
    const { note } = req.body;
    const cert = await StudentCertificate.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', adminNote: note || 'Does not meet requirements', rejectedAt: new Date() },
      { new: true }
    );
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate rejected', cert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LEADERBOARD
// ─────────────────────────────────────────────────────────────────────────────
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['student', 'instructor'] } })
      .select('name email role avatar profilePoints certificatePoints coursePoints interviewPoints interviewSessions earnedCertificates enrolledCourses createdAt')
      .lean();

    const leaderboard = users.map(u => ({
      _id:                u._id,
      name:               u.name,
      email:              u.email,
      role:               u.role,
      avatar:             u.avatar,
      createdAt:          u.createdAt,
      totalPoints:        (u.profilePoints     || 0)
                        + (u.certificatePoints || 0)
                        + (u.coursePoints      || 0)
                        + (u.interviewPoints   || 0),
      interviewPoints:    u.interviewPoints    || 0,
      certificatePoints:  u.certificatePoints  || 0,
      coursePoints:       u.coursePoints       || 0,
      interviewSessions:  u.interviewSessions  || 0,
      earnedCertificates: u.earnedCertificates?.length || 0,
      enrolledCourses:    u.enrolledCourses?.length    || 0,
    })).sort((a, b) => b.totalPoints - a.totalPoints);

    res.json({ leaderboard });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HR USER MANAGEMENT  ← NEW
// Admin creates / lists / deletes headhr & subhr accounts
// ─────────────────────────────────────────────────────────────────────────────
const getHRUsers = async (req, res) => {
  try {
    const hrUsers = await User.find({ role: { $in: ['headhr', 'subhr'] } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(hrUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createHRUser = async (req, res) => {
  try {
    const { name, email, password, hrRole, mappedEmail } = req.body;

    if (!name || !email || !password || !hrRole) {
      return res.status(400).json({ message: 'name, email, password and hrRole are all required' });
    }
    if (!['headhr', 'subhr'].includes(hrRole)) {
      return res.status(400).json({ message: 'hrRole must be "headhr" or "subhr"' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // HR accounts are pre-verified — no OTP flow needed
    const user = await User.create({
      name,
      email,
      password,
      role:             hrRole,
      isEmailVerified:  true,
      instructorStatus: 'approved',
    });

    // Send credentials email to the mapped personal email (if provided) or the login email
    const deliveryEmail = (mappedEmail || '').trim() || email;
    try {
      await sendHRCredentialsEmail({
        toEmail:    deliveryEmail,
        name,
        loginEmail: email,
        password,
        hrRole,
      });
    } catch (emailErr) {
      console.error('Credentials email failed (non-fatal):', emailErr.message);
    }

    res.status(201).json({
      message: `${hrRole === 'headhr' ? 'Head HR' : 'Sub HR'} account created successfully${mappedEmail ? `. Credentials sent to ${mappedEmail}` : ''}`,
      user:    user.getPublicProfile(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteHRUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!['headhr', 'subhr'].includes(user.role)) {
      return res.status(400).json({ message: 'Can only delete HR accounts via this endpoint' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'HR account removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  // Role guard
  isAdmin,
  // Stats
  getPlatformStats,
  // Users
  getAllUsers,
  getUnverifiedUsers,
  resendVerificationLink,
  resendVerificationToAll,
  // Instructors
  getAllInstructors,
  getPendingInstructors,
  approveInstructor,
  rejectInstructor,
  // Courses
  getAllCourses,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  // Student certificates
  getAllStudentCertificates,
  approveStudentCertificate,
  rejectStudentCertificate,
  // Leaderboard
  getLeaderboard,
  // HR management (NEW)
  getHRUsers,
  createHRUser,
  deleteHRUser,
};