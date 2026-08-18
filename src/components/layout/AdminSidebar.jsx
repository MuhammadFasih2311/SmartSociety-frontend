import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import {
  FaChartLine, FaUsers, FaShieldAlt, FaBuilding,
  FaFileInvoice, FaCalendarCheck, FaBell, FaCog,
  FaSignOutAlt, FaClipboardList
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AdminSidebar = ({ isSidebarOpen = true }) => {
  const { logout, user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: <FaChartLine />, label: 'Dashboard' },
    { path: '/admin/residents', icon: <FaUsers />, label: 'Residents' },
    { path: '/admin/guards', icon: <FaShieldAlt />, label: 'Guards' },
    { path: '/admin/amenities', icon: <FaBuilding />, label: 'Amenities' },
    { path: '/admin/billing', icon: <FaFileInvoice />, label: 'Billing' },
    { path: '/admin/amenities/bookings', icon: <FaCalendarCheck />, label: 'Amenity Bookings' },
    { path: '/admin/complaints', icon: <FaBell />, label: 'Complaints' },
    { path: '/admin/security', icon: <FaClipboardList />, label: 'Security' },
    { path: '/admin/notices', icon: <FaBell />, label: 'Notices' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
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
          <FaShieldAlt className="text-primary" />
        </div>
        <h3 className="text-white font-bold text-sm mt-2 truncate">{user?.fullName || 'Admin'}</h3>
        <p className="text-text-muted text-[10px]">Administrator</p>
        <p className="text-text-muted text-[10px] truncate">{societyName}</p>
      </div>

      <div className={`text-center py-2 border-b border-white/5 transition-all duration-300 ${isSidebarOpen ? 'hidden' : 'block'}`}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-accent-light mx-auto flex items-center justify-center text-lg">
          <FaShieldAlt className="text-primary" />
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
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
            {item.label === 'Dashboard' && isSidebarOpen && (
              <span className="ml-auto text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full">Live</span>
            )}
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

export default AdminSidebar;