import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaUser, FaPhone, FaHome, FaArrowLeft, 
  FaClock, FaIdCard, FaEdit, FaTrash,
  FaCheckCircle, FaTimesCircle, FaCar,
  FaFileAlt, FaCalendarAlt
} from 'react-icons/fa';

const ShowVisitor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    if (id) {
      fetchVisitor();
    } else {
      toast.error('Invalid visitor ID');
      navigate('/guard/visitors');
    }
  }, [id]);

  const fetchVisitor = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/guard/visitors/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      if (response.data.success) {
        setVisitor(response.data.data);
      } else {
        toast.error('Failed to load visitor data');
        navigate('/guard/visitors');
      }
    } catch (error) {
      console.error('Fetch visitor error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 404) {
        toast.error('Visitor not found');
        navigate('/guard/visitors');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load visitor');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this visitor?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/guard/visitors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Visitor deleted successfully!');
      navigate('/guard/visitors');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div><p className="text-text-muted mt-2">Loading...</p></div>;
  }

  if (!visitor) return null;

  const getStatusBadge = (status) => {
  switch(status) {
    case 'Verified':
    case 'approved':
      return { color: 'bg-success/20 text-success', icon: <FaCheckCircle />, label: status };
    case 'Flagged':
    case 'rejected':
      return { color: 'bg-red-400/20 text-red-400', icon: <FaTimesCircle />, label: status };
    case 'Resident':
      return { color: 'bg-accent/20 text-accent', icon: <FaCheckCircle />, label: 'Resident' };
    case 'pending':
      return { color: 'bg-warning/20 text-warning', icon: <FaClock />, label: 'Pending' };
    default:
      return { color: 'bg-text-muted/20 text-text-muted', icon: null, label: status || 'Unknown' };
  }
};
  const statusInfo = getStatusBadge(visitor.status);
  const displayName = visitor.name || visitor.visitorName || 'Unknown';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Visitor Details</h1>
          <p className="text-text-muted text-sm mt-1">Visitor: {displayName}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/guard/visitors" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
            <FaArrowLeft /> Back
          </Link>
          <Link to={`/guard/visitor/edit/${visitor._id || visitor.id}`} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaEdit /> Edit
          </Link>
          <button onClick={handleDelete} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300">
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className={`glass-card p-4 mb-6 border ${
        visitor.status === 'approved' || visitor.status === 'Verified' ? 'border-success/30' : 
        visitor.status === 'pending' ? 'border-warning/30' : 
        'border-red-400/30'
      }`}>
        <div className="flex items-center gap-3">
          <span className={`text-xl ${statusInfo.color}`}>
            {statusInfo.icon}
          </span>
          <div>
            <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
            <p className="text-text-muted text-xs">Entry logged on {new Date(visitor.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <FaUser className="text-accent" /> Visitor Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaUser className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Full Name</p><p className="text-white font-medium">{displayName}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaPhone className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Phone</p><p className="text-white font-medium">{visitor.phone}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaIdCard className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">ID Type</p><p className="text-white font-medium">{visitor.idType || 'N/A'}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaIdCard className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">ID Number</p><p className="text-white font-medium">{visitor.idNumber || 'N/A'}</p></div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <FaHome className="text-accent" /> Visit Details
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaHome className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Flat Number</p><p className="text-white font-medium">{visitor.flatNumber}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaFileAlt className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Purpose</p><p className="text-white font-medium">{visitor.purpose}</p></div>
            </div>
            {visitor.vehicleNumber && (
              <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaCar className="text-sm" /></div>
                <div><p className="text-text-muted text-xs">Vehicle Number</p><p className="text-white font-medium">{visitor.vehicleNumber}</p></div>
              </div>
            )}
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaClock className="text-sm" /></div>
              <div><p className="text-text-muted text-xs">Entry Time</p><p className="text-white font-medium">{visitor.entryTime || 'N/A'}</p></div>
            </div>
            {visitor.exitTime && visitor.exitTime !== 'N/A' && (
              <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaClock className="text-sm" /></div>
                <div><p className="text-text-muted text-xs">Exit Time</p><p className="text-white font-medium">{visitor.exitTime}</p></div>
              </div>
            )}
          </div>
        </div>

        {visitor.notes && (
          <div className="glass-card p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
              <FaFileAlt className="text-accent" /> Notes
            </h2>
            <div className="p-4 bg-primary/30 rounded-xl">
              <p className="text-text-muted">{visitor.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowVisitor;