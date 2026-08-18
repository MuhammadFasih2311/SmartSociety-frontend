import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSearch, FaPlus, FaEye, FaEdit, FaTrash,
  FaUser, FaPhone, FaClock, FaCheckCircle,
  FaTimesCircle, FaArrowLeft, FaArrowRight,
  FaHome, FaBan
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Visitors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/guard/visitors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVisitors(response.data.data);
    } catch (error) {
      console.error('Fetch visitors error:', error);
      toast.error('Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/guard/visitors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Visitor deleted successfully!');
      fetchVisitors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/guard/visitors/${id}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to ${status}`);
      fetchVisitors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  const filteredVisitors = visitors.filter(visitor => {
    const name = visitor.name || visitor.visitorName || '';
    const phone = visitor.phone || '';
    const flatNumber = visitor.flatNumber || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         phone.includes(searchTerm) ||
                         flatNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (visitor.status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVisitors = filteredVisitors.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Verified':
      case 'approved':
        return { color: 'bg-success/20 text-success', label: 'Verified', icon: <FaCheckCircle className="text-success" /> };
      case 'Flagged':
      case 'rejected':
        return { color: 'bg-red-400/20 text-red-400', label: 'Flagged', icon: <FaTimesCircle className="text-red-400" /> };
      case 'Resident':
        return { color: 'bg-accent/20 text-accent', label: 'Resident', icon: <FaCheckCircle className="text-accent" /> };
      case 'pending':
        return { color: 'bg-warning/20 text-warning', label: 'Pending', icon: <FaClock className="text-warning" /> };
      case 'cancelled':
        return { color: 'bg-gray-400/20 text-gray-400', label: 'Cancelled', icon: <FaBan className="text-gray-400" /> };
      default:
        return { color: 'bg-text-muted/20 text-text-muted', label: status || 'Unknown', icon: null };
    }
  };

  const statusOptions = ['Verified', 'Flagged', 'Resident', 'pending', 'cancelled'];

  // Stats
  const stats = {
    total: visitors.length,
    verified: visitors.filter(v => v.status === 'Verified' || v.status === 'approved').length,
    flagged: visitors.filter(v => v.status === 'Flagged' || v.status === 'rejected').length,
    resident: visitors.filter(v => v.status === 'Resident').length,
    pending: visitors.filter(v => v.status === 'pending').length,
    cancelled: visitors.filter(v => v.status === 'cancelled').length
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Visitors</h1>
        <p className="text-text-muted text-sm mt-1">Manage all visitors and gate entries.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs">Total Visitors</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-4 border-success/20">
          <p className="text-text-muted text-xs">Verified</p>
          <p className="text-2xl font-bold text-success">{stats.verified}</p>
        </div>
        <div className="glass-card p-4 border-red-400/20">
          <p className="text-text-muted text-xs">Flagged</p>
          <p className="text-2xl font-bold text-red-400">{stats.flagged}</p>
        </div>
        <div className="glass-card p-4 border-accent/20">
          <p className="text-text-muted text-xs">Resident</p>
          <p className="text-2xl font-bold text-accent">{stats.resident}</p>
        </div>
        <div className="glass-card p-4 border-warning/20">
          <p className="text-text-muted text-xs">Pending</p>
          <p className="text-2xl font-bold text-warning">{stats.pending}</p>
        </div>
        <div className="glass-card p-4 border-gray-400/20">
          <p className="text-text-muted text-xs">Cancelled</p>
          <p className="text-2xl font-bold text-gray-400">{stats.cancelled}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, phone or flat..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="flagged">Flagged</option>
            <option value="resident">Resident</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Link to="/guard/visitor/create" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaPlus /> Add Visitor
          </Link>
        </div>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
            <p className="text-text-muted mt-2">Loading visitors...</p>
          </div>
        ) : filteredVisitors.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="text-5xl text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">No visitors found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Visitor</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">Contact</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Flat</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Purpose</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVisitors.map((visitor) => {
                  const statusBadge = getStatusBadge(visitor.status);
                  const visitorId = visitor._id || visitor.id;
                  const displayName = visitor.name || visitor.visitorName || 'Unknown';
                  return (
                    <tr key={visitorId || Math.random()} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">
                            {displayName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{displayName}</p>
                            <p className="text-text-muted text-xs md:hidden">{visitor.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-text-muted text-sm">{visitor.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white text-sm">Flat {visitor.flatNumber}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-text-muted text-sm">{visitor.purpose || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={visitor.status || 'Verified'}
                          onChange={(e) => handleStatusChange(visitorId, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-none focus:ring-0 focus:outline-none cursor-pointer ${statusBadge.color}`}
                          style={{
                            minWidth: '100px',
                            appearance: 'auto',
                            WebkitAppearance: 'auto'
                          }}
                        >
                          {statusOptions.map(status => (
                            <option 
                              key={status} 
                              value={status}
                              style={{
                                backgroundColor: '#1a1a2e',
                                color: status === 'Verified' ? '#22c55e' : 
                                       status === 'Flagged' ? '#f87171' : 
                                       status === 'Resident' ? '#60a5fa' :
                                       status === 'pending' ? '#eab308' :
                                       status === 'cancelled' ? '#9ca3af' :
                                       '#eab308',
                                padding: '4px 8px'
                              }}
                            >
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/guard/visitor/show/${visitorId}`} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="View">
                            <FaEye className="text-sm" />
                          </Link>
                          <Link to={`/guard/visitor/edit/${visitorId}`} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="Edit">
                            <FaEdit className="text-sm" />
                          </Link>
                          <button onClick={() => handleDelete(visitorId, displayName)} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors" title="Delete">
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <p className="text-text-muted text-sm">
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredVisitors.length)} of {filteredVisitors.length} visitors
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
    </div>
  );
};

export default Visitors;