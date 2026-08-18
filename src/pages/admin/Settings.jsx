import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSettings } from '../../context/SettingsContext';
import { 
  FaUser, FaLock, FaBuilding, FaPhone, FaEnvelope, 
  FaSave, FaCheckCircle, FaUserCog, FaCamera,
  FaMapMarkerAlt, FaGlobe
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';
  const [generalSettings, setGeneralSettings] = useState({
    societyName: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  });

  const [profileSettings, setProfileSettings] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: ''
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
    if (settings) {
      setGeneralSettings({
        societyName: settings.societyName || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        website: settings.website || ''
      });
    }
    setLoading(false);
  }, [settings]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/settings/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileSettings(response.data.data);
    } catch (error) {
      console.error('Fetch profile error:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileSettings(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateGeneral = () => {
    const newErrors = {};
    
    if (generalSettings.societyName && !/^[A-Za-z0-9\s\-&.]+$/.test(generalSettings.societyName)) {
      newErrors.societyName = 'Society name can only contain letters, numbers, spaces, -, &, and .';
    }
    if (generalSettings.societyName && generalSettings.societyName.length > 100) {
      newErrors.societyName = 'Society name cannot exceed 100 characters';
    }
    
    if (generalSettings.phone && !/^[0-9+\-\s]+$/.test(generalSettings.phone)) {
      newErrors.phone = 'Phone can only contain numbers, +, -, and spaces';
    }
    if (generalSettings.phone && generalSettings.phone.length < 10) {
      newErrors.phone = 'Phone must be at least 10 characters';
    }
    if (generalSettings.phone && generalSettings.phone.length > 15) {
      newErrors.phone = 'Phone cannot exceed 15 characters';
    }
    
    if (generalSettings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(generalSettings.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (generalSettings.email && generalSettings.email.length > 50) {
      newErrors.email = 'Email cannot exceed 50 characters';
    }
    
    if (generalSettings.address && generalSettings.address.length > 200) {
      newErrors.address = 'Address cannot exceed 200 characters';
    }
    
    if (generalSettings.website && generalSettings.website.length > 100) {
      newErrors.website = 'Website cannot exceed 100 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProfile = () => {
    const newErrors = {};
    
    if (!profileSettings.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (!/^[A-Za-z\s]+$/.test(profileSettings.fullName)) {
      newErrors.fullName = 'Full name can only contain letters';
    } else if (profileSettings.fullName.length > 50) {
      newErrors.fullName = 'Full name cannot exceed 50 characters';
    }
    
    if (profileSettings.phone && !/^[0-9+\-\s]+$/.test(profileSettings.phone)) {
      newErrors.phone = 'Phone can only contain numbers, +, -, and spaces';
    }
    if (profileSettings.phone && profileSettings.phone.length < 10) {
      newErrors.phone = 'Phone must be at least 10 characters';
    }
    if (profileSettings.phone && profileSettings.phone.length > 15) {
      newErrors.phone = 'Phone cannot exceed 15 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSaveGeneral = async () => {
    if (!validateGeneral()) {
      const firstError = document.querySelector('.error-text');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateSettings(generalSettings);
      if (result.success) {
        setSaveSuccess(true);
        toast.success('Settings saved successfully!');
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
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
      await axios.put(`${API_URL}/admin/settings/profile`, {
        fullName: profileSettings.fullName,
        phone: profileSettings.phone
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

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/settings/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
        <p className="text-text-muted mt-2">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
        <p className="text-text-muted text-sm mt-1">Manage your society settings and profile.</p>
      </div>

      {saveSuccess && (
        <div className="glass-card p-4 mb-6 border-success/30 bg-success/10 animate-fade-in">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-success text-xl" />
            <p className="text-white">Settings saved successfully!</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaBuilding className="text-accent" /> General Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-text-muted text-sm mb-2">Society Name</label>
              <input
                type="text"
                name="societyName"
                value={generalSettings.societyName}
                onChange={handleGeneralChange}
                maxLength="100"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.societyName ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
              />
              {errors.societyName && <p className="error-text text-red-400 text-xs mt-1">{errors.societyName}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={generalSettings.address}
                onChange={handleGeneralChange}
                maxLength="200"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.address ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
              />
              {errors.address && <p className="error-text text-red-400 text-xs mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={generalSettings.phone}
                onChange={handleGeneralChange}
                maxLength="15"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.phone ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
              />
              {errors.phone && <p className="error-text text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={generalSettings.email}
                onChange={handleGeneralChange}
                maxLength="50"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.email ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
              />
              {errors.email && <p className="error-text text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Website</label>
              <input
                type="text"
                name="website"
                value={generalSettings.website}
                onChange={handleGeneralChange}
                maxLength="100"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.website ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
              />
              {errors.website && <p className="error-text text-red-400 text-xs mt-1">{errors.website}</p>}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveGeneral}
                disabled={isSaving}
                className={`btn-primary flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSaving ? (
                  <><svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...</>
                ) : (
                  <><FaSave /> Save Settings</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaUserCog className="text-accent" /> Profile Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-text-muted text-sm mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profileSettings.fullName}
                onChange={handleProfileChange}
                maxLength="50"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.fullName ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
              />
              {errors.fullName && <p className="error-text text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Email</label>
              <input
                type="email"
                value={profileSettings.email}
                disabled
                className="w-full px-4 py-2 bg-primary-light/30 border border-white/5 rounded-xl text-text-muted cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={profileSettings.phone}
                onChange={handleProfileChange}
                maxLength="15"
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.phone ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}
              />
              {errors.phone && <p className="error-text text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Role</label>
              <input
                type="text"
                value={profileSettings.role}
                disabled
                className="w-full px-4 py-2 bg-primary-light/30 border border-white/5 rounded-xl text-text-muted cursor-not-allowed"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className={`btn-primary flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSaving ? (
                  <><svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Updating...</>
                ) : (
                  <><FaSave /> Update Profile</>
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-accent hover:text-accent-light transition-colors text-sm flex items-center gap-2"
              >
                <FaLock /> {showPasswordForm ? 'Hide' : 'Change Password'}
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
                        <><svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Changing...</>
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
    </div>
  );
};

export default Settings;