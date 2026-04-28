const express = require('express');
const router = express.Router();
const {
  getProperties, getProperty, createProperty, updateProperty, deleteProperty,
  getAgentProperties, getAllPropertiesAdmin, approveProperty,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getProperties);
router.get('/agent/my', protect, authorize('agent', 'admin'), getAgentProperties);
router.get('/admin/all', protect, authorize('admin'), getAllPropertiesAdmin);
router.get('/:id', getProperty);
router.post('/', protect, authorize('agent', 'admin'), upload.array('images', 10), createProperty);
router.put('/:id', protect, authorize('agent', 'admin'), upload.array('images', 10), updateProperty);
router.put('/:id/approve', protect, authorize('admin'), approveProperty);
router.delete('/:id', protect, authorize('agent', 'admin'), deleteProperty);

module.exports = router;
