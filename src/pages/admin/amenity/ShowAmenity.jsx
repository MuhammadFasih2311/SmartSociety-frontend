import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  FaArrowLeft, FaEdit, FaTrash, FaBuilding,
  FaUsers, FaDollarSign, FaMapMarkerAlt,
  FaClock, FaCheckCircle, FaTimesCircle,
  FaSwimmer, FaDumbbell, FaTableTennis,
  FaChild, FaBook, FaMusic, FaUtensils,
  FaCalendarAlt, FaInfoCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ShowAmenity = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [amenity, setAmenity] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setAmenity(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load amenity');
      navigate('/admin/amenities');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${amenity?.name}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/amenities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Amenity deleted successfully!');
      navigate('/admin/amenities', { state: { message: 'Amenity deleted successfully!' } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const getAmenityIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'pool': return <FaSwimmer className="text-4xl" />;
      case 'gym': return <FaDumbbell className="text-4xl" />;
      case 'clubhouse': return <FaBuilding className="text-4xl" />;
      case 'tennis': return <FaTableTennis className="text-4xl" />;
      case 'playground': return <FaChild className="text-4xl" />;
      case 'library': return <FaBook className="text-4xl" />;
      case 'party hall': return <FaMusic className="text-4xl" />;
      default: return <FaUtensils className="text-4xl" />;
    }
  };

  const getAmenityColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'pool': return 'from-blue-400/20 to-blue-400/5 text-blue-400';
      case 'gym': return 'from-red-400/20 to-red-400/5 text-red-400';
      case 'clubhouse': return 'from-purple-400/20 to-purple-400/5 text-purple-400';
      case 'tennis': return 'from-green-400/20 to-green-400/5 text-green-400';
      case 'playground': return 'from-yellow-400/20 to-yellow-400/5 text-yellow-400';
      case 'library': return 'from-indigo-400/20 to-indigo-400/5 text-indigo-400';
      case 'party hall': return 'from-pink-400/20 to-pink-400/5 text-pink-400';
      default: return 'from-gray-400/20 to-gray-400/5 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
        <p className="text-text-muted mt-2">Loading...</p>
      </div>
    );
  }

  if (!amenity) return null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{amenity.name}</h1>
          <p className="text-text-muted text-sm mt-1">{amenity.type}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/amenities" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
            <FaArrowLeft /> Back
          </Link>
          <Link to={`/admin/amenities/edit/${amenity._id}`} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaEdit /> Edit
          </Link>
          <button onClick={handleDelete} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300">
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className={`glass-card p-4 mb-6 border ${amenity.isActive ? 'border-success/30' : 'border-red-400/30'}`}>
        <div className="flex items-center gap-3">
          {amenity.isActive ? (
            <FaCheckCircle className="text-success text-xl" />
          ) : (
            <FaTimesCircle className="text-red-400 text-xl" />
          )}
          <div>
            <span className={`text-sm font-medium ${amenity.isActive ? 'text-success' : 'text-red-400'}`}>
              {amenity.isActive ? 'Active' : 'Inactive'}
            </span>
            <p className="text-text-muted text-xs">
              Created {new Date(amenity.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${getAmenityColor(amenity.type)} flex items-center justify-center`}>
              {getAmenityIcon(amenity.type)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{amenity.name}</h2>
              <p className="text-text-muted">{amenity.type}</p>
            </div>
          </div>

          {amenity.description && (
            <div className="mb-4">
              <p className="text-text-muted text-sm">Description</p>
              <p className="text-white text-sm mt-1">{amenity.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-primary-light/20 rounded-xl p-3 text-center">
              <p className="text-text-muted text-xs">Capacity</p>
              <p className="text-white font-bold text-lg">{amenity.capacity}</p>
            </div>
            <div className="bg-primary-light/20 rounded-xl p-3 text-center">
              <p className="text-text-muted text-xs">Price Per Hour</p>
              <p className="text-accent font-bold text-lg">Rs. {amenity.pricePerHour}</p>
            </div>
            <div className="bg-primary-light/20 rounded-xl p-3 text-center">
              <p className="text-text-muted text-xs">Available Slots</p>
              <p className="text-white font-bold text-lg">{amenity.availableSlots}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Details</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2 bg-primary/30 rounded-lg">
              <FaMapMarkerAlt className="text-accent mt-0.5" />
              <div>
                <p className="text-text-muted text-xs">Location</p>
                <p className="text-white">{amenity.location || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-primary/30 rounded-lg">
              <FaClock className="text-accent mt-0.5" />
              <div>
                <p className="text-text-muted text-xs">Timings</p>
                <p className="text-white">
                  {amenity.timings?.start || '08:00'} - {amenity.timings?.end || '22:00'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-primary/30 rounded-lg">
              <FaCalendarAlt className="text-accent mt-0.5" />
              <div>
                <p className="text-text-muted text-xs">Created</p>
                <p className="text-white">{new Date(amenity.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-primary/30 rounded-lg">
              <FaInfoCircle className="text-accent mt-0.5" />
              <div>
                <p className="text-text-muted text-xs">Last Updated</p>
                <p className="text-white">{new Date(amenity.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowAmenity;