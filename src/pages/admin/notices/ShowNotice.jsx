import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaArrowLeft, FaBell, FaTag, FaUser, FaCalendar,
  FaEdit, FaTrash, FaEye, FaClock, FaCheckCircle,
  FaExclamationTriangle, FaPrint
} from 'react-icons/fa';

const ShowNotice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotice(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load notice');
      navigate('/admin/notices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this notice?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Notice deleted successfully!');
      navigate('/admin/notices', { state: { message: 'Notice deleted successfully!' } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div><p className="text-text-muted mt-2">Loading...</p></div>;
  }

  if (!notice) return null;

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Urgent': return 'bg-red-400/20 text-red-400';
      case 'High': return 'bg-warning/20 text-warning';
      case 'Medium': return 'bg-blue-400/20 text-blue-400';
      case 'Low': return 'bg-green-400/20 text-green-400';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return 'bg-success/20 text-success';
      case 'Draft': return 'bg-warning/20 text-warning';
      case 'Archived': return 'bg-red-400/20 text-red-400';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Published': return <FaCheckCircle className="text-success" />;
      case 'Draft': return <FaClock className="text-warning" />;
      case 'Archived': return <FaExclamationTriangle className="text-red-400" />;
      default: return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Notice Details</h1>
          <p className="text-text-muted text-sm mt-1">{notice.title}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/notices" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
            <FaArrowLeft /> Back
          </Link>
          <Link to={`/admin/notices/edit/${notice._id}`} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaEdit /> Edit
          </Link>
          <button onClick={handleDelete} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300">
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className={`glass-card p-4 mb-6 border ${notice.status === 'Published' ? 'border-success/30' : notice.status === 'Draft' ? 'border-warning/30' : 'border-red-400/30'}`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{getStatusIcon(notice.status)}</span>
          <div>
            <span className={`text-sm font-medium ${getStatusColor(notice.status)}`}>{notice.status}</span>
            <p className="text-text-muted text-xs">Created on {notice.createdAt || notice.date}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <FaBell className="text-accent" /> Notice Content
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-text-muted text-xs">Title</p>
              <h3 className="text-2xl font-bold text-white">{notice.title}</h3>
            </div>
            <div>
              <p className="text-text-muted text-xs">Content</p>
              <p className="text-white text-base leading-relaxed mt-1 whitespace-pre-wrap">{notice.content}</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-4">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-all duration-300">
              <FaPrint /> Print
            </button>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <FaTag className="text-accent" /> Details
          </h2>
          <div className="space-y-4">
            <div className="p-3 bg-primary/30 rounded-xl">
              <p className="text-text-muted text-xs flex items-center gap-1"><FaTag className="text-accent text-xs" /> Category</p>
              <p className="text-white font-medium">{notice.category}</p>
            </div>
            <div className="p-3 bg-primary/30 rounded-xl">
              <p className="text-text-muted text-xs flex items-center gap-1"><FaClock className="text-accent text-xs" /> Priority</p>
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notice.priority)}`}>{notice.priority}</span>
            </div>
            <div className="p-3 bg-primary/30 rounded-xl">
              <p className="text-text-muted text-xs flex items-center gap-1"><FaCalendar className="text-accent text-xs" /> Date</p>
              <p className="text-white font-medium">{notice.date}</p>
            </div>
            <div className="p-3 bg-primary/30 rounded-xl">
              <p className="text-text-muted text-xs flex items-center gap-1"><FaUser className="text-accent text-xs" /> Author</p>
              <p className="text-white font-medium">{notice.author}</p>
            </div>
            <div className="p-3 bg-primary/30 rounded-xl">
              <p className="text-text-muted text-xs flex items-center gap-1"><FaEye className="text-accent text-xs" /> Status</p>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(notice.status)}`}>{notice.status}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .glass-card { background: #0f0e17 !important; border: 1px solid rgba(255,255,255,0.1) !important; }
          .btn-secondary, .btn-primary, button { display: none !important; }
          body { background: #0f0e17 !important; }
        }
      `}</style>
    </div>
  );
};

export default ShowNotice;