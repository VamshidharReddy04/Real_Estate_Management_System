const Wishlist = require('../models/Wishlist');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate({ path: 'properties.property', populate: { path: 'agent', select: 'name email phone' } });

    if (!wishlist) {
      wishlist = { properties: [] };
    }

    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add to wishlist
// @route   POST /api/wishlist/:propertyId
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, properties: [] });
    }

    const alreadyAdded = wishlist.properties.some(
      (p) => p.property.toString() === req.params.propertyId
    );

    if (alreadyAdded) {
      return res.status(400).json({ success: false, message: 'Property already in wishlist' });
    }

    wishlist.properties.push({ property: req.params.propertyId });
    await wishlist.save();

    res.json({ success: true, message: 'Added to wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:propertyId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.properties = wishlist.properties.filter(
      (p) => p.property.toString() !== req.params.propertyId
    );

    await wishlist.save();
    res.json({ success: true, message: 'Removed from wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
