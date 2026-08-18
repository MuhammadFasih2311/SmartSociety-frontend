import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaUser, FaPhone, FaHome, FaSave, FaTimes, 
  FaArrowLeft, FaClock, FaIdCard, FaCar,
  FaFileAlt, FaCalendarAlt
} from 'react-icons/fa';

const CreateVisitor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';
  const today = new Date().toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    flatNumber: '',
    purpose: '',
    vehicleNumber: '',
    entryTime: '',
    exitTime: '',
    idType: 'CNIC',
    idNumber: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const idTypes = ['CNIC', 'Passport', 'Driving License', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone can only contain numbers, +, -, and spaces';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Phone must be at least 10 characters';
    } else if (formData.phone.length > 15) {
      newErrors.phone = 'Phone cannot exceed 15 characters';
    }
    
    if (!formData.flatNumber) {
      newErrors.flatNumber = 'Flat number is required';
    } else if (!/^[0-9A-Za-z\s-]+$/.test(formData.flatNumber)) {
      newErrors.flatNumber = 'Flat number can only contain letters, numbers, spaces, and dashes';
    } else if (formData.flatNumber.length > 10) {
      newErrors.flatNumber = 'Flat number cannot exceed 10 characters';
    }
    
    if (!formData.purpose) {
      newErrors.purpose = 'Purpose is required';
    } else if (formData.purpose.length > 100) {
      newErrors.purpose = 'Purpose cannot exceed 100 characters';
    }
    
    if (formData.vehicleNumber && formData.vehicleNumber.length > 15) {
      newErrors.vehicleNumber = 'Vehicle number cannot exceed 15 characters';
    }
    
    if (formData.entryTime && formData.entryTime < today) {
      newErrors.entryTime = 'Entry time cannot be in the past';
    }
    
    if (formData.idNumber && !/^[A-Za-z0-9-]+$/.test(formData.idNumber)) {
      newErrors.idNumber = 'ID number can only contain letters, numbers, and dashes';
    }
    if (formData.idNumber && formData.idNumber.length > 20) {
      newErrors.idNumber = 'ID number cannot exceed 20 characters';
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

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      const response = await axios.post(`${API_URL}/guard/visitors`, formData, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      if (response.data.success) {
        toast.success('Visitor added successfully!');
        navigate('/guard/visitors');
      } else {
        toast.error(response.data.message || 'Failed to add visitor');
      }
    } catch (error) {
      console.error('Create error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add visitor');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Add Visitor</h1>
          <p className="text-text-muted text-sm mt-1">Log a new visitor entry.</p>
        </div>
        <Link to="/guard/visitors" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <FaArrowLeft /> Back to List
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaUser className="text-accent" /> Visitor Information
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
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.name ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} 
                placeholder="Ali Hassan" 
              />
              {errors.name && <p className="error-text text-red-400 text-xs mt-1">{errors.name}</p>}
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
              <label className="block text-text-muted text-sm mb-2">Flat Number *</label>
              <input 
                type="text" 
                name="flatNumber" 
                value={formData.flatNumber} 
                onChange={handleChange} 
                maxLength="10"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.flatNumber ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} 
                placeholder="A-101" 
              />
              {errors.flatNumber && <p className="error-text text-red-400 text-xs mt-1">{errors.flatNumber}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Purpose *</label>
              <input 
                type="text" 
                name="purpose" 
                value={formData.purpose} 
                onChange={handleChange} 
                maxLength="100"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.purpose ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} 
                placeholder="Meeting / Delivery / Visit" 
              />
              {errors.purpose && <p className="error-text text-red-400 text-xs mt-1">{errors.purpose}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Vehicle Number</label>
              <input 
                type="text" 
                name="vehicleNumber" 
                value={formData.vehicleNumber} 
                onChange={handleChange} 
                maxLength="15"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.vehicleNumber ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} 
                placeholder="ABC-1234" 
              />
              {errors.vehicleNumber && <p className="error-text text-red-400 text-xs mt-1">{errors.vehicleNumber}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Entry Time</label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  name="entryTime" 
                  value={formData.entryTime} 
                  onChange={handleChange} 
                  min={today}
                  className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.entryTime ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} 
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
              </div>
              {errors.entryTime && <p className="error-text text-red-400 text-xs mt-1">{errors.entryTime}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Exit Time</label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  name="exitTime" 
                  value={formData.exitTime} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" 
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">ID Type</label>
              <select 
                name="idType" 
                value={formData.idType} 
                onChange={handleChange} 
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
              >
                {idTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">ID Number</label>
              <input 
                type="text" 
                name="idNumber" 
                value={formData.idNumber} 
                onChange={handleChange} 
                maxLength="20"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.idNumber ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} 
                placeholder="12345-1234567-1" 
              />
              {errors.idNumber && <p className="error-text text-red-400 text-xs mt-1">{errors.idNumber}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-text-muted text-sm mb-2">Notes</label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                rows="3" 
                maxLength="200"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.notes ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors resize-none`} 
                placeholder="Additional notes..." 
              />
              {errors.notes && <p className="error-text text-red-400 text-xs mt-1">{errors.notes}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link to="/guard/visitors" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300">
            <FaTimes /> Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className={`btn-primary flex items-center justify-center gap-2 px-6 py-3 min-w-[140px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <><svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Adding...</>
            ) : (
              <><FaSave /> Add Visitor</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVisitor;