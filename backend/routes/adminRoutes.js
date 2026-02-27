const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    isAdmin,
    getPendingInstructors, getAllInstructors, approveInstructor, rejectInstructor,
    getPendingCourses, getAllCourses, approveCourse, rejectCourse,
    getPlatformStats, getAllUsers
} = require('../controllers/adminController');

// All admin routes require login + admin check
router.use(protect, isAdmin);

// Stats
router.get('/stats', getPlatformStats);

// Users
router.get('/users', getAllUsers);

// Instructors
router.get('/instructors', getAllInstructors);
router.get('/instructors/pending', getPendingInstructors);
router.put('/instructors/:id/approve', approveInstructor);
router.put('/instructors/:id/reject', rejectInstructor);

// Courses
router.get('/courses', getAllCourses);
router.get('/courses/pending', getPendingCourses);
router.put('/courses/:id/approve', approveCourse);
router.put('/courses/:id/reject', rejectCourse);

module.exports = router;
