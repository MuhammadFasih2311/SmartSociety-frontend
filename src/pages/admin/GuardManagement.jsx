import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSearch, FaPlus, FaEdit, FaTrash, FaEye, 
  FaUser, FaShieldAlt, FaPhone, FaEnvelope, 
  FaClock, FaCheckCircle, FaTimesCircle, FaKey,
  FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const GuardManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterShift, setFilterShift] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchGuards();
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const fetchGuards = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/guards`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const guardsWithId = response.data.data.map(g => ({
        ...g,
        id: g.id || g._id
      }));
      setGuards(guardsWithId);
    } catch (error) {
      console.error('Fetch guards error:', error);
      toast.error(error.response?.data?.message || 'Failed to load guards');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!id) {
      toast.error('Invalid guard ID');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/guards/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${name} deleted successfully!`);
      fetchGuards();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!id) {
      toast.error('Invalid guard ID');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/guards/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to ${newStatus}`);
      fetchGuards();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  const shifts = ['Morning', 'Evening', 'Night'];
  const statusOptions = ['Active', 'On Leave', 'Inactive'];

  const filteredGuards = guards.filter(guard => {
    const name = guard.name || '';
    const employeeId = guard.employeeId || '';
    const phone = guard.phone || '';
    const email = guard.email || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         phone.includes(searchTerm) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (guard.status || '').toLowerCase() === filterStatus.toLowerCase();
    const matchesShift = filterShift === 'all' || guard.shift === filterShift;
    return matchesSearch && matchesStatus && matchesShift;
  });

  const totalPages = Math.ceil(filteredGuards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGuards = filteredGuards.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-success/20 text-success';
      case 'On Leave': return 'bg-warning/20 text-warning';
      case 'Inactive': return 'bg-red-400/20 text-red-400';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  const getShiftBadge = (shift) => {
    switch(shift) {
      case 'Morning': return 'bg-orange-400/20 text-orange-400';
      case 'Evening': return 'bg-purple-400/20 text-purple-400';
      case 'Night': return 'bg-blue-400/20 text-blue-400';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Guard Management</h1>
        <p className="text-text-muted text-sm mt-1">Manage security guards, shifts, and gate assignments.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-xs">Total Guards</span>
            <FaShieldAlt className="text-accent" />
          </div>
          <p className="text-2xl font-bold text-white">{guards.length}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-xs">Active</span>
            <FaCheckCircle className="text-success" />
          </div>
          <p className="text-2xl font-bold text-white">{guards.filter(g => g.status === 'Active').length}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-xs">On Leave</span>
            <FaClock className="text-warning" />
          </div>
          <p className="text-2xl font-bold text-white">{guards.filter(g => g.status === 'On Leave').length}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-xs">Gates</span>
            <FaKey className="text-accent" />
          </div>
          <p className="text-2xl font-bold text-white">4</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, ID, phone or email..."
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
            <option value="active">Active</option>
            <option value="on leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filterShift}
            onChange={(e) => { setFilterShift(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All Shifts</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
          <Link to="/admin/guards/create" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaPlus /> Add Guard
          </Link>
        </div>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
            <p className="text-text-muted mt-2">Loading guards...</p>
          </div>
        ) : filteredGuards.length === 0 ? (
          <div className="text-center py-12">
            <FaShieldAlt className="text-5xl text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">No guards found</p>
            <p className="text-text-muted/50 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Guard</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">ID</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Contact</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Shift</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">Gate</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGuards.map((guard) => {
                  const guardId = guard.id || guard._id;
                  const statusColor = getStatusColor(guard.status);
                  const shiftBadge = getShiftBadge(guard.shift);
                  const displayName = guard.name || 'Unknown';
                  
                  return (
                    <tr key={guardId || Math.random()} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent-light flex items-center justify-center text-primary font-bold text-sm">
                            {displayName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{displayName}</p>
                            <p className="text-text-muted text-xs hidden sm:block">{guard.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-accent text-sm font-medium">{guard.employeeId}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-text-muted text-sm">{guard.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${shiftBadge}`}>
                          {guard.shift}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-text-muted text-sm">{guard.gate}</span>
                      </td>
                      <td className="py-3 px-4">
                      <select
                        value={guard.status || 'Active'}
                        onChange={(e) => handleStatusChange(guardId, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-none focus:ring-0 focus:outline-none cursor-pointer ${statusColor}`}
                        style={{
                          minWidth: '80px',
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
                              color: status === 'Active' ? '#22c55e' : 
                                    status === 'On Leave' ? '#eab308' : 
                                    '#f87171',
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
                          <Link to={`/admin/guards/show/${guardId}`} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="View">
                            <FaEye className="text-sm" />
                          </Link>
                          <Link to={`/admin/guards/edit/${guardId}`} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="Edit">
                            <FaEdit className="text-sm" />
                          </Link>
                          <button onClick={() => handleDelete(guardId, displayName)} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors" title="Delete">
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
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredGuards.length)} of {filteredGuards.length} guards
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {shifts.map((shift) => {
          const count = guards.filter(g => g.shift === shift).length;
          const activeCount = guards.filter(g => g.shift === shift && g.status === 'Active').length;
          return (
            <div key={shift} className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-xs">{shift} Shift</p>
                  <p className="text-xl font-bold text-white">{count} Guards</p>
                  <p className="text-text-muted text-xs">{activeCount} Active</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-accent to-accent-light flex items-center justify-center text-2xl text-primary`}>
                  <FaShieldAlt />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuardManagement;