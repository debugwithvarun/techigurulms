const express = require('express');
const dotenv  = require('dotenv');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

// --- Import Routes & Utils ---
const authRoutes        = require('./routes/authRoutes');
const courseRoutes      = require('./routes/courseRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const blogRoutes        = require('./routes/blogRoutes');
const adminRoutes       = require('./routes/adminRoutes');
const studentRoutes     = require('./routes/studentRoutes');
const contactRoutes     = require('./routes/contactRoutes');
const internshipRoutes  = require('./routes/internshipRoutes');

const connectDB        = require('./config/db');
const seedInstructors  = require('./utlis/Seeder');

dotenv.config();

// --- Ensure upload directories exist (create if missing) ---
const UPLOAD_DIRS = [
  'uploads',
  'uploads/internship',
];
UPLOAD_DIRS.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// --- Connect to Database ---
connectDB().then(() => {
  seedInstructors();
});

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://techiguru.in',
  'https://techiguru.in',
  'http://www.techiguru.in',
  'https://www.techiguru.in',
  'http://localhost:5173',
  'https://imshopper-aimockinterview.hf.space',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow Postman / mobile apps / server-to-server (no origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
};

// Must be FIRST — before any routes
app.use(cors(corsOptions));

// Explicitly respond 204 to every preflight OPTIONS request.
// Without this line, browsers that send OPTIONS before POST/PUT
// get no Access-Control-Allow-Origin header and block the real request.
app.options('*', cors(corsOptions));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files ──────────────────────────────────────────────────────────────
// Serves everything under /uploads (resumes, offer letters, certificates, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/courses',      courseRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/blogs',        blogRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/student',      studentRoutes);
app.use('/api/contact',      contactRoutes);
app.use('/api/internship',   internshipRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.send('API is running...'));

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);