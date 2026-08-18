import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSearch, FaPlus, FaEdit, FaTrash, FaEye, 
  FaUser, FaHome, FaPhone, FaEnvelope,
  FaCheckCircle, FaClock, FaTimesCircle,
  FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ResidentManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchResidents();
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const fetchResidents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/residents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const residentsWithId = response.data.data.map(r => ({
        ...r,
        id: r.id || r._id
      }));
      setResidents(residentsWithId);
    } catch (error) {
      console.error('Fetch residents error:', error);
      toast.error(error.response?.data?.message || 'Failed to load residents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!id) {
      toast.error('Invalid resident ID');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/residents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${name} deleted successfully!`);
      fetchResidents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!id) {
      toast.error('Invalid resident ID');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/residents/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to ${newStatus}`);
      fetchResidents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  const filteredResidents = residents.filter(resident => {
    const name = resident.name || resident.fullName || '';
    const flat = resident.flatNumber || resident.flat || '';
    const phone = resident.phone || '';
    const email = resident.email || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         phone.includes(searchTerm) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || (resident.status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResidents = filteredResidents.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return { color: 'text-success', bg: 'bg-success/20' };
      case 'Pending': return { color: 'text-warning', bg: 'bg-warning/20' };
      case 'Inactive': return { color: 'text-red-400', bg: 'bg-red-400/20' };
      default: return { color: 'text-text-muted', bg: 'bg-text-muted/20' };
    }
  };

  const statusOptions = ['Active', 'Pending', 'Inactive'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Resident Management</h1>
        <p className="text-text-muted text-sm mt-1">Manage all residents, tenants, and owners in your society.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs">Total Residents</p>
          <p className="text-2xl font-bold text-white">{residents.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs">Active</p>
          <p className="text-2xl font-bold text-success">{residents.filter(r => r.status === 'Active').length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs">Pending</p>
          <p className="text-2xl font-bold text-warning">{residents.filter(r => r.status === 'Pending').length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs">Inactive</p>
          <p className="text-2xl font-bold text-red-400">{residents.filter(r => r.status === 'Inactive').length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, flat, phone or email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
          <Link to="/admin/residents/create" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaPlus /> Add Resident
          </Link>
        </div>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
            <p className="text-text-muted mt-2">Loading residents...</p>
          </div>
        ) : filteredResidents.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="text-5xl text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">No residents found</p>
            <p className="text-text-muted/50 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Resident</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Flat</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">Contact</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Joined</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResidents.map((resident) => {
                  const residentId = resident.id || resident._id;
                  const statusBadge = getStatusBadge(resident.status);
                  const displayName = resident.name || resident.fullName || 'Unknown';
                  const displayFlat = resident.flatNumber || resident.flat || 'N/A';
                  
                  return (
                    <tr key={residentId || Math.random()} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent-light flex items-center justify-center text-primary font-bold text-sm">
                            {displayName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{displayName}</p>
                            <p className="text-text-muted text-xs hidden sm:block">{resident.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white text-sm">{displayFlat}</span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-text-muted text-sm">{resident.phone}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-text-muted text-sm">{resident.joinDate || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={resident.status || 'Active'}
                          onChange={(e) => handleStatusChange(residentId, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-none focus:ring-0 focus:outline-none cursor-pointer ${statusBadge.bg} ${statusBadge.color}`}
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
                                       status === 'Pending' ? '#eab308' : 
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
                          <Link to={`/admin/residents/show/${residentId}`} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="View">
                            <FaEye className="text-sm" />
                          </Link>
                          <Link to={`/admin/residents/edit/${residentId}`} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="Edit">
                            <FaEdit className="text-sm" />
                          </Link>
                          <button onClick={() => handleDelete(residentId, displayName)} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors" title="Delete">
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
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredResidents.length)} of {filteredResidents.length} residents
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

export default ResidentManagement;