import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Footer() {
  const { user } = useSelector((s) => s.auth);

  const quickLinks = [
    { to: "/", label: "Home" },
    ...(user
      ? [
          {
            to:
              user.role === "admin"
                ? "/admin"
                : user.role === "agent"
                  ? "/agent"
                  : "/dashboard",
            label: "Dashboard",
          },
        ]
      : []),
    ...(!user
      ? [
          { to: "/login", label: "Login" },
          { to: "/register", label: "Register" },
        ]
      : []),
    ...(user?.role === "agent"
      ? [{ to: "/agent/add", label: "Add Property" }]
      : []),
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-white text-slate-700 border-t border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.06),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_28%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl"
            >
              <span className="text-2xl">🏠</span> EstateHub
            </Link>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              India's trusted real estate platform. Discover premium properties
              for sale and rent across top cities. Connect with verified agents
              and find your dream home.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">
              Quick Links
            </h4>
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:border-primary-400/50 hover:bg-primary-50 hover:text-primary-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-primary-400/40 dark:hover:bg-primary-500/10 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>📧 info@estatehub.in</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Hyderabad, India</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 dark:border-white/10 pt-6 flex flex-col gap-2 text-center text-xs text-slate-500 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>
            © {new Date().getFullYear()} EstateHub. All rights reserved.
          </span>
          <span>Built with MERN Stack</span>
        </div>
      </div>
    </footer>
  );
}
