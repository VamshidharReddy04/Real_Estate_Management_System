import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../store/slices/propertySlice";
import PropertyCard from "../components/PropertyCard";
import SearchFilter from "../components/SearchFilter";
import {
  featuredCityImages,
  genericPropertyFallbackImage,
  heroBannerImage,
} from "../utils/imageFallbacks";

const HERO_STATS = [
  { label: "Properties Listed", value: "10,000+" },
  { label: "Happy Clients", value: "25,000+" },
  { label: "Verified Agents", value: "1,200+" },
  { label: "Cities Covered", value: "50+" },
];

const FEATURED_CITIES = [
  {
    name: "Mumbai",
    img: featuredCityImages.Mumbai,
    count: "2,400+",
  },
  {
    name: "Delhi",
    img: featuredCityImages.Delhi,
    count: "1,800+",
  },
  {
    name: "Bangalore",
    img: featuredCityImages.Bangalore,
    count: "3,100+",
  },
  {
    name: "Hyderabad",
    img: featuredCityImages.Hyderabad,
    count: "1,600+",
  },
  {
    name: "Chennai",
    img: featuredCityImages.Chennai,
    count: "900+",
  },
  {
    name: "Pune",
    img: featuredCityImages.Pune,
    count: "1,200+",
  },
];

const CITY_IMAGE_FALLBACK = genericPropertyFallbackImage;

const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-card">
    <div className="skeleton h-52 w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-5 w-1/3 rounded" />
    </div>
  </div>
);

export default function Home() {
  const dispatch = useDispatch();
  const { properties, pagination, loading, error, isFallbackData } =
    useSelector((s) => s.properties);
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});
  const latestPropertiesRef = useRef(null);

  const scrollToLatestProperties = () => {
    if (!latestPropertiesRef.current) return;
    latestPropertiesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    dispatch(fetchProperties({ ...activeFilters, page, limit: 12 }));

    if (page > 1 && latestPropertiesRef.current) {
      latestPropertiesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [page, activeFilters]);

  const handleFilter = (filters, options = {}) => {
    const { scrollToResults = false } = options;
    setActiveFilters(filters);
    setPage(1);

    if (scrollToResults) {
      requestAnimationFrame(scrollToLatestProperties);
    }
  };

  const handleRetry = () => {
    dispatch(fetchProperties({ ...activeFilters, page, limit: 12 }));
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 text-slate-900 dark:from-primary-900 dark:via-primary-800 dark:to-primary-700 dark:text-white">
        <div
          className="absolute inset-0 opacity-20 mix-blend-multiply dark:mix-blend-normal dark:opacity-10"
          style={{
            backgroundImage: `url(${heroBannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <span className="inline-block bg-white/70 border border-primary-200/80 text-primary-800 text-sm px-4 py-1.5 rounded-full mb-5 backdrop-blur dark:bg-white/10 dark:border-white/20 dark:text-white">
            🏆 India's #1 Real Estate Platform
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight text-slate-900 dark:text-white">
            Find Your{" "}
            <span className="text-primary-700 dark:text-gold-400">
              Dream Property
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 dark:text-primary-100 mb-10 max-w-2xl mx-auto">
            Browse thousands of verified listings across India. Buy, sell, or
            rent with confidence using EstateHub.
          </p>

          {/* Quick type buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {["house", "apartment", "villa", "commercial"].map((type) => (
              <button
                key={type}
                onClick={() =>
                  handleFilter({ type }, { scrollToResults: true })
                }
                className="bg-white/80 border border-primary-200 hover:bg-white text-primary-800 px-5 py-2 rounded-full text-sm font-medium transition-all capitalize backdrop-blur dark:bg-white/10 dark:border-white/30 dark:hover:bg-white/20 dark:text-white"
              >
                {type === "house"
                  ? "🏠"
                  : type === "apartment"
                    ? "🏢"
                    : type === "villa"
                      ? "🏰"
                      : "🏪"}{" "}
                {type}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                className="bg-white/75 backdrop-blur rounded-xl p-4 border border-primary-200/70 dark:bg-white/10 dark:border-white/20"
              >
                <div className="text-2xl font-bold text-primary-700 dark:text-gold-400">
                  {s.value}
                </div>
                <div className="text-xs text-slate-600 dark:text-primary-200 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SearchFilter onFilter={handleFilter} />

        <div
          ref={latestPropertiesRef}
          className="flex items-center justify-between mb-6 scroll-mt-24"
        >
          <div>
            <h2 className="section-title mb-0">
              {Object.values(activeFilters).some(Boolean)
                ? "Search Results"
                : "Latest Properties"}
            </h2>
            {pagination && (
              <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">
                {pagination.total} properties found
              </p>
            )}
          </div>
        </div>

        {isFallbackData && !loading && (
          <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Showing fallback demo properties because the database is
            unreachable. Add your current IP to MongoDB Atlas Network Access to
            load all properties.
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Unable to load properties
            </h3>
            <p className="text-gray-500 dark:text-slate-300">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏚️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No properties found
            </h3>
            <p className="text-gray-500 dark:text-slate-300">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((p, index) => (
                <PropertyCard key={p._id} property={p} fallbackIndex={index} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-primary-600 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"}`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  disabled={page === pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Featured Cities */}
      <section className="bg-white py-14 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title text-slate-900 dark:text-white">
              Explore by City
            </h2>
            <p className="section-subtitle text-slate-600 dark:text-slate-300">
              Find properties in India's top real estate markets
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED_CITIES.map((city) => (
              <button
                key={city.name}
                aria-label={`Browse properties in ${city.name}`}
                onClick={() =>
                  handleFilter({ city: city.name }, { scrollToResults: true })
                }
                className="group relative h-32 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-hover dark:border-slate-800 dark:bg-slate-900/70"
              >
                <img
                  src={city.img}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = CITY_IMAGE_FALLBACK;
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent dark:from-slate-950/90 dark:via-slate-950/40" />
                <div className="absolute inset-x-2 bottom-2 rounded-lg bg-black/45 px-2.5 py-2 text-center backdrop-blur-sm dark:bg-slate-950/70">
                  <p className="text-white font-semibold text-sm">
                    {city.name}
                  </p>
                  <p className="text-white/70 text-xs">{city.count} listings</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 text-slate-900 py-16 dark:bg-primary-700 dark:text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">
            Are You an Agent?
          </h2>
          <p className="text-slate-700 dark:text-primary-200 mb-8 text-lg">
            List your properties and connect with thousands of potential buyers
            and renters on EstateHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-primary-600 text-white dark:bg-white dark:text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-primary-700 dark:hover:bg-primary-50 transition-colors"
            >
              Register as Agent
            </a>
            <a
              href="/"
              className="border border-primary-300 text-primary-700 dark:border-white/40 dark:text-white px-8 py-3 rounded-xl hover:bg-primary-50 dark:hover:bg-white/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
