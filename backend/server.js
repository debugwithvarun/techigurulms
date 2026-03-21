const dotenv = require('dotenv');
dotenv.config(); // ← MUST be first so process.env is populated before any require()

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// --- Import Routes & Utils ---
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const internshipRoutes = require('./routes/internshiproutes');

const connectDB = require('./config/db');
const seedInstructors = require('./utlis/Seeder');

// dotenv already loaded at top of file

// --- Ensure upload directories exist ---
const UPLOAD_DIRS = [
  'uploads',
  'uploads/internship',
  'uploads/avatars',
  'uploads/courses',
];
UPLOAD_DIRS.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// --- Connect DB ---
connectDB().then(() => {
  seedInstructors();
});

const app = express();


// ================== ✅ FIXED CORS ==================
const corsOptions = {
  origin: [
    'https://techiguru.in',
    'https://www.techiguru.in',
    'http://localhost:5173',
    'https://imshopper-aimockinterview.hf.space'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// 🔥 CRITICAL: handle preflight requests
// app.options('*', cors(corsOptions));
// ===================================================


// --- Body parsers ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Static files ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/internship', internshipRoutes);

// --- Health check ---
app.get('/', (req, res) => res.send('API is running...'));

// --- 404 handler ---
app.use((req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);