import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaArrowLeft, FaUser, FaCar, FaClock, FaMapMarkerAlt,
  FaPhone, FaInfoCircle, FaCalendarAlt, FaShieldAlt,
  FaCheckCircle, FaTimesCircle, FaUserCheck, FaTrash
} from 'react-icons/fa';

const ShowLog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchLog();
  }, [id]);

  const fetchLog = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/security/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLog(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load log');
      navigate('/admin/security');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this log?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/security/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Log deleted successfully!');
      navigate('/admin/security', { state: { message: 'Log deleted successfully!' } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div><p className="text-text-muted mt-2">Loading...</p></div>;
  }

  if (!log) return null;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Verified': return { color: 'bg-success/20 text-success', icon: <FaCheckCircle /> };
      case 'Flagged': return { color: 'bg-red-400/20 text-red-400', icon: <FaTimesCircle /> };
      case 'Resident': return { color: 'bg-accent/20 text-accent', icon: <FaUserCheck /> };
      default: return { color: 'bg-text-muted/20 text-text-muted', icon: null };
    }
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'visitor': return 'bg-blue-400/20 text-blue-400';
      case 'delivery': return 'bg-warning/20 text-warning';
      case 'resident': return 'bg-accent/20 text-accent';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  const statusInfo = getStatusBadge(log.status);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Security Log Details</h1>
          <p className="text-text-muted text-sm mt-1">#{log._id?.slice(-6)} - {log.visitorName}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/security" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
            <FaArrowLeft /> Back to Logs
          </Link>
          <button onClick={handleDelete} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300">
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className={`glass-card p-4 mb-6 border ${log.status === 'Verified' ? 'border-success/30' : log.status === 'Flagged' ? 'border-red-400/30' : 'border-accent/30'}`}>
        <div className="flex items-center gap-3">
          <span className={`text-xl ${statusInfo.color}`}>{statusInfo.icon}</span>
          <div>
            <span className={`text-sm font-medium ${statusInfo.color}`}>{log.status}</span>
            <p className="text-text-muted text-xs">Entry logged on {log.date}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><FaUser className="text-accent" /> Visitor Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaUser className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Name</p><p className="text-white font-medium">{log.visitorName}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaMapMarkerAlt className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Flat</p><p className="text-white font-medium">{log.flatNumber}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaCar className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Vehicle</p><p className="text-white font-medium">{log.vehicleNumber}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaPhone className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Phone</p><p className="text-white font-medium">{log.phone || 'N/A'}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl md:col-span-2">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaInfoCircle className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Purpose</p><p className="text-white font-medium">{log.purpose || 'Not specified'}</p></div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><FaShieldAlt className="text-accent" /> Entry Details</h2>
          <div className="space-y-4">
            <div className="p-3 bg-primary/30 rounded-xl"><p className="text-text-muted text-xs">Log ID</p><p className="text-white font-medium">#{log._id?.slice(-6)}</p></div>
            <div className="p-3 bg-primary/30 rounded-xl"><p className="text-text-muted text-xs">Gate</p><p className="text-white font-medium">{log.gate}</p></div>
            <div className="p-3 bg-primary/30 rounded-xl"><p className="text-text-muted text-xs">Entry Time</p><p className="text-white font-medium">{log.entryTime}</p></div>
            <div className="p-3 bg-primary/30 rounded-xl"><p className="text-text-muted text-xs">Exit Time</p><p className="text-white font-medium">{log.exitTime}</p></div>
            <div className="p-3 bg-primary/30 rounded-xl"><p className="text-text-muted text-xs">Type</p><span className={`text-xs px-2 py-1 rounded-full ${getTypeBadge(log.type)}`}>{log.type}</span></div>
            <div className="p-3 bg-primary/30 rounded-xl"><p className="text-text-muted text-xs">Status</p><span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(log.status).color}`}>{log.status}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowLog;