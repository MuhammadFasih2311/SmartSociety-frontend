import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaMoneyBillWave, FaDownload, FaEye, FaPlus, FaSearch, 
  FaCheckCircle, FaClock, FaExclamationTriangle, FaEdit,
  FaTrash, FaArrowLeft, FaArrowRight, FaFileInvoice
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const BillingEngine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchBills();
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/billing`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBills(response.data.data);
    } catch (error) {
      console.error('Fetch bills error:', error);
      toast.error(error.response?.data?.message || 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${id}?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/billing/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Invoice ${id} deleted successfully!`);
      fetchBills();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/billing/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Invoice status updated to ${newStatus}`);
      fetchBills();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  const filteredBills = bills.filter(bill => {
    const flat = bill.flatNumber || '';
    const resident = bill.residentName || '';
    const id = bill._id || '';
    
    const matchesSearch = flat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || (bill.status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBills = filteredBills.slice(startIndex, startIndex + itemsPerPage);

  const stats = [
    { label: 'Total Bills', value: `PKR ${bills.reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}`, icon: <FaMoneyBillWave />, color: 'from-accent to-accent-light' },
    { label: 'Collected', value: `PKR ${bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}`, icon: <FaCheckCircle />, color: 'from-success to-emerald-400' },
    { label: 'Pending', value: `PKR ${bills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}`, icon: <FaClock />, color: 'from-warning to-orange-400' },
    { label: 'Overdue', value: `PKR ${bills.filter(b => b.status === 'Overdue').reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}`, icon: <FaExclamationTriangle />, color: 'from-red-400 to-pink-400' },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Paid': return 'bg-success/20 text-success';
      case 'Pending': return 'bg-warning/20 text-warning';
      case 'Overdue': return 'bg-red-400/20 text-red-400';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  const statusOptions = ['Paid', 'Pending', 'Overdue'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Billing Engine</h1>
        <p className="text-text-muted text-sm mt-1">Generate, manage, and track maintenance bills for all residents.</p>
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
            placeholder="Search by invoice, flat or resident..."
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <Link to="/admin/billing/generate" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaPlus /> Generate Bills
          </Link>
        </div>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
            <p className="text-text-muted mt-2">Loading bills...</p>
          </div>
        ) : filteredBills.length === 0 ? (
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
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Invoice</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Resident</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">Flat</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Amount</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Due Date</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBills.map((bill) => {
                  const billId = bill._id || bill.id;
                  return (
                    <tr key={billId || Math.random()} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-4">
                        <span className="text-accent font-medium text-sm">{bill._id?.slice(-6) || bill.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white text-sm">{bill.residentName}</span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-text-muted text-sm">{bill.flatNumber}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white font-medium text-sm">PKR {bill.amount?.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-text-muted text-sm">{new Date(bill.dueDate).toLocaleDateString()}</span>
                      </td>
                      <td className="py-3 px-4">
                      <select
                        value={bill.status || 'Pending'}
                        onChange={(e) => handleStatusChange(billId, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-none focus:ring-0 focus:outline-none cursor-pointer ${getStatusBadge(bill.status)}`}
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
                              color: status === 'Paid' ? '#22c55e' : 
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
                          <Link to={`/admin/billing/show/${billId}`} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="View">
                            <FaEye className="text-sm" />
                          </Link>
                          <Link to={`/admin/billing/edit/${billId}`} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="Edit">
                            <FaEdit className="text-sm" />
                          </Link>
                          <button onClick={() => handleDelete(billId)} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors" title="Delete">
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
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredBills.length)} of {filteredBills.length} bills
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

export default BillingEngine;