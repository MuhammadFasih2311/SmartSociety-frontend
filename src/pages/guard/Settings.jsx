import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUser, FaLock, FaBuilding, FaPhone, FaEnvelope, 
  FaSave, FaCheckCircle, FaUserCog, FaIdCard,
  FaVenusMars, FaCalendarAlt, FaMapMarkerAlt,
  FaShieldAlt, FaClock, FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const GuardSettings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api/guard';
  const today = new Date().toISOString().split('T')[0];

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    cnic: '',
    gender: 'Male',
    dateOfBirth: '',
    employeeId: '',
    gateAssigned: '',
    shiftTiming: '',
    emergencyContact: '',
    status: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/settings/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.data);
    } catch (error) {
      console.error('❌ Fetch profile error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateProfile = () => {
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
    
    if (profile.dateOfBirth && profile.dateOfBirth > today) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }
    
    if (profile.emergencyContact && !/^[0-9+\-\s]+$/.test(profile.emergencyContact)) {
      newErrors.emergencyContact = 'Emergency contact can only contain numbers, +, -, and spaces';
    }
    if (profile.emergencyContact && profile.emergencyContact.length < 10) {
      newErrors.emergencyContact = 'Emergency contact must be at least 10 characters';
    }
    if (profile.emergencyContact && profile.emergencyContact.length > 15) {
      newErrors.emergencyContact = 'Emergency contact cannot exceed 15 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      const firstError = document.querySelector('.error-text');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/settings/profile`, {
        fullName: profile.fullName,
        phone: profile.phone,
        cnic: profile.cnic,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        emergencyContact: profile.emergencyContact
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaveSuccess(true);
      toast.success('Profile updated successfully!');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) errors.newPassword = 'New password is required';
    if (passwordData.newPassword && passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    if (passwordData.newPassword && passwordData.newPassword.length > 20) {
      errors.newPassword = 'Password cannot exceed 20 characters';
    }
    if (!passwordData.confirmPassword) errors.confirmPassword = 'Confirm password is required';
    if (passwordData.newPassword && passwordData.confirmPassword && 
        passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/settings/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent/20 border-t-accent"></div>
          <p className="text-text-muted mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Guard Settings</h1>
        <p className="text-text-muted text-sm mt-1">Manage your profile and account settings.</p>
      </div>

      {saveSuccess && (
        <div className="glass-card p-4 mb-6 border-success/30 bg-success/10 animate-fade-in">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-success text-xl" />
            <p className="text-white">Settings saved successfully!</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <FaUserCog className="text-accent" /> Profile Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-muted text-sm mb-2">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    maxLength="50"
                    className={`w-full pl-10 pr-4 py-2 bg-primary-light/50 border ${errors.fullName ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                  />
                  {errors.fullName && <p className="error-text text-red-400 text-xs mt-1">{errors.fullName}</p>}
                </div>
              </div>
              <div>
                <label className="block text-text-muted text-sm mb-2">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2 bg-primary-light/30 border border-white/5 rounded-xl text-text-muted cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-text-muted text-sm mb-2">Phone</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    maxLength="15"
                    className={`w-full pl-10 pr-4 py-2 bg-primary-light/50 border ${errors.phone ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                  />
                  {errors.phone && <p className="error-text text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-text-muted text-sm mb-2">CNIC</label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                  <input
                    type="text"
                    name="cnic"
                    value={profile.cnic}
                    onChange={handleProfileChange}
                    maxLength="20"
                    className={`w-full pl-10 pr-4 py-2 bg-primary-light/50 border ${errors.cnic ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                  />
                  {errors.cnic && <p className="error-text text-red-400 text-xs mt-1">{errors.cnic}</p>}
                </div>
              </div>
              <div>
                <label className="block text-text-muted text-sm mb-2">Gender</label>
                <div className="relative">
                  <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-text-muted text-sm mb-2">Date of Birth</label>
                <div className="relative">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={handleProfileChange}
                    max={today}
                    className={`w-full pl-10 pr-4 py-2 bg-primary-light/50 border ${errors.dateOfBirth ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                  />
                  <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
                </div>
                {errors.dateOfBirth && <p className="error-text text-red-400 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="block text-text-muted text-sm mb-2">Emergency Contact</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                  <input
                    type="text"
                    name="emergencyContact"
                    value={profile.emergencyContact}
                    onChange={handleProfileChange}
                    maxLength="15"
                    className={`w-full pl-10 pr-4 py-2 bg-primary-light/50 border ${errors.emergencyContact ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                  />
                  {errors.emergencyContact && <p className="error-text text-red-400 text-xs mt-1">{errors.emergencyContact}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-white/5">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className={`btn-primary flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <><FaSave /> Update Profile</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <FaShieldAlt className="text-accent" /> Guard Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-text-muted text-sm">Employee ID</span>
                <span className="text-white font-medium">{profile.employeeId || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-text-muted text-sm">Gate Assigned</span>
                <span className="text-accent font-medium">{profile.gateAssigned || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-text-muted text-sm">Shift Timing</span>
                <span className="text-white">{profile.shiftTiming || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-text-muted text-sm">Status</span>
                <span className={`text-xs px-2 py-1 rounded-full ${profile.status === 'Active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                  {profile.status || 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <FaLock className="text-accent" /> Security
            </h2>
            
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full btn-secondary flex items-center justify-center gap-2 px-4 py-2 text-sm"
            >
              <FaLock />
              {showPasswordForm ? 'Hide Password Form' : 'Change Password'}
            </button>

            {showPasswordForm && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-text-muted text-sm mb-2">Current Password *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${passwordErrors.currentPassword ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                    placeholder="Enter current password"
                  />
                  {passwordErrors.currentPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.currentPassword}</p>}
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-2">New Password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    maxLength="20"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${passwordErrors.newPassword ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                    placeholder="Enter new password (min 6 chars)"
                  />
                  {passwordErrors.newPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.newPassword}</p>}
                </div>
                <div>
                  <label className="block text-text-muted text-sm mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    maxLength="20"
                    className={`w-full px-4 py-2 bg-primary-light/50 border ${passwordErrors.confirmPassword ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.confirmPassword}</p>}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={isSaving}
                    className={`btn-primary flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSaving ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <><FaLock /> Change Password</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardSettings;