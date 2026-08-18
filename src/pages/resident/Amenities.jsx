import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  FaSearch, FaArrowLeft, FaArrowRight,
  FaEye, FaCalendarAlt, FaUser, FaTag,
  FaTimesCircle, FaBell, FaClock,
  FaUsers, FaUtensils, FaDumbbell, FaSwimmer,
  FaTableTennis, FaChild, FaBook, FaMusic,
  FaMapMarkerAlt, FaDollarSign, FaInfoCircle,
  FaCalendarCheck  
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Amenities = () => {
  const [loading, setLoading] = useState(true);
  const [amenities, setAmenities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({ total: 0, byType: {} });
  const itemsPerPage = 6;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  const formatCurrency = (amount) => {
    return `Rs. ${amount || 0}`;
  };

  useEffect(() => {
    fetchAmenities();
    fetchStats();
  }, []);

  const fetchAmenities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/resident/amenities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAmenities(response.data.data || []);
    } catch (error) {
      console.error('Fetch amenities error:', error);
      toast.error('Failed to load amenities');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/resident/amenities/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const getAmenityIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'pool':
        return <FaSwimmer className="text-2xl" />;
      case 'gym':
        return <FaDumbbell className="text-2xl" />;
      case 'clubhouse':
        return <FaUsers className="text-2xl" />;
      case 'tennis':
        return <FaTableTennis className="text-2xl" />;
      case 'playground':
        return <FaChild className="text-2xl" />;
      case 'library':
        return <FaBook className="text-2xl" />;
      case 'party hall':
        return <FaMusic className="text-2xl" />;
      default:
        return <FaUtensils className="text-2xl" />;
    }
  };

  const getAmenityColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'pool':
        return 'from-blue-400/20 to-blue-400/5 text-blue-400';
      case 'gym':
        return 'from-red-400/20 to-red-400/5 text-red-400';
      case 'clubhouse':
        return 'from-purple-400/20 to-purple-400/5 text-purple-400';
      case 'tennis':
        return 'from-green-400/20 to-green-400/5 text-green-400';
      case 'playground':
        return 'from-yellow-400/20 to-yellow-400/5 text-yellow-400';
      case 'library':
        return 'from-indigo-400/20 to-indigo-400/5 text-indigo-400';
      case 'party hall':
        return 'from-pink-400/20 to-pink-400/5 text-pink-400';
      default:
        return 'from-gray-400/20 to-gray-400/5 text-gray-400';
    }
  };

  const amenityTypes = ['Pool', 'Gym', 'Clubhouse', 'Tennis', 'Playground', 'Library', 'Party Hall'];

  const filteredAmenities = amenities.filter(amenity => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      amenity.name?.toLowerCase().includes(search) ||
      amenity.location?.toLowerCase().includes(search) ||
      amenity.description?.toLowerCase().includes(search);
    const matchesType = filterType === 'all' || amenity.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredAmenities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAmenities = filteredAmenities.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetails = (amenity) => {
    setSelectedAmenity(amenity);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent/20 border-t-accent"></div>
          <p className="text-text-muted mt-4">Loading amenities...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Amenities</h1>
        <p className="text-text-muted text-sm mt-1">Explore all community amenities and facilities.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-xs">Total Amenities</p>
              <p className="text-2xl font-bold text-white">{stats.total || amenities.length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <FaBell />
            </div>
          </div>
        </div>
        {amenityTypes.slice(0, 4).map((type) => (
          <div key={type} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs capitalize">{type}</p>
                <p className="text-2xl font-bold text-white">
                  {stats.byType?.[type] || amenities.filter(a => a.type === type).length}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getAmenityColor(type)} flex items-center justify-center`}>
                {getAmenityIcon(type)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search amenities by name, location or description..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors min-w-[160px]"
        >
          <option value="all">All Types</option>
          {amenityTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {filteredAmenities.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FaBell className="text-5xl text-text-muted/20 mx-auto mb-4" />
          <p className="text-text-muted text-lg">No amenities found</p>
          <p className="text-text-muted/50 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedAmenities.map((amenity) => (
              <div
                key={amenity._id}
                className="glass-card p-5 hover:border-accent/40 transition-all duration-300 cursor-pointer group"
                onClick={() => handleViewDetails(amenity)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${getAmenityColor(amenity.type)} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {getAmenityIcon(amenity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-white font-semibold text-base truncate">{amenity.name}</h3>
                      <button className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors flex-shrink-0">
                        <FaEye className="text-sm" />
                      </button>
                    </div>
                    <p className="text-text-muted text-sm mt-1 flex items-center gap-1">
                      <FaMapMarkerAlt className="text-accent text-xs" />
                      {amenity.location || 'Available'}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <FaUsers className="text-accent" />
                        {amenity.capacity || 10} capacity
                      </span>
                      <span className="flex items-center gap-1">
                        <FaDollarSign className="text-accent" />
                        {/* ✅ Rs sign instead of $ */}
                        {formatCurrency(amenity.pricePerHour)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <p className="text-text-muted text-sm">
                Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredAmenities.length)} of {filteredAmenities.length} amenities
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1
                    ${currentPage === 1 ? 'text-text-muted/30 cursor-not-allowed' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                >
                  <FaArrowLeft className="text-xs" />
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors
                      ${currentPage === i + 1 ? 'bg-accent text-primary' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1
                    ${currentPage === totalPages ? 'text-text-muted/30 cursor-not-allowed' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                >
                  Next
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showDetailModal && selectedAmenity && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getAmenityColor(selectedAmenity.type)} flex items-center justify-center text-2xl`}>
                  {getAmenityIcon(selectedAmenity.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedAmenity.name}</h3>
                  <p className="text-text-muted text-xs">{selectedAmenity.type}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-text-muted hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <FaTimesCircle className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-accent" />
                <span className="text-white">{selectedAmenity.location || 'No location specified'}</span>
              </div>

              {selectedAmenity.description && (
                <div className="bg-primary-light/30 rounded-xl p-4">
                  <p className="text-text-muted text-sm">Description</p>
                  <p className="text-white text-sm mt-1">{selectedAmenity.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-light/20 rounded-xl p-3 text-center">
                  <p className="text-text-muted text-xs">Capacity</p>
                  <p className="text-white font-bold text-lg">{selectedAmenity.capacity || 10}</p>
                </div>
                <div className="bg-primary-light/20 rounded-xl p-3 text-center">
                  <p className="text-text-muted text-xs">Price Per Hour</p>
                  <p className="text-accent font-bold text-lg">{formatCurrency(selectedAmenity.pricePerHour)}</p>
                </div>
                <div className="bg-primary-light/20 rounded-xl p-3 text-center">
                  <p className="text-text-muted text-xs">Available Slots</p>
                  <p className="text-white font-bold text-lg">{selectedAmenity.availableSlots || 5}</p>
                </div>
                <div className="bg-primary-light/20 rounded-xl p-3 text-center">
                  <p className="text-text-muted text-xs">Timings</p>
                  <p className="text-white font-bold text-sm">
                    {selectedAmenity.timings?.start || '08:00'} - {selectedAmenity.timings?.end || '22:00'}
                  </p>
                </div>
              </div>

              <Link
                to="/resident/booking"
                state={{ preSelectedAmenity: selectedAmenity._id }}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                onClick={() => setShowDetailModal(false)}
              >
                <FaCalendarCheck />
                Book This Amenity
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Amenities;