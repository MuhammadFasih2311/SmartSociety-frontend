import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaUser, FaPhone, FaEnvelope, FaSave, FaTimes, 
  FaArrowLeft, FaShieldAlt, FaKey, FaMapMarkerAlt,
  FaClock, FaBuilding, FaEye, FaEyeSlash
} from 'react-icons/fa';

const CreateGuard = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    phone: '',
    email: '',
    password: '',
    shift: 'Morning',
    gate: 'Main Gate',
    status: 'Active',
    emergency: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  const shifts = ['Morning', 'Evening', 'Night'];
  const gates = ['Main Gate', 'Side Gate', 'Back Gate', 'Parking Gate'];
  const statuses = ['Active', 'On Leave', 'Inactive'];

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
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 20) {
      newErrors.password = 'Password cannot exceed 20 characters';
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
      const response = await axios.post(`${API_URL}/admin/guards`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Guard created successfully!');
        navigate('/admin/guards', { state: { message: 'Guard created successfully!' } });
      }
    } catch (error) {
      console.error('Create error:', error);
      if (error.response?.data?.errors) {
        setServerErrors(error.response.data.errors);
        toast.error('Please fix the validation errors');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create guard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Add New Guard</h1>
          <p className="text-text-muted text-sm mt-1">Register a new security guard.</p>
        </div>
        <Link to="/admin/guards" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <FaArrowLeft /> Back to List
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaUser className="text-accent" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">Full Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                maxLength="50"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.name || serverErrors.name ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} 
                placeholder="Rashid Ahmed" 
              />
              {(errors.name || serverErrors.name) && <p className="error-text text-red-400 text-xs mt-1">{errors.name || serverErrors.name}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Employee ID *</label>
              <input 
                type="text" 
                name="employeeId" 
                value={formData.employeeId} 
                onChange={handleChange} 
                maxLength="20"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.employeeId || serverErrors.employeeId ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} 
                placeholder="G-001" 
              />
              {(errors.employeeId || serverErrors.employeeId) && <p className="error-text text-red-400 text-xs mt-1">{errors.employeeId || serverErrors.employeeId}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Phone *</label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                maxLength="15"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.phone ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} 
                placeholder="+92 300 1234567" 
              />
              {errors.phone && <p className="error-text text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Email *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                maxLength="50"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.email || serverErrors.email ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} 
                placeholder="rashid@email.com" 
              />
              {(errors.email || serverErrors.email) && <p className="error-text text-red-400 text-xs mt-1">{errors.email || serverErrors.email}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Password *</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  maxLength="20"
                  className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.password || serverErrors.password ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors pr-10`} 
                  placeholder="Minimum 6 characters" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {(errors.password || serverErrors.password) && <p className="error-text text-red-400 text-xs mt-1">{errors.password || serverErrors.password}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Emergency Contact</label>
              <input 
                type="text" 
                name="emergency" 
                value={formData.emergency} 
                onChange={handleChange} 
                maxLength="15"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.emergency ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} 
                placeholder="+92 300 7654321" 
              />
              {errors.emergency && <p className="error-text text-red-400 text-xs mt-1">{errors.emergency}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-text-muted text-sm mb-2">Address</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                maxLength="100"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.address ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} 
                placeholder="House #12, Street 5" 
              />
              {errors.address && <p className="error-text text-red-400 text-xs mt-1">{errors.address}</p>}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaShieldAlt className="text-accent" /> Assignment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">Shift *</label>
              <select 
                name="shift" 
                value={formData.shift} 
                onChange={handleChange} 
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.shift ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
              >
                {shifts.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.shift && <p className="error-text text-red-400 text-xs mt-1">{errors.shift}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Gate Assignment *</label>
              <select 
                name="gate" 
                value={formData.gate} 
                onChange={handleChange} 
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.gate ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
              >
                {gates.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.gate && <p className="error-text text-red-400 text-xs mt-1">{errors.gate}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link to="/admin/guards" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300">
            <FaTimes /> Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className={`btn-primary flex items-center justify-center gap-2 px-6 py-3 min-w-[140px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <><svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creating...</>
            ) : (
              <><FaSave /> Create Guard</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGuard;