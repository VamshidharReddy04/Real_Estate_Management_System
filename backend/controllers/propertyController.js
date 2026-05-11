const Property = require("../models/Property");
const { cloudinary } = require("../config/cloudinary");
const fallbackProperties = require("../data/fallbackProperties");

const LIST_SORTS = {
  "-createdAt": { createdAt: -1 },
  createdAt: { createdAt: 1 },
  "-price": { price: -1 },
  price: { price: 1 },
};

const normalizeImages = (images = []) =>
  (Array.isArray(images) ? images : [])
    .map((image) => {
      if (typeof image === "string") {
        return { url: image };
      }

      if (image && typeof image === "object" && image.url) {
        return { url: image.url, public_id: image.public_id };
      }

      return null;
    })
    .filter(Boolean);

const paginateFallbackProperties = ({ page = 1, limit = 12 } = {}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(24, Math.max(1, Number(limit) || 12));
  const skip = (safePage - 1) * safeLimit;
  const items = fallbackProperties.slice(skip, skip + safeLimit);

  return {
    properties: items,
    pagination: {
      total: fallbackProperties.length,
      page: safePage,
      pages: Math.ceil(fallbackProperties.length / safeLimit),
      limit: safeLimit,
    },
  };
};

// @desc    Get all approved properties with filters
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const {
      search,
      type,
      status,
      city,
      minPrice,
      maxPrice,
      bedrooms,
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;

    const query = { isApproved: true, isAvailable: true };
    const escapeRegex = (value = "") =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    if (search) {
      const normalizedSearch = String(search).trim();
      if (normalizedSearch.length >= 2) {
        const prefixSearch = escapeRegex(normalizedSearch);
        query.$or = [
          { title: { $regex: `\\b${prefixSearch}`, $options: "i" } },
          {
            "location.city": { $regex: `\\b${prefixSearch}`, $options: "i" },
          },
        ];
      }
    }
    if (type)
      query.type = {
        $regex: `^${escapeRegex(String(type).trim())}$`,
        $options: "i",
      };
    if (status)
      query.status = {
        $regex: `^${escapeRegex(String(status).trim())}$`,
        $options: "i",
      };
    if (city) {
      const normalizedCity = escapeRegex(String(city).trim());
      query["location.city"] = {
        $regex: `^\\s*${normalizedCity}`,
        $options: "i",
      };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (bedrooms) query["features.bedrooms"] = { $gte: Number(bedrooms) };

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(24, Math.max(1, Number(limit) || 12));
    const skip = (safePage - 1) * safeLimit;
    const sortSpec = LIST_SORTS[String(sort)] || LIST_SORTS["-createdAt"];

    const listQuery = Property.find(query)
      .select(
        "title type status price priceUnit location.city location.state features.bedrooms features.bathrooms features.area features.areaUnit images agent isApproved",
      )
      .populate("agent", "name")
      .sort(sortSpec)
      .allowDiskUse(true)
      .skip(skip)
      .limit(safeLimit)
      .lean();

    const [total, properties] = await Promise.all([
      Property.countDocuments(query),
      listQuery,
    ]);

    const normalizedProperties = properties.map((property) => ({
      ...property,
      images: normalizeImages(property.images).slice(0, 1),
    }));

    res.json({
      success: true,
      properties: normalizedProperties,
      pagination: {
        total,
        page: safePage,
        pages: Math.ceil(total / safeLimit),
        limit: safeLimit,
      },
    });
  } catch (error) {
    const fallback = paginateFallbackProperties({
      page: req.query.page,
      limit: req.query.limit,
    });
    res.json({ success: true, ...fallback, fallback: true });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res) => {
  try {
    const propertyDoc = await Property.findById(req.params.id).populate(
      "agent",
      "name email phone avatar agentInfo role",
    );

    if (!propertyDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Increment views
    propertyDoc.views += 1;
    await propertyDoc.save();

    const property = propertyDoc.toObject();
    property.images = normalizeImages(property.images);

    res.json({ success: true, property });
  } catch (error) {
    const property = fallbackProperties.find(
      (item) => item._id === req.params.id,
    );

    if (property) {
      return res.json({
        success: true,
        property: {
          ...property,
          images: normalizeImages(property.images),
          fallback: true,
        },
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private (Agent, Admin)
const createProperty = async (req, res) => {
  try {
    const body =
      typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;

    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push({ url: file.path, public_id: file.filename });
      });
    }

    // Auto-approve for admins, and in local development to simplify testing.
    const isApproved =
      req.user.role === "admin" || process.env.NODE_ENV === "development";

    const property = await Property.create({
      ...body,
      images,
      agent: req.user.id,
      isApproved,
    });

    await property.populate("agent", "name email phone avatar");

    res.status(201).json({
      success: true,
      message: isApproved
        ? "Property created and approved"
        : "Property submitted for admin approval",
      property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Agent owner, Admin)
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Check ownership
    if (
      property.agent.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this property",
      });
    }

    const body =
      typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
      body.images = [...(property.images || []), ...newImages];
    }

    property = await Property.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).populate("agent", "name email phone avatar");

    res.json({
      success: true,
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Agent owner, Admin)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    if (
      property.agent.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this property",
      });
    }

    // Delete images from cloudinary
    if (property.images && property.images.length > 0) {
      for (const img of property.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id).catch(() => {});
        }
      }
    }

    await property.deleteOne();
    res.json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get agent properties
// @route   GET /api/properties/agent/my
// @access  Private (Agent)
const getAgentProperties = async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.user.id }).sort(
      "-createdAt",
    );
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Get all properties (incl. unapproved)
// @route   GET /api/properties/admin/all
// @access  Private (Admin)
const getAllPropertiesAdmin = async (req, res) => {
  try {
    const properties = await Property.find({})
      .populate("agent", "name email")
      .sort("-createdAt");
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Approve or reject property
// @route   PUT /api/properties/:id/approve
// @access  Private (Admin)
const approveProperty = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true },
    ).populate("agent", "name email");

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.json({
      success: true,
      message: `Property ${isApproved ? "approved" : "rejected"}`,
      property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getAgentProperties,
  getAllPropertiesAdmin,
  approveProperty,
};
