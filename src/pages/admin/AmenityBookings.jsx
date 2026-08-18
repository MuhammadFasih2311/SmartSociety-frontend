import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaSearch, FaFilter, FaCheckCircle, FaTimes, FaClock,
  FaEye, FaTrash, FaCalendarAlt, FaUser, FaHome,
  FaBuilding, FaSwimmingPool, FaDumbbell, 
  FaGlassCheers, FaArrowLeft, FaArrowRight, FaEdit,
  FaSave, FaTimes as FaTimesIcon, FaInfoCircle,
  FaUsers, FaMoneyBillWave, FaCheck, FaTshirt, FaChevronDown
} from 'react-icons/fa';

const AdminAmenityBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    completed: 0
  });
  const itemsPerPage = 5;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  const amenities = [
    { id: 'clubhouse', name: 'Clubhouse', icon: <FaHome />, capacity: 50, price: 5000 },
    { id: 'swimming_pool', name: 'Swimming Pool', icon: <FaSwimmingPool />, capacity: 20, price: 2000 },
    { id: 'tennis_court', name: 'Tennis Court', icon: <FaTshirt />, capacity: 4, price: 1500 },
    { id: 'party_hall', name: 'Party Hall', icon: <FaGlassCheers />, capacity: 100, price: 10000 },
    { id: 'gym', name: 'Gymnasium', icon: <FaDumbbell />, capacity: 10, price: 1000 },
    { id: 'other', name: 'Other', icon: <FaBuilding />, capacity: 10, price: 500 }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-warning', bg: 'bg-warning/20' },
    { value: 'approved', label: 'Approved', color: 'text-success', bg: 'bg-success/20' },
    { value: 'rejected', label: 'Rejected', color: 'text-red-400', bg: 'bg-red-400/20' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-gray-400', bg: 'bg-gray-400/20' },
    { value: 'completed', label: 'Completed', color: 'text-blue-400', bg: 'bg-blue-400/20' }
  ];

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/amenities/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.data);
    } catch (error) {
      console.error('Fetch bookings error:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/amenities/bookings/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleStatusChange = async (id, status) => {
    setIsUpdating(true);
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/admin/amenities/bookings/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`Booking ${status} successfully!`);
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === id ? { ...booking, status: status } : booking
          )
        );
        fetchStats(); 
        setShowModal(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/amenities/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking deleted successfully!');
      setBookings(prevBookings => prevBookings.filter(booking => booking._id !== id));
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete booking');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return { color: 'bg-success/20 text-success', icon: <FaCheckCircle />, label: 'Approved' };
      case 'pending': return { color: 'bg-warning/20 text-warning', icon: <FaClock />, label: 'Pending' };
      case 'rejected': return { color: 'bg-red-400/20 text-red-400', icon: <FaTimes />, label: 'Rejected' };
      case 'cancelled': return { color: 'bg-gray-400/20 text-gray-400', icon: <FaTimes />, label: 'Cancelled' };
      case 'completed': return { color: 'bg-blue-400/20 text-blue-400', icon: <FaCheckCircle />, label: 'Completed' };
      default: return { color: 'bg-text-muted/20 text-text-muted', icon: null, label: status };
    }
  };

  const getAmenityIcon = (type) => {
    const amenity = amenities.find(a => a.id === type);
    return amenity?.icon || <FaBuilding />;
  };

  const getAmenityName = (type) => {
    const amenity = amenities.find(a => a.id === type);
    return amenity?.name || type;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.residentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.flatNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.amenityName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const statCards = [
    { label: 'Total Bookings', value: stats.total, icon: <FaCalendarAlt />, color: 'from-accent to-accent-light' },
    { label: 'Pending', value: stats.pending, icon: <FaClock />, color: 'from-warning to-orange-400' },
    { label: 'Approved', value: stats.approved, icon: <FaCheckCircle />, color: 'from-success to-emerald-400' },
    { label: 'Rejected', value: stats.rejected, icon: <FaTimes />, color: 'from-red-400 to-pink-400' },
    { label: 'Completed', value: stats.completed, icon: <FaCheckCircle />, color: 'from-blue-400 to-cyan-400' },
    { label: 'Cancelled', value: stats.cancelled, icon: <FaTimes />, color: 'from-gray-400 to-gray-500' },
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
        <p className="text-text-muted mt-2">Loading bookings...</p>
      </div>
    );
  }

  const StatusDropdown = ({ bookingId, currentStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isUpdatingThis = updatingId === bookingId;

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isUpdatingThis}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200
            ${getStatusBadge(currentStatus).color} hover:opacity-80 border border-white/10
            ${isUpdatingThis ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>{getStatusBadge(currentStatus).icon}</span>
          <span>{getStatusBadge(currentStatus).label}</span>
          <FaChevronDown className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-primary-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-20 py-1 overflow-hidden">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (option.value !== currentStatus) {
                      handleStatusChange(bookingId, option.value);
                    }
                    setIsOpen(false);
                  }}
                  disabled={isUpdatingThis}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200
                    ${currentStatus === option.value 
                      ? `${option.bg} ${option.color} cursor-default` 
                      : 'text-text-muted hover:text-white hover:bg-white/5'
                    }
                    ${isUpdatingThis ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={`text-base ${option.color}`}>{getStatusBadge(option.value).icon}</span>
                  <span>{option.label}</span>
                  {currentStatus === option.value && (
                    <span className="ml-auto text-accent text-xs">
                      <FaCheck />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Amenity Bookings</h1>
        <p className="text-text-muted text-sm mt-1">Manage all amenity bookings from residents.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statCards.map((stat, index) => (
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
            placeholder="Search by resident, flat or amenity..."
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
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <FaBuilding className="text-5xl text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">No bookings found</p>
            <p className="text-text-muted/50 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Amenity</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Resident</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">Date & Time</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden lg:table-cell">People</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((booking) => {
                  const bookingId = booking._id;
                  return (
                    <tr key={bookingId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-accent text-lg">{getAmenityIcon(booking.amenityType)}</span>
                          <div>
                            <span className="text-white text-sm block">{booking.amenityName}</span>
                            <span className="text-text-muted text-xs">{getAmenityName(booking.amenityType)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white text-sm">{booking.residentName}</p>
                          <p className="text-text-muted text-xs">Flat {booking.flatNumber}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div>
                          <p className="text-text-muted text-sm">{new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          <p className="text-text-muted/50 text-xs">{booking.startTime} - {booking.endTime}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-text-muted text-sm">{booking.numberOfPeople}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusDropdown 
                          bookingId={bookingId} 
                          currentStatus={booking.status} 
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowModal(true);
                            }}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors"
                            title="View Details"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(bookingId)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors"
                            title="Delete"
                          >
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
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1
                      ${currentPage === 1 ? 'text-text-muted/30 cursor-not-allowed' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                  >
                    <FaArrowLeft className="text-xs" /> Previous
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
                    Next <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Booking Details</h2>
              <button
                onClick={() => { setShowModal(false); setSelectedBooking(null); }}
                className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors"
              >
                <FaTimesIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary/30 rounded-xl">
                  <p className="text-text-muted text-xs">Amenity</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <span className="text-accent">{getAmenityIcon(selectedBooking.amenityType)}</span>
                    {selectedBooking.amenityName}
                  </p>
                </div>
                <div className="p-3 bg-primary/30 rounded-xl">
                  <p className="text-text-muted text-xs">Status</p>
                  <div className="mt-1">
                    <StatusDropdown 
                      bookingId={selectedBooking._id} 
                      currentStatus={selectedBooking.status} 
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary/30 rounded-xl">
                  <p className="text-text-muted text-xs">Resident</p>
                  <p className="text-white font-medium">{selectedBooking.residentName}</p>
                  <p className="text-text-muted text-xs">Flat {selectedBooking.flatNumber}</p>
                </div>
                <div className="p-3 bg-primary/30 rounded-xl">
                  <p className="text-text-muted text-xs">Number of People</p>
                  <p className="text-white font-medium">{selectedBooking.numberOfPeople}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary/30 rounded-xl">
                  <p className="text-text-muted text-xs">Date</p>
                  <p className="text-white font-medium">{new Date(selectedBooking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="p-3 bg-primary/30 rounded-xl">
                  <p className="text-text-muted text-xs">Time</p>
                  <p className="text-white font-medium">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                </div>
              </div>

              {selectedBooking.purpose && (
                <div className="p-3 bg-primary/30 rounded-xl">
                  <p className="text-text-muted text-xs">Purpose</p>
                  <p className="text-white font-medium">{selectedBooking.purpose}</p>
                </div>
              )}

              {selectedBooking.notes && (
                <div className="p-3 bg-primary/30 rounded-xl">
                  <p className="text-text-muted text-xs">Notes</p>
                  <p className="text-text-muted text-sm">{selectedBooking.notes}</p>
                </div>
              )}

              {selectedBooking.amount > 0 && (
                <div className="p-3 bg-primary/30 rounded-xl">
                  <p className="text-text-muted text-xs">Payment</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Rs {selectedBooking.amount}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${selectedBooking.paymentStatus === 'paid' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                      {selectedBooking.paymentStatus?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/5">
                <p className="text-text-muted text-xs mb-3">Change Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(selectedBooking._id, option.value)}
                      disabled={isUpdating || selectedBooking.status === option.value}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                        ${selectedBooking.status === option.value 
                          ? `${option.bg} ${option.color} cursor-default` 
                          : 'bg-primary/30 text-text-muted hover:text-white hover:bg-white/10'
                        }
                        ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAmenityBookings;