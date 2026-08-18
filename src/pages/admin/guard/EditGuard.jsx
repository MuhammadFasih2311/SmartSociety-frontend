import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaUser, FaPhone, FaEnvelope, FaSave, FaTimes, 
  FaArrowLeft, FaShieldAlt, FaKey, FaMapMarkerAlt,
  FaClock, FaBuilding
} from 'react-icons/fa';

const EditGuard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchGuard();
  }, [id]);

  const fetchGuard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/guards/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.data;
      setFormData({
        name: data.name || '',
        employeeId: data.employeeId || '',
        phone: data.phone || '',
        email: data.email || '',
        shift: data.shift || 'Morning',
        gate: data.gate || 'Main Gate',
        status: data.status || 'Active',
        emergency: data.emergency || '',
        address: data.address || ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load guard');
      navigate('/admin/guards');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverErrors[name]) setServerErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (formData.name && !/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters';
    }
    if (formData.name && formData.name.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }
    
    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    if (formData.employeeId && formData.employeeId.length > 20) {
      newErrors.employeeId = 'Employee ID cannot exceed 20 characters';
    }
    
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (formData.phone && !/^[0-9+\-\s]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number can only contain numbers, +, -, and spaces';
    }
    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 characters';
    }
    if (formData.phone && formData.phone.length > 15) {
      newErrors.phone = 'Phone number cannot exceed 15 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.email && formData.email.length > 50) {
      newErrors.email = 'Email cannot exceed 50 characters';
    }
    
    if (!formData.shift) newErrors.shift = 'Shift is required';
    if (!formData.gate) newErrors.gate = 'Gate assignment is required';
    
    if (formData.emergency && !/^[0-9+\-\s]+$/.test(formData.emergency)) {
      newErrors.emergency = 'Emergency contact can only contain numbers, +, -, and spaces';
    }
    if (formData.emergency && formData.emergency.length < 10) {
      newErrors.emergency = 'Emergency contact must be at least 10 characters';
    }
    if (formData.emergency && formData.emergency.length > 15) {
      newErrors.emergency = 'Emergency contact cannot exceed 15 characters';
    }
    
    if (formData.address && formData.address.length > 100) {
      newErrors.address = 'Address cannot exceed 100 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErrors({});
    
    if (!validate()) {
      const firstError = document.querySelector('.error-text');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/guards/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Guard updated successfully!');
      navigate('/admin/guards', { state: { message: 'Guard updated successfully!' } });
    } catch (error) {
      console.error('Update error:', error);
      if (error.response?.data?.errors) {
        setServerErrors(error.response.data.errors);
        toast.error('Please fix the validation errors');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update guard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div><p className="text-text-muted mt-2">Loading...</p></div>;
  }

  if (!formData) return null;

  const shifts = ['Morning', 'Evening', 'Night'];
  const gates = ['Main Gate', 'Side Gate', 'Back Gate', 'Parking Gate'];
  const statuses = ['Active', 'On Leave', 'Inactive'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Guard</h1>
          <p className="text-text-muted text-sm mt-1">Update {formData.name}'s information</p>
        </div>
        <Link to="/admin/guards" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <FaArrowLeft /> Back to List
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><FaUser className="text-accent" /> Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} maxLength="50"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.name || serverErrors.name ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {(errors.name || serverErrors.name) && <p className="error-text text-red-400 text-xs mt-1">{errors.name || serverErrors.name}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Employee ID *</label>
              <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} maxLength="20"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.employeeId || serverErrors.employeeId ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {(errors.employeeId || serverErrors.employeeId) && <p className="error-text text-red-400 text-xs mt-1">{errors.employeeId || serverErrors.employeeId}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Phone *</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} maxLength="15"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.phone ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {errors.phone && <p className="error-text text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} maxLength="50"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.email || serverErrors.email ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {(errors.email || serverErrors.email) && <p className="error-text text-red-400 text-xs mt-1">{errors.email || serverErrors.email}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Emergency Contact</label>
              <input type="text" name="emergency" value={formData.emergency || ''} onChange={handleChange} maxLength="15"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.emergency ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {errors.emergency && <p className="error-text text-red-400 text-xs mt-1">{errors.emergency}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Address</label>
              <input type="text" name="address" value={formData.address || ''} onChange={handleChange} maxLength="100"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.address ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {errors.address && <p className="error-text text-red-400 text-xs mt-1">{errors.address}</p>}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><FaShieldAlt className="text-accent" /> Assignment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">Shift *</label>
              <select name="shift" value={formData.shift} onChange={handleChange} 
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.shift ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}>
                {shifts.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.shift && <p className="error-text text-red-400 text-xs mt-1">{errors.shift}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Gate Assignment *</label>
              <select name="gate" value={formData.gate} onChange={handleChange} 
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.gate ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}>
                {gates.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.gate && <p className="error-text text-red-400 text-xs mt-1">{errors.gate}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link to="/admin/guards" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300"><FaTimes /> Cancel</Link>
          <button type="submit" disabled={isSubmitting} className={`btn-primary flex items-center justify-center gap-2 px-6 py-3 min-w-[140px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isSubmitting ? (<><svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Updating...</>) : (<><FaSave /> Update Guard</>)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditGuard;