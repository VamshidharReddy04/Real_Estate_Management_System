import React, { useEffect, useRef, useState } from "react";
import { PROPERTY_TYPES, PROPERTY_STATUS } from "../utils/helpers";

export default function SearchFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  });
  const liveSearchTimer = useRef(null);

  const shouldTriggerLiveFilter = (name, value) => {
    if (name !== "search" && name !== "city") return false;
    const trimmed = String(value || "").trim();
    return trimmed.length === 0 || trimmed.length >= 2;
  };

  const handle = (e) => {
    const { name, value } = e.target;
    const next = { ...filters, [name]: value };

    setFilters(next);

    if (name === "search" || name === "city") {
      if (liveSearchTimer.current) {
        clearTimeout(liveSearchTimer.current);
      }

      if (shouldTriggerLiveFilter(name, value)) {
        liveSearchTimer.current = setTimeout(() => {
          onFilter(next);
        }, 350);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (liveSearchTimer.current) {
        clearTimeout(liveSearchTimer.current);
      }
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };
  const reset = () => {
    if (liveSearchTimer.current) {
      clearTimeout(liveSearchTimer.current);
    }
    const cleared = {
      search: "",
      type: "",
      status: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
    };
    setFilters(cleared);
    onFilter(cleared);
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-2xl shadow-card p-5 mb-8"
    >
      {/* Main search bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            name="search"
            value={filters.search}
            onChange={handle}
            placeholder="Search by title, city, or keyword..."
            className="input-field pl-10"
          />
        </div>
        <button type="submit" className="btn-primary px-6">
          Search
        </button>
      </div>

      {/* Filters row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <select
          name="type"
          value={filters.type}
          onChange={handle}
          className="input-field text-sm capitalize"
        >
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">
              {t}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handle}
          className="input-field text-sm"
        >
          <option value="">Buy or Rent</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>

        <input
          name="city"
          value={filters.city}
          onChange={handle}
          placeholder="City"
          className="input-field text-sm"
        />

        <input
          name="minPrice"
          value={filters.minPrice}
          onChange={handle}
          placeholder="Min Price (₹)"
          type="number"
          className="input-field text-sm"
        />

        <input
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handle}
          placeholder="Max Price (₹)"
          type="number"
          className="input-field text-sm"
        />

        <select
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handle}
          className="input-field text-sm"
        >
          <option value="">Any Beds</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+ Beds
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end mt-3">
        <button
          type="button"
          onClick={reset}
          className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Clear Filters
        </button>
      </div>
    </form>
  );
}
