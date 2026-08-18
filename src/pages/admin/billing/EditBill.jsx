import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaSave, FaTimes, FaArrowLeft, FaMoneyBillWave,
  FaCalendarAlt, FaFileInvoice
} from 'react-icons/fa';

const EditBill = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/billing/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.data;
      setFormData({
        amount: data.amount || '',
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '',
        status: data.status || 'Pending',
        description: data.description || ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load bill');
      navigate('/admin/billing');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.amount) {
      toast.error('Please enter amount');
      return false;
    }
    if (formData.amount < 0) {
      toast.error('Amount cannot be negative');
      return false;
    }
    if (!formData.dueDate) {
      toast.error('Please select due date');
      return false;
    }
    if (formData.dueDate < today) {
      toast.error('Due date cannot be in the past');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/billing/${id}`, {
        amount: formData.amount,
        dueDate: formData.dueDate,
        status: formData.status,
        description: formData.description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Bill updated successfully!');
      navigate('/admin/billing', { state: { message: 'Bill updated successfully!' } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update bill');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div><p className="text-text-muted mt-2">Loading...</p></div>;
  }

  if (!formData) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Bill</h1>
          <p className="text-text-muted text-sm mt-1">Update bill #{id?.slice(-6)}</p>
        </div>
        <Link to="/admin/billing" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <FaArrowLeft /> Back to Billing
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaFileInvoice className="text-accent" /> Bill Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">Amount (PKR) *</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} min="0"
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Due Date *</label>
              <div className="relative">
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} min={today}
                  className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-text-muted text-sm mb-2">Description</label>
              <input type="text" name="description" value={formData.description || ''} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link to="/admin/billing" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300">
            <FaTimes /> Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className={`btn-primary flex items-center justify-center gap-2 px-6 py-3 min-w-[140px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isSubmitting ? (<><svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Updating...</>) : (<><FaSave /> Update Bill</>)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBill;