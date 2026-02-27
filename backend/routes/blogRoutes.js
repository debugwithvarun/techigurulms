const express = require('express');
const router = express.Router();
const {
    getBlogs, getBlogById, getMyBlogs, createBlog, updateBlog, deleteBlog
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.get('/', getBlogs);
router.get('/my', protect, getMyBlogs);
router.get('/:id', getBlogById);

// Protected
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
