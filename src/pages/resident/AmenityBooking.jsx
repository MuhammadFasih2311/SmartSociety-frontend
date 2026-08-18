import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaCalendarCheck, FaPlus, FaTimesCircle, FaSpinner,
  FaArrowLeft, FaArrowRight, FaSearch, FaClock,
  FaUsers, FaUtensils, FaDumbbell, FaSwimmer,
  FaTableTennis, FaChild, FaBook, FaMusic,
  FaEye, FaTrash, FaCheckCircle, FaClock as FaClockIcon,
  FaCalendarAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AmenityBooking = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [errors, setErrors] = useState({});
  const itemsPerPage = 5;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    amenityId: '',
    date: '',
    time: '',
    duration: '1',
    guests: '1',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [bookingsRes, amenitiesRes] = await Promise.all([
        axios.get(`${API_URL}/resident/amenities/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/amenities`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      console.log('📥 Bookings Response:', bookingsRes.data);
      console.log('📥 Amenities Response:', amenitiesRes.data);

      const bookingsData = bookingsRes.data.data || [];
      const amenitiesData = amenitiesRes.data.data || [];

      const amenityMap = {};
      amenitiesData.forEach(a => {
        amenityMap[a._id] = a;
      });

      const mappedBookings = bookingsData.map(booking => {
        let amenity = null;
        if (booking.amenityId) {
          const amenityIdStr = booking.amenityId.toString();
          amenity = amenitiesData.find(a => a._id.toString() === amenityIdStr);
        }

        const amenityName = booking.amenityName || amenity?.name || 'Unknown';
        const amenityType = booking.amenityType || amenity?.type || 'Other';
        const amenityLocation = booking.amenityLocation || amenity?.location || '';

        return {
          ...booking,
          amenityName: amenityName,
          amenityType: amenityType,
          amenityLocation: amenityLocation,
          amenityDisplayName: amenityName,
          amenity: amenity
        };
      });

      console.log('📤 Mapped Bookings:', mappedBookings);

      setBookings(mappedBookings);
      setAmenities(amenitiesData);
    } catch (error) {
      console.error('❌ Fetch data error:', error);
      console.error('❌ Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to load data');
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
    
    if (!formData.amenityId) {
      newErrors.amenityId = 'Please select an amenity';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else if (formData.date < today) {
      newErrors.date = 'Date cannot be in the past';
    }
    
    if (!formData.time) {
      newErrors.time = 'Please select a time';
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
      
      const bookingData = {
        amenityId: formData.amenityId,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration),
        guests: parseInt(formData.guests),
        notes: formData.notes
      };
      
      console.log('📤 Sending booking data:', bookingData);

      const response = await axios.post(`${API_URL}/resident/amenities/book`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Amenity booked successfully!');
        setShowModal(false);
        setFormData({
          amenityId: '',
          date: '',
          time: '',
          duration: '1',
          guests: '1',
          notes: ''
        });
        setErrors({});
        fetchData();
      }
    } catch (error) {
      console.error('❌ Booking error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to book amenity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/resident/amenities/booking/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Booking cancelled successfully');
        fetchData();
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('❌ Cancel error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const getAmenityIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'pool':
      case 'swimming_pool':
        return <FaSwimmer />;
      case 'gym':
        return <FaDumbbell />;
      case 'clubhouse':
        return <FaUsers />;
      case 'tennis':
      case 'tennis_court':
        return <FaTableTennis />;
      case 'playground':
        return <FaChild />;
      case 'library':
        return <FaBook />;
      case 'party hall':
      case 'party_hall':
        return <FaMusic />;
      default:
        return <FaUtensils />;
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'confirmed': { color: 'bg-success/20 text-success', label: 'Confirmed', icon: <FaCheckCircle /> },
      'approved': { color: 'bg-success/20 text-success', label: 'Approved', icon: <FaCheckCircle /> },
      'pending': { color: 'bg-warning/20 text-warning', label: 'Pending', icon: <FaClockIcon /> },
      'cancelled': { color: 'bg-red-400/20 text-red-400', label: 'Cancelled', icon: <FaTimesCircle /> },
      'completed': { color: 'bg-blue-400/20 text-blue-400', label: 'Completed', icon: <FaCheckCircle /> },
      'rejected': { color: 'bg-red-400/20 text-red-400', label: 'Rejected', icon: <FaTimesCircle /> }
    };
    return statusMap[status?.toLowerCase()] || { color: 'bg-text-muted/20 text-text-muted', label: status || 'Unknown', icon: null };
  };

  const getAmenityName = (booking) => {
    if (booking.amenityDisplayName && booking.amenityDisplayName !== 'Unknown') {
      return booking.amenityDisplayName;
    }
    if (booking.amenityName && booking.amenityName !== 'Unknown') {
      return booking.amenityName;
    }
    if (booking.amenityId) {
      const amenity = amenities.find(a => a._id === booking.amenityId || a._id.toString() === booking.amenityId.toString());
      if (amenity) {
        return amenity.name;
      }
    }
    return 'Unknown';
  };

  const getAmenityType = (booking) => {
    if (booking.amenityType && booking.amenityType !== 'Other') {
      return booking.amenityType;
    }
    if (booking.amenityId) {
      const amenity = amenities.find(a => a._id === booking.amenityId || a._id.toString() === booking.amenityId.toString());
      if (amenity) {
        return amenity.type;
      }
    }
    return 'Other';
  };

  const filteredBookings = bookings.filter(booking => {
    const search = searchTerm.toLowerCase();
    const amenityName = getAmenityName(booking);
    const matchesSearch = 
      amenityName?.toLowerCase().includes(search) ||
      booking.date?.includes(search);
    const matchesStatus = filterStatus === 'all' || booking.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending' || b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed' || b.status === 'Confirmed' || b.status === 'approved').length,
    completed: bookings.filter(b => b.status === 'completed' || b.status === 'Completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled' || b.status === 'Cancelled').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent/20 border-t-accent"></div>
          <p className="text-text-muted mt-4">Loading amenities...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Amenity Booking</h1>
          <p className="text-text-muted text-sm mt-1">Book and manage community amenities.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
        >
          <FaPlus /> Book Now
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs">Total Bookings</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-4 border-success/20">
          <p className="text-text-muted text-xs">Confirmed</p>
          <p className="text-2xl font-bold text-success">{stats.confirmed}</p>
        </div>
        <div className="glass-card p-4 border-warning/20">
          <p className="text-text-muted text-xs">Pending</p>
          <p className="text-2xl font-bold text-warning">{stats.pending}</p>
        </div>
        <div className="glass-card p-4 border-blue-400/20">
          <p className="text-text-muted text-xs">Completed</p>
          <p className="text-2xl font-bold text-blue-400">{stats.completed}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {amenities.slice(0, 4).map((amenity) => (
          <div key={amenity._id} className="glass-card p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/20 mx-auto flex items-center justify-center text-accent text-xl">
              {getAmenityIcon(amenity.type)}
            </div>
            <p className="text-white text-sm font-medium mt-2">{amenity.name}</p>
            <p className="text-text-muted text-xs">{amenity.location || 'Available'}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search bookings..."
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
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendarCheck className="text-5xl text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">No bookings found</p>
            <p className="text-text-muted/50 text-sm mt-1">Book an amenity to get started</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Amenity</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">Date</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Time</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Duration</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((booking) => {
                  const statusBadge = getStatusBadge(booking.status);
                  const displayName = getAmenityName(booking);
                  const amenityType = getAmenityType(booking);
                  
                  return (
                    <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                            {getAmenityIcon(amenityType)}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{displayName}</p>
                            <p className="text-text-muted text-xs md:hidden">{booking.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-text-muted text-sm">{booking.date}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white text-sm">{booking.time}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-text-muted text-sm">{booking.duration}h</span>
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
                            onClick={() => handleViewDetails(booking)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors"
                            title="View Details"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          {(booking.status === 'pending' || booking.status === 'Pending' || 
                            booking.status === 'confirmed' || booking.status === 'Confirmed') && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={cancelling}
                              className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors"
                              title="Cancel Booking"
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
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
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
                <FaCalendarCheck className="text-accent" />
                Book Amenity
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
                  <label className="block text-text-muted text-sm mb-1">Select Amenity *</label>
                  <select
                    name="amenityId"
                    value={formData.amenityId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.amenityId ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                    required
                  >
                    <option value="">Select an amenity</option>
                    {amenities.map((amenity) => (
                      <option key={amenity._id} value={amenity._id}>
                        {amenity.name} - {amenity.location || 'Available'}
                      </option>
                    ))}
                  </select>
                  {errors.amenityId && <p className="error-text text-red-400 text-xs mt-1">{errors.amenityId}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-muted text-sm mb-1">Date *</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={today}
                        className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.date ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                        required
                      />
                      <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
                    </div>
                    {errors.date && <p className="error-text text-red-400 text-xs mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-text-muted text-sm mb-1">Time *</label>
                    <div className="relative">
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.time ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                        required
                      />
                      <FaClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
                    </div>
                    {errors.time && <p className="error-text text-red-400 text-xs mt-1">{errors.time}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </select>
                  </div>
                  <div>
                    <label className="block text-text-muted text-sm mb-1">Number of Guests</label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-1">Special Requests</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    maxLength="200"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.notes ? 'border-red-400' : 'border-white/10'} rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors resize-none`}
                    placeholder="Any special requests..."
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
                      Booking...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Book Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaCalendarCheck className="text-accent" />
                Booking Details
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
                <span className="text-text-muted">Amenity</span>
                <span className="text-white font-medium">
                  {getAmenityName(selectedBooking)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Date</span>
                <span className="text-white">{selectedBooking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Time</span>
                <span className="text-white">{selectedBooking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Duration</span>
                <span className="text-white">{selectedBooking.duration} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Guests</span>
                <span className="text-white">{selectedBooking.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Status</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(selectedBooking.status).color}`}>
                  {getStatusBadge(selectedBooking.status).label}
                </span>
              </div>
              {selectedBooking.notes && (
                <div>
                  <p className="text-text-muted text-sm">Special Requests</p>
                  <p className="text-white text-sm mt-1">{selectedBooking.notes}</p>
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
              {(selectedBooking.status === 'pending' || selectedBooking.status === 'Pending' || 
                selectedBooking.status === 'confirmed' || selectedBooking.status === 'Confirmed') && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking._id)}
                  disabled={cancelling}
                  className="flex-1 btn-primary bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 px-4 py-2"
                >
                  {cancelling ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      Cancel Booking
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

export default AmenityBooking;