import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    if (isAuthenticated && user) {
      window.location.href = `/${user.role}/dashboard`;
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        const { token, user, redirectTo } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success(response.data.message || 'Login successful!');

        setTimeout(() => {
          window.location.href = redirectTo;
        }, 200);
      } else {
        setError(response.data.message || 'Login failed');
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please make sure backend is running.';
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0c14] text-white relative overflow-hidden flex items-center justify-center px-4 py-8">
      <div className="absolute top-[-180px] left-[-180px] w-[450px] h-[450px] bg-orange-500/10 rounded-full blur-[130px]" />
      <div className="absolute bottom-[-180px] right-[-180px] w-[450px] h-[450px] bg-yellow-400/10 rounded-full blur-[130px]" />

      <div className="absolute top-[20%] left-[8%] w-1 h-1 bg-orange-500 rounded-full opacity-70" />
      <div className="absolute top-[35%] right-[12%] w-1 h-1 bg-orange-500 rounded-full opacity-60" />
      <div className="absolute bottom-[20%] left-[18%] w-1 h-1 bg-yellow-400 rounded-full opacity-50" />
      <div className="absolute bottom-[30%] right-[20%] w-1 h-1 bg-orange-500 rounded-full opacity-50" />

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 21V3h16v18H4Zm3-3h2v-2H7v2Zm0-4h2v-2H7v2Zm0-4h2V8H7v2Zm4 8h2v-2h-2v2Zm0-4h2v-2h-2v2Zm0-4h2V8h-2v2Zm4 8h2v-6h-2v6Zm0-8h2V6h-2v2Z" />
              </svg>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
              SmartSociety
            </span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium mb-7">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            Smart Society Management
          </div>

          <h1 className="text-5xl xl:text-6xl font-bold leading-[1.08]">
            Welcome
            <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
              Back
            </span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg leading-8 max-w-lg">
            Login to your SmartSociety account and manage your
            community experience from one secure place.
          </p>

          <div className="mt-10 flex items-center gap-10">
            <div>
              <p className="text-2xl font-bold text-orange-400">500+</p>
              <p className="text-gray-500 text-sm mt-1">Residents</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-orange-400">200+</p>
              <p className="text-gray-500 text-sm mt-1">Families</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-orange-400">50+</p>
              <p className="text-gray-500 text-sm mt-1">Amenities</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-[#151421]/95 border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/30 backdrop-blur-xl relative">
            <Link
              to="/"
              className="absolute top-4 left-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all duration-300 group"
              title="Back to Home"
            >
              <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>

            <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 21V3h16v18H4Zm3-3h2v-2H7v2Zm0-4h2v-2H7v2Zm0-4h2V8H7v2Zm4 8h2v-2h-2v2Zm0-4h2v-2h-2v2Zm0-4h2V8h-2v2Zm4 8h2v-6h-2v6Zm0-8h2V6h-2v2Z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                SmartSociety
              </span>
            </div>

            <div className="mb-8 mt-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-5">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="m10 17 5-5-5-5" />
                  <path d="M15 12H3" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Login to your SmartSociety account</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-[#0e0d16] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-orange-400 hover:text-yellow-300 transition">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#0e0d16] border border-white/10 rounded-xl py-4 pl-12 pr-16 text-white placeholder-gray-600 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-orange-400 transition"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                  disabled={loading}
                />
                <span className="text-sm text-gray-500">Remember me</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-yellow-300 text-black font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to Account
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>

              <div className="mt-7 pt-6 border-t border-white/5 text-center">
                  <p className="text-gray-500 text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-orange-400 font-semibold hover:text-yellow-300 transition"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
            </form>
            
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-gray-500 text-xs text-center">
                Demo Credentials:
              </p>
              <div className="grid grid-cols-1 gap-1 mt-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Admin:</span>
                  <span>admin@smartsociety.com / admin123</span>
                </div>
                <div className="flex justify-between">
                  <span>Resident:</span>
                  <span>resident1@smartsociety.com / resident123</span>
                </div>
                <div className="flex justify-between">
                  <span>Guard:</span>
                  <span>guard1@smartsociety.com / guard123</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-xs mt-5">
            🔒 Your connection is secure and protected
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;