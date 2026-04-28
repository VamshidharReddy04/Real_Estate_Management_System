const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const mongoose = require("mongoose");

const isDbReady = () => mongoose.connection.readyState === 1;
const dbUnavailableMessage =
  "Database is currently unavailable. Please check MongoDB Atlas network access and try again.";
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    if (!isDbReady()) {
      return res
        .status(503)
        .json({ success: false, message: dbUnavailableMessage });
    }

    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Only allow user and agent roles on registration
    const allowedRoles = ["user", "agent"];
    const userRole = allowedRoles.includes(role) ? role : "user";

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      phone: phone || "",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    if (!isDbReady()) {
      return res
        .status(503)
        .json({ success: false, message: dbUnavailableMessage });
    }

    const { email, name, identifier, password } = req.body;
    const loginIdentifier = (identifier || email || name || "").trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name/email and password",
      });
    }

    const isEmailLogin = loginIdentifier.includes("@");
    let user;

    if (isEmailLogin) {
      user = await User.findOne({
        email: loginIdentifier.toLowerCase(),
      }).select("+password");
    } else {
      const escapedName = escapeRegex(loginIdentifier);
      const matchedUsers = await User.find({
        name: { $regex: `^${escapedName}$`, $options: "i" },
      })
        .select("+password")
        .limit(2);

      if (matchedUsers.length > 1) {
        return res.status(400).json({
          success: false,
          message:
            "Multiple accounts use this name. Please login with email instead.",
        });
      }

      user = matchedUsers[0];
    }

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Contact admin.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    if (!isDbReady()) {
      return res
        .status(503)
        .json({ success: false, message: dbUnavailableMessage });
    }

    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    if (!isDbReady()) {
      return res
        .status(503)
        .json({ success: false, message: dbUnavailableMessage });
    }

    const { name, phone, agentInfo } = req.body;
    const updateData = { name, phone };
    if (agentInfo && req.user.role === "agent") {
      updateData.agentInfo = agentInfo;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile };
