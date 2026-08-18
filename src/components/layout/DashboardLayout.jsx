import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { 
  FaBars, FaTimes, FaUser, FaSignOutAlt, 
  FaBuilding, FaUserShield, FaShieldAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const DashboardLayout = ({ children, sidebar }) => {
  const { settings } = useSettings();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const getRoleInfo = () => {
    const path = location.pathname;
    if (path.includes('/resident')) {
      return {
        role: 'Resident',
        icon: <FaUser className="text-primary" />,
        welcome: 'Welcome back!',
        color: 'from-accent to-accent-light',
        name: user?.fullName || 'Resident'
      };
    } else if (path.includes('/admin')) {
      return {
        role: 'Admin',
        icon: <FaUserShield className="text-primary" />,
        welcome: 'Welcome to your dashboard!',
        color: 'from-purple-400 to-pink-400',
        name: user?.fullName || 'Admin'
      };
    } else if (path.includes('/guard')) {
      return {
        role: 'Guard',
        icon: <FaShieldAlt className="text-primary" />,
        welcome: 'Security monitoring active!',
        color: 'from-green-400 to-emerald-400',
        name: user?.fullName || 'Guard'
      };
    }
    return {
      role: 'User',
      icon: <FaUser className="text-primary" />,
      welcome: 'Welcome!',
      color: 'from-accent to-accent-light',
      name: 'User'
    };
  };

  const roleInfo = getRoleInfo();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-primary overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-xl border-b border-white/5 h-16">
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FaBars className="w-5 h-5" />
            </button>

            <button
              onClick={toggleSidebar}
              className="hidden lg:block text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FaBars className="w-5 h-5" />
            </button>

            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent-light flex items-center justify-center flex-shrink-0">
                <FaBuilding className="text-primary text-sm" />
              </div>
              <span className="text-lg font-bold gradient-text hidden sm:inline">
                {settings?.societyName || 'SmartSociety'}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">

            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${roleInfo.color} flex items-center justify-center flex-shrink-0`}>
                {roleInfo.icon}
              </div>
              <div className="hidden sm:block">
                <span className="text-white text-sm font-medium">{roleInfo.name}</span>
                <p className="text-text-muted text-xs">{roleInfo.role}</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="text-text-muted hover:text-accent transition-colors p-2 hover:bg-white/5 rounded-lg"
            >
              <FaSignOutAlt className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <aside className={`
        fixed top-16 left-0 bottom-0 z-40 
        bg-primary/95 backdrop-blur-xl border-r border-white/5
        transition-all duration-300 overflow-y-auto overflow-x-hidden
        hidden lg:block
        ${isSidebarOpen ? 'w-64' : 'w-[72px]'}
      `}>
        <style>{`
          .sidebar-scroll::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
          .sidebar-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}</style>
        <div className={`p-3 h-full sidebar-scroll overflow-y-auto ${isSidebarOpen ? 'px-4' : 'px-2'}`}>
          {sidebar && React.cloneElement(sidebar, { isSidebarOpen })}
        </div>
      </aside>

      <div className={`
        fixed inset-0 z-40 lg:hidden
        transition-all duration-300
        ${isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={toggleMobileSidebar}
        />
        <div className={`
          absolute top-0 left-0 bottom-0 w-72 bg-primary/98 backdrop-blur-xl border-r border-white/5
          transition-all duration-300 overflow-y-auto
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4">
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleMobileSidebar}
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      </div>

      <main className={`
        pt-16 transition-all duration-300 min-h-screen
        ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-[72px]'}
      `}>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;