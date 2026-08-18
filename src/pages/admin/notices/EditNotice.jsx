import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaSave, FaTimes, FaArrowLeft, FaBell, FaTag,
  FaUser, FaCalendar
} from 'react-icons/fa';

const EditNotice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
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
      const data = response.data.data;
      setFormData({
        title: data.title || '',
        content: data.content || '',
        category: data.category || 'General',
        priority: data.priority || 'Medium',
        status: data.status || 'Draft',
        author: data.author || 'Admin',
        date: data.date || new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load notice');
      navigate('/admin/notices');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.content) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/notices/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Notice updated successfully!');
      navigate('/admin/notices', { state: { message: 'Notice updated successfully!' } });
    } catch (error) {
      console.error('Update notice error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error('Please fix the validation errors');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update notice');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div><p className="text-text-muted mt-2">Loading...</p></div>;
  }

  if (!formData) return null;

  const categories = ['Billing', 'Security', 'Event', 'Facility', 'Utility', 'General'];
  const priorities = ['Urgent', 'High', 'Medium', 'Low'];
  const statuses = ['Published', 'Draft', 'Archived'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Notice</h1>
          <p className="text-text-muted text-sm mt-1">Update notice details.</p>
        </div>
        <Link to="/admin/notices" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <FaArrowLeft /> Back to Notices
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaBell className="text-accent" /> Notice Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-text-muted text-sm mb-2">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange}
                className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.title ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {errors.title && <p className="error-text text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-text-muted text-sm mb-2">Content *</label>
              <textarea name="content" value={formData.content} onChange={handleChange}
                rows="6" className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.content ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors resize-none`} />
              {errors.content && <p className="error-text text-red-400 text-xs mt-1">{errors.content}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Date</label>
              <div className="relative">
                <input type="date" name="date" value={formData.date} onChange={handleChange}
                  className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
                <FaCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Author</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link to="/admin/notices" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300">
            <FaTimes /> Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className={`btn-primary flex items-center justify-center gap-2 px-6 py-3 min-w-[140px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isSubmitting ? (<><svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Updating...</>) : (<><FaSave /> Update Notice</>)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNotice;