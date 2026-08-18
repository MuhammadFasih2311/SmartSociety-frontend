import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaUser, FaEnvelope, FaPhone, FaHome, FaBuilding,
  FaCalendarAlt, FaBriefcase, FaIdCard, FaVenusMars,
  FaSave, FaCheckCircle, FaUserCog
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ResidentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    flatNumber: '',
    blockName: '',
    floor: '',
    moveInDate: '',
    occupation: '',
    cnic: '',
    gender: 'Male',
    dateOfBirth: '',
    status: ''
  });
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api/resident';
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.data);
    } catch (error) {
      console.error('Fetch profile error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!profile.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (!/^[A-Za-z\s]+$/.test(profile.fullName)) {
      newErrors.fullName = 'Full name can only contain letters';
    } else if (profile.fullName.length > 50) {
      newErrors.fullName = 'Full name cannot exceed 50 characters';
    }
    
    if (profile.phone && !/^[0-9+\-\s]+$/.test(profile.phone)) {
      newErrors.phone = 'Phone can only contain numbers, +, -, and spaces';
    }
    if (profile.phone && profile.phone.length < 10) {
      newErrors.phone = 'Phone must be at least 10 characters';
    }
    if (profile.phone && profile.phone.length > 15) {
      newErrors.phone = 'Phone cannot exceed 15 characters';
    }
    
    if (profile.cnic && !/^[0-9-]+$/.test(profile.cnic)) {
      newErrors.cnic = 'CNIC can only contain numbers and dashes';
    }
    if (profile.cnic && profile.cnic.length > 20) {
      newErrors.cnic = 'CNIC cannot exceed 20 characters';
    }
    
    if (!profile.flatNumber) {
      newErrors.flatNumber = 'Flat number is required';
    } else if (!/^[0-9]+$/.test(profile.flatNumber)) {
      newErrors.flatNumber = 'Flat number can only contain numbers';
    } else if (profile.flatNumber.length > 10) {
      newErrors.flatNumber = 'Flat number cannot exceed 10 characters';
    }
    
    if (!profile.blockName) {
      newErrors.blockName = 'Block name is required';
    } else if (!/^[A-Za-z0-9\s-]+$/.test(profile.blockName)) {
      newErrors.blockName = 'Block name can only contain letters, numbers, spaces, and dashes';
    } else if (profile.blockName.length > 10) {
      newErrors.blockName = 'Block name cannot exceed 10 characters';
    }
    
    if (!profile.floor) {
      newErrors.floor = 'Floor is required';
    } else if (!/^[0-9]+$/.test(profile.floor)) {
      newErrors.floor = 'Floor can only contain numbers';
    } else if (profile.floor.length > 10) {
      newErrors.floor = 'Floor cannot exceed 10 characters';
    }
    
    if (profile.dateOfBirth && profile.dateOfBirth > today) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }
    
    if (profile.moveInDate && profile.moveInDate < today) {
      newErrors.moveInDate = 'Move in date cannot be in the past';
    }
    
    if (profile.occupation && profile.occupation.length > 50) {
      newErrors.occupation = 'Occupation cannot exceed 50 characters';
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

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaveSuccess(true);
      toast.success('Profile updated successfully!');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
        <p className="text-text-muted mt-2">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">My Profile</h1>
        <p className="text-text-muted text-sm mt-1">View and update your personal information.</p>
      </div>

      {saveSuccess && (
        <div className="glass-card p-4 mb-6 border-success/30 bg-success/10 animate-fade-in">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-success text-xl" />
            <p className="text-white">Profile updated successfully!</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <FaUserCog className="text-accent" />
              Personal Information
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted text-sm mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    maxLength="50"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.fullName ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                  />
                  {errors.fullName && <p className="error-text text-red-400 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2 bg-primary-light/30 border border-white/5 rounded-xl text-text-muted cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    maxLength="15"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.phone ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                  />
                  {errors.phone && <p className="error-text text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-1">CNIC</label>
                  <input
                    type="text"
                    name="cnic"
                    value={profile.cnic}
                    onChange={handleChange}
                    maxLength="20"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.cnic ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                  />
                  {errors.cnic && <p className="error-text text-red-400 text-xs mt-1">{errors.cnic}</p>}
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-1">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-1">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profile.dateOfBirth}
                      onChange={handleChange}
                      max={today}
                      className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.dateOfBirth ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                    />
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
                  </div>
                  {errors.dateOfBirth && <p className="error-text text-red-400 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-1">Flat Number</label>
                  <input
                    type="text"
                    name="flatNumber"
                    value={profile.flatNumber}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.flatNumber ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                  />
                  {errors.flatNumber && <p className="error-text text-red-400 text-xs mt-1">{errors.flatNumber}</p>}
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-1">Block Name</label>
                  <input
                    type="text"
                    name="blockName"
                    value={profile.blockName}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.blockName ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                  />
                  {errors.blockName && <p className="error-text text-red-400 text-xs mt-1">{errors.blockName}</p>}
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-1">Floor</label>
                  <input
                    type="text"
                    name="floor"
                    value={profile.floor}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.floor ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                  />
                  {errors.floor && <p className="error-text text-red-400 text-xs mt-1">{errors.floor}</p>}
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-1">Move In Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="moveInDate"
                      value={profile.moveInDate}
                      onChange={handleChange}
                      min={today}
                      className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.moveInDate ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                    />
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
                  </div>
                  {errors.moveInDate && <p className="error-text text-red-400 text-xs mt-1">{errors.moveInDate}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-text-muted text-sm mb-1">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={profile.occupation}
                    onChange={handleChange}
                    maxLength="50"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.occupation ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                  />
                  {errors.occupation && <p className="error-text text-red-400 text-xs mt-1">{errors.occupation}</p>}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className={`btn-primary flex items-center gap-2 px-6 py-2 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {saving ? 'Saving...' : <><FaSave /> Update Profile</>}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-accent to-accent-light mx-auto flex items-center justify-center text-3xl">
              <FaUser className="text-primary" />
            </div>
            <h3 className="text-white font-bold text-xl mt-4">{profile.fullName}</h3>
            <p className="text-text-muted text-sm">{profile.flatNumber}, {profile.blockName}</p>
            <p className="text-text-muted text-xs">{profile.role || 'Resident'}</p>
            
            <div className="mt-4 pt-4 border-t border-white/5 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FaEnvelope className="text-text-muted" />
                <span className="text-white">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaPhone className="text-text-muted" />
                <span className="text-white">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaHome className="text-text-muted" />
                <span className="text-white">Flat {profile.flatNumber}, {profile.blockName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaBuilding className="text-text-muted" />
                <span className="text-white">Floor {profile.floor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaIdCard className="text-text-muted" />
                <span className="text-white">{profile.cnic || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`text-xs px-2 py-1 rounded-full ${profile.status === 'Active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                  {profile.status || 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentProfile;