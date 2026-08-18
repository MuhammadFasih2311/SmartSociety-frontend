import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaBell, FaPlus, FaTimesCircle, FaSpinner,
  FaArrowLeft, FaArrowRight, FaSearch,
  FaCheckCircle, FaClock, FaUser,
  FaHome, FaBuilding, FaTrash, FaEye
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Complaints = () => {
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 5;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  const [formData, setFormData] = useState({
    category: 'Plumbing',
    description: '',
    priority: 'Medium'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/resident/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data.data || []);
    } catch (error) {
      console.error('Fetch complaints error:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/resident/complaints`, {
        category: formData.category,
        description: formData.description,
        priority: formData.priority
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Complaint submitted successfully!');
        setShowModal(false);
        setFormData({
          category: 'Plumbing',
          description: '',
          priority: 'Medium'
        });
        fetchComplaints();
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this complaint?')) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/resident/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Complaint cancelled successfully!');
        fetchComplaints();
        setShowDetailModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel complaint');
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Resolved':
        return { color: 'bg-success/20 text-success', label: 'Resolved', icon: <FaCheckCircle /> };
      case 'In-Progress':
        return { color: 'bg-warning/20 text-warning', label: 'In Progress', icon: <FaClock /> };
      case 'Pending':
        return { color: 'bg-accent/20 text-accent', label: 'Pending', icon: <FaClock /> };
      case 'Rejected':
        return { color: 'bg-red-400/20 text-red-400', label: 'Rejected', icon: <FaTimesCircle /> };
      default:
        return { color: 'bg-text-muted/20 text-text-muted', label: status || 'Unknown', icon: null };
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'Urgent':
        return 'bg-red-400/20 text-red-400';
      case 'High':
        return 'bg-orange-400/20 text-orange-400';
      case 'Medium':
        return 'bg-warning/20 text-warning';
      case 'Low':
        return 'bg-blue-400/20 text-blue-400';
      default:
        return 'bg-text-muted/20 text-text-muted';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Plumbing':
      case 'Electrical':
        return <FaBuilding className="text-accent" />;
      case 'Security':
        return <FaHome className="text-blue-400" />;
      default:
        return <FaBell className="text-text-muted" />;
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      complaint.category?.toLowerCase().includes(search) ||
      complaint.description?.toLowerCase().includes(search);
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In-Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    rejected: complaints.filter(c => c.status === 'Rejected').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent/20 border-t-accent"></div>
          <p className="text-text-muted mt-4">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Complaints</h1>
          <p className="text-text-muted text-sm mt-1">Raise and track your complaints.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
        >
          <FaPlus /> Raise Complaint
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs">Total Complaints</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-4 border-accent/20">
          <p className="text-text-muted text-xs">Pending</p>
          <p className="text-2xl font-bold text-accent">{stats.pending}</p>
        </div>
        <div className="glass-card p-4 border-warning/20">
          <p className="text-text-muted text-xs">In Progress</p>
          <p className="text-2xl font-bold text-warning">{stats.inProgress}</p>
        </div>
        <div className="glass-card p-4 border-success/20">
          <p className="text-text-muted text-xs">Resolved</p>
          <p className="text-2xl font-bold text-success">{stats.resolved}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In-Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="text-5xl text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">No complaints found</p>
            <p className="text-text-muted/50 text-sm mt-1">Raise a complaint to get started</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Category</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">Description</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Date</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Priority</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedComplaints.map((complaint) => {
                  const statusBadge = getStatusBadge(complaint.status);
                  return (
                    <tr key={complaint._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                            {getCategoryIcon(complaint.category)}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{complaint.category}</p>
                            <p className="text-text-muted text-xs md:hidden">{complaint.description?.substring(0, 30)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-text-muted text-sm">{complaint.description?.substring(0, 50)}...</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-text-muted text-sm">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(complaint.priority)} uppercase`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusBadge.color} flex items-center gap-1 w-fit`}>
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(complaint)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors"
                            title="View Details"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          {complaint.status === 'Pending' && (
                            <button
                              onClick={() => handleDelete(complaint._id)}
                              disabled={deleting}
                              className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors"
                              title="Cancel Complaint"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          )}
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
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredComplaints.length)} of {filteredComplaints.length} complaints
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

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaBell className="text-accent" />
                Raise Complaint
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-muted hover:text-white transition-colors"
              >
                <FaTimesCircle className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-text-muted text-sm mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                    required
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Elevator">Elevator</option>
                    <option value="Security">Security</option>
                    <option value="AC Repair">AC Repair</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Painting">Painting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors resize-none"
                    placeholder="Describe your complaint in detail (min 10 characters)..."
                    required
                  />
                  {formData.description && formData.description.length < 10 && (
                    <p className="text-red-400 text-xs mt-1">Description must be at least 10 characters</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 px-4 py-2"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaBell className="text-accent" />
                Complaint Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-text-muted hover:text-white transition-colors"
              >
                <FaTimesCircle className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-text-muted">Category</span>
                <span className="text-white font-medium">{selectedComplaint.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Priority</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(selectedComplaint.priority)} uppercase`}>
                  {selectedComplaint.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Status</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(selectedComplaint.status).color}`}>
                  {getStatusBadge(selectedComplaint.status).label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Date</span>
                <span className="text-white">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <p className="text-text-muted text-sm">Description</p>
                <p className="text-white text-sm mt-1">{selectedComplaint.description}</p>
              </div>
              {selectedComplaint.resolution && (
                <div>
                  <p className="text-text-muted text-sm">Resolution</p>
                  <p className="text-success text-sm mt-1">{selectedComplaint.resolution}</p>
                </div>
              )}
              {selectedComplaint.assignedTo && selectedComplaint.assignedTo !== 'Unassigned' && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Assigned To</span>
                  <span className="text-white">{selectedComplaint.assignedTo}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 btn-secondary px-4 py-2"
              >
                Close
              </button>
              {selectedComplaint.status === 'Pending' && (
                <button
                  onClick={() => handleDelete(selectedComplaint._id)}
                  disabled={deleting}
                  className="flex-1 btn-primary bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 px-4 py-2"
                >
                  {deleting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      Cancel Complaint
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;