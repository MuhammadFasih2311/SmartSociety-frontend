import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaUser, FaPhone, FaEnvelope, FaArrowLeft, 
  FaShieldAlt, FaKey, FaMapMarkerAlt, FaClock,
  FaBuilding, FaEdit, FaTrash, FaCheckCircle,
  FaTimesCircle, FaUserFriends
} from 'react-icons/fa';

const ShowGuard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [guard, setGuard] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setGuard(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load guard');
      navigate('/admin/guards');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this guard?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/guards/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Guard deleted successfully!');
      navigate('/admin/guards', { state: { message: 'Guard deleted successfully!' } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div><p className="text-text-muted mt-2">Loading...</p></div>;
  }

  if (!guard) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-success/20 text-success';
      case 'On Leave': return 'bg-warning/20 text-warning';
      case 'Inactive': return 'bg-red-400/20 text-red-400';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  const getShiftBadge = (shift) => {
    switch(shift) {
      case 'Morning': return 'bg-orange-400/20 text-orange-400';
      case 'Evening': return 'bg-purple-400/20 text-purple-400';
      case 'Night': return 'bg-blue-400/20 text-blue-400';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Guard Details</h1>
          <p className="text-text-muted text-sm mt-1">
            {guard.name} - {guard.employeeId}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/guards" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
            <FaArrowLeft /> Back
          </Link>
          <Link to={`/admin/guards/edit/${guard.id}`} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaEdit /> Edit
          </Link>
          <button onClick={handleDelete} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300">
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className={`glass-card p-4 mb-6 border ${guard.status === 'Active' ? 'border-success/30' : guard.status === 'On Leave' ? 'border-warning/30' : 'border-red-400/30'}`}>
        <div className="flex items-center gap-3">
          {guard.status === 'Active' ? <FaCheckCircle className="text-success text-xl" /> : guard.status === 'On Leave' ? <FaClock className="text-warning text-xl" /> : <FaTimesCircle className="text-red-400 text-xl" />}
          <div>
            <span className={`text-sm font-medium ${getStatusColor(guard.status)}`}>{guard.status}</span>
            <p className="text-text-muted text-xs">Joined in {guard.joinDate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><FaUser className="text-accent" /> Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaUser className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Full Name</p><p className="text-white font-medium">{guard.name}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaKey className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Employee ID</p><p className="text-white font-medium">{guard.employeeId}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaPhone className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Phone</p><p className="text-white font-medium">{guard.phone}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaEnvelope className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Email</p><p className="text-white font-medium">{guard.email}</p></div>
            </div>
            {guard.emergency && (
              <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaUserFriends className="text-sm" /></div>
                <div><p className="text-text-muted text-xs">Emergency Contact</p><p className="text-white font-medium">{guard.emergency}</p></div>
              </div>
            )}
            {guard.address && (
              <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaMapMarkerAlt className="text-sm" /></div>
                <div><p className="text-text-muted text-xs">Address</p><p className="text-white font-medium">{guard.address}</p></div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><FaShieldAlt className="text-accent" /> Assignment Details</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaClock className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Shift</p><p className="text-white font-medium"><span className={`px-2 py-0.5 rounded-full text-xs ${getShiftBadge(guard.shift)}`}>{guard.shift}</span></p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaBuilding className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Assigned Gate</p><p className="text-white font-medium">{guard.gate}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaClock className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Join Date</p><p className="text-white font-medium">{guard.joinDate}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowGuard;