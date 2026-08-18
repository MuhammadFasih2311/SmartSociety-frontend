import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaUser, FaHome, FaPhone, FaEnvelope, 
  FaArrowLeft, FaCar, FaUserFriends, 
  FaIdCard, FaBuilding, FaEdit, FaTrash,
  FaCheckCircle, FaTimesCircle, FaClock,
  FaMapMarkerAlt, FaCalendarAlt, FaFileInvoice
} from 'react-icons/fa';

const ShowResident = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchResident();
  }, [id]);

  const fetchResident = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/residents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResident(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load resident');
      navigate('/admin/residents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resident?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/residents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Resident deleted successfully!');
      navigate('/admin/residents', { state: { message: 'Resident deleted successfully!' } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div><p className="text-text-muted mt-2">Loading...</p></div>;
  }

  if (!resident) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-success/20 text-success';
      case 'Pending': return 'bg-warning/20 text-warning';
      case 'Inactive': return 'bg-red-400/20 text-red-400';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  const renderFamilyMembers = (members) => {
    if (!members || members.length === 0) {
      return 'N/A';
    }
    if (typeof members === 'string') {
      return members;
    }
    if (Array.isArray(members)) {
      return members.map(m => m.name || m).join(', ');
    }
    return 'N/A';
  };

  const renderEmergencyContact = (contact) => {
    if (!contact) return 'N/A';
    if (typeof contact === 'string') return contact;
    if (typeof contact === 'object') {
      return contact.name || contact.phone || 'N/A';
    }
    return 'N/A';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Resident Details</h1>
          <p className="text-text-muted text-sm mt-1">Flat {resident.flatNumber} - Block {resident.blockName}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/residents" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"><FaArrowLeft /> Back</Link>
          <Link to={`/admin/residents/edit/${resident.id}`} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"><FaEdit /> Edit</Link>
          <button onClick={handleDelete} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300"><FaTrash /> Delete</button>
        </div>
      </div>

      <div className={`glass-card p-4 mb-6 border ${resident.status === 'Active' ? 'border-success/30' : resident.status === 'Pending' ? 'border-warning/30' : 'border-red-400/30'}`}>
        <div className="flex items-center gap-3">
          {resident.status === 'Active' ? <FaCheckCircle className="text-success text-xl" /> : resident.status === 'Pending' ? <FaClock className="text-warning text-xl" /> : <FaTimesCircle className="text-red-400 text-xl" />}
          <div>
            <span className={`text-sm font-medium ${getStatusColor(resident.status)}`}>{resident.status}</span>
            <p className="text-text-muted text-xs">Joined in {resident.joinDate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><FaUser className="text-accent" /> Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaUser className="text-sm" /></div><div><p className="text-text-muted text-xs">Full Name</p><p className="text-white font-medium">{resident.firstName} {resident.lastName}</p></div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaIdCard className="text-sm" /></div><div><p className="text-text-muted text-xs">CNIC</p><p className="text-white font-medium">{resident.cnic || 'N/A'}</p></div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaPhone className="text-sm" /></div><div><p className="text-text-muted text-xs">Phone</p><p className="text-white font-medium">{resident.phone}</p></div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaEnvelope className="text-sm" /></div><div><p className="text-text-muted text-xs">Email</p><p className="text-white font-medium">{resident.email}</p></div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaCalendarAlt className="text-sm" /></div><div><p className="text-text-muted text-xs">Date of Birth</p><p className="text-white font-medium">{resident.dateOfBirth || 'N/A'}</p></div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaBuilding className="text-sm" /></div><div><p className="text-text-muted text-xs">Gender</p><p className="text-white font-medium">{resident.gender}</p></div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl md:col-span-2"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaUserFriends className="text-sm" /></div><div><p className="text-text-muted text-xs">Occupation</p><p className="text-white font-medium">{resident.occupation || 'N/A'}</p></div></div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><FaHome className="text-accent" /> Flat Details</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaBuilding className="text-sm" /></div><div><p className="text-text-muted text-xs">Block</p><p className="text-white font-medium">{resident.blockName}</p></div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaHome className="text-sm" /></div><div><p className="text-text-muted text-xs">Flat Number</p><p className="text-white font-medium">{resident.flatNumber}</p></div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaMapMarkerAlt className="text-sm" /></div><div><p className="text-text-muted text-xs">Floor</p><p className="text-white font-medium">{resident.floor || 'N/A'}</p></div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaFileInvoice className="text-sm" /></div><div><p className="text-text-muted text-xs">Occupancy Type</p><p className="text-white font-medium">{resident.occupancyType}</p></div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaCalendarAlt className="text-sm" /></div><div><p className="text-text-muted text-xs">Move-in Date</p><p className="text-white font-medium">{resident.moveInDate || 'N/A'}</p></div></div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><FaUserFriends className="text-accent" /> Family & Emergency</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaUserFriends className="text-sm" /></div><div><p className="text-text-muted text-xs">Family Members</p>
              <p className="text-white font-medium">{renderFamilyMembers(resident.familyMembers)}</p>
            </div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaUser className="text-sm" /></div><div><p className="text-text-muted text-xs">Emergency Contact</p>
              <p className="text-white font-medium">{renderEmergencyContact(resident.emergencyContact)}</p>
            </div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaPhone className="text-sm" /></div><div><p className="text-text-muted text-xs">Emergency Phone</p>
              <p className="text-white font-medium">{resident.emergencyPhone || 'N/A'}</p>
            </div></div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><FaCar className="text-accent" /> Vehicle Details</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaCar className="text-sm" /></div><div><p className="text-text-muted text-xs">Vehicle Number</p><p className="text-white font-medium">{resident.vehicleNumber || 'N/A'}</p></div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaBuilding className="text-sm" /></div><div><p className="text-text-muted text-xs">Vehicle Type</p><p className="text-white font-medium">{resident.vehicleType}</p></div></div>
            <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl"><div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent"><FaMapMarkerAlt className="text-sm" /></div><div><p className="text-text-muted text-xs">Parking Slot</p><p className="text-white font-medium">{resident.parkingSlot || 'N/A'}</p></div></div>
          </div>
        </div>

        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><FaFileInvoice className="text-accent" /> Notes</h2>
          <div className="p-4 bg-primary/30 rounded-xl"><p className="text-text-muted">{resident.notes || 'No notes available.'}</p></div>
        </div>
      </div>
    </div>
  );
};

export default ShowResident;