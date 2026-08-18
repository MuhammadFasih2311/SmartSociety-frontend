import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  FaKey, FaUser, FaPhone, FaCalendarAlt, FaClock,
  FaPlus, FaEye, FaEdit, FaTrash, FaCheckCircle,
  FaTimesCircle, FaArrowLeft, FaArrowRight, FaSearch,
  FaSpinner, FaBan, FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const VisitorPass = () => {
  const [loading, setLoading] = useState(true);
  const [passes, setPasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const itemsPerPage = 5;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    visitorName: '',
    phone: '',
    flatNumber: '',
    purpose: '',
    visitDate: '',
    visitTime: '',
    duration: '1',
    idType: 'CNIC',
    idNumber: '',
    notes: ''
  });

  useEffect(() => {
    fetchPasses();
  }, []);

  const fetchPasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/resident/passes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasses(response.data.data);
    } catch (error) {
      console.error('Fetch passes error:', error);
      toast.error('Failed to load passes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.visitorName) {
      newErrors.visitorName = 'Visitor name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.visitorName)) {
      newErrors.visitorName = 'Name can only contain letters';
    } else if (formData.visitorName.length > 50) {
      newErrors.visitorName = 'Name cannot exceed 50 characters';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone can only contain numbers, +, -, and spaces';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Phone must be at least 10 characters';
    } else if (formData.phone.length > 15) {
      newErrors.phone = 'Phone cannot exceed 15 characters';
    }
    
    if (!formData.flatNumber) {
      newErrors.flatNumber = 'Flat number is required';
    } else if (!/^[0-9A-Za-z\s-]+$/.test(formData.flatNumber)) {
      newErrors.flatNumber = 'Flat number can only contain letters, numbers, spaces, and dashes';
    } else if (formData.flatNumber.length > 10) {
      newErrors.flatNumber = 'Flat number cannot exceed 10 characters';
    }
    
    if (formData.purpose && formData.purpose.length > 100) {
      newErrors.purpose = 'Purpose cannot exceed 100 characters';
    }
    
    if (!formData.visitDate) {
      newErrors.visitDate = 'Visit date is required';
    } else if (formData.visitDate < today) {
      newErrors.visitDate = 'Visit date cannot be in the past';
    }
    
    if (!formData.visitTime) {
      newErrors.visitTime = 'Visit time is required';
    }
    
    if (formData.idNumber && !/^[A-Za-z0-9-]+$/.test(formData.idNumber)) {
      newErrors.idNumber = 'ID number can only contain letters, numbers, and dashes';
    }
    if (formData.idNumber && formData.idNumber.length > 20) {
      newErrors.idNumber = 'ID number cannot exceed 20 characters';
    }
    
    if (formData.notes && formData.notes.length > 200) {
      newErrors.notes = 'Notes cannot exceed 200 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector('.error-text');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/resident/passes`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Visitor pass created successfully!');
        setShowModal(false);
        setFormData({
          visitorName: '',
          phone: '',
          flatNumber: '',
          purpose: '',
          visitDate: '',
          visitTime: '',
          duration: '1',
          idType: 'CNIC',
          idNumber: '',
          notes: ''
        });
        setErrors({});
        fetchPasses();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create pass');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelPass = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this pass?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/resident/passes/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pass cancelled successfully');
      fetchPasses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel pass');
    }
  };

  const filteredPasses = passes.filter(pass => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      pass.visitorName?.toLowerCase().includes(search) ||
      pass.phone?.includes(search) ||
      pass.flatNumber?.toLowerCase().includes(search);
    const matchesStatus = filterStatus === 'all' || pass.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPasses = filteredPasses.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
      case 'approved':
        return { color: 'bg-success/20 text-success', label: 'Active', icon: <FaCheckCircle className="text-success" /> };
      case 'Verified':
        return { color: 'bg-success/20 text-success', label: 'Verified', icon: <FaCheckCircle className="text-success" /> };
      case 'pending':
        return { color: 'bg-warning/20 text-warning', label: 'Pending', icon: <FaClock className="text-warning" /> };
      case 'Flagged':
        return { color: 'bg-orange-400/20 text-orange-400', label: 'Flagged', icon: <FaExclamationTriangle className="text-orange-400" /> };
      case 'Resident':
        return { color: 'bg-accent/20 text-accent', label: 'Resident', icon: <FaCheckCircle className="text-accent" /> };
      case 'expired':
        return { color: 'bg-red-400/20 text-red-400', label: 'Expired', icon: <FaTimesCircle className="text-red-400" /> };
      case 'rejected':
        return { color: 'bg-red-400/20 text-red-400', label: 'Rejected', icon: <FaTimesCircle className="text-red-400" /> };
      case 'cancelled':
        return { color: 'bg-gray-400/20 text-gray-400', label: 'Cancelled', icon: <FaBan className="text-gray-400" /> };
      default:
        return { color: 'bg-text-muted/20 text-text-muted', label: status || 'Unknown', icon: null };
    }
  };

  const stats = {
    total: passes.length,
    active: passes.filter(p => p.status === 'active' || p.status === 'approved').length,
    pending: passes.filter(p => p.status === 'pending').length,
    expired: passes.filter(p => p.status === 'expired').length,
    cancelled: passes.filter(p => p.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent/20 border-t-accent"></div>
          <p className="text-text-muted mt-4">Loading passes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Visitor Passes</h1>
          <p className="text-text-muted text-sm mt-1">Manage your visitor passes for gate entry.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
        >
          <FaPlus /> Create Pass
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs">Total Passes</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-4 border-success/20">
          <p className="text-text-muted text-xs">Active</p>
          <p className="text-2xl font-bold text-success">{stats.active}</p>
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
            placeholder="Search by visitor name, phone or flat..."
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
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        {filteredPasses.length === 0 ? (
          <div className="text-center py-12">
            <FaKey className="text-5xl text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">No visitor passes found</p>
            <p className="text-text-muted/50 text-sm mt-1">Create a new pass to get started</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Visitor</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">Contact</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Flat</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Date</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPasses.map((pass) => {
                  const statusBadge = getStatusBadge(pass.status);
                  return (
                    <tr key={pass._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">
                            {pass.visitorName?.charAt(0) || 'V'}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{pass.visitorName}</p>
                            <p className="text-text-muted text-xs md:hidden">{pass.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-text-muted text-sm">{pass.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white text-sm">{pass.flatNumber}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div>
                          <p className="text-text-muted text-sm">{new Date(pass.visitDate).toLocaleDateString()}</p>
                          <p className="text-text-muted/50 text-xs">{pass.visitTime}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusBadge.color} flex items-center gap-1 w-fit`}>
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {(pass.status === 'pending') && (
                            <button
                              onClick={() => handleCancelPass(pass._id)}
                              className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors"
                              title="Cancel Pass"
                            >
                              <FaTimesCircle className="text-sm" />
                            </button>
                          )}
                          {(pass.status === 'active' || pass.status === 'approved') && (
                            <span className="text-success text-xs flex items-center gap-1">
                              <FaCheckCircle /> Active
                            </span>
                          )}
                          {pass.status === 'cancelled' && (
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                              <FaBan /> Cancelled
                            </span>
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
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPasses.length)} of {filteredPasses.length} passes
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
          <div className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaKey className="text-accent" />
                Create Visitor Pass
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-muted hover:text-white transition-colors"
              >
                <FaTimesCircle className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted text-sm mb-1">Visitor Name *</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      name="visitorName"
                      value={formData.visitorName}
                      onChange={handleInputChange}
                      maxLength="50"
                      className={`w-full pl-10 pr-4 py-2 bg-primary-light/50 border ${errors.visitorName ? 'border-red-400' : 'border-white/10'} rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors`}
                      placeholder="Enter visitor name"
                    />
                    {errors.visitorName && <p className="error-text text-red-400 text-xs mt-1">{errors.visitorName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-1">Phone *</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength="15"
                      className={`w-full pl-10 pr-4 py-2 bg-primary-light/50 border ${errors.phone ? 'border-red-400' : 'border-white/10'} rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors`}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && <p className="error-text text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-1">Flat Number</label>
                  <input
                    type="text"
                    name="flatNumber"
                    value={formData.flatNumber}
                    onChange={handleInputChange}
                    maxLength="10"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.flatNumber ? 'border-red-400' : 'border-white/10'} rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors`}
                    placeholder="Enter flat number"
                  />
                  {errors.flatNumber && <p className="error-text text-red-400 text-xs mt-1">{errors.flatNumber}</p>}
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-1">Purpose</label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    maxLength="100"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.purpose ? 'border-red-400' : 'border-white/10'} rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors`}
                    placeholder="Purpose of visit"
                  />
                  {errors.purpose && <p className="error-text text-red-400 text-xs mt-1">{errors.purpose}</p>}
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-1">Visit Date *</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="visitDate"
                      value={formData.visitDate}
                      onChange={handleInputChange}
                      min={today}
                      className={`w-full pl-10 pr-4 py-2 bg-primary-light/50 border ${errors.visitDate ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                    />
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
                  </div>
                  {errors.visitDate && <p className="error-text text-red-400 text-xs mt-1">{errors.visitDate}</p>}
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-1">Visit Time *</label>
                  <div className="relative">
                    <input
                      type="time"
                      name="visitTime"
                      value={formData.visitTime}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 bg-primary-light/50 border ${errors.visitTime ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                    />
                    <FaClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
                  </div>
                  {errors.visitTime && <p className="error-text text-red-400 text-xs mt-1">{errors.visitTime}</p>}
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-1">Duration (hours)</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="1">1 Hour</option>
                    <option value="2">2 Hours</option>
                    <option value="3">3 Hours</option>
                    <option value="4">4 Hours</option>
                    <option value="6">6 Hours</option>
                    <option value="8">8 Hours</option>
                    <option value="12">12 Hours</option>
                    <option value="24">24 Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-1">ID Type</label>
                  <select
                    name="idType"
                    value={formData.idType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="CNIC">CNIC</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver License">Driver License</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-1">ID Number</label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    maxLength="20"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.idNumber ? 'border-red-400' : 'border-white/10'} rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors`}
                    placeholder="Enter ID number"
                  />
                  {errors.idNumber && <p className="error-text text-red-400 text-xs mt-1">{errors.idNumber}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-text-muted text-sm mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    maxLength="200"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.notes ? 'border-red-400' : 'border-white/10'} rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors resize-none`}
                    placeholder="Any additional notes..."
                  />
                  {errors.notes && <p className="error-text text-red-400 text-xs mt-1">{errors.notes}</p>}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Create Pass
                    </>
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

export default VisitorPass;