import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-hot-toast';
import { 
  FaBuilding, 
  FaGithub, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram,
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaHeart,
  FaArrowRight,
  FaClock,
  FaShieldAlt,
  FaUsers,
  FaHome,
  FaNewspaper,
  FaCalendarCheck,
  FaTools
} from 'react-icons/fa';

const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const societyName = settings?.societyName || 'SmartSociety';
  const address = settings?.address || 'The complete digital solution for modern housing societies. Secure, smart, and seamless community living.';
  const emailAddress = settings?.email || 'info@smartsociety.com';
  const phoneNumber = settings?.phone || '+92 300 1234567';
  const location = settings?.address?.split(',').pop()?.trim() || 'Islamabad, Pakistan';

  const quickLinks = [
    { path: '/', label: 'Home', icon: <FaHome className="text-xs" /> },
    { path: '/sitemap', label: 'Sitemap', icon: <FaUsers className="text-xs" /> },
  ];

  const socialLinks = [
    { icon: <FaGithub />, href: '#', label: 'GitHub', color: 'hover:text-[#6e5494]' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter', color: 'hover:text-[#1DA1F2]' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn', color: 'hover:text-[#0A66C2]' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram', color: 'hover:text-[#E4405F]' },
  ];

  const services = [
    { name: 'Visitor Management', icon: <FaShieldAlt /> },
    { name: 'Maintenance Billing', icon: <FaClock /> },
    { name: 'Complaint Portal', icon: <FaTools /> },
    { name: 'Amenity Booking', icon: <FaCalendarCheck /> },
    { name: 'Notice Board', icon: <FaNewspaper /> },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      toast.success('Subscribed successfully!');
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    } else {
      toast.error('Please enter your email address');
    }
  };

  return (
    <footer className="bg-gradient-to-b from-primary-light/10 to-primary/90 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-light rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent to-accent-light flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/20">
                <FaBuilding className="text-primary text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold gradient-text">
                  {societyName}
                </h2>
                <p className="text-text-muted text-xs tracking-wider uppercase">Community Living</p>
              </div>
            </div>
            
            <p className="text-text-muted text-sm leading-relaxed">
              {address}
            </p>
            
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className={`
                    w-10 h-10 rounded-full bg-primary/30 border border-white/10 
                    flex items-center justify-center text-text-muted 
                    ${social.color} 
                    hover:border-accent hover:bg-accent/10 
                    transition-all duration-300 hover:transform hover:scale-110 hover:-translate-y-1
                    group relative
                  `}
                >
                  {social.icon}
                  <span className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs bg-primary/90 px-2 py-1 rounded-full whitespace-nowrap">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-accent to-accent-light rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `
                      group flex items-center gap-2 text-text-muted hover:text-white 
                      transition-all duration-300 text-sm
                      ${isActive ? 'text-accent' : ''}
                    `}
                  >
                    <span className="text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
                      <FaArrowRight className="text-xs" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
                      {link.icon && link.icon}
                      {link.label}
                    </span>
                    {link.icon && (
                      <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-accent to-accent-light rounded-full"></span>
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <div className="group flex items-center gap-3 text-text-muted hover:text-white transition-all duration-300 text-sm cursor-default">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-all duration-300">
                      {service.icon}
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {service.name}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-accent to-accent-light rounded-full"></span>
              Stay Connected
            </h3>

            <div className="space-y-3">
              <div className="group flex items-start gap-3 text-text-muted hover:text-white transition-colors duration-300 text-sm p-2 rounded-xl hover:bg-white/5">
                <FaEnvelope className="text-accent text-lg group-hover:scale-110 transition-transform duration-300 mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted/50">Email</p>
                  <p>{emailAddress}</p>
                </div>
              </div>
              <div className="group flex items-start gap-3 text-text-muted hover:text-white transition-colors duration-300 text-sm p-2 rounded-xl hover:bg-white/5">
                <FaPhone className="text-accent text-lg group-hover:scale-110 transition-transform duration-300 mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted/50">Phone</p>
                  <p>{phoneNumber}</p>
                </div>
              </div>
              <div className="group flex items-start gap-3 text-text-muted hover:text-white transition-colors duration-300 text-sm p-2 rounded-xl hover:bg-white/5">
                <FaMapMarkerAlt className="text-accent text-lg group-hover:scale-110 transition-transform duration-300 mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted/50">Location</p>
                  <p>{location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-muted text-sm flex items-center gap-2 group">
              © {currentYear} {societyName}. Made with 
              <FaHeart className="text-accent text-xs group-hover:scale-125 transition-transform duration-300 animate-pulse" />
              for better communities
            </p>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <a href="#" className="text-text-muted hover:text-white text-sm transition-colors duration-300 relative group">
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
              </a>
              <span className="text-text-muted/20">|</span>
              <a href="#" className="text-text-muted hover:text-white text-sm transition-colors duration-300 relative group">
                Terms of Service
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
              </a>
              <span className="text-text-muted/20">|</span>
              <a href="#" className="text-text-muted hover:text-white text-sm transition-colors duration-300 relative group">
                Cookie Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;