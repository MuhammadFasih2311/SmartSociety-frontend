import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaLock, FaSave, FaCheckCircle, FaBuilding } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ResidentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [society, setSociety] = useState({
    societyName: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api/resident';

  useEffect(() => {
    fetchSocietySettings();
  }, []);

  const fetchSocietySettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/settings/society`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSociety(response.data.data);
    } catch (error) {
      console.error('Fetch society error:', error);
      toast.error('Failed to load society settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/change-password`, passwordData, {
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
      setSaving(false);
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
        <p className="text-text-muted text-sm mt-1">Manage your account settings.</p>
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
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaBuilding className="text-accent" />
            Society Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-text-muted text-xs">Society Name</p>
              <p className="text-white font-medium">{society.societyName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Address</p>
              <p className="text-white font-medium">{society.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Phone</p>
              <p className="text-white font-medium">{society.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Email</p>
              <p className="text-white font-medium">{society.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Website</p>
              <p className="text-white font-medium">{society.website || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaLock className="text-accent" />
            Security
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
                <label className="block text-text-muted text-sm mb-1">Current Password *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-text-muted text-sm mb-1">New Password *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-text-muted text-sm mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className={`btn-primary flex items-center gap-2 px-6 py-2 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {saving ? 'Changing...' : <><FaLock /> Change Password</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentSettings;