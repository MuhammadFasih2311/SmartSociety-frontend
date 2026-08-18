import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaSave, FaTimes, FaArrowLeft, FaMoneyBillWave,
  FaUser, FaHome, FaCalendarAlt, FaFileInvoice,
  FaPlus, FaTrash, FaUsers
} from 'react-icons/fa';

const GenerateBill = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedResidents, setSelectedResidents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    dueDate: '',
    description: 'Monthly maintenance fee',
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    charges: {
      maintenance: 0,
      security: 0,
      water: 0,
      repairs: 0,
      other: 0
    }
  });

  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/residents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResidents(response.data.data);
    } catch (error) {
      console.error('Fetch residents error:', error);
      toast.error('Failed to load residents');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleResident = (id) => {
    if (selectedResidents.includes(id)) {
      setSelectedResidents(selectedResidents.filter(r => r !== id));
    } else {
      setSelectedResidents([...selectedResidents, id]);
    }
  };

  const toggleAllResidents = () => {
    if (selectAll) {
      setSelectedResidents([]);
    } else {
      setSelectedResidents(residents.map(r => r.id));
    }
    setSelectAll(!selectAll);
  };

  const validate = () => {
    if (selectedResidents.length === 0) {
      toast.error('Please select at least one resident');
      return false;
    }
    if (!formData.amount) {
      toast.error('Please enter total amount');
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

      const amount = parseFloat(formData.amount);
      const charges = {
        maintenance: amount * 0.6,
        security: amount * 0.2,
        water: amount * 0.1,
        repairs: amount * 0.05,
        other: amount * 0.05
      };

      const response = await axios.post(`${API_URL}/admin/billing/generate`, {
        residentIds: selectedResidents,
        amount: formData.amount,
        dueDate: formData.dueDate,
        description: formData.description,
        month: formData.month,
        year: formData.year,
        charges: charges
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/admin/billing', { state: { message: response.data.message } });
      }
    } catch (error) {
      console.error('Generate bills error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate bills');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div><p className="text-text-muted mt-2">Loading residents...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Generate Bills</h1>
          <p className="text-text-muted text-sm mt-1">Create maintenance bills for selected residents.</p>
        </div>
        <Link to="/admin/billing" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <FaArrowLeft /> Back to Billing
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <FaUsers className="text-accent" /> Select Residents
            </h2>
            <button type="button" onClick={toggleAllResidents} className="text-accent hover:text-accent-light transition-colors text-sm">
              {selectAll ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {residents.map((resident) => (
              <div key={resident.id} onClick={() => toggleResident(resident.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-300 flex items-center gap-3
                  ${selectedResidents.includes(resident.id) 
                    ? 'bg-accent/20 border border-accent/50' 
                    : 'bg-primary/30 border border-white/5 hover:border-white/20'}`}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                  ${selectedResidents.includes(resident.id) ? 'bg-accent border-accent' : 'border-white/20'}`}>
                  {selectedResidents.includes(resident.id) && <span className="text-primary text-xs">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{resident.name}</p>
                  <p className="text-text-muted text-xs">{resident.flatNumber}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-primary/30 rounded-xl">
            <p className="text-text-muted text-sm">Selected: <span className="text-white font-medium">{selectedResidents.length}</span> residents</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaFileInvoice className="text-accent" /> Bill Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">Total Amount (PKR) *</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" placeholder="5000" />
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
              <label className="block text-text-muted text-sm mb-2">Month</label>
              <input type="text" name="month" value={formData.month} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Year</label>
              <input type="number" name="year" value={formData.year} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-text-muted text-sm mb-2">Description</label>
              <input type="text" name="description" value={formData.description} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" placeholder="Monthly maintenance fee" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link to="/admin/billing" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300">
            <FaTimes /> Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className={`btn-primary flex items-center justify-center gap-2 px-6 py-3 min-w-[180px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isSubmitting ? (
              <><svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...</>
            ) : (
              <><FaSave /> Generate {selectedResidents.length > 0 ? `${selectedResidents.length} Bills` : 'Bills'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateBill;