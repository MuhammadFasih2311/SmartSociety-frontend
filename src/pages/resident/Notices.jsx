import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaBuilding, FaSearch, FaArrowLeft, FaArrowRight,
  FaEye, FaCalendarAlt, FaUser, FaTag,
  FaTimesCircle, FaBell, FaClock, FaFilter,
  FaExclamationCircle, FaInfoCircle, FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Notices = () => {
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({ total: 0, byCategory: {} });
  const itemsPerPage = 6;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchNotices();
    fetchStats();
  }, []);

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/resident/notices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📝 Notices response:', response.data);
      setNotices(response.data.data || []);
    } catch (error) {
      console.error('Fetch notices error:', error);
      toast.error(error.response?.data?.message || 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/resident/notices/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📊 Stats response:', response.data);
      setStats(response.data.data || { total: 0, byCategory: {} });
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const getCategoryBadge = (category) => {
    switch(category?.toLowerCase()) {
      case 'billing':
        return { color: 'bg-green-400/20 text-green-400', label: 'Billing', icon: <FaInfoCircle /> };
      case 'security':
        return { color: 'bg-red-400/20 text-red-400', label: 'Security', icon: <FaExclamationCircle /> };
      case 'event':
        return { color: 'bg-purple-400/20 text-purple-400', label: 'Event', icon: <FaBell /> };
      case 'facility':
        return { color: 'bg-blue-400/20 text-blue-400', label: 'Facility', icon: <FaBuilding /> };
      case 'utility':
        return { color: 'bg-yellow-400/20 text-yellow-400', label: 'Utility', icon: <FaClock /> };
      case 'general':
        return { color: 'bg-gray-400/20 text-gray-400', label: 'General', icon: <FaInfoCircle /> };
      default:
        return { color: 'bg-text-muted/20 text-text-muted', label: category || 'Other', icon: <FaTag /> };
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-400/20 text-orange-400 border-orange-400/30';
      case 'medium':
        return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'low':
        return 'bg-blue-400/20 text-blue-400 border-blue-400/30';
      default:
        return 'bg-text-muted/20 text-text-muted';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'urgent':
        return <FaExclamationCircle className="text-red-400" />;
      case 'high':
        return <FaExclamationCircle className="text-orange-400" />;
      case 'medium':
        return <FaClock className="text-yellow-400" />;
      case 'low':
        return <FaInfoCircle className="text-blue-400" />;
      default:
        return <FaTag className="text-text-muted" />;
    }
  };

  const categories = ['Billing', 'Security', 'Event', 'Facility', 'Utility', 'General'];
  const priorities = ['Urgent', 'High', 'Medium', 'Low'];

  const filteredNotices = notices.filter(notice => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      notice.title?.toLowerCase().includes(search) ||
      notice.content?.toLowerCase().includes(search) ||
      notice.category?.toLowerCase().includes(search);
    const matchesCategory = filterCategory === 'all' || notice.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || notice.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetails = (notice) => {
    setSelectedNotice(notice);
    setShowDetails(true);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent/20 border-t-accent"></div>
          <p className="text-text-muted mt-4">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Notices</h1>
        <p className="text-text-muted text-sm mt-1">View all society notices and announcements.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-xs">Total Notices</p>
              <p className="text-2xl font-bold text-white">{stats.total || notices.length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <FaBell />
            </div>
          </div>
        </div>
        {categories.slice(0, 4).map((cat) => (
          <div key={cat} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs capitalize">{cat}</p>
                <p className="text-2xl font-bold text-white">
                  {stats.byCategory?.[cat] || notices.filter(n => n.category === cat).length}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-full ${getCategoryBadge(cat).color} flex items-center justify-center`}>
                {getCategoryBadge(cat).icon}
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
            placeholder="Search notices by title, content or category..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors min-w-[140px]"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => { setFilterPriority(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors min-w-[140px]"
        >
          <option value="all">All Priorities</option>
          {priorities.map(pri => (
            <option key={pri} value={pri}>{pri}</option>
          ))}
        </select>
      </div>

      {filteredNotices.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FaBell className="text-5xl text-text-muted/20 mx-auto mb-4" />
          <p className="text-text-muted text-lg">No notices found</p>
          <p className="text-text-muted/50 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedNotices.map((notice) => {
              const categoryBadge = getCategoryBadge(notice.category);
              const priorityClass = getPriorityBadge(notice.priority);
              const isNew = new Date(notice.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              const statusColor = notice.status === 'Published' ? 'bg-success/20 text-success' : 
                                 notice.status === 'Draft' ? 'bg-warning/20 text-warning' : 
                                 'bg-red-400/20 text-red-400';

              return (
                <div
                  key={notice._id}
                  className="glass-card p-5 hover:border-accent/40 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  onClick={() => handleViewDetails(notice)}
                >
                  {isNew && notice.status === 'Published' && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-accent/20 text-accent text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                        NEW
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColor}`}>
                      {notice.status || 'Draft'}
                    </span>
                  </div>

                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    notice.priority?.toLowerCase() === 'urgent' ? 'bg-red-500' :
                    notice.priority?.toLowerCase() === 'high' ? 'bg-orange-400' :
                    notice.priority?.toLowerCase() === 'medium' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />

                  <div className="pl-3 pt-2">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${categoryBadge.color} flex items-center gap-1`}>
                        {categoryBadge.icon}
                        {categoryBadge.label}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityClass}`}>
                        {notice.priority || 'Medium'}
                      </span>
                    </div>

                    <h3 className="text-white font-semibold text-base line-clamp-2 group-hover:text-accent transition-colors">
                      {notice.title}
                    </h3>

                    <p className="text-text-muted text-sm mt-2 line-clamp-3">
                      {notice.content}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-accent text-[10px]" />
                          {formatDate(notice.date || notice.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUser className="text-accent text-[10px]" />
                          {notice.author || notice.createdBy?.fullName || 'Admin'}
                        </span>
                      </div>
                      <button
                        className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors"
                        title="View Details"
                      >
                        <FaEye className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <p className="text-text-muted text-sm">
                Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredNotices.length)} of {filteredNotices.length} notices
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

      {showDetails && selectedNotice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${getCategoryBadge(selectedNotice.category).color} flex items-center justify-center text-lg`}>
                  {getCategoryBadge(selectedNotice.category).icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Notice Details</h3>
                  <p className="text-text-muted text-xs">Posted on {formatDate(selectedNotice.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-text-muted hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <FaTimesCircle className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadge(selectedNotice.category).color} flex items-center gap-1`}>
                  {getCategoryBadge(selectedNotice.category).icon}
                  {getCategoryBadge(selectedNotice.category).label}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityBadge(selectedNotice.priority)} flex items-center gap-1`}>
                  {getPriorityIcon(selectedNotice.priority)}
                  {selectedNotice.priority || 'Medium'} Priority
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedNotice.status === 'Published' ? 'bg-success/20 text-success' : 
                  selectedNotice.status === 'Draft' ? 'bg-warning/20 text-warning' : 
                  'bg-red-400/20 text-red-400'
                }`}>
                  {selectedNotice.status || 'Draft'}
                </span>
                {new Date(selectedNotice.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                  <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full animate-pulse">
                    New
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-white">{selectedNotice.title}</h2>
              <div className="flex items-center gap-4 text-sm text-text-muted border-b border-white/5 pb-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <FaUser className="text-accent" />
                  {selectedNotice.author || selectedNotice.createdBy?.fullName || 'Admin'}
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendarAlt className="text-accent" />
                  {formatDate(selectedNotice.date || selectedNotice.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-accent" />
                  {new Date(selectedNotice.createdAt).toLocaleTimeString()}
                </span>
              </div>

              <div className="bg-primary-light/30 rounded-xl p-4">
                <p className="text-white whitespace-pre-wrap leading-relaxed">
                  {selectedNotice.content}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 btn-secondary px-4 py-2"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetails(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 btn-primary flex items-center justify-center gap-2 px-4 py-2"
              >
                <FaEye />
                Back to Notices
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;