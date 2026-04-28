const express = require('express');
const router = express.Router();
const { sendInquiry, getUserInquiries, getAgentInquiries, updateInquiry, getAllInquiries } = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, sendInquiry);
router.get('/my', protect, getUserInquiries);
router.get('/agent', protect, authorize('agent', 'admin'), getAgentInquiries);
router.get('/admin', protect, authorize('admin'), getAllInquiries);
router.put('/:id', protect, authorize('agent', 'admin'), updateInquiry);

module.exports = router;
