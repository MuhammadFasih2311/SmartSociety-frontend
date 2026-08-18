import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const API_URL = "https://smart-society-backend-dusky.vercel.app/api";

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    flatNumber: "",
    blockName: "",
    occupancyType: "owner",
    vehicleNumber: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (value.length < 3) {
          error = "Username must be at least 3 characters";
        } else if (value.length > 20) {
          error = "Username cannot exceed 20 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Username can only contain letters, numbers, and underscores";
        }
        break;

      case "fullName":
        if (value.length < 2) {
          error = "Full name must be at least 2 characters";
        } else if (value.length > 50) {
          error = "Full name cannot exceed 50 characters";
        } else if (!/^[a-zA-Z\s.]+$/.test(value)) {
          error = "Full name can only contain letters, spaces, and dots";
        }
        break;

      case "phone":
        if (value.length < 10) {
          error = "Phone number must be at least 10 digits";
        } else if (value.length > 15) {
          error = "Phone number cannot exceed 15 digits";
        } else if (!/^[\d+\s-]+$/.test(value)) {
          error = "Phone number can only contain digits, spaces, +, and -";
        }
        break;

      case "flatNumber":
        if (value && !/^[0-9]+$/.test(value)) {
          error = "Flat number can only contain digits";
        }
        break;

      case "blockName":
        if (value && !/^[a-zA-Z\s]+$/.test(value)) {
          error = "Block name can only contain letters and spaces";
        }
        break;

      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "password":
        if (value.length < 6) {
          error = "Password must be at least 6 characters";
        } else if (value.length > 30) {
          error = "Password cannot exceed 30 characters";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    validateField(name, newValue);
    setError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrors({});

    const validationFields = [
      "username",
      "fullName",
      "email",
      "phone",
      "flatNumber",
      "blockName",
      "password",
      "confirmPassword",
    ];

    let hasError = false;

    validationFields.forEach((field) => {
      const value = formData[field];
      if (!value || value.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          [field]: `${field === "flatNumber" ? "Flat" : field === "blockName" ? "Block" : field} is required`,
        }));
        hasError = true;
      } else {
        const fieldError = validateField(field, value);
        if (fieldError) {
          hasError = true;
        }
      }
    });

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      hasError = true;
    }

    if (!formData.agreeTerms) {
      setError("Please agree to the Terms & Conditions.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/auth/register`, {
        username: formData.username.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: "resident",
        flatNumber: formData.flatNumber.trim(),
        blockName: formData.blockName.trim(),
        occupancyType: formData.occupancyType,
        vehicleNumber: formData.vehicleNumber.trim(),
      });

      if (response.data.success) {
        toast.success(
          "Registration submitted! Please wait for admin approval."
        );
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    const baseClass =
      "w-full bg-[#0e0d16] border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 outline-none transition-all focus:ring-2";

    if (errors[fieldName]) {
      return `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500/10`;
    }
    return `${baseClass} border-white/10 focus:border-orange-400 focus:ring-orange-400/10`;
  };

  return (
    <div className="min-h-screen bg-[#0d0c14] text-white relative overflow-hidden">
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[120px]" />
      <div className="absolute top-32 left-[8%] w-1 h-1 bg-orange-500 rounded-full opacity-70" />
      <div className="absolute top-52 right-[15%] w-1 h-1 bg-orange-500 rounded-full opacity-60" />
      <div className="absolute bottom-32 left-[20%] w-1 h-1 bg-yellow-400 rounded-full opacity-50" />

      <main className="relative z-10 min-h-[calc(100vh-81px)] flex items-center justify-center px-4 py-10 mt-4 sm:py-14">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium mb-7">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              Smart Society Management
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.08]">
              Join
              <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                SmartSociety
              </span>
              <span className="block text-white">Today</span>
            </h1>

            <p className="mt-6 text-gray-400 text-lg leading-8 max-w-xl">
              Create your account and experience a smarter, safer and more
              connected community living experience.
            </p>

            <div className="mt-9 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Secure & Private</h3>
                  <p className="text-gray-500 text-sm">
                    Your community data stays protected.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 11h18" />
                    <path d="M5 11V9a7 7 0 0 1 14 0v2" />
                    <path d="M7 11v7h10v-7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Easy Community Access
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Manage everything from one place.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8v4l3 2" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Save Time</h3>
                  <p className="text-gray-500 text-sm">
                    Handle bills, visitors and complaints easily.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl mx-auto">
            <div className="bg-[#151421]/95 border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="mb-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <svg
                      className="w-6 h-6 text-black"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M19 8v6" />
                      <path d="M22 11h-6" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Create Account</h2>
                    <p className="text-gray-500 text-sm">
                      Join your SmartSociety community
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                      </svg>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Choose username"
                        maxLength="20"
                        className={getInputClass("username")}
                      />
                      {errors.username && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.username}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                      </svg>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter full name"
                        maxLength="50"
                        className={getInputClass("fullName")}
                      />
                      {errors.fullName && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="you@example.com"
                        maxLength="50"
                        className={getInputClass("email")}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6.5 3h3l1.5 4-2 1.5a16 16 0 0 0 6.5 6.5L17 13l4 1.5v3c0 1.1-.9 2-2 2C10.7 19.5 4.5 13.3 4.5 5c0-1.1.9-2 2-2Z" />
                      </svg>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="+92 300 1234567"
                        maxLength="15"
                        className={getInputClass("phone")}
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Flat Number <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 21h18" />
                        <path d="M5 21V5l7-3 7 3v16" />
                        <path d="M9 21v-4h6v4" />
                      </svg>
                      <input
                        type="text"
                        name="flatNumber"
                        value={formData.flatNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 204"
                        maxLength="10"
                        className={getInputClass("flatNumber")}
                      />
                      {errors.flatNumber && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.flatNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Block Name <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 21h18" />
                        <path d="M5 21V5l7-3 7 3v16" />
                        <path d="M9 8h1" />
                        <path d="M14 8h1" />
                      </svg>
                      <input
                        type="text"
                        name="blockName"
                        value={formData.blockName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Block A"
                        maxLength="20"
                        className={getInputClass("blockName")}
                      />
                      {errors.blockName && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.blockName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Occupancy Type
                    </label>
                    <select
                      name="occupancyType"
                      value={formData.occupancyType}
                      onChange={handleChange}
                      className="w-full bg-[#0e0d16] border border-white/10 rounded-xl py-3.5 px-4 text-white outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                    >
                      <option value="owner" className="bg-[#151421]">
                        Owner
                      </option>
                      <option value="tenant" className="bg-[#151421]">
                        Tenant
                      </option>
                      <option value="rental" className="bg-[#151421]">
                        Rental
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Vehicle Number
                      <span className="text-gray-600 ml-1">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      placeholder="e.g. ABC-123"
                      maxLength="15"
                      className="w-full bg-[#0e0d16] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect x="4" y="10" width="16" height="11" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="••••••••"
                        maxLength="30"
                        className={getInputClass("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                      {errors.password && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect x="4" y="10" width="16" height="11" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="••••••••"
                        maxLength="30"
                        className={getInputClass("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                      {errors.confirmPassword && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-500 leading-6">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-orange-400 hover:text-yellow-300 transition"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-orange-400 hover:text-yellow-300 transition"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-yellow-300 text-black font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  )}
                </button>
              </form>

              <div className="mt-7 pt-6 border-t border-white/5 text-center">
                <p className="text-gray-500 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-orange-400 font-semibold hover:text-yellow-300 transition"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center text-gray-600 text-xs mt-5">
              🔒 Your information is securely protected
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;