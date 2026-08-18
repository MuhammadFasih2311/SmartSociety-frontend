import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  FaArrowLeft, FaSave, FaTimesCircle, FaSpinner,
  FaBuilding, FaUsers, FaDollarSign, FaMapMarkerAlt,
  FaClock, FaInfoCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const EditAmenity = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Pool',
    location: '',
    capacity: 10,
    pricePerHour: 0,
    description: '',
    availableSlots: 5,
    isActive: true,
    timings: {
      start: '08:00',
      end: '22:00'
    }
  });
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchAmenity();
  }, [id]);

  const fetchAmenity = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/amenities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.data;
      setFormData({
        name: data.name || '',
        type: data.type || 'Pool',
        location: data.location || '',
        capacity: data.capacity || 10,
        pricePerHour: data.pricePerHour || 0,
        description: data.description || '',
        availableSlots: data.availableSlots || 5,
        isActive: data.isActive !== undefined ? data.isActive : true,
        timings: data.timings || { start: '08:00', end: '22:00' }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load amenity');
      navigate('/admin/amenities');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'timings.start' || name === 'timings.end') {
      const [key, subKey] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [subKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      toast.error('Name and Type are required');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/admin/amenities/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Amenity updated successfully!');
        navigate('/admin/amenities', { state: { message: 'Amenity updated successfully!' } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update amenity');
    } finally {
      setLoading(false);
    }
  };

  const amenityTypes = ['Pool', 'Gym', 'Clubhouse', 'Tennis', 'Playground', 'Library', 'Party Hall', 'Other'];

  if (fetchLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
        <p className="text-text-muted mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Amenity</h1>
          <p className="text-text-muted text-sm mt-1">Update amenity details.</p>
        </div>
        <Link to="/admin/amenities" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <FaArrowLeft /> Back to Amenities
        </Link>
      </div>

      <div className="glass-card p-6 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Same form fields as CreateAmenity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-muted text-sm mb-1">Amenity Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                placeholder="Enter amenity name"
                required
              />
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-1">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                required
              >
                {amenityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-text-muted text-sm mb-1">Location</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                placeholder="e.g., Block A, Ground Floor"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-text-muted text-sm mb-1">Capacity</label>
              <div className="relative">
                <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                  min="1"
                />
              </div>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-1">Price Per Hour</label>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  type="number"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                  min="0"
                  step="50"
                />
              </div>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-1">Available Slots</label>
              <input
                type="number"
                name="availableSlots"
                value={formData.availableSlots}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-muted text-sm mb-1">Opening Time</label>
              <div className="relative">
                <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  type="time"
                  name="timings.start"
                  value={formData.timings.start}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-1">Closing Time</label>
              <div className="relative">
                <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  type="time"
                  name="timings.end"
                  value={formData.timings.end}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-text-muted text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder="Describe the amenity, facilities, rules, etc."
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-white text-sm">Active</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => navigate('/admin/amenities')}
              className="flex-1 btn-secondary px-4 py-2 flex items-center justify-center gap-2"
            >
              <FaTimesCircle /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary px-4 py-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FaSave /> Update Amenity
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAmenity;