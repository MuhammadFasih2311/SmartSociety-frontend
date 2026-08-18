import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSearch, FaUser, FaClock, FaTools, FaPhone, FaEnvelope,
  FaPlus, FaEdit, FaTrash, FaEye, FaCheckCircle,
  FaTimesCircle, FaArrowLeft, FaArrowRight, FaFilter,
  FaExclamationTriangle, FaUserCog, FaBuilding,
  FaTimes, FaSave
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ComplaintRouting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [complaints, setComplaints] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const itemsPerPage = 4;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  const [formData, setFormData] = useState({
    residentId: '',
    residentName: '',
    flatNumber: '',
    category: '',
    description: '',
    priority: 'Medium',
    assignedTo: 'Unassigned'
  });

  const categories = ['Plumbing', 'Electrical', 'Elevator', 'Security', 'AC Repair', 'Carpentry', 'Painting', 'Other'];
  const priorities = ['Urgent', 'High', 'Medium', 'Low'];
  const staff = ['Unassigned', 'Rashid Maintenance', 'Elevator Tech', 'Security Team', 'Electrical Team', 'Usman AC Services'];

  useEffect(() => {
    fetchComplaints();
    fetchResidents();
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data.data);
    } catch (error) {
      console.error('Fetch complaints error:', error);
      toast.error(error.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/residents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResidents(response.data.data);
    } catch (error) {
      console.error('Fetch residents error:', error);
    }
  };

  const handleAssign = async (id, assignedTo) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/complaints/${id}/assign`, 
        { assignedTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Complaint assigned to ${assignedTo}`);
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/complaints/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to ${newStatus}`);
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this complaint?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Complaint deleted successfully!');
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResidentSelect = (e) => {
    const selected = residents.find(r => r.id === e.target.value || r._id === e.target.value);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        residentId: selected.id || selected._id,
        residentName: selected.name || selected.fullName,
        flatNumber: selected.flatNumber || selected.flat
      }));
    }
  };

  const handleAddComplaint = async (e) => {
    e.preventDefault();
    
    if (!formData.residentId || !formData.category || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/admin/complaints`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Complaint added successfully!');
        setShowModal(false);
        setFormData({
          residentId: '',
          residentName: '',
          flatNumber: '',
          category: '',
          description: '',
          priority: 'Medium',
          assignedTo: 'Unassigned'
        });
        fetchComplaints();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = (complaint.residentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (complaint.flatNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (complaint.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (complaint._id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (complaint.status || '').toLowerCase() === filterStatus.toLowerCase();
    const matchesPriority = filterPriority === 'all' || (complaint.priority || '').toLowerCase() === filterPriority.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const stats = [
    { label: 'Total Complaints', value: complaints.length, icon: <FaTools />, color: 'from-accent to-accent-light' },
    { label: 'Pending', value: complaints.filter(c => c.status === 'Pending').length, icon: <FaClock />, color: 'from-warning to-orange-400' },
    { label: 'In Progress', value: complaints.filter(c => c.status === 'In-Progress').length, icon: <FaUserCog />, color: 'from-blue-400 to-cyan-400' },
    { label: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length, icon: <FaCheckCircle />, color: 'from-success to-emerald-400' },
  ];

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'Urgent': return { color: 'bg-red-400/20 text-red-400', icon: <FaExclamationTriangle /> };
      case 'High': return { color: 'bg-warning/20 text-warning', icon: <FaExclamationTriangle /> };
      case 'Medium': return { color: 'bg-blue-400/20 text-blue-400', icon: <FaClock /> };
      case 'Low': return { color: 'bg-green-400/20 text-green-400', icon: <FaCheckCircle /> };
      default: return { color: 'bg-text-muted/20 text-text-muted', icon: null };
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return 'bg-warning/20 text-warning';
      case 'In-Progress': return 'bg-accent/20 text-accent';
      case 'Resolved': return 'bg-success/20 text-success';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  const statusOptions = ['Pending', 'In-Progress', 'Resolved'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Complaint Routing</h1>
        <p className="text-text-muted text-sm mt-1">Assign and manage resident complaints to maintenance staff.</p>
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
            placeholder="Search by resident, flat, category or ID..."
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
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => { setFilterPriority(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaPlus /> Add Complaint
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
          <p className="text-text-muted mt-2">Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FaTools className="text-5xl text-text-muted/20 mx-auto mb-4" />
          <p className="text-text-muted">No complaints found</p>
          <p className="text-text-muted/50 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedComplaints.map((complaint) => {
              const complaintId = complaint._id || complaint.id;
              const priorityInfo = getPriorityBadge(complaint.priority);
              return (
                <div key={complaintId || Math.random()} className="glass-card p-6 hover:border-accent/30 transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-white font-medium">#{complaintId?.slice(-6)}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${priorityInfo.color}`}>
                          {priorityInfo.icon} {complaint.priority}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(complaint.status)}`}>
                          {complaint.status}
                        </span>
                        {complaint.status === 'Resolved' && complaint.resolvedAt && (
                          <span className="text-xs text-text-muted">Resolved on {new Date(complaint.resolvedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      <p className="text-white text-sm mb-1">{complaint.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1"><FaUser className="text-accent" /> {complaint.residentName} ({complaint.flatNumber})</span>
                        <span className="flex items-center gap-1"><FaTools className="text-accent" /> {complaint.category}</span>
                        <span className="flex items-center gap-1"><FaClock className="text-accent" /> {new Date(complaint.createdAt).toLocaleString()}</span>
                        {complaint.assignedTo !== 'Unassigned' && (
                          <span className="flex items-center gap-1"><FaUserCog className="text-accent" /> {complaint.assignedTo}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <select
                        value={complaint.assignedTo}
                        onChange={(e) => handleAssign(complaintId, e.target.value)}
                        className="px-3 py-1.5 bg-primary-light/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent transition-colors"
                      >
                        {staff.map((member) => (
                          <option key={member} value={member}>{member}</option>
                        ))}
                      </select>
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaintId, e.target.value)}
                        className="px-3 py-1.5 bg-primary-light/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent transition-colors"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button onClick={() => handleDelete(complaintId)} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors" title="Delete">
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
              <p className="text-text-muted text-sm">Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredComplaints.length)} of {filteredComplaints.length} complaints</p>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Add New Complaint</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddComplaint} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-muted text-sm mb-2">Resident *</label>
                  <select
                    value={formData.residentId}
                    onChange={handleResidentSelect}
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                    required
                  >
                    <option value="">Select Resident</option>
                    {residents.map(r => (
                      <option key={r.id || r._id} value={r.id || r._id}>
                        {r.name || r.fullName} - {r.flatNumber || r.flat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-2">Flat</label>
                  <input type="text" value={formData.flatNumber} readOnly className="w-full px-4 py-2 bg-primary-light/30 border border-white/5 rounded-xl text-text-muted cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-muted text-sm mb-2">Category *</label>
                  <select name="category" value={formData.category} onChange={handleFormChange} className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-2">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleFormChange} className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-text-muted text-sm mb-2">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleFormChange} rows="4" className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors resize-none" placeholder="Describe the complaint in detail..." required />
              </div>

              <div>
                <label className="block text-text-muted text-sm mb-2">Assign To</label>
                <select name="assignedTo" value={formData.assignedTo} onChange={handleFormChange} className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                  {staff.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowModal(false)} className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300">
                  <FaTimes /> Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className={`btn-primary flex items-center justify-center gap-2 px-6 py-3 min-w-[140px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isSubmitting ? (
                    <><svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Adding...</>
                  ) : (
                    <><FaSave /> Add Complaint</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintRouting;