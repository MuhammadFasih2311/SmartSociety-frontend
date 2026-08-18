import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaSitemap, FaUser, FaBuilding, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useSettings } from '../../context/SettingsContext';

const Navbar = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/sitemap', label: 'Sitemap', icon: <FaSitemap /> },
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const societyName = settingsLoading ? 'SmartSociety' : (settings?.societyName || 'SmartSociety');

  return (
    <nav 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled 
          ? 'bg-primary/95 backdrop-blur-xl shadow-2xl border-b border-white/5' 
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 group relative"
          >
            <div className="absolute -inset-4 bg-accent/0 group-hover:bg-accent/5 rounded-2xl blur-xl transition-all duration-700 -z-10"></div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-accent/30 rounded-full blur-xl group-hover:blur-2xl group-hover:bg-accent/40 transition-all duration-700 animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-accent-light flex items-center justify-center relative z-10 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-accent/20 group-hover:shadow-2xl group-hover:shadow-accent/40">
                <FaBuilding className="text-primary text-lg group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            
            <span className="text-2xl font-bold bg-gradient-to-r from-accent via-accent-light to-accent bg-[length:200%] animate-gradient bg-clip-text text-transparent">
              {societyName}
              <span className="absolute -inset-1 bg-accent/0 group-hover:bg-accent/10 blur-xl transition-all duration-700 -z-10"></span>
            </span>
          </NavLink>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.path);
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`
                    relative text-white/70 hover:text-white transition-all duration-300
                    font-medium text-sm uppercase tracking-wider flex items-center gap-2
                    ${isActive ? 'text-white' : ''}
                    group
                    px-3 py-2 rounded-xl hover:bg-white/5
                  `}
                >
                  <span className={`text-accent transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {link.icon}
                  </span>
                  {link.label}
                  <span className={`
                    absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-accent to-accent-light
                    transition-all duration-300
                    ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
                  `}></span>
                  <span className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 rounded-xl transition-all duration-500 -z-10"></span>
                </NavLink>
              );
            })}
            
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm">
                  {user.fullName || user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="relative group flex items-center gap-2"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-red-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-all duration-700"></div>
                  <div className="relative bg-gradient-to-r from-red-500 to-red-400 hover:from-red-400 hover:to-red-300 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40 flex items-center gap-2 text-sm">
                    <FaSignOutAlt className="group-hover:rotate-12 transition-transform duration-300" />
                    Logout
                  </div>
                </button>
              </div>
            ) : (
              <Link to="/login" className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent to-accent-light rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-all duration-700"></div>
                <div className="relative bg-gradient-to-r from-accent to-accent-light hover:from-accent-dark hover:to-accent text-primary font-semibold px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-accent/40 flex items-center gap-2 text-sm">
                  <FaUser className="group-hover:rotate-12 transition-transform duration-300" />
                  Login
                </div>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors relative group"
          >
            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 rounded-lg blur-xl transition-all duration-500"></div>
            {isOpen ? <FaTimes className="w-6 h-6 relative" /> : <FaBars className="w-6 h-6 relative" />}
          </button>
        </div>
      </div>

      <div 
        className={`
          md:hidden fixed inset-x-0 top-16 bg-primary/98 backdrop-blur-xl
          border-b border-white/5 transition-all duration-300
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}
      >
        <div className="px-4 py-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.path);
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`
                  block text-white/80 hover:text-white transition-all duration-300
                  font-medium px-4 py-3 rounded-lg flex items-center gap-3
                  ${isActive ? 'bg-gradient-to-r from-accent/20 to-accent-light/10 text-accent' : 'hover:bg-white/5'}
                  relative group overflow-hidden
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-accent-light/5 transition-all duration-500"></div>
                <span className={`text-accent transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {link.icon}
                </span>
                {link.label}
                {isActive && (
                  <span className="absolute right-4 w-1 h-6 bg-gradient-to-b from-accent to-accent-light rounded-full"></span>
                )}
              </NavLink>
            );
          })}
          
          <div className="pt-4 border-t border-white/10">
            {isLoggedIn && user ? (
              <>
                <div className="px-4 py-2 text-white/70 text-sm">
                  Welcome, {user.fullName || user.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-400 hover:from-red-400 hover:to-red-300 text-white font-semibold py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
                  <FaSignOutAlt className="group-hover:rotate-12 transition-transform duration-300" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="w-full bg-gradient-to-r from-accent to-accent-light hover:from-accent-dark hover:to-accent text-primary font-semibold py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
                <FaUser className="group-hover:rotate-12 transition-transform duration-300" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;