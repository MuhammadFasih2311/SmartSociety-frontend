import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, FaBuilding, FaShieldAlt, FaUser,
  FaCheckCircle, FaTimesCircle, FaClock, FaEdit,
  FaSave, FaTimes, FaPlus, FaTrash, FaSync,
  FaMapMarkerAlt, FaInfoCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const GateStatus = () => {
  const [gates, setGates] = useState([]);
  const [allGuards, setAllGuards] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    maintenance: 0
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGate, setNewGate] = useState({
    name: '',
    status: 'Active',
    guardId: '',
    guardName: '',
    shift: 'N/A',
    location: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchGates();
    fetchAllGuards();
  }, []);

  const fetchGates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await axios.get(`${API_URL}/guard/gates`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setGates(response.data.data);
        setStats(response.data.stats);
      } else {
        toast.error(response.data.message || 'Failed to load gates');
      }
    } catch (error) {
      console.error('Fetch gates error:', error);
      toast.error(error.response?.data?.message || 'Failed to load gates');
    } finally {
      setLoading(false);
    }
  };
const fetchAllGuards = async () => {
  try {
    console.log('🔄 Fetching all guards...');
    const token = localStorage.getItem('token');
    console.log('🔑 Token available:', !!token);
    
    const response = await axios.get(`${API_URL}/guard/all-guards`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📥 Response:', response.data);

    if (response.data.success) {
      console.log(`✅ Found ${response.data.data.length} guards`);
      setAllGuards(response.data.data);
    } else {
      console.log('⚠️ No guards found:', response.data.message);
      setAllGuards([]);
    }
  } catch (error) {
    console.error('❌ Fetch guards error:', error);
    console.log('Error details:', error.response?.data);
    toast.error('Failed to load guards list');
    setAllGuards([]);
  }
};

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_URL}/guard/gates/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Gate status updated to ${newStatus}`);
        fetchGates();
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Status change error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleEdit = (gate) => {
    setEditingId(gate.id);
    setEditData({
      ...gate,
      guardId: gate.guardId || ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');

      let guardName = editData.guard || 'N/A';
      if (editData.guardId) {
        const selectedGuard = allGuards.find(g => g._id === editData.guardId);
        if (selectedGuard) {
          guardName = selectedGuard.fullName || 'N/A';
        }
      }

      const submitData = {
        ...editData,
        guardName: guardName
      };

      const response = await axios.put(
        `${API_URL}/guard/gates/${editingId}`,
        submitData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Gate details updated successfully!');
        setEditingId(null);
        setEditData({});
        fetchGates();
      } else {
        toast.error(response.data.message || 'Failed to update gate');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update gate');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_URL}/guard/gates/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Gate deleted successfully!');
        fetchGates();
      } else {
        toast.error(response.data.message || 'Failed to delete gate');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete gate');
    }
  };

 const handleAddGate = async () => {
  if (!newGate.name.trim()) {
    toast.error('Gate name is required');
    return;
  }

  setIsSubmitting(true);
  try {
    const token = localStorage.getItem('token');

    let guardName = 'N/A';
    if (newGate.guardId) {
      const selectedGuard = allGuards.find(g => g._id === newGate.guardId);
      if (selectedGuard) {
        guardName = selectedGuard.fullName || 'N/A';
      }
    }

    const submitData = {
      ...newGate,
      guardName: guardName
    };

    const response = await axios.post(
      `${API_URL}/guard/gates`,  
      submitData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      toast.success('Gate created successfully!');
      setShowAddModal(false);
      setNewGate({
        name: '',
        status: 'Active',
        guardId: '',
        guardName: '',
        shift: 'N/A',
        location: '',
        description: ''
      });
      fetchGates();
      fetchAllGuards(); 
    } else {
      toast.error(response.data.message || 'Failed to create gate');
    }
  } catch (error) {
    console.error('Create gate error:', error);
    if (error.response?.status === 403) {
      toast.error('You do not have permission to create gates');
    } else {
      toast.error(error.response?.data?.message || 'Failed to create gate');
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return 'bg-success/20 text-success';
      case 'Inactive':
        return 'bg-red-400/20 text-red-400';
      case 'Maintenance':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-text-muted/20 text-text-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active':
        return <FaCheckCircle className="text-success" />;
      case 'Inactive':
        return <FaTimesCircle className="text-red-400" />;
      case 'Maintenance':
        return <FaClock className="text-warning" />;
      default:
        return null;
    }
  };

  const statusOptions = ['Active', 'Inactive', 'Maintenance'];
  const shiftOptions = ['Morning', 'Evening', 'Night', 'N/A'];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
        <p className="text-text-muted mt-2">Loading gates...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Gate Status</h1>
          <p className="text-text-muted text-sm mt-1">Monitor and manage all gate operations.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
          >
            <FaPlus /> Add Gate
          </button>
          <Link to="/guard/dashboard" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
            <FaArrowLeft />
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs">Total Gates</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-4 border-success/20">
          <p className="text-text-muted text-xs">Active</p>
          <p className="text-2xl font-bold text-success">{stats.active}</p>
        </div>
        <div className="glass-card p-4 border-red-400/20">
          <p className="text-text-muted text-xs">Inactive</p>
          <p className="text-2xl font-bold text-red-400">{stats.inactive}</p>
        </div>
        <div className="glass-card p-4 border-warning/20">
          <p className="text-text-muted text-xs">Maintenance</p>
          <p className="text-2xl font-bold text-warning">{stats.maintenance || 0}</p>
        </div>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        {gates.length === 0 ? (
          <div className="text-center py-12">
            <FaBuilding className="text-5xl text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">No gates found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
            >
              <FaPlus /> Add First Gate
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Gate</th>
                <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">Guard</th>
                <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Shift</th>
                <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Last Updated</th>
                <th className="text-right text-text-muted text-xs font-medium uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gates.map((gate) => (
                <tr key={gate.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  {editingId === gate.id ? (
                    <>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-2 py-1 bg-primary-light/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className={`px-2 py-1 rounded-lg border-none focus:ring-0 focus:outline-none cursor-pointer ${getStatusBadge(editData.status)}`}
                          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                        >
                          {statusOptions.map(s => (
                            <option key={s} value={s} style={{ backgroundColor: '#1a1a2e' }}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <select
                          value={editData.guardId || ''}
                          onChange={(e) => {
                            const guardId = e.target.value;
                            const selectedGuard = allGuards.find(g => g._id === guardId);
                            setEditData({ 
                              ...editData, 
                              guardId: guardId,
                              guard: selectedGuard ? selectedGuard.fullName : 'N/A'
                            });
                          }}
                          className="w-full px-2 py-1 bg-primary-light/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                        >
                          <option value="">No Guard Assigned</option>
                          {allGuards.map(guard => (
                            <option key={guard._id} value={guard._id}>
                              {guard.fullName} ({guard.email})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <select
                          value={editData.shift}
                          onChange={(e) => setEditData({ ...editData, shift: e.target.value })}
                          className="w-full px-2 py-1 bg-primary-light/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                        >
                          {shiftOptions.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-text-muted text-sm">{gate.lastUpdated}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={handleSaveEdit} className="p-1.5 hover:bg-white/10 rounded-lg text-success hover:text-success transition-colors" title="Save">
                            <FaSave className="text-sm" />
                          </button>
                          <button onClick={handleCancelEdit} className="p-1.5 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-400 transition-colors" title="Cancel">
                            <FaTimes className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FaBuilding className="text-accent" />
                          <span className="text-white text-sm font-medium">{gate.name}</span>
                          {gate.location && (
                            <span className="text-text-muted text-xs flex items-center gap-1">
                              <FaMapMarkerAlt className="text-[10px]" />
                              {gate.location}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(gate.status)}
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(gate.status)}`}>
                            {gate.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-text-muted text-sm flex items-center gap-1">
                          <FaUser className="text-accent text-xs" />
                          {gate.guard}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-text-muted text-sm">{gate.shift}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-text-muted text-sm flex items-center gap-1">
                          <FaClock className="text-accent text-xs" />
                          {gate.lastUpdated}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleStatusChange(gate.id, gate.status === 'Active' ? 'Inactive' : 'Active')}
                            className={`p-1.5 hover:bg-white/10 rounded-lg transition-colors ${gate.status === 'Active' ? 'text-warning hover:text-warning' : 'text-success hover:text-success'}`}
                            title={gate.status === 'Active' ? 'Deactivate' : 'Activate'}
                          >
                            <FaShieldAlt className="text-sm" />
                          </button>
                          <button onClick={() => handleEdit(gate)} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="Edit">
                            <FaEdit className="text-sm" />
                          </button>
                          <button onClick={() => handleDelete(gate.id, gate.name)} className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-red-400 transition-colors" title="Delete">
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add New Gate</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-text-muted text-sm mb-2">Gate Name *</label>
                  <input
                    type="text"
                    value={newGate.name}
                    onChange={(e) => setNewGate({ ...newGate, name: e.target.value })}
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                    placeholder="e.g., Main Gate"
                  />
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-2">Status</label>
                  <select
                    value={newGate.status}
                    onChange={(e) => setNewGate({ ...newGate, status: e.target.value })}
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-2">Assign Guard</label>
                  <select
                    value={newGate.guardId || ''}
                    onChange={(e) => {
                      const guardId = e.target.value;
                      const selectedGuard = allGuards.find(g => g._id === guardId);
                      setNewGate({ 
                        ...newGate, 
                        guardId: guardId,
                        guardName: selectedGuard ? selectedGuard.fullName : 'N/A'
                      });
                    }}
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="">No Guard Assigned</option>
                    {allGuards.map(guard => (
                      <option key={guard._id} value={guard._id}>
                        {guard.fullName} ({guard.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-2">Shift</label>
                  <select
                    value={newGate.shift}
                    onChange={(e) => setNewGate({ ...newGate, shift: e.target.value })}
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                  >
                    {shiftOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-2">Location</label>
                  <input
                    type="text"
                    value={newGate.location}
                    onChange={(e) => setNewGate({ ...newGate, location: e.target.value })}
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
                    placeholder="e.g., Near Block A"
                  />
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-2">Description</label>
                  <textarea
                    value={newGate.description}
                    onChange={(e) => setNewGate({ ...newGate, description: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors resize-none"
                    placeholder="Additional details..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddGate}
                    disabled={isSubmitting}
                    className={`flex-1 btn-primary py-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Gate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GateStatus;