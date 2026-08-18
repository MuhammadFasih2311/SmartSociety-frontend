import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaBell, FaCalendar, 
  FaUser, FaTag, FaSearch, FaFilter, FaArrowLeft, 
  FaArrowRight, FaCheckCircle, FaClock, FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Notices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 4;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchNotices();
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/notices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotices(response.data.data);
    } catch (error) {
      console.error('Fetch notices error:', error);
      toast.error(error.response?.data?.message || 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this notice?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Notice deleted successfully!');
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/notices/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to ${newStatus}`);
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  const categories = ['Billing', 'Security', 'Event', 'Facility', 'Utility', 'General'];
  const statuses = ['Published', 'Draft', 'Archived'];

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = (notice.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notice.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notice.author || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || (notice.category || '').toLowerCase() === filterCategory.toLowerCase();
    const matchesStatus = filterStatus === 'all' || (notice.status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  const stats = [
    { label: 'Total Notices', value: notices.length, icon: <FaBell />, color: 'from-accent to-accent-light' },
    { label: 'Published', value: notices.filter(n => n.status === 'Published').length, icon: <FaCheckCircle />, color: 'from-success to-emerald-400' },
    { label: 'Draft', value: notices.filter(n => n.status === 'Draft').length, icon: <FaClock />, color: 'from-warning to-orange-400' },
    { label: 'Archived', value: notices.filter(n => n.status === 'Archived').length, icon: <FaExclamationTriangle />, color: 'from-red-400 to-pink-400' },
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Urgent': return 'bg-red-400/20 text-red-400';
      case 'High': return 'bg-warning/20 text-warning';
      case 'Medium': return 'bg-blue-400/20 text-blue-400';
      case 'Low': return 'bg-green-400/20 text-green-400';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return 'bg-success/20 text-success';
      case 'Draft': return 'bg-warning/20 text-warning';
      case 'Archived': return 'bg-red-400/20 text-red-400';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  const statusOptions = [
    { value: 'Published', color: '#22c55e' },
    { value: 'Draft', color: '#eab308' },
    { value: 'Archived', color: '#f87171' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Notices & Announcements</h1>
        <p className="text-text-muted text-sm mt-1">Create, manage, and broadcast notices to all residents.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
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

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by title, content or author..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>{cat}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status.toLowerCase()}>{status}</option>
            ))}
          </select>
          <Link to="/admin/notices/create" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaPlus /> Create Notice
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
          <p className="text-text-muted mt-2">Loading notices...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FaBell className="text-5xl text-text-muted/20 mx-auto mb-4" />
          <p className="text-text-muted">No notices found</p>
          <p className="text-text-muted/50 text-sm mt-1">Try adjusting your search or filters</p>
          <Link to="/admin/notices/create" className="btn-primary mt-4 text-sm inline-flex items-center gap-2">
            <FaPlus /> Create First Notice
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedNotices.map((notice) => {
              const noticeId = notice._id || notice.id;
              return (
                <div key={noticeId || Math.random()} className="glass-card p-6 hover:border-accent/30 transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-white font-medium text-lg">{notice.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </span>
                        <select
                          value={notice.status || 'Draft'}
                          onChange={(e) => handleStatusChange(noticeId, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-none focus:ring-0 focus:outline-none cursor-pointer ${getStatusColor(notice.status)}`}
                          style={{
                            minWidth: '100px',
                            appearance: 'auto',
                            WebkitAppearance: 'auto',
                            backgroundColor: '#1a1a2e',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          {statusOptions.map((status) => (
                            <option 
                              key={status.value} 
                              value={status.value}
                              style={{
                                backgroundColor: '#1a1a2e',
                                color: status.color,
                                padding: '4px 8px',
                                fontWeight: '500'
                              }}
                            >
                              {status.value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="text-text-muted text-sm mb-3 line-clamp-2">{notice.content}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <FaTag className="text-accent" /> {notice.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendar className="text-accent" /> {notice.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUser className="text-accent" /> {notice.author}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/notices/show/${noticeId}`} className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="View">
                        <FaEye className="text-sm" />
                      </Link>
                      <Link to={`/admin/notices/edit/${noticeId}`} className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="Edit">
                        <FaEdit className="text-sm" />
                      </Link>
                      <button onClick={() => handleDelete(noticeId)} className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors" title="Delete">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <p className="text-text-muted text-sm">
                Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredNotices.length)} of {filteredNotices.length} notices
              </p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1 ${currentPage === 1 ? 'text-text-muted/30 cursor-not-allowed' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>
                  <FaArrowLeft className="text-xs" /> Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 text-sm rounded-lg transition-colors ${currentPage === i + 1 ? 'bg-accent text-primary' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1 ${currentPage === totalPages ? 'text-text-muted/30 cursor-not-allowed' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>
                  Next <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notices;