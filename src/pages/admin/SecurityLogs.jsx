import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSearch, FaUser, FaClock, FaCar, FaDownload, FaEye,
  FaTrash, FaArrowLeft, FaArrowRight, FaShieldAlt,
  FaCheckCircle, FaTimesCircle, FaUserCheck, FaTruck,
  FaFilter, FaPlus
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const SecurityLogs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchLogs();
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/security`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data.data);
    } catch (error) {
      console.error('Fetch logs error:', error);
      toast.error(error.response?.data?.message || 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this log?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/security/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Log deleted successfully!');
      fetchLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleExportLogs = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/security/export`, {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `security-logs-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    toast.success('Logs exported successfully!');
  } catch (error) {
    console.error('Export error:', error);
    toast.error(error.response?.data?.message || 'Export failed');
  }
};

  const filteredLogs = logs.filter(log => {
    const matchesSearch = (log.visitorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.flatNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.vehicleNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log._id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesStatus = filterStatus === 'all' || (log.status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const stats = [
    { label: 'Total Entries', value: logs.length, icon: <FaShieldAlt />, color: 'from-accent to-accent-light' },
    { label: 'Verified', value: logs.filter(l => l.status === 'Verified').length, icon: <FaCheckCircle />, color: 'from-success to-emerald-400' },
    { label: 'Flagged', value: logs.filter(l => l.status === 'Flagged').length, icon: <FaTimesCircle />, color: 'from-red-400 to-pink-400' },
    { label: 'Residents', value: logs.filter(l => l.type === 'resident').length, icon: <FaUserCheck />, color: 'from-blue-400 to-cyan-400' },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Verified': return 'bg-success/20 text-success';
      case 'Flagged': return 'bg-red-400/20 text-red-400';
      case 'Resident': return 'bg-accent/20 text-accent';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'visitor': return 'bg-blue-400/20 text-blue-400';
      case 'delivery': return 'bg-warning/20 text-warning';
      case 'resident': return 'bg-accent/20 text-accent';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Security Logs</h1>
        <p className="text-text-muted text-sm mt-1">Monitor all gate entries, visitors, and security activities in real-time.</p>
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
            placeholder="Search by name, flat, vehicle or ID..."
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
            <option value="visitor">Visitors</option>
            <option value="delivery">Delivery</option>
            <option value="resident">Residents</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="flagged">Flagged</option>
            <option value="resident">Resident</option>
          </select>
          <button onClick={handleExportLogs} className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
            <FaDownload /> Export Logs
          </button>
          <Link to="/admin/security/add" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaPlus /> Add Entry
          </Link>
        </div>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
            <p className="text-text-muted mt-2">Loading logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <FaShieldAlt className="text-5xl text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">No logs found</p>
            <p className="text-text-muted/50 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Log ID</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Visitor</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">Vehicle</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Flat</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Entry</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => {
                  const logId = log._id || log.id;
                  return (
                    <tr key={logId || Math.random()} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-4">
                        <span className="text-accent text-sm font-medium">#{logId?.slice(-6)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white text-sm">{log.visitorName}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadge(log.type)}`}>
                              {log.type}
                            </span>
                            <span className="text-text-muted text-xs">{log.gate}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-text-muted text-sm flex items-center gap-1">
                          <FaCar className="text-accent text-xs" />
                          {log.vehicleNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white text-sm">{log.flatNumber}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div>
                          <p className="text-text-muted text-sm">{log.entryTime}</p>
                          <p className="text-text-muted/50 text-xs">Exit: {log.exitTime}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/security/show/${logId}`} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="View">
                            <FaEye className="text-sm" />
                          </Link>
                          <button onClick={() => handleDelete(logId)} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors" title="Delete">
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
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
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

export default SecurityLogs;