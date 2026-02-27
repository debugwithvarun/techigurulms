const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: { type: String, unique: true },
    excerpt: {
        type: String,
        maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    coverImage: {
        url: { type: String, default: '' },
        public_id: String
    },
    category: {
        type: String,
        enum: ['Technology', 'Education', 'Career', 'Development', 'Design', 'Business', 'University', 'Tutorial', 'News'],
        default: 'Education'
    },
    tags: [String],
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    },
    readTime: { type: String, default: '5 min read' },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Auto-generate slug from title
blogSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    // Auto-calculate readTime from content length
    if (this.isModified('content')) {
        const wordCount = this.content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / 200);
        this.readTime = `${minutes} min read`;
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
