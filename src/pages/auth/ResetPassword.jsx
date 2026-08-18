import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaLock, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [validToken, setValidToken] = useState(true);

  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    if (!token) {
      setValidToken(false);
      toast.error('Invalid or missing reset token');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = () => {
    if (!formData.password) {
      setError('Please enter a new password');
      toast.error('Please enter a new password');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password: formData.password,
      });

      if (response.data.success) {
        setSubmitted(true);
        toast.success(response.data.message || 'Password reset successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
      toast.error(message);
      if (error.response?.status === 400) {
        setValidToken(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen bg-[#0d0c14] text-white relative overflow-hidden flex items-center justify-center px-4 py-8">
        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="bg-[#151421]/95 border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/30 backdrop-blur-xl text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h2>
            <p className="text-gray-500 text-sm mb-6">
              The password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password" className="btn-primary inline-block px-6 py-3 text-sm">
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0c14] text-white relative overflow-hidden flex items-center justify-center px-4 py-8">
      <div className="absolute top-[-180px] left-[-180px] w-[450px] h-[450px] bg-orange-500/10 rounded-full blur-[130px]" />
      <div className="absolute bottom-[-180px] right-[-180px] w-[450px] h-[450px] bg-yellow-400/10 rounded-full blur-[130px]" />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-[#151421]/95 border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6"
          >
            <FaArrowLeft className="text-sm" />
            <span className="text-sm">Back to Login</span>
          </button>

          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-5">
              <FaLock className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-3xl font-bold">Set New Password</h2>
            <p className="text-gray-500 mt-2">
              Create a new password for your account.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Password Reset!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Your password has been changed successfully.
                <br />
                Redirecting to login...
              </p>
              <Link to="/login" className="btn-primary inline-block px-6 py-3 text-sm">
                Login Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-full bg-[#0e0d16] border border-white/10 rounded-xl py-4 pl-12 pr-16 text-white placeholder-gray-600 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-1">Must be at least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className="w-full bg-[#0e0d16] border border-white/10 rounded-xl py-4 pl-12 pr-16 text-white placeholder-gray-600 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-yellow-300 text-black font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;