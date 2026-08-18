import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      if (response.data.success) {
        if (response.data.data?.resetToken) {
          navigate(`/reset-password?token=${response.data.data.resetToken}`);
          toast.success('Email verified! Please set your new password.');
        } else {
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
      toast.error(message);
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
              <FaEnvelope className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-3xl font-bold">Forgot Password</h2>
            <p className="text-gray-500 mt-2">
              Enter your email address to reset your password.
            </p>
          </div>

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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="you@example.com"
                  className={`w-full bg-[#0e0d16] border ${
                    error ? 'border-red-500/50' : 'border-white/10'
                  } rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10`}
                  disabled={loading}
                />
                {error && (
                  <p className="text-red-400 text-xs mt-1">{error}</p>
                )}
              </div>
            </div>

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
                  Verifying...
                </>
              ) : (
                <>
                  Send Reset Link
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-gray-500 text-xs text-center">
              Demo Email: <span className="text-gray-400">admin@smartsociety.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;