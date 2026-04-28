const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    type: {
      type: String,
      required: [true, "Property type is required"],
      enum: ["house", "apartment", "villa", "commercial", "land", "office"],
    },
    status: {
      type: String,
      enum: ["sale", "rent"],
      required: [true, "Status is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    priceUnit: {
      type: String,
      enum: ["total", "per_month", "per_year"],
      default: "total",
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: "India" },
      zipCode: { type: String, default: "" },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    features: {
      bedrooms: { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      area: { type: Number, required: [true, "Area is required"] },
      areaUnit: {
        type: String,
        enum: ["sqft", "sqm", "acres"],
        default: "sqft",
      },
      parking: { type: Boolean, default: false },
      furnished: {
        type: String,
        enum: ["unfurnished", "semi-furnished", "fully-furnished"],
        default: "unfurnished",
      },
      floor: { type: Number },
      totalFloors: { type: Number },
      yearBuilt: { type: Number },
    },
    amenities: [{ type: String }],
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
      },
    ],
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

// Text index for search
propertySchema.index({
  title: "text",
  description: "text",
  "location.city": "text",
  "location.address": "text",
});

// Supports default list query: { isApproved: true, isAvailable: true }.sort('-createdAt')
propertySchema.index({ isApproved: 1, isAvailable: 1, createdAt: -1 });

// Helps common filtered listing variants
propertySchema.index({
  isApproved: 1,
  isAvailable: 1,
  type: 1,
  status: 1,
  createdAt: -1,
});

// Helps featured-city filtering + latest sort
propertySchema.index({
  isApproved: 1,
  isAvailable: 1,
  "location.city": 1,
  createdAt: -1,
});

module.exports = mongoose.model("Property", propertySchema);
