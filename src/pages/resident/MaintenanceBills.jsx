import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaFileInvoice, FaSearch, FaArrowLeft, FaArrowRight,
  FaCheckCircle, FaTimesCircle, FaClock, FaSpinner,
  FaEye, FaRupeeSign, FaCalendarAlt, FaHome, FaUser,
  FaInfoCircle, FaDownload
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const MaintenanceBills = () => {
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [paying, setPaying] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0
  });
  const itemsPerPage = 5;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchBills();
    fetchStats();
  }, []);

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/resident/bills`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBills(response.data.data || []);
    } catch (error) {
      console.error('Fetch bills error:', error);
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/resident/bills/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handlePayBill = async (id) => {
    if (!window.confirm('Are you sure you want to pay this bill?')) return;

    setPaying(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/resident/bills/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Bill paid successfully!');
        fetchBills();
        fetchStats();
        setShowDetails(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to pay bill');
    } finally {
      setPaying(false);
    }
  };

  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setShowDetails(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Paid':
        return { 
          color: 'bg-success/20 text-success', 
          label: 'Paid', 
          icon: <FaCheckCircle className="text-success" /> 
        };
      case 'Overdue':
        return { 
          color: 'bg-red-400/20 text-red-400', 
          label: 'Overdue', 
          icon: <FaTimesCircle className="text-red-400" /> 
        };
      case 'Pending':
        return { 
          color: 'bg-warning/20 text-warning', 
          label: 'Pending', 
          icon: <FaClock className="text-warning" /> 
        };
      default:
        return { 
          color: 'bg-text-muted/20 text-text-muted', 
          label: status || 'Unknown', 
          icon: null 
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredBills = bills.filter(bill => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      bill.month?.toLowerCase().includes(search) ||
      bill.description?.toLowerCase().includes(search) ||
      bill.flatNumber?.toLowerCase().includes(search) ||
      bill.residentName?.toLowerCase().includes(search);
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBills = filteredBills.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent/20 border-t-accent"></div>
          <p className="text-text-muted mt-4">Loading bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Maintenance Bills</h1>
        <p className="text-text-muted text-sm mt-1">View and pay your maintenance bills.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs">Total Bills</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-4 border-success/20">
          <p className="text-text-muted text-xs">Paid</p>
          <p className="text-2xl font-bold text-success">{stats.paid}</p>
        </div>
        <div className="glass-card p-4 border-warning/20">
          <p className="text-text-muted text-xs">Pending</p>
          <p className="text-2xl font-bold text-warning">{stats.pending}</p>
        </div>
        <div className="glass-card p-4 border-red-400/20">
          <p className="text-text-muted text-xs">Overdue</p>
          <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4 border-accent/30">
          <p className="text-text-muted text-xs">Total Amount</p>
          <p className="text-2xl font-bold text-white flex items-center">
            <FaRupeeSign className="text-sm mr-1" />
            {stats.totalAmount?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="glass-card p-4 border-success/30">
          <p className="text-text-muted text-xs">Paid Amount</p>
          <p className="text-2xl font-bold text-success flex items-center">
            <FaRupeeSign className="text-sm mr-1" />
            {stats.paidAmount?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="glass-card p-4 border-warning/30">
          <p className="text-text-muted text-xs">Pending Amount</p>
          <p className="text-2xl font-bold text-warning flex items-center">
            <FaRupeeSign className="text-sm mr-1" />
            {stats.pendingAmount?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by month, description or flat..."
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
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        {filteredBills.length === 0 ? (
          <div className="text-center py-12">
            <FaFileInvoice className="text-5xl text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">No bills found</p>
            <p className="text-text-muted/50 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Month</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">Description</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Amount</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Due Date</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBills.map((bill) => {
                  const statusBadge = getStatusBadge(bill.status);
                  return (
                    <tr key={bill._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium text-sm">{bill.month} {bill.year}</p>
                          <p className="text-text-muted text-xs md:hidden">{bill.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-text-muted text-sm">{bill.description}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white font-bold flex items-center">
                          <FaRupeeSign className="text-xs mr-1" />
                          {bill.amount?.toFixed(2) || '0.00'}
                        </span>
                        {bill.lateFee > 0 && (
                          <span className="text-red-400 text-xs">+{bill.lateFee} late fee</span>
                        )}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-text-muted text-sm">{formatDate(bill.dueDate)}</span>
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
                            onClick={() => handleViewDetails(bill)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors"
                            title="View Details"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          {(bill.status === 'Pending' || bill.status === 'Overdue') && (
                            <button
                              onClick={() => handlePayBill(bill._id)}
                              disabled={paying}
                              className="btn-primary text-xs px-3 py-1 flex items-center gap-1"
                            >
                              {paying ? <FaSpinner className="animate-spin" /> : <FaRupeeSign />}
                              Pay Now
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
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredBills.length)} of {filteredBills.length} bills
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

      {showDetails && selectedBill && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaFileInvoice className="text-accent" />
                Bill Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-text-muted hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <FaTimesCircle className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-text-muted">Month</span>
                <span className="text-white font-medium">{selectedBill.month} {selectedBill.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Flat Number</span>
                <span className="text-white">{selectedBill.flatNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Resident</span>
                <span className="text-white">{selectedBill.residentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Amount</span>
                <span className="text-accent font-bold text-xl flex items-center">
                  <FaRupeeSign className="text-sm mr-1" />
                  {selectedBill.amount?.toFixed(2) || '0.00'}
                </span>
              </div>
              {selectedBill.lateFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Late Fee</span>
                  <span className="text-red-400 font-bold flex items-center">
                    <FaRupeeSign className="text-xs mr-1" />
                    {selectedBill.lateFee?.toFixed(2) || '0.00'}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-muted">Due Date</span>
                <span className="text-white">{formatDate(selectedBill.dueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Status</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(selectedBill.status).color}`}>
                  {getStatusBadge(selectedBill.status).label}
                </span>
              </div>
              {selectedBill.paidDate && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Paid Date</span>
                  <span className="text-success">{formatDate(selectedBill.paidDate)}</span>
                </div>
              )}
              <div>
                <p className="text-text-muted text-sm">Description</p>
                <p className="text-white text-sm mt-1">{selectedBill.description}</p>
              </div>

              {selectedBill.charges && (
                <div className="border-t border-white/5 pt-3">
                  <p className="text-text-muted text-sm mb-2">Charges Breakdown</p>
                  <div className="space-y-1 text-sm">
                    {selectedBill.charges.maintenance > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Maintenance</span>
                        <span className="text-white">Rs. {selectedBill.charges.maintenance}</span>
                      </div>
                    )}
                    {selectedBill.charges.security > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Security</span>
                        <span className="text-white">Rs. {selectedBill.charges.security}</span>
                      </div>
                    )}
                    {selectedBill.charges.water > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Water</span>
                        <span className="text-white">Rs. {selectedBill.charges.water}</span>
                      </div>
                    )}
                    {selectedBill.charges.repairs > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Repairs</span>
                        <span className="text-white">Rs. {selectedBill.charges.repairs}</span>
                      </div>
                    )}
                    {selectedBill.charges.other > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Other</span>
                        <span className="text-white">Rs. {selectedBill.charges.other}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 btn-secondary px-4 py-2"
              >
                Close
              </button>
              {(selectedBill.status === 'Pending' || selectedBill.status === 'Overdue') && (
                <button
                  onClick={() => handlePayBill(selectedBill._id)}
                  disabled={paying}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 px-4 py-2"
                >
                  {paying ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaRupeeSign />
                      Pay Bill
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

export default MaintenanceBills;