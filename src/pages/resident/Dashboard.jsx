import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FaHome, FaFileInvoice, FaBell, FaCalendarCheck,
  FaKey, FaBuilding, FaUser, FaArrowRight, FaChartPie,
  FaWallet, FaCreditCard, FaClock, FaCheckCircle,
  FaTimesCircle, FaSpinner, FaExclamationTriangle,
  FaUsers, FaCalendarAlt, FaPercent
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ResidentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    bills: { total: 0, paid: 0, overdue: 0, pending: 0, totalAmount: 0, paidAmount: 0, pendingAmount: 0 },
    passes: { total: 0, active: 0, pending: 0, expired: 0, cancelled: 0 },
    complaints: { total: 0, pending: 0, resolved: 0, rejected: 0, inProgress: 0 },
    bookings: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [profile, setProfile] = useState(null);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      const [
        statsRes,
        billsRes,
        passesRes,
        complaintsRes,
        bookingsRes,
        profileRes
      ] = await Promise.all([
        axios.get(`${API_URL}/resident/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/resident/bills`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/resident/passes`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/resident/complaints`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/resident/amenities/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/resident/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const bills = billsRes.data.data || [];
      const passes = passesRes.data.data || [];
      const complaints = complaintsRes.data.data || [];
      const bookings = bookingsRes.data.data || [];

      const totalAmount = bills.reduce((sum, b) => sum + (b.amount || 0), 0);
      const paidAmount = bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + (b.amount || 0), 0);
      const pendingAmount = bills.filter(b => b.status === 'Pending' || b.status === 'Overdue')
        .reduce((sum, b) => sum + (b.amount || 0), 0);

      setStats({
        bills: {
          total: bills.length,
          paid: bills.filter(b => b.status === 'Paid').length,
          overdue: bills.filter(b => b.status === 'Overdue').length,
          pending: bills.filter(b => b.status === 'Pending').length,
          totalAmount: totalAmount,
          paidAmount: paidAmount,
          pendingAmount: pendingAmount
        },
        passes: {
          total: passes.length,
          active: passes.filter(p => p.status === 'active' || p.status === 'Active' || p.status === 'approved').length,
          pending: passes.filter(p => p.status === 'pending' || p.status === 'Pending').length,
          expired: passes.filter(p => p.status === 'expired' || p.status === 'Expired').length,
          cancelled: passes.filter(p => p.status === 'cancelled' || p.status === 'Cancelled').length
        },
        complaints: {
          total: complaints.length,
          pending: complaints.filter(c => c.status === 'Pending' || c.status === 'pending').length,
          resolved: complaints.filter(c => c.status === 'Resolved' || c.status === 'resolved').length,
          rejected: complaints.filter(c => c.status === 'Rejected' || c.status === 'rejected').length,
          inProgress: complaints.filter(c => c.status === 'In-Progress' || c.status === 'in-progress').length
        },
        bookings: {
          total: bookings.length,
          pending: bookings.filter(b => b.status === 'Pending' || b.status === 'pending').length,
          confirmed: bookings.filter(b => b.status === 'Confirmed' || b.status === 'confirmed' || b.status === 'approved').length,
          completed: bookings.filter(b => b.status === 'Completed' || b.status === 'completed').length,
          cancelled: bookings.filter(b => b.status === 'Cancelled' || b.status === 'cancelled').length
        }
      });

      setProfile(profileRes.data.data);

      const recent = [
        ...bills.slice(0, 2).map(b => ({
          id: b._id,
          type: 'bill',
          title: `Maintenance Bill - ${b.month || 'Monthly'}`,
          date: new Date(b.createdAt).toLocaleDateString(),
          status: b.status,
          amount: b.amount,
          icon: <FaFileInvoice className="text-blue-400" />
        })),
        ...passes.slice(0, 2).map(p => ({
          id: p._id,
          type: 'pass',
          title: `Visitor Pass - ${p.visitorName || 'Guest'}`,
          date: new Date(p.createdAt).toLocaleDateString(),
          status: p.status,
          icon: <FaKey className="text-accent" />
        })),
        ...complaints.slice(0, 2).map(c => ({
          id: c._id,
          type: 'complaint',
          title: `Complaint - ${c.category || 'General'}`,
          date: new Date(c.createdAt).toLocaleDateString(),
          status: c.status,
          icon: <FaBell className="text-warning" />
        })),
        ...bookings.slice(0, 2).map(b => ({
          id: b._id,
          type: 'booking',
          title: `Booking - ${b.amenityName || 'Amenity'}`,
          date: new Date(b.createdAt).toLocaleDateString(),
          status: b.status,
          icon: <FaCalendarCheck className="text-purple-400" />
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

      setRecentActivity(recent);

      const upcoming = [
        ...passes.filter(p => p.status === 'pending' || p.status === 'Pending' || p.status === 'active').slice(0, 3).map(p => ({
          id: p._id,
          type: 'pass',
          title: `${p.visitorName || 'Guest'} - Visitor Pass`,
          date: p.visitDate || p.createdAt,
          status: p.status,
          icon: <FaKey className="text-accent" />
        })),
        ...bookings.filter(b => b.status === 'Pending' || b.status === 'pending' || b.status === 'Confirmed' || b.status === 'confirmed').slice(0, 3).map(b => ({
          id: b._id,
          type: 'booking',
          title: `${b.amenityName || 'Amenity'} Booking`,
          date: b.date || b.createdAt,
          status: b.status,
          icon: <FaCalendarCheck className="text-purple-400" />
        }))
      ].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);

      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Paid': { color: 'bg-success/20 text-success', label: 'Paid' },
      'Active': { color: 'bg-success/20 text-success', label: 'Active' },
      'active': { color: 'bg-success/20 text-success', label: 'Active' },
      'approved': { color: 'bg-success/20 text-success', label: 'Approved' },
      'Confirmed': { color: 'bg-success/20 text-success', label: 'Confirmed' },
      'confirmed': { color: 'bg-success/20 text-success', label: 'Confirmed' },
      'Resolved': { color: 'bg-success/20 text-success', label: 'Resolved' },
      'resolved': { color: 'bg-success/20 text-success', label: 'Resolved' },
      'Completed': { color: 'bg-blue-400/20 text-blue-400', label: 'Completed' },
      'completed': { color: 'bg-blue-400/20 text-blue-400', label: 'Completed' },
      'Pending': { color: 'bg-warning/20 text-warning', label: 'Pending' },
      'pending': { color: 'bg-warning/20 text-warning', label: 'Pending' },
      'In-Progress': { color: 'bg-warning/20 text-warning', label: 'In Progress' },
      'in-progress': { color: 'bg-warning/20 text-warning', label: 'In Progress' },
      'Overdue': { color: 'bg-red-400/20 text-red-400', label: 'Overdue' },
      'overdue': { color: 'bg-red-400/20 text-red-400', label: 'Overdue' },
      'Rejected': { color: 'bg-red-400/20 text-red-400', label: 'Rejected' },
      'rejected': { color: 'bg-red-400/20 text-red-400', label: 'Rejected' },
      'Cancelled': { color: 'bg-red-400/20 text-red-400', label: 'Cancelled' },
      'cancelled': { color: 'bg-red-400/20 text-red-400', label: 'Cancelled' },
      'Expired': { color: 'bg-gray-400/20 text-gray-400', label: 'Expired' },
      'expired': { color: 'bg-gray-400/20 text-gray-400', label: 'Expired' }
    };
    return statusMap[status] || { color: 'bg-text-muted/20 text-text-muted', label: status || 'Unknown' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const billPaidPercent = stats.bills.total > 0 ? Math.round((stats.bills.paid / stats.bills.total) * 100) : 0;
  const complaintResolvedPercent = stats.complaints.total > 0 ? Math.round((stats.complaints.resolved / stats.complaints.total) * 100) : 0;
  const bookingConfirmedPercent = stats.bookings.total > 0 ? Math.round((stats.bookings.confirmed / stats.bookings.total) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent/20 border-t-accent"></div>
          <p className="text-text-muted mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const mainStats = [
    {
      title: 'Maintenance Bills',
      value: stats.bills.total,
      icon: <FaFileInvoice className="text-2xl" />,
      color: 'from-accent/20 to-accent-light/10 text-accent',
      bgColor: 'bg-accent/10',
      details: [
        { label: 'Paid', value: stats.bills.paid, color: 'text-success' },
        { label: 'Pending', value: stats.bills.pending, color: 'text-warning' },
        { label: 'Overdue', value: stats.bills.overdue, color: 'text-red-400' }
      ],
      link: '/resident/bills',
      amount: formatCurrency(stats.bills.totalAmount),
      progress: billPaidPercent
    },
    {
      title: 'Visitor Passes',
      value: stats.passes.total,
      icon: <FaKey className="text-2xl" />,
      color: 'from-blue-400/20 to-blue-400/10 text-blue-400',
      bgColor: 'bg-blue-400/10',
      details: [
        { label: 'Active', value: stats.passes.active, color: 'text-success' },
        { label: 'Pending', value: stats.passes.pending, color: 'text-warning' },
        { label: 'Expired', value: stats.passes.expired, color: 'text-gray-400' }
      ],
      link: '/resident/visitor-pass',
      progress: stats.passes.total > 0 ? Math.round((stats.passes.active / stats.passes.total) * 100) : 0
    },
    {
      title: 'Complaints',
      value: stats.complaints.total,
      icon: <FaBell className="text-2xl" />,
      color: 'from-warning/20 to-warning/10 text-warning',
      bgColor: 'bg-warning/10',
      details: [
        { label: 'Pending', value: stats.complaints.pending, color: 'text-warning' },
        { label: 'In Progress', value: stats.complaints.inProgress, color: 'text-blue-400' },
        { label: 'Resolved', value: stats.complaints.resolved, color: 'text-success' }
      ],
      link: '/resident/complaints',
      progress: complaintResolvedPercent
    },
    {
      title: 'Amenity Bookings',
      value: stats.bookings.total,
      icon: <FaCalendarCheck className="text-2xl" />,
      color: 'from-purple-400/20 to-purple-400/10 text-purple-400',
      bgColor: 'bg-purple-400/10',
      details: [
        { label: 'Confirmed', value: stats.bookings.confirmed, color: 'text-success' },
        { label: 'Pending', value: stats.bookings.pending, color: 'text-warning' },
        { label: 'Completed', value: stats.bookings.completed, color: 'text-blue-400' }
      ],
      link: '/resident/booking',
      progress: bookingConfirmedPercent
    }
  ];

  const financialSummary = [
    { label: 'Total Bills', value: stats.bills.total, icon: <FaFileInvoice className="text-accent" /> },
    { label: 'Total Amount', value: formatCurrency(stats.bills.totalAmount), icon: <FaWallet className="text-accent" /> },
    { label: 'Paid Amount', value: formatCurrency(stats.bills.paidAmount), icon: <FaCheckCircle className="text-success" /> },
    { label: 'Pending Amount', value: formatCurrency(stats.bills.pendingAmount), icon: <FaClock className="text-warning" /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Welcome back, {profile?.fullName || 'Resident'}! 👋
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Flat {profile?.flatNumber || 'N/A'} • {profile?.blockName || ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-3 py-1 rounded-full ${
            profile?.status === 'Active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
          }`}>
            {profile?.status || 'Active'}
          </span>
          <span className="text-text-muted text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {financialSummary.map((item, index) => (
          <div key={index} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-xs">{item.label}</span>
              <span className="text-lg">{item.icon}</span>
            </div>
            <p className="text-xl font-bold text-white mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="glass-card p-5 hover:border-accent/40 transition-all duration-300 group block"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-text-muted text-xs uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                {stat.amount && (
                  <p className="text-accent text-sm font-medium mt-1">{stat.amount}</p>
                )}
              </div>
              <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
            </div>

            {stat.progress !== undefined && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Progress</span>
                  <span>{stat.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-primary-light/30 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-1000"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-3 pt-3 border-t border-white/5">
              {stat.details.map((detail, idx) => (
                <div key={idx} className="flex-1">
                  <p className={`text-xs font-medium ${detail.color}`}>{detail.value}</p>
                  <p className="text-text-muted text-[10px]">{detail.label}</p>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          to="/resident/visitor-pass"
          className="glass-card p-4 text-center hover:border-accent/40 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-accent/20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
            <FaKey className="text-accent text-xl" />
          </div>
          <p className="text-white text-sm mt-2">Visitor Pass</p>
          <p className="text-text-muted text-xs">Create new pass</p>
        </Link>
        <Link
          to="/resident/bills"
          className="glass-card p-4 text-center hover:border-accent/40 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-blue-400/20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
            <FaFileInvoice className="text-blue-400 text-xl" />
          </div>
          <p className="text-white text-sm mt-2">Pay Bills</p>
          <p className="text-text-muted text-xs">View due bills</p>
        </Link>
        <Link
          to="/resident/complaints"
          className="glass-card p-4 text-center hover:border-accent/40 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-warning/20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
            <FaBell className="text-warning text-xl" />
          </div>
          <p className="text-white text-sm mt-2">Raise Complaint</p>
          <p className="text-text-muted text-xs">Report an issue</p>
        </Link>
        <Link
          to="/resident/booking"
          className="glass-card p-4 text-center hover:border-accent/40 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-purple-400/20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
            <FaCalendarCheck className="text-purple-400 text-xl" />
          </div>
          <p className="text-white text-sm mt-2">Book Amenity</p>
          <p className="text-text-muted text-xs">Reserve facility</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FaClock className="text-accent" />
              Recent Activity
            </h2>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-text-muted text-center py-6">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const statusBadge = getStatusBadge(activity.status);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'bill' ? 'bg-blue-400/20' :
                        activity.type === 'complaint' ? 'bg-warning/20' :
                        activity.type === 'booking' ? 'bg-purple-400/20' :
                        'bg-accent/20'
                      }`}>
                        {activity.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm truncate">{activity.title}</p>
                        <p className="text-text-muted text-xs">{activity.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-accent" />
            Upcoming Events
          </h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-text-muted text-center py-6">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => {
                const statusBadge = getStatusBadge(event.status);
                return (
                  <div key={index} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        event.type === 'pass' ? 'bg-accent/20' : 'bg-purple-400/20'
                      }`}>
                        {event.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{event.title}</p>
                        <p className="text-text-muted text-xs">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FaChartPie className="text-accent" />
          Summary at a Glance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-primary-light/20 rounded-xl">
            <p className="text-text-muted text-xs">Total Bills</p>
            <p className="text-2xl font-bold text-white">{stats.bills.total}</p>
          </div>
          <div className="text-center p-3 bg-primary-light/20 rounded-xl">
            <p className="text-text-muted text-xs">Active Passes</p>
            <p className="text-2xl font-bold text-success">{stats.passes.active}</p>
          </div>
          <div className="text-center p-3 bg-primary-light/20 rounded-xl">
            <p className="text-text-muted text-xs">Pending Complaints</p>
            <p className="text-2xl font-bold text-warning">{stats.complaints.pending}</p>
          </div>
          <div className="text-center p-3 bg-primary-light/20 rounded-xl">
            <p className="text-text-muted text-xs">Confirmed Bookings</p>
            <p className="text-2xl font-bold text-accent">{stats.bookings.confirmed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;