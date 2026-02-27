const User = require('../models/User');
const jwt = require('jsonwebtoken');

const ADMIN_EMAILS = ['vc2802204@gmail.com', 'techiguru.in@gmail.com'];

// Helper: Generate JWT
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ── Register ────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, bio, title } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) return res.status(400).json({ message: 'Account with this email already exists' });

    // Determine role: admin emails get admin role, others get requested role
    let assignedRole = role || 'student';
    if (ADMIN_EMAILS.includes(email.toLowerCase())) assignedRole = 'admin';

    const user = await User.create({
      name, email, password,
      role: assignedRole,
      bio: bio || '',
      title: title || '',
      // Instructors from admin emails are auto-approved; others need approval
      instructorStatus: ADMIN_EMAILS.includes(email.toLowerCase()) ? 'approved' : 'pending',
    });

    if (!user) return res.status(400).json({ message: 'Invalid user data' });

    // Instructors (non-admin) are in pending state — return special message
    const isPendingInstructor = assignedRole === 'instructor' && !ADMIN_EMAILS.includes(email.toLowerCase());

    res.status(201).json({
      ...user.getPublicProfile(),
      token: generateToken(user._id),
      pendingApproval: isPendingInstructor,
      message: isPendingInstructor
        ? 'Registration successful! Your instructor account is pending admin approval. You will be notified once approved.'
        : 'Registration successful!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateModifiedOnly: true });

    res.json({
      ...user.getPublicProfile(),
      token: generateToken(user._id),
      pendingApproval: user.role === 'instructor' && user.instructorStatus === 'pending'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ── Get current user ──────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('earnedCertificates.course', 'title thumbnail category');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.getPublicProfile());
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ── Update Profile ────────────────────────────────────────────────────────────
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, bio, title, avatar, instructorBio, expertise, socialLinks } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (title !== undefined) user.title = title;
    if (avatar !== undefined) user.avatar = avatar;
    if (instructorBio !== undefined) user.instructorBio = instructorBio;
    if (expertise !== undefined) user.expertise = expertise;
    if (socialLinks !== undefined) user.socialLinks = { ...user.socialLinks, ...socialLinks };
    if (req.body.password) user.password = req.body.password;

    const updated = await user.save({ validateModifiedOnly: true });

    res.json({
      ...updated.getPublicProfile(),
      token: generateToken(updated._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get My Enrolled Courses with Progress ─────────────────────────────────────
const getMyEnrollments = async (req, res) => {
  try {
    const Course = require('../models/Course');
    // Find all courses where req.user._id is an enrolled student
    const courses = await Course.find({
      'enrollments.student': req.user._id,
      approvalStatus: 'approved'
    })
      .populate('instructor', 'name avatar title instructorBio')
      .select('title thumbnail description category level sections studentsEnrolled rating price enrollments slug');

    // Attach individual progress to each course
    const withProgress = courses.map(c => {
      const enrollment = c.enrollments.find(e => e.student.toString() === req.user._id.toString());
      return {
        _id: c._id,
        title: c.title,
        thumbnail: c.thumbnail,
        description: c.description,
        category: c.category,
        level: c.level,
        studentsEnrolled: c.studentsEnrolled,
        rating: c.rating,
        price: c.price,
        instructor: c.instructor,
        totalLessons: c.sections?.reduce((a, s) => a + (s.lessons?.length || 0), 0) || 0,
        progress: enrollment?.progress || 0,
        completed: enrollment?.completed || false,
        enrolledAt: enrollment?.enrolledAt,
      };
    });

    res.json(withProgress);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// ── Get Public Instructor Profile ──────────────────────────────────────────────
const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name avatar bio title instructorBio expertise socialLinks totalStudents totalCourses role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ── Upload Avatar ──────────────────────────────────────────────────────────────
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete old avatar from disk if it's a local file
    if (user.avatar && (user.avatar.startsWith('/uploads') || user.avatar.startsWith('\\uploads'))) {
      const fs = require('fs');
      const oldPath = require('path').join(__dirname, '..', user.avatar.replace(/\\/g, '/'));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Save relative path (served via /uploads/avatars/...)
    const relativePath = `/uploads/avatars/${req.file.filename}`;
    user.avatar = relativePath;
    await user.save({ validateModifiedOnly: true });

    res.json({ avatar: relativePath, message: 'Avatar updated successfully' });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, updateUserProfile, getMyEnrollments, getPublicProfile, uploadAvatar };
