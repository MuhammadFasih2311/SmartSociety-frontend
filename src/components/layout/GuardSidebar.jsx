import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import {
  FaUser, FaKey, FaClipboardList,
  FaShieldAlt, FaCog, FaChartLine, FaQrcode,
  FaPrint, FaBuilding, FaSignOutAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const GuardSidebar = ({ isSidebarOpen = true }) => {
  const { logout, user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/guard/dashboard', icon: <FaChartLine />, label: 'Dashboard' },
    { path: '/guard/visitors', icon: <FaUser />, label: 'Visitors' },
    { path: '/guard/verify', icon: <FaQrcode />, label: 'Verify Pass' },
    { path: '/guard/logs', icon: <FaClipboardList />, label: 'Gate Logs' },
    { path: '/guard/gates', icon: <FaBuilding />, label: 'Gate Status' },
    { path: '/guard/report', icon: <FaPrint />, label: 'Reports' },
    { path: '/guard/settings', icon: <FaCog />, label: 'Settings' },
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
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 mx-auto flex items-center justify-center text-xl shadow-lg shadow-green-400/20">
          <FaShieldAlt className="text-primary" />
        </div>
        <h3 className="text-white font-bold text-sm mt-2 truncate">{user?.fullName || 'Guard'}</h3>
        <p className="text-text-muted text-[10px]">{societyName}</p>
        <span className="inline-block mt-1 text-[10px] bg-success/20 text-success px-2 py-0.5 rounded-full">Active</span>
      </div>

      <div className={`text-center py-2 border-b border-white/5 transition-all duration-300 ${isSidebarOpen ? 'hidden' : 'block'}`}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 mx-auto flex items-center justify-center text-lg shadow-lg shadow-green-400/20">
          <FaShieldAlt className="text-primary" />
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
                ? 'bg-gradient-to-r from-green-400/20 to-emerald-400/10 text-accent border border-green-400/20' 
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
              <span className="ml-auto text-[10px] bg-green-400/20 text-green-400 px-2 py-0.5 rounded-full">Live</span>
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

export default GuardSidebar;