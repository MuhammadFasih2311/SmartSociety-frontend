import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    societyName: 'SmartSociety',
    address: '123 Main Street, Gulshan-e-Iqbal, Karachi',
    phone: '+92 300 1234567',
    email: 'info@smartsociety.com',
    website: 'www.smartsociety.com'
  });
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || user?.role !== 'admin') {
        setIsInitialized(true);
        return;
      }
      
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.log('Settings fetch skipped for non-admin');
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || user?.role !== 'admin') {
        toast.error('Only admin can update settings');
        return { success: false, message: 'Not authorized' };
      }
      
      const response = await axios.put(`${API_URL}/admin/settings`, newSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSettings(response.data.data);
        toast.success('Settings updated successfully!');
        return { success: true, message: response.data.message };
      }
      return { success: false, message: 'Failed to update settings' };
    } catch (error) {
      console.error('Update settings error:', error);
      const message = error.response?.data?.message || 'Failed to update settings';
      toast.error(message);
      return { success: false, message };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, isInitialized, updateSettings, fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};