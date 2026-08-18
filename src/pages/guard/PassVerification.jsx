import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCheckCircle, FaTimesCircle, FaSearch,
  FaUser, FaHome, FaClock, FaArrowLeft,
  FaKey, FaPhone, FaCar, FaFileAlt, FaInfoCircle,
  FaIdCard, FaUserCheck
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const PassVerification = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  const handleVerify = async () => {
    if (!searchTerm || searchTerm.trim() === '') {
      toast.error('Please enter a name, phone number, or CNIC');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await axios.post(`${API_URL}/guard/verify`, 
        { searchTerm: searchTerm.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const result = response.data.data;
        setVerificationResult(result);

        setSearchHistory(prev => [
          { term: searchTerm.trim(), timestamp: new Date().toLocaleTimeString() },
          ...prev.slice(0, 4)
        ]);
        
        if (result.valid) {
          toast.success('Visitor verified successfully!');
        } else {
          toast.error(result.message || 'Verification failed');
        }
      } else {
        toast.error(response.data.message || 'Verification failed');
        setVerificationResult({
          valid: false,
          message: response.data.message || 'No visitor found'
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to verify';
      toast.error(errorMessage);
      setVerificationResult({
        valid: false,
        message: errorMessage
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setVerificationResult(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Verified':
      case 'approved':
        return 'bg-success/20 text-success';
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'rejected':
      case 'Flagged':
        return 'bg-red-400/20 text-red-400';
      case 'cancelled':
        return 'bg-gray-400/20 text-gray-400';
      default:
        return 'bg-text-muted/20 text-text-muted';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Pass Verification</h1>
          <p className="text-text-muted text-sm mt-1">Search visitor by name, phone number, or CNIC.</p>
        </div>
        <Link to="/guard/dashboard" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <FaArrowLeft />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaUserCheck className="text-accent" />
            Search Visitor
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-text-muted text-sm mb-2">
                Name / Phone / CNIC
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter name, phone number, or CNIC..."
                    className="w-full pl-10 pr-4 py-3 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors placeholder-text-muted"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-text-muted text-xs">Try:</span>
                <button 
                  onClick={() => setSearchTerm('Ahmed')}
                  className="text-xs text-accent hover:text-accent-light transition-colors"
                >
                  Name
                </button>
                <span className="text-text-muted text-xs">•</span>
                <button 
                  onClick={() => setSearchTerm('0300')}
                  className="text-xs text-accent hover:text-accent-light transition-colors"
                >
                  Phone
                </button>
                <span className="text-text-muted text-xs">•</span>
                <button 
                  onClick={() => setSearchTerm('12345')}
                  className="text-xs text-accent hover:text-accent-light transition-colors"
                >
                  CNIC
                </button>
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className={`w-full btn-primary flex items-center justify-center gap-2 py-3 ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch />
                  Search & Verify
                </>
              )}
            </button>

            {verificationResult && (
              <button
                onClick={handleReset}
                className="w-full text-text-muted hover:text-white transition-colors text-sm"
              >
                Clear Result
              </button>
            )}

            {searchHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-text-muted text-xs mb-2">Recent Searches</p>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(item.term)}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-text-muted hover:text-white transition-colors"
                    >
                      {item.term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaInfoCircle className="text-accent" />
            Verification Result
          </h2>

          {verificationResult ? (
            <div className={`p-6 rounded-xl ${
              verificationResult.valid 
                ? 'bg-success/10 border border-success/30' 
                : 'bg-red-400/10 border border-red-400/30'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {verificationResult.valid ? (
                  <FaCheckCircle className="text-success text-3xl" />
                ) : (
                  <FaTimesCircle className="text-red-400 text-3xl" />
                )}
                <div>
                  <p className={`text-lg font-bold ${verificationResult.valid ? 'text-success' : 'text-red-400'}`}>
                    {verificationResult.valid ? 'Verified ✓' : 'Not Found ✗'}
                  </p>
                  <p className="text-text-muted text-sm">
                    ID: {verificationResult.visitor?._id?.slice(-6) || 'N/A'}
                  </p>
                </div>
              </div>

              {verificationResult.message && (
                <div className={`p-3 rounded-xl mb-4 ${
                  verificationResult.valid 
                    ? 'bg-success/20 text-success' 
                    : 'bg-red-400/20 text-red-400'
                }`}>
                  <p className="text-sm">{verificationResult.message}</p>
                </div>
              )}

              {verificationResult.visitor ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <FaUser className="text-accent" />
                    <div>
                      <p className="text-text-muted text-xs">Visitor Name</p>
                      <p className="text-white font-medium">
                        {verificationResult.visitor.name || verificationResult.visitor.visitorName || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <FaHome className="text-accent" />
                    <div>
                      <p className="text-text-muted text-xs">Flat Number</p>
                      <p className="text-white font-medium">{verificationResult.visitor.flatNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <FaPhone className="text-accent" />
                    <div>
                      <p className="text-text-muted text-xs">Phone</p>
                      <p className="text-white font-medium">{verificationResult.visitor.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <FaIdCard className="text-accent" />
                    <div>
                      <p className="text-text-muted text-xs">CNIC / ID</p>
                      <p className="text-white font-medium">{verificationResult.visitor.idNumber || verificationResult.visitor.cnic || 'N/A'}</p>
                    </div>
                  </div>
                  {verificationResult.visitor.purpose && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <FaFileAlt className="text-accent" />
                      <div>
                        <p className="text-text-muted text-xs">Purpose</p>
                        <p className="text-white font-medium">{verificationResult.visitor.purpose}</p>
                      </div>
                    </div>
                  )}
                  {verificationResult.visitor.vehicleNumber && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <FaCar className="text-accent" />
                      <div>
                        <p className="text-text-muted text-xs">Vehicle</p>
                        <p className="text-white font-medium">{verificationResult.visitor.vehicleNumber}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <FaClock className="text-accent" />
                    <div>
                      <p className="text-text-muted text-xs">Entry Time</p>
                      <p className="text-white font-medium">{verificationResult.visitor.entryTime || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <FaInfoCircle className="text-accent" />
                    <div>
                      <p className="text-text-muted text-xs">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(verificationResult.visitor.status)}`}>
                        {verificationResult.visitor.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaSearch className="text-5xl text-text-muted/20 mx-auto mb-4" />
                  <p className="text-text-muted">No visitor found</p>
                  <p className="text-text-muted/50 text-sm">Try searching with different criteria</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaUserCheck className="text-6xl text-text-muted/20 mx-auto mb-4" />
              <p className="text-text-muted">No verification performed yet</p>
              <p className="text-text-muted/50 text-sm">Enter name, phone, or CNIC to search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassVerification;