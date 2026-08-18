import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaUser, FaHome, FaPhone, FaEnvelope, 
  FaSave, FaTimes, FaArrowLeft, FaCar,
  FaUserFriends, FaIdCard, FaCalendarAlt,
  FaBuilding, FaEye, FaEyeSlash
} from 'react-icons/fa';

const EditResident = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchResident();
  }, [id]);

  const fetchResident = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/residents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.data;
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        cnic: data.cnic || '',
        gender: data.gender || 'Male',
        dateOfBirth: data.dateOfBirth || '',
        occupation: data.occupation || '',
        flatNumber: data.flatNumber || '',
        blockName: data.blockName || 'A',
        floor: data.floor || '1',
        occupancyType: data.occupancyType || 'Owner',
        moveInDate: data.moveInDate || '',
        familyMembers: data.familyMembers || '',
        emergencyContact: data.emergencyContact || '',
        emergencyPhone: data.emergencyPhone || '',
        vehicleNumber: data.vehicleNumber || '',
        vehicleType: data.vehicleType || 'Car',
        parkingSlot: data.parkingSlot || '',
        status: data.status || 'Active',
        notes: data.notes || '',
        password: '' 
      });
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to load resident');
      navigate('/admin/residents');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverErrors[name]) setServerErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (formData.firstName && !/^[A-Za-z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters';
    }
    if (formData.firstName && formData.firstName.length > 30) {
      newErrors.firstName = 'First name cannot exceed 30 characters';
    }
    
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (formData.lastName && !/^[A-Za-z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters';
    }
    if (formData.lastName && formData.lastName.length > 30) {
      newErrors.lastName = 'Last name cannot exceed 30 characters';
    }
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (formData.phone && !/^[0-9+\-\s]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number can only contain numbers, +, -, and spaces';
    }
    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 characters';
    }
    if (formData.phone && formData.phone.length > 15) {
      newErrors.phone = 'Phone number cannot exceed 15 characters';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password && formData.password.length > 20) {
      newErrors.password = 'Password cannot exceed 20 characters';
    }
    
    if (formData.cnic && !/^[0-9-]+$/.test(formData.cnic)) {
      newErrors.cnic = 'CNIC can only contain numbers and dashes';
    }
    
    if (!formData.flatNumber) newErrors.flatNumber = 'Flat number is required';
    if (formData.flatNumber && !/^[0-9]+$/.test(formData.flatNumber)) {
      newErrors.flatNumber = 'Flat number can only contain numbers';
    }
    
    if (!formData.blockName) newErrors.blockName = 'Block is required';
    
    if (formData.dateOfBirth && formData.dateOfBirth > today) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }
    
    if (formData.moveInDate && formData.moveInDate < today) {
      newErrors.moveInDate = 'Move-in date cannot be in the past';
    }
    
    if (formData.emergencyContact && !/^[A-Za-z\s]+$/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = 'Emergency contact name can only contain letters';
    }
    if (formData.emergencyContact && formData.emergencyContact.length > 50) {
      newErrors.emergencyContact = 'Emergency contact name cannot exceed 50 characters';
    }
    
    if (formData.emergencyPhone && !/^[0-9+\-\s]+$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = 'Emergency phone can only contain numbers, +, -, and spaces';
    }
    if (formData.emergencyPhone && formData.emergencyPhone.length < 10) {
      newErrors.emergencyPhone = 'Emergency phone must be at least 10 characters';
    }
    if (formData.emergencyPhone && formData.emergencyPhone.length > 15) {
      newErrors.emergencyPhone = 'Emergency phone cannot exceed 15 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErrors({});
    
    if (!validate()) {
      const firstError = document.querySelector('.error-text');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email, 
        phone: formData.phone,
        cnic: formData.cnic,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        occupation: formData.occupation,
        flatNumber: formData.flatNumber,
        blockName: formData.blockName,
        floor: formData.floor,
        occupancyType: formData.occupancyType.toLowerCase(),
        moveInDate: formData.moveInDate,
        familyMembers: formData.familyMembers,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        vehicleNumber: formData.vehicleNumber,
        vehicleType: formData.vehicleType,
        parkingSlot: formData.parkingSlot,
        status: formData.status,
        notes: formData.notes
      };

      if (formData.password && formData.password.length >= 6) {
        submitData.password = formData.password;
      }

      const response = await axios.put(`${API_URL}/admin/residents/${id}`, submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Resident updated successfully!');
        navigate('/admin/residents', { state: { message: 'Resident updated successfully!' } });
      }
    } catch (error) {
      console.error('Update error:', error);
      if (error.response?.data?.errors) {
        setServerErrors(error.response.data.errors);
        toast.error('Please fix the validation errors');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update resident');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div><p className="text-text-muted mt-2">Loading...</p></div>;
  }

  if (!formData) return null;

  const blocks = ['A', 'B', 'C', 'D', 'E'];
  const floors = ['Ground', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const genders = ['Male', 'Female', 'Other'];
  const occupancyTypes = ['Owner', 'Tenant', 'Rental'];
  const vehicleTypes = ['Car', 'Bike', 'Scooter', 'None'];
  const statuses = ['Active', 'Pending', 'Inactive'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Resident</h1>
          <p className="text-text-muted text-sm mt-1">Update resident information - Flat {formData.flatNumber}</p>
        </div>
        <Link to="/admin/residents" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"><FaArrowLeft /> Back to List</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><FaUser className="text-accent" /> Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">First Name *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} maxLength="30" className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.firstName ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {errors.firstName && <p className="error-text text-red-400 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Last Name *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} maxLength="30" className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.lastName ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {errors.lastName && <p className="error-text text-red-400 text-xs mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} maxLength="50" className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.email || serverErrors.email ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {(errors.email || serverErrors.email) && <p className="error-text text-red-400 text-xs mt-1">{errors.email || serverErrors.email}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Phone *</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} maxLength="15" className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.phone ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {errors.phone && <p className="error-text text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Password (Leave blank to keep current)</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  maxLength="20"
                  className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.password ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors pr-10`} 
                  placeholder="Enter new password (optional)" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="error-text text-red-400 text-xs mt-1">{errors.password}</p>}
              <p className="text-text-muted/50 text-xs mt-1">Min 6 characters. Leave empty to keep current password.</p>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">CNIC</label>
              <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} maxLength="20" className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.cnic ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {errors.cnic && <p className="error-text text-red-400 text-xs mt-1">{errors.cnic}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Date of Birth</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="dateOfBirth" 
                  value={formData.dateOfBirth} 
                  onChange={handleChange} 
                  max={today}
                  className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.dateOfBirth ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors [color-scheme:dark]`} 
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 pointer-events-none" />
              </div>
              {errors.dateOfBirth && <p className="error-text text-red-400 text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Occupation</label>
              <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} maxLength="50" className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><FaHome className="text-accent" /> Flat Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">Block *</label>
              <select name="blockName" value={formData.blockName} onChange={handleChange} className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.blockName ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`}>
                {blocks.map(b => <option key={b} value={b}>Block {b}</option>)}
              </select>
              {errors.blockName && <p className="error-text text-red-400 text-xs mt-1">{errors.blockName}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Flat Number *</label>
              <input type="text" name="flatNumber" value={formData.flatNumber} onChange={handleChange} maxLength="10" className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.flatNumber || serverErrors.flatNumber ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {(errors.flatNumber || serverErrors.flatNumber) && <p className="error-text text-red-400 text-xs mt-1">{errors.flatNumber || serverErrors.flatNumber}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Floor</label>
              <select name="floor" value={formData.floor} onChange={handleChange} className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                {floors.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Occupancy Type</label>
              <select name="occupancyType" value={formData.occupancyType} onChange={handleChange} className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                {occupancyTypes.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Move-in Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="moveInDate" 
                  value={formData.moveInDate} 
                  onChange={handleChange} 
                  min={today}
                  className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.moveInDate ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors [color-scheme:dark]`} 
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 pointer-events-none" />
              </div>
              {errors.moveInDate && <p className="error-text text-red-400 text-xs mt-1">{errors.moveInDate}</p>}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><FaUserFriends className="text-accent" /> Family & Emergency</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">Family Members</label>
              <input type="number" name="familyMembers" value={formData.familyMembers} onChange={handleChange} min="1" max="20" className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Emergency Contact</label>
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} maxLength="50" className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.emergencyContact ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {errors.emergencyContact && <p className="error-text text-red-400 text-xs mt-1">{errors.emergencyContact}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Emergency Phone</label>
              <input type="text" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} maxLength="15" className={`w-full px-4 py-2 bg-primary-light/50 border ${errors.emergencyPhone ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-accent transition-colors`} />
              {errors.emergencyPhone && <p className="error-text text-red-400 text-xs mt-1">{errors.emergencyPhone}</p>}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><FaCar className="text-accent" /> Vehicle Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">Vehicle Number</label>
              <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} maxLength="15" className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Vehicle Type</label>
              <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                {vehicleTypes.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Parking Slot</label>
              <input type="text" name="parkingSlot" value={formData.parkingSlot} onChange={handleChange} maxLength="10" className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><FaIdCard className="text-accent" /> Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-muted text-sm mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-muted text-sm mb-2">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" maxLength="500" className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors resize-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link to="/admin/residents" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300"><FaTimes /> Cancel</Link>
          <button type="submit" disabled={isSubmitting} className={`btn-primary flex items-center justify-center gap-2 px-6 py-3 min-w-[140px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isSubmitting ? (<><svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Updating...</>) : (<><FaSave /> Update Resident</>)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditResident;