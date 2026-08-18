import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSearch, FaFilter, FaDownload, FaEye, 
  FaArrowLeft, FaArrowRight, FaUser, FaCar,
  FaClock, FaCheckCircle, FaTimesCircle,
  FaPrint, FaFileExport, FaHome, FaPhone,
  FaCalendarAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const GateLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    verified: 0,
    flagged: 0,
    resident: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const itemsPerPage = 5;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await axios.get(`${API_URL}/guard/gate-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setLogs(response.data.data);
        setStats(response.data.stats);
      } else {
        toast.error(response.data.message || 'Failed to load logs');
      }
    } catch (error) {
      console.error('Fetch logs error:', error);
      toast.error(error.response?.data?.message || 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/guard/gate-logs/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `gate-logs-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Logs exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error.response?.data?.message || 'Failed to export logs');
    } finally {
      setExporting(false);
    }
  };

  // Apply filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.visitor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.flat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.vehicle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.logId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesStatus = filterStatus === 'all' || log.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchesDate = !filterDate || log.date === filterDate;

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Verified':
      case 'approved':
        return 'bg-success/20 text-success';
      case 'Flagged':
      case 'rejected':
        return 'bg-red-400/20 text-red-400';
      case 'Resident':
        return 'bg-accent/20 text-accent';
      case 'pending':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-text-muted/20 text-text-muted';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'Verified':
      case 'approved':
        return 'Verified';
      case 'Flagged':
      case 'rejected':
        return 'Flagged';
      case 'Resident':
        return 'Resident';
      case 'pending':
        return 'Pending';
      default:
        return status || 'Unknown';
    }
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'visitor':
        return 'bg-blue-400/20 text-blue-400';
      case 'delivery':
        return 'bg-warning/20 text-warning';
      case 'resident':
        return 'bg-accent/20 text-accent';
      default:
        return 'bg-text-muted/20 text-text-muted';
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterStatus, filterDate]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Gate Logs</h1>
          <p className="text-text-muted text-sm mt-1">View all gate entry and exit logs.</p>
        </div>
        <Link to="/guard/dashboard" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <FaArrowLeft />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs">Total Entries</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs">Today's Entries</p>
          <p className="text-2xl font-bold text-white">{stats.today}</p>
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
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, flat, vehicle, phone or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All Types</option>
            <option value="visitor">Visitors</option>
            <option value="delivery">Delivery</option>
            <option value="resident">Residents</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="flagged">Flagged</option>
            <option value="resident">Resident</option>
            <option value="pending">Pending</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
          />
          <button 
            onClick={handleExport} 
            disabled={exporting}
            className={`btn-secondary flex items-center gap-2 px-4 py-2 text-sm ${exporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaDownload />
            {exporting ? 'Exporting...' : 'Export'}
          </button>
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
            <FaSearch className="text-5xl text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">No logs found</p>
            <p className="text-text-muted/50 text-sm">Try adjusting your search or filters</p>
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
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-accent text-sm font-medium">#{log.logId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white text-sm">{log.visitor}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadge(log.type)}`}>
                            {log.type}
                          </span>
                          {log.phone && log.phone !== 'N/A' && (
                            <span className="text-text-muted text-xs flex items-center gap-1">
                              <FaPhone className="text-[10px]" />
                              {log.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-text-muted text-sm flex items-center gap-1">
                        <FaCar className="text-accent text-xs" />
                        {log.vehicle}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white text-sm">{log.flat}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div>
                        <p className="text-text-muted text-sm">{log.entryTime}</p>
                        <p className="text-text-muted/50 text-xs">Exit: {log.exitTime}</p>
                        <p className="text-text-muted/30 text-xs">{log.date}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(log.status)}`}>
                        {getStatusLabel(log.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/guard/visitor/show/${log.id}`} 
                          className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors"
                          title="View Details"
                        >
                          <FaEye className="text-sm" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <p className="text-text-muted text-sm">
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
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
    </div>
  );
};

export default GateLogs;