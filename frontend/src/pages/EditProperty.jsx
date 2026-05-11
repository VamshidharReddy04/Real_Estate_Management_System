import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProperty, updateProperty } from "../store/slices/propertySlice";
import {
  PROPERTY_TYPES,
  FURNISHED_OPTIONS,
  AMENITIES_LIST,
} from "../utils/helpers";
import toast from "react-hot-toast";

export default function EditProperty() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { property, loading } = useSelector((s) => s.properties);
  const [form, setForm] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    dispatch(fetchProperty(id));
  }, [id]);

  useEffect(() => {
    if (property && property._id === id) {
      setForm({
        title: property.title || "",
        description: property.description || "",
        type: property.type || "apartment",
        status: property.status || "sale",
        price: property.price || "",
        priceUnit: property.priceUnit || "total",
        location: { ...property.location },
        features: { ...property.features },
        amenities: property.amenities || [],
      });
    }
  }, [property]);

  if (!form)
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-4 animate-pulse">
          <div className="skeleton h-8 w-1/3 rounded" />
          <div className="skeleton h-96 rounded-xl" />
        </div>
      </div>
    );

  const set = (path, val) => {
    setForm((f) => {
      const copy = JSON.parse(JSON.stringify(f));
      const keys = path.split(".");
      let ref = copy;
      keys.slice(0, -1).forEach((k) => (ref = ref[k]));
      ref[keys[keys.length - 1]] = val;
      return copy;
    });
  };

  const toggleAmenity = (a) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((p) => [...p, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.features.area)
      return toast.error("Please fill all required fields");

    const fd = new FormData();
    fd.append("data", JSON.stringify(form));
    newImages.forEach((img) => fd.append("images", img));

    const res = await dispatch(updateProperty({ id, formData: fd }));
    if (!res.error) {
      toast.success("✅ Property updated successfully!");
      navigate("/agent");
    } else {
      toast.error(res.payload || "Update failed");
    }
  };

  const inputCls = "input-field text-sm";
  const labelCls =
    "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-primary-600 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Basic Information</h2>
          <div>
            <label className={labelCls}>Title *</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputCls}
              maxLength={100}
            />
          </div>
          <div>
            <label className={labelCls}>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type</label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className={inputCls}
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className={inputCls}
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Price (₹) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Price Unit</label>
              <select
                value={form.priceUnit}
                onChange={(e) => set("priceUnit", e.target.value)}
                className={inputCls}
              >
                <option value="total">Total Price</option>
                <option value="per_month">Per Month</option>
                <option value="per_year">Per Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Location</h2>
          <div>
            <label className={labelCls}>Address</label>
            <input
              value={form.location?.address || ""}
              onChange={(e) => set("location.address", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>City</label>
              <input
                value={form.location?.city || ""}
                onChange={(e) => set("location.city", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input
                value={form.location?.state || ""}
                onChange={(e) => set("location.state", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Features</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Bedrooms</label>
              <input
                type="number"
                value={form.features?.bedrooms || 0}
                min={0}
                onChange={(e) => set("features.bedrooms", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Bathrooms</label>
              <input
                type="number"
                value={form.features?.bathrooms || 0}
                min={0}
                onChange={(e) => set("features.bathrooms", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>
                Area * ({form.features?.areaUnit})
              </label>
              <input
                type="number"
                value={form.features?.area || ""}
                onChange={(e) => set("features.area", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Furnishing</label>
              <select
                value={form.features?.furnished || "unfurnished"}
                onChange={(e) => set("features.furnished", e.target.value)}
                className={inputCls}
              >
                {FURNISHED_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Year Built</label>
              <input
                type="number"
                value={form.features?.yearBuilt || ""}
                onChange={(e) => set("features.yearBuilt", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.features?.parking || false}
              onChange={(e) => set("features.parking", e.target.checked)}
              className="w-4 h-4 accent-primary-600"
            />
            <span className="text-sm text-gray-700">🚗 Parking Available</span>
          </label>
        </div>

        {/* Amenities */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_LIST.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${form.amenities?.includes(a) ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"}`}
              >
                {form.amenities?.includes(a) ? "✅ " : ""}
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Existing images */}
        {property?.images?.length > 0 && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-800 mb-3">Current Images</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {property.images.map((img, i) => (
                <img
                  key={i}
                  src={typeof img === "string" ? img : img?.url}
                  alt=""
                  className="w-full h-14 rounded-lg object-cover border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Add more images */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-3">Add More Images</h2>
          <label className="border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all">
            <span className="text-2xl mb-2">📸</span>
            <span className="text-sm font-medium text-gray-600">
              Click to add images
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              className="hidden"
            />
          </label>
          {previews.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-full h-14 rounded-lg object-cover border border-primary-200"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary flex-1 justify-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 justify-center"
          >
            {loading ? "⏳ Saving..." : "✅ Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
