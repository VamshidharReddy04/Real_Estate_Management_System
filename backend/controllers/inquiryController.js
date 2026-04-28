const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Send inquiry
// @route   POST /api/inquiries
// @access  Private
const sendInquiry = async (req, res) => {
  try {
    const { propertyId, message, phone } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const inquiry = await Inquiry.create({
      property: propertyId,
      sender: req.user.id,
      agent: property.agent,
      name: req.user.name,
      email: req.user.email,
      phone: phone || req.user.phone || '',
      message,
    });

    await inquiry.populate(['property', { path: 'agent', select: 'name email' }]);

    res.status(201).json({ success: true, message: 'Inquiry sent successfully', inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's sent inquiries
// @route   GET /api/inquiries/my
// @access  Private
const getUserInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ sender: req.user.id })
      .populate('property', 'title images location price')
      .populate('agent', 'name email phone')
      .sort('-createdAt');

    res.json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get agent's received inquiries
// @route   GET /api/inquiries/agent
// @access  Private (Agent)
const getAgentInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ agent: req.user.id })
      .populate('property', 'title images location price')
      .populate('sender', 'name email phone')
      .sort('-createdAt');

    res.json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry status / reply
// @route   PUT /api/inquiries/:id
// @access  Private (Agent)
const updateInquiry = async (req, res) => {
  try {
    const { status, reply } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (inquiry.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (status) inquiry.status = status;
    if (reply) { inquiry.reply = reply; inquiry.status = 'replied'; }
    await inquiry.save();

    res.json({ success: true, message: 'Inquiry updated', inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Get all inquiries
// @route   GET /api/inquiries/admin
// @access  Private (Admin)
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({})
      .populate('property', 'title')
      .populate('sender', 'name email')
      .populate('agent', 'name email')
      .sort('-createdAt');

    res.json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendInquiry, getUserInquiries, getAgentInquiries, updateInquiry, getAllInquiries };
