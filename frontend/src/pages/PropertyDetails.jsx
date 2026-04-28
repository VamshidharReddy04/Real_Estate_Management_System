import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperty, deleteProperty } from "../store/slices/propertySlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import {
  formatPrice,
  formatDate,
  getPropertyIcon,
  getAgentDisplayName,
  AMENITIES_LIST,
} from "../utils/helpers";
import API from "../utils/axios";
import toast from "react-hot-toast";
import {
  genericPropertyFallbackImage,
  getPropertyFallbackImage,
  getPropertyRoomPreviewImages,
} from "../utils/imageFallbacks";

export default function PropertyDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { property, loading } = useSelector((s) => s.properties);
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.wishlist);
  const [activeImg, setActiveImg] = useState(0);
  const [inquiry, setInquiry] = useState({ message: "", phone: "" });
  const [sending, setSending] = useState(false);
  const isWishlisted = items.some(
    (i) => i.property?._id === id || i.property === id,
  );

  useEffect(() => {
    dispatch(fetchProperty(id));
    setActiveImg(0);
  }, [id]);

  const normalizedSources =
    property?.images
      ?.map((image) => {
        if (typeof image === "string") return image;
        return image?.url;
      })
      .filter(Boolean) || [];

  const primaryImage =
    normalizedSources[0] ||
    (property
      ? getPropertyFallbackImage(property)
      : genericPropertyFallbackImage);

  const roomPreviews = property
    ? getPropertyRoomPreviewImages(property)
    : {
        kitchen: genericPropertyFallbackImage,
        bedroom: genericPropertyFallbackImage,
        hall: genericPropertyFallbackImage,
      };

  const roomGallerySources = [
    primaryImage,
    normalizedSources[1] || roomPreviews.kitchen || primaryImage,
    normalizedSources[2] || roomPreviews.bedroom || primaryImage,
    normalizedSources[3] || roomPreviews.hall || primaryImage,
  ];

  const extraGallerySources = normalizedSources.slice(4);
  const gallerySources = [...roomGallerySources, ...extraGallerySources];

  const thumbnailItems = [
    { label: "Property", src: gallerySources[0] },
    { label: "Kitchen", src: gallerySources[1] },
    { label: "Bed", src: gallerySources[2] },
    { label: "Hall", src: gallerySources[3] },
    ...extraGallerySources.map((src, index) => ({
      label: `Image ${index + 5}`,
      src,
    })),
  ];

  useEffect(() => {
    if (activeImg >= gallerySources.length) {
      setActiveImg(0);
    }
  }, [activeImg, gallerySources.length]);

  if (loading || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton h-96 rounded-2xl" />
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
          </div>
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  const activeSrc = gallerySources[activeImg] || genericPropertyFallbackImage;

  const handleWishlist = async () => {
    if (!user) return toast.error("Please login first");
    if (user.role !== "user")
      return toast.error("Only users can wishlist properties");
    if (isWishlisted) {
      await dispatch(removeFromWishlist(id));
      toast.success("Removed from wishlist");
    } else {
      await dispatch(addToWishlist(id));
      toast.success("Added to wishlist ❤️");
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to contact the agent");
    if (!inquiry.message.trim()) return toast.error("Please enter a message");
    setSending(true);
    try {
      await API.post("/inquiries", {
        propertyId: id,
        message: inquiry.message,
        phone: inquiry.phone,
      });
      toast.success("Inquiry sent! The agent will contact you soon.");
      setInquiry({ message: "", phone: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send inquiry");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;
    const res = await dispatch(deleteProperty(id));
    if (!res.error) {
      toast.success("Property deleted");
      navigate("/agent");
    } else toast.error("Failed to delete property");
  };

  const canEdit =
    user && (user._id === property.agent?._id || user.role === "admin");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button
          onClick={() => navigate("/")}
          className="hover:text-primary-600"
        >
          Home
        </button>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">
          {property.title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="card overflow-hidden">
            {/* Main image display */}
            <div className="relative h-72 sm:h-96 bg-gray-100">
              <img
                src={activeSrc}
                alt={property.title}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = genericPropertyFallbackImage;
                }}
              />

              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={`badge text-white ${property.status === "sale" ? "bg-primary-600" : "bg-emerald-500"}`}
                >
                  For {property.status === "sale" ? "Sale" : "Rent"}
                </span>
                <span className="badge bg-white text-gray-700 capitalize">
                  {getPropertyIcon(property.type)} {property.type}
                </span>
              </div>
              {!property.isApproved && (
                <div className="absolute top-4 right-4 badge bg-amber-500 text-white">
                  ⏳ Pending Approval
                </div>
              )}
            </div>

            {/* Property image thumbnails */}
            <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
              {thumbnailItems.map((item, i) => (
                <button
                  key={`${property._id}-${i}`}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? "border-primary-500" : "border-transparent hover:border-gray-300"}`}
                >
                  <img
                    src={item.src}
                    alt={`${property.title} ${item.label}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = genericPropertyFallbackImage;
                    }}
                  />
                  <span className="sr-only">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Price */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {property.title}
                </h1>
                <p className="text-gray-500 flex items-center gap-1">
                  📍 {property.location?.address}, {property.location?.city},{" "}
                  {property.location?.state}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-700">
                  {formatPrice(property.price, property.priceUnit)}
                </p>
                {property.status === "rent" && (
                  <p className="text-sm text-gray-400">per month</p>
                )}
              </div>
            </div>

            {canEdit && (
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => navigate(`/agent/edit/${id}`)}
                  className="btn-secondary text-sm py-2"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-danger text-sm py-2"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>

          {/* Key Features */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Property Features</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: "🛏",
                  label: "Bedrooms",
                  value: property.features?.bedrooms || "N/A",
                },
                {
                  icon: "🚿",
                  label: "Bathrooms",
                  value: property.features?.bathrooms || "N/A",
                },
                {
                  icon: "📐",
                  label: "Area",
                  value: `${property.features?.area} ${property.features?.areaUnit}`,
                },
                {
                  icon: "🏢",
                  label: "Floor",
                  value: property.features?.floor
                    ? `${property.features.floor}/${property.features?.totalFloors}`
                    : "N/A",
                },
                {
                  icon: "🛋️",
                  label: "Furnished",
                  value: property.features?.furnished || "N/A",
                },
                {
                  icon: "🚗",
                  label: "Parking",
                  value: property.features?.parking ? "Yes" : "No",
                },
                {
                  icon: "📅",
                  label: "Year Built",
                  value: property.features?.yearBuilt || "N/A",
                },
                { icon: "👁️", label: "Views", value: property.views || 0 },
              ].map((f) => (
                <div
                  key={f.label}
                  className="bg-gray-50 rounded-xl p-3 text-center"
                >
                  <div className="text-xl mb-1">{f.icon}</div>
                  <div className="font-semibold text-gray-800 text-sm capitalize">
                    {f.value}
                  </div>
                  <div className="text-xs text-gray-400">{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span
                    key={a}
                    className="badge bg-primary-50 text-primary-700 border border-primary-100 px-3 py-1.5 text-sm"
                  >
                    ✅ {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Posted date */}
          <p className="text-xs text-gray-400">
            Listed on {formatDate(property.createdAt)}
          </p>
        </div>

        {/* Right: Agent + Inquiry */}
        <div className="space-y-5">
          {/* Agent Card */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Contact Agent</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-lg font-bold">
                {getAgentDisplayName(property.agent)[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {getAgentDisplayName(property.agent)}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  🏠 {property.agent?.role}
                </p>
                {property.agent?.agentInfo?.agency && (
                  <p className="text-xs text-gray-400">
                    {property.agent.agentInfo.agency}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {property.agent?.phone && (
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  📞 {property.agent.phone}
                </a>
              )}
              <a
                href={`mailto:${property.agent?.email}`}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                ✉️ {property.agent?.email}
              </a>
            </div>
          </div>

          {/* Wishlist btn */}
          {user?.role === "user" && (
            <button
              onClick={handleWishlist}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all border ${
                isWishlisted
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500"
              }`}
            >
              {isWishlisted ? "❤️ Saved to Wishlist" : "🤍 Save to Wishlist"}
            </button>
          )}

          {/* Inquiry Form */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Send Inquiry</h3>
            {!user ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-3">
                  Login to contact the agent
                </p>
                <a href="/login" className="btn-primary text-sm py-2">
                  Login Now
                </a>
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Your Name
                  </label>
                  <input
                    value={user.name}
                    disabled
                    className="input-field bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Phone (optional)
                  </label>
                  <input
                    value={inquiry.phone}
                    onChange={(e) =>
                      setInquiry((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="+91 98765 43210"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Message *
                  </label>
                  <textarea
                    value={inquiry.message}
                    onChange={(e) =>
                      setInquiry((p) => ({ ...p, message: e.target.value }))
                    }
                    rows={4}
                    placeholder="I'm interested in this property. Please share more details..."
                    className="input-field text-sm resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full justify-center"
                >
                  {sending ? "⏳ Sending..." : "📩 Send Inquiry"}
                </button>
              </form>
            )}
          </div>

          {/* Share */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Share Property</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
                className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
              >
                🔗 Copy Link
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out this property: ${property.title} - ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 text-sm text-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                📱 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
