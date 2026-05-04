import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { clearWishlist } from "../store/slices/wishlistSlice";
import { getInitials } from "../utils/helpers";
import toast from "react-hot-toast";

export default function Navbar({ theme = "light", onToggleTheme }) {
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearWishlist());
    toast.success("Logged out successfully");
    navigate("/");
    setDropOpen(false);
  };

  const dashboardLink =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "agent"
        ? "/agent"
        : "/dashboard";
  const isActive = (path) =>
    location.pathname === path
      ? "text-primary-600 dark:text-primary-300 font-semibold"
      : "text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300";

  const isDarkTheme = theme === "dark";
  const ThemeIcon = isDarkTheme ? "🌙" : "☀️";

  return (
    <header className="bg-white/95 dark:bg-slate-950/90 backdrop-blur sticky top-0 z-50 border-b border-gray-100 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-primary-700 dark:text-primary-300"
          >
            <span className="text-2xl"> </span>
            <span>EstateHub</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className={isActive("/")}>
              Home
            </Link>
            {user && (
              <Link to={dashboardLink} className={isActive(dashboardLink)}>
                Dashboard
              </Link>
            )}
            {user?.role === "agent" && (
              <Link to="/agent/add" className="btn-primary text-sm py-2 px-4">
                + Add Property
              </Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleTheme}
              className="theme-toggle group"
              aria-label={
                isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              <span className="text-base leading-none">{ThemeIcon}</span>
              <span className="hidden sm:inline text-sm leading-none">
                {isDarkTheme ? "Dark" : "Light"}
              </span>
              <span className="theme-toggle-track ml-1" aria-hidden="true">
                <span
                  className={`theme-toggle-thumb ${isDarkTheme ? "translate-x-5" : "translate-x-0"}`}
                />
              </span>
            </button>
            {!user ? (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-100 leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-400 capitalize">
                      {user.role}
                    </p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 dark:text-slate-400 transition-transform ${dropOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-slate-800 py-2 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-50 dark:border-slate-800 mb-1">
                      <p className="font-semibold text-sm text-gray-800 dark:text-slate-100">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to={dashboardLink}
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      📊 Dashboard
                    </Link>
                    {user.role === "user" && (
                      <Link
                        to="/dashboard"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                      >
                        ❤️ Wishlist{" "}
                        {items.length > 0 && (
                          <span className="ml-auto bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                            {items.length}
                          </span>
                        )}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={onToggleTheme}
              className="theme-toggle px-2.5 py-2"
              aria-label={
                isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              <span className="text-base leading-none">{ThemeIcon}</span>
              <span className="theme-toggle-track">
                <span
                  className={`theme-toggle-thumb ${isDarkTheme ? "translate-x-5" : "translate-x-0"}`}
                />
              </span>
            </button>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-700 dark:text-slate-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 dark:border-slate-800 mt-2 space-y-1 animate-fadeIn">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              🏠 Home
            </Link>
            {user ? (
              <>
                <Link
                  to={dashboardLink}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  📊 Dashboard
                </Link>
                {user.role === "agent" && (
                  <Link
                    to="/agent/add"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    ➕ Add Property
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-primary-600 font-medium hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-slate-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
