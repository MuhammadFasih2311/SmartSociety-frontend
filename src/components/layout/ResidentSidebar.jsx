import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import {
  FaUser, FaKey, FaClipboardList, FaBell,
  FaCalendarCheck, FaBuilding, FaChartLine, FaCog, FaSignOutAlt, FaFileInvoice
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ResidentSidebar = ({ isSidebarOpen = true }) => {
  const { logout, user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/resident/dashboard', icon: <FaChartLine />, label: 'Dashboard' },
    { path: '/resident/profile', icon: <FaUser />, label: 'My Profile' },
    { path: '/resident/visitor-pass', icon: <FaKey />, label: 'Visitor Pass' },
    { path: '/resident/amenities', icon: <FaBuilding />, label: 'Amenities' },
    { path: '/resident/bills', icon: <FaFileInvoice />, label: 'Maintenance Bills' },
    { path: '/resident/complaints', icon: <FaBell />, label: 'Complaints' },
    { path: '/resident/booking', icon: <FaCalendarCheck />, label: 'Amenity Booking' },
    { path: '/resident/notices', icon: <FaBuilding />, label: 'Notices' },
    { path: '/resident/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/', { replace: true });
  };

  const societyName = settings?.societyName || 'SmartSociety';

  return (
    <div className="space-y-3">
      <div className={`text-center py-3 border-b border-white/5 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-accent to-accent-light mx-auto flex items-center justify-center text-xl">
          <FaUser className="text-primary" />
        </div>
        <h3 className="text-white font-bold text-sm mt-2 truncate">{user?.fullName || 'Resident'}</h3>
        <p className="text-text-muted text-[10px]">{user?.flatNumber || 'Flat A-101'}</p>
        <p className="text-text-muted text-[10px] truncate">{societyName}</p>
      </div>

      <div className={`text-center py-2 border-b border-white/5 transition-all duration-300 ${isSidebarOpen ? 'hidden' : 'block'}`}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-accent-light mx-auto flex items-center justify-center text-lg">
          <FaUser className="text-primary" />
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300
              ${isActive 
                ? 'bg-gradient-to-r from-accent/20 to-accent-light/10 text-accent' 
                : 'text-text-muted hover:text-white hover:bg-white/5'
              }
              group
              ${!isSidebarOpen ? 'justify-center' : ''}
            `}
            title={!isSidebarOpen ? item.label : ''}
          >
            <span className={`text-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ${!isSidebarOpen ? 'text-xl' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-sm font-medium transition-all duration-300 ${!isSidebarOpen ? 'hidden' : 'block'}`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-accent hover:bg-white/5 transition-all duration-300 ${!isSidebarOpen ? 'justify-center' : ''}`}
          title={!isSidebarOpen ? 'Logout' : ''}
        >
          <FaSignOutAlt className={`text-lg flex-shrink-0 ${!isSidebarOpen ? 'text-xl' : ''}`} />
          <span className={`text-sm font-medium transition-all duration-300 ${!isSidebarOpen ? 'hidden' : 'block'}`}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ResidentSidebar;