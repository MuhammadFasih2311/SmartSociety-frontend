import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaSave, FaTimes, FaArrowLeft, FaUser, FaCar,
  FaPhone, FaMapMarkerAlt, FaClock, FaShieldAlt,
  FaCalendarAlt
} from 'react-icons/fa';

const AddLog = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    visitorName: '',
    flatNumber: '',
    vehicleNumber: '',
    phone: '',
    gate: 'Main Gate',
    type: 'visitor',
    status: 'Verified',
    purpose: '',
    entryTime: '',
    exitTime: '',
    date: new Date().toISOString().split('T')[0]
  });

  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';
  const gates = ['Main Gate', 'Side Gate', 'Back Gate', 'Parking Gate'];
  const types = ['visitor', 'delivery', 'resident'];
  const statuses = ['Verified', 'Flagged', 'Resident'];
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
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
    
    if (!formData.flatNumber) {
      newErrors.flatNumber = 'Flat number is required';
    } else if (!/^[0-9A-Za-z\s-]+$/.test(formData.flatNumber)) {
      newErrors.flatNumber = 'Flat number can only contain letters, numbers, spaces, and dashes';
    } else if (formData.flatNumber.length > 10) {
      newErrors.flatNumber = 'Flat number cannot exceed 10 characters';
    }
    
    if (formData.phone && !/^[0-9+\-\s]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone can only contain numbers, +, -, and spaces';
    }
    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = 'Phone must be at least 10 characters';
    }
    if (formData.phone && formData.phone.length > 15) {
      newErrors.phone = 'Phone cannot exceed 15 characters';
    }
    
    if (formData.vehicleNumber && formData.vehicleNumber.length > 15) {
      newErrors.vehicleNumber = 'Vehicle number cannot exceed 15 characters';
    }
    
    if (!formData.entryTime) {
      newErrors.entryTime = 'Entry time is required';
    }
    
    if (formData.date && formData.date < today) {
      newErrors.date = 'Date cannot be in the past';
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

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/admin/security`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Log entry added successfully!');
        navigate('/admin/security', { state: { message: 'Log entry added successfully!' } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add log entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Add Security Log</h1>
          <p className="text-text-muted text-sm mt-1">Record a new gate entry.</p>
        </div>
        <Link to="/admin/security" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <FaArrowLeft /> Back to Logs
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaUser className="text-accent" /> Visitor Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">Visitor Name *</label>
              <input type="text" name="visitorName" value={formData.visitorName} onChange={handleChange} maxLength="50"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.visitorName ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} placeholder="Ahmed Ali" />
              {errors.visitorName && <p className="error-text text-red-400 text-xs mt-1">{errors.visitorName}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Flat Number *</label>
              <input type="text" name="flatNumber" value={formData.flatNumber} onChange={handleChange} maxLength="10"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.flatNumber ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} placeholder="A-101" />
              {errors.flatNumber && <p className="error-text text-red-400 text-xs mt-1">{errors.flatNumber}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Vehicle Number</label>
              <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} maxLength="15"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.vehicleNumber ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} placeholder="ABC-1234" />
              {errors.vehicleNumber && <p className="error-text text-red-400 text-xs mt-1">{errors.vehicleNumber}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} maxLength="15"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.phone ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} placeholder="+92 300 1234567" />
              {errors.phone && <p className="error-text text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-text-muted text-sm mb-2">Purpose</label>
              <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} maxLength="100"
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" placeholder="Meeting with resident" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaShieldAlt className="text-accent" /> Entry Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">Gate</label>
              <select name="gate" value={formData.gate} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                {gates.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Type</label>
              <select name="type" value={formData.type} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Date</label>
              <div className="relative">
                <input type="date" name="date" value={formData.date} onChange={handleChange} min={today}
                  className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.date ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
              </div>
              {errors.date && <p className="error-text text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Entry Time *</label>
              <div className="relative">
                <input type="time" name="entryTime" value={formData.entryTime} onChange={handleChange}
                  className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.entryTime ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
                <FaClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
              </div>
              {errors.entryTime && <p className="error-text text-red-400 text-xs mt-1">{errors.entryTime}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Exit Time</label>
              <div className="relative">
                <input type="time" name="exitTime" value={formData.exitTime} onChange={handleChange}
                  className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
                <FaClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link to="/admin/security" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300">
            <FaTimes /> Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className={`btn-primary flex items-center justify-center gap-2 px-6 py-3 min-w-[140px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isSubmitting ? (
              <><svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Adding...</>
            ) : (
              <><FaSave /> Add Entry</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLog;