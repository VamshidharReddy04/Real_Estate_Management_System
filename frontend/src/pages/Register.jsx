import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";

const PasswordToggleIcon = ({ visible }) =>
  visible ? (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12S5.25 5.25 12 5.25 21.75 12 21.75 12 18.75 18.75 12 18.75 2.25 12 2.25 12Z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.88 4.24A9.95 9.95 0 0112 4c5 0 9.27 3.11 11 7.5a12.76 12.76 0 01-4.11 5.24"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.61 6.61A12.01 12.01 0 001 11.5C2.73 15.89 7 19 12 19c1.67 0 3.25-.34 4.68-.95"
      />
    </svg>
  );

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate(user.role === "agent" ? "/agent" : "/dashboard");
    return () => dispatch(clearError());
  }, [user]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      return toast.error(
        "Password must include at least one letter and one number",
      );
    }
    const { confirmPassword, ...data } = form;
    dispatch(registerUser(data));
  };

  return (
    <div className="auth-shell">
      <div className="absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="absolute -bottom-20 left-[-5rem] h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="relative w-full max-w-md animate-fadeIn">
        <div className="auth-card">
          <div className="auth-card-accent" />
          <div className="text-center mb-7">
            <span className="text-4xl"></span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Create Account
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              Join thousands of property seekers and agents
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {["user", "agent"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm((f) => ({ ...f, role: r }))}
                className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.role === r ? "border-primary-300 bg-primary-50 text-primary-800 shadow-lg shadow-primary-100 dark:border-cyan-300 dark:bg-cyan-500/15 dark:text-white dark:shadow-cyan-500/10" : "border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/25 dark:hover:bg-white/10"}`}
              >
                {r === "user" ? "👤 I'm a Buyer/Renter" : "🏢 I'm an Agent"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Full Name *
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="John Doe"
                className="auth-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="you@example.com"
                className="auth-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="+91 98765 43210"
                className="auth-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  pattern="(?=.*[A-Za-z])(?=.*\d).{6,}"
                  title="Use at least 6 characters with at least one letter and one number"
                  className="auth-input pr-16"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <PasswordToggleIcon visible={showPassword} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
                placeholder="Re-enter password"
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="auth-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>{" "}
                  Creating...
                </span>
              ) : (
                " Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 dark:text-slate-300 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-700 dark:text-cyan-300 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
