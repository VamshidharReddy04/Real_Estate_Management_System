import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import {
  formatPrice,
  truncate,
  getPropertyIcon,
  getAgentDisplayName,
} from "../utils/helpers";
import toast from "react-hot-toast";
import {
  getPropertyFallbackImage,
  genericPropertyFallbackImage,
} from "../utils/imageFallbacks";

export default function PropertyCard({ property, fallbackIndex }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.wishlist);
  const isWishlisted = items.some(
    (i) => i.property?._id === property._id || i.property === property._id,
  );

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to save properties");
    if (user.role !== "user")
      return toast.error("Only users can wishlist properties");
    if (isWishlisted) {
      await dispatch(removeFromWishlist(property._id));
      toast.success("Removed from wishlist");
    } else {
      await dispatch(addToWishlist(property._id));
      toast.success("Added to wishlist ❤️");
    }
  };

  const fallbackImage = getPropertyFallbackImage(property, fallbackIndex);
  const mainImage = property.images?.[0]?.url || fallbackImage;

  return (
    <Link
      to={`/properties/${property._id}`}
      className="card group block overflow-hidden animate-fadeIn"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage || genericPropertyFallbackImage;
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`badge text-white ${property.status === "sale" ? "bg-primary-600" : "bg-emerald-500"}`}
          >
            For {property.status === "sale" ? "Sale" : "Rent"}
          </span>
          <span className="badge bg-white text-gray-700 capitalize">
            {getPropertyIcon(property.type)} {property.type}
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow
            ${isWishlisted ? "bg-red-500 text-white" : "bg-white text-gray-500 hover:text-red-500 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-red-400"}`}
        >
          <svg
            className="w-4 h-4"
            fill={isWishlisted ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {!property.isApproved && (
          <div className="absolute bottom-3 left-3 badge bg-amber-500 text-white">
            ⏳ Pending Approval
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-base leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
            {truncate(property.title, 50)}
          </h3>
        </div>

        <p className="text-gray-500 dark:text-slate-300 text-sm mb-3 flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {property.location?.city}, {property.location?.state}
        </p>

        {/* Features */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-300 mb-3 pb-3 border-b border-gray-100 dark:border-slate-700">
          {property.features?.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              🛏 {property.features.bedrooms} Beds
            </span>
          )}
          {property.features?.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              🚿 {property.features.bathrooms} Baths
            </span>
          )}
          <span className="flex items-center gap-1">
            📐 {property.features?.area} {property.features?.areaUnit}
          </span>
        </div>

        {/* Price + Agent */}
        <div className="flex items-center justify-between">
          <p className="text-primary-700 font-bold text-lg">
            {formatPrice(property.price, property.priceUnit)}
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
              {getAgentDisplayName(property.agent)[0]?.toUpperCase() || "A"}
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-300">
              {getAgentDisplayName(property.agent)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
