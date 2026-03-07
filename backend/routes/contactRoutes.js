const express = require('express');
const { submitContact, getContacts, markContactRead } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, authorize('admin'), getContacts);
router.patch('/:id/read', protect, authorize('admin'), markContactRead);

module.exports = router;
