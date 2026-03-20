// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // --- 1. PROTECT MIDDLEWARE (Authentication) ---
// // Verifies the JWT token and attaches the user to req.user
// const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     try {
//       // Get token from header (Format: "Bearer <token>")
//       token = req.headers.authorization.split(' ')[1];

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Get user from the token (exclude password)
//       req.user = await User.findById(decoded.id).select('-password');

//       if (!req.user) {
//         return res.status(401).json({ message: 'Not authorized, user not found' });
//       }

//       next();
//     } catch (error) {
//       console.error(`Auth Error: ${error.message}`);
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };


// const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//         return res.status(401).json({ message: 'Not authorized, user not found' });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ 
//         message: `User role '${req.user.role}' is not authorized to access this route` 
//       });
//     }
//     next();
//   };
// };

// module.exports = { protect, authorize };


const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── protect ───────────────────────────────────────────────────────────────────
// Verifies the Bearer JWT and attaches the user to req.user
// Unchanged from original — works for all 6 roles automatically
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(`Auth Error: ${error.message}`);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ── authorize ─────────────────────────────────────────────────────────────────
// Role-based guard factory — pass one or more allowed roles.
// Works for all roles: student | instructor | admin | headhr | subhr | intern
//
// Usage examples:
//   authorize('admin')
//   authorize('headhr', 'admin')
//   authorize('subhr', 'headhr', 'admin')
//   authorize('intern', 'student')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

// ── isAdmin helper (used by adminRoutes) ──────────────────────────────────────
// Kept as named export so existing adminRoutes.js import works unchanged
const isAdmin = authorize('admin');

module.exports = { protect, authorize, isAdmin };