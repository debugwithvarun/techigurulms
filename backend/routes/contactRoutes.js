const express = require('express');
const { submitContact, getContacts } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, authorize('admin'), getContacts);

module.exports = router;
