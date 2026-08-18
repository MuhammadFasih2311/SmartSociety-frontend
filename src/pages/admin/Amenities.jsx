import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaArrowLeft, FaArrowRight, FaBuilding,
  FaUsers, FaDollarSign, FaMapMarkerAlt,
  FaCheckCircle, FaTimesCircle, FaClock,
  FaSwimmer, FaDumbbell, FaTableTennis,
  FaChild, FaBook, FaMusic, FaUtensils
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Amenities = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byType: {}
  });
  const itemsPerPage = 6;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  const formatCurrency = (amount) => {
    return `Rs. ${amount || 0}`;
  };

  useEffect(() => {
    fetchAmenities();
    fetchStats();
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const fetchAmenities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/amenities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAmenities(response.data.data);
    } catch (error) {
      console.error('Fetch amenities error:', error);
      toast.error(error.response?.data?.message || 'Failed to load amenities');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/amenities/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/amenities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Amenity deleted successfully!');
      fetchAmenities();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = !currentStatus;
      await axios.patch(`${API_URL}/admin/amenities/${id}/status`,
        { isActive: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Amenity ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchAmenities();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  const getAmenityIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'pool': return <FaSwimmer className="text-2xl" />;
      case 'gym': return <FaDumbbell className="text-2xl" />;
      case 'clubhouse': return <FaBuilding className="text-2xl" />;
      case 'tennis': return <FaTableTennis className="text-2xl" />;
      case 'playground': return <FaChild className="text-2xl" />;
      case 'library': return <FaBook className="text-2xl" />;
      case 'party hall': return <FaMusic className="text-2xl" />;
      default: return <FaUtensils className="text-2xl" />;
    }
  };

  const getAmenityColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'pool': return 'from-blue-400/20 to-blue-400/5 text-blue-400';
      case 'gym': return 'from-red-400/20 to-red-400/5 text-red-400';
      case 'clubhouse': return 'from-purple-400/20 to-purple-400/5 text-purple-400';
      case 'tennis': return 'from-green-400/20 to-green-400/5 text-green-400';
      case 'playground': return 'from-yellow-400/20 to-yellow-400/5 text-yellow-400';
      case 'library': return 'from-indigo-400/20 to-indigo-400/5 text-indigo-400';
      case 'party hall': return 'from-pink-400/20 to-pink-400/5 text-pink-400';
      default: return 'from-gray-400/20 to-gray-400/5 text-gray-400';
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
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && amenity.isActive) ||
      (filterStatus === 'inactive' && !amenity.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAmenities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAmenities = filteredAmenities.slice(startIndex, startIndex + itemsPerPage);

  const statCards = [
    { label: 'Total Amenities', value: stats.total, icon: <FaBuilding />, color: 'from-accent to-accent-light' },
    { label: 'Active', value: stats.active, icon: <FaCheckCircle />, color: 'from-success to-emerald-400' },
    { label: 'Inactive', value: stats.inactive, icon: <FaTimesCircle />, color: 'from-red-400 to-pink-400' },
    { label: 'Total Slots', value: stats.totalSlots || 0, icon: <FaUsers />, color: 'from-blue-400 to-cyan-400' },
  ];

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
        <p className="text-text-muted mt-2">Loading amenities...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Amenities Management</h1>
        <p className="text-text-muted text-sm mt-1">Manage all community amenities and facilities.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className="glass-card p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-text-muted text-xs">{stat.label}</span>
              <span className={`text-lg bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.icon}
              </span>
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(stats.byType || {}).map(([type, count]) => (
          <span key={type} className="text-xs px-3 py-1 rounded-full bg-primary-light/50 text-text-muted">
            {type}: {count}
          </span>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, location or description..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All Types</option>
            {amenityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Link to="/admin/amenities/create" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaPlus /> Add Amenity
          </Link>
        </div>
      </div>

      {filteredAmenities.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FaBuilding className="text-5xl text-text-muted/20 mx-auto mb-4" />
          <p className="text-text-muted">No amenities found</p>
          <p className="text-text-muted/50 text-sm mt-1">Try adjusting your search or filters</p>
          <Link to="/admin/amenities/create" className="btn-primary mt-4 text-sm inline-flex items-center gap-2">
            <FaPlus /> Add First Amenity
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedAmenities.map((amenity) => (
              <div
                key={amenity._id}
                className={`glass-card p-5 hover:border-accent/40 transition-all duration-300 group ${
                  !amenity.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${getAmenityColor(amenity.type)} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {getAmenityIcon(amenity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-base truncate">{amenity.name}</h3>
                        <p className="text-text-muted text-xs flex items-center gap-1">
                          <FaMapMarkerAlt className="text-accent" />
                          {amenity.location || 'Available'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          amenity.isActive ? 'bg-success/20 text-success' : 'bg-red-400/20 text-red-400'
                        }`}>
                          {amenity.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <FaUsers className="text-accent" />
                        {amenity.capacity || 10}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaDollarSign className="text-accent" />
                        {/* ✅ Rs sign instead of $ */}
                        {formatCurrency(amenity.pricePerHour)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-accent" />
                        {amenity.timings?.start || '08:00'} - {amenity.timings?.end || '22:00'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleStatusToggle(amenity._id, amenity.isActive)}
                    className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                      amenity.isActive 
                        ? 'text-warning hover:bg-warning/10' 
                        : 'text-success hover:bg-success/10'
                    }`}
                  >
                    {amenity.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <Link
                    to={`/admin/amenities/show/${amenity._id}`}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors"
                    title="View"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <Link
                    to={`/admin/amenities/edit/${amenity._id}`}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors"
                    title="Edit"
                  >
                    <FaEdit className="text-sm" />
                  </Link>
                  <button
                    onClick={() => handleDelete(amenity._id, amenity.name)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
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
    </div>
  );
};

export default Amenities;