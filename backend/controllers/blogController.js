const Blog = require('../models/Blog');

// @desc   Get all published blogs (public)
// @route  GET /api/blogs
const getBlogs = async (req, res) => {
    try {
        const { keyword = '', category = '', page = 1, limit = 9, featured } = req.query;
        const query = { status: 'Published' };
        if (keyword) query.title = { $regex: keyword, $options: 'i' };
        if (category && category !== 'All') query.category = category;
        if (featured === 'true') query.featured = true;

        const total = await Blog.countDocuments(query);
        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .populate('author', 'name avatar')
            .lean();

        res.json({ blogs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc   Get single blog
// @route  GET /api/blogs/:id
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name avatar').lean();
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        // Increment views
        await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc   Get all my blogs (instructor)
// @route  GET /api/blogs/my
const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 }).lean();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc   Create blog
// @route  POST /api/blogs
const createBlog = async (req, res) => {
    try {
        const { title, excerpt, content, category, tags, status, coverImage, featured } = req.body;
        if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

        const blog = await Blog.create({
            author: req.user._id,
            title, excerpt, content, category,
            tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : (tags || []),
            status: status || 'Draft',
            coverImage: coverImage || { url: '' },
            featured: featured || false
        });
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc   Update blog
// @route  PUT /api/blogs/:id
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        if (blog.author.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Not authorized' });

        const { title, excerpt, content, category, tags, status, coverImage, featured } = req.body;
        if (title) blog.title = title;
        if (excerpt !== undefined) blog.excerpt = excerpt;
        if (content) blog.content = content;
        if (category) blog.category = category;
        if (tags !== undefined) blog.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : (tags || []);
        if (status) blog.status = status;
        if (coverImage) blog.coverImage = coverImage;
        if (featured !== undefined) blog.featured = featured;

        await blog.save();
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc   Delete blog
// @route  DELETE /api/blogs/:id
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        if (blog.author.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Not authorized' });
        await blog.deleteOne();
        res.json({ message: 'Blog deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getBlogs, getBlogById, getMyBlogs, createBlog, updateBlog, deleteBlog };
