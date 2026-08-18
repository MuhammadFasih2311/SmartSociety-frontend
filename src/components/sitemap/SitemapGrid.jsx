import React, { useState, useEffect, useRef } from 'react';
import { 
  FaHome, FaSitemap, FaUsers, FaClipboardList, 
  FaCalendarCheck, FaBell, FaShieldAlt, FaArrowRight,
  FaBuilding, FaUserShield, FaUserFriends, FaKey,
  FaChartLine, FaCog, FaDatabase, FaLock, FaGlobe,
  FaMobile, FaDesktop, FaCheckCircle, FaClock, FaRocket,
  FaInfoCircle, FaFileAlt, FaSearch, FaMapMarkerAlt,
  FaListAlt, FaTasks, FaWallet, FaCreditCard, FaPhone,
  FaEnvelope, FaExclamationTriangle, FaQuestionCircle
} from 'react-icons/fa';

const SitemapGrid = () => {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.dataset.index]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const sitemapData = [
    {
      category: 'Public Pages',
      icon: <FaGlobe />,
      gradient: 'from-blue-400 to-cyan-400',
      description: 'Accessible to all visitors without authentication',
      totalPages: 2,
      features: ['Landing Page', 'Site Navigation', 'Public Information', 'Contact Details'],
      pages: [
        { name: 'Home', icon: <FaHome />, description: 'Landing page of SmartSociety with hero section and key features showcase' },
        { name: 'Sitemap', icon: <FaSitemap />, description: 'Complete site navigation and page structure overview' },
      ]
    },
    {
      category: 'Resident Features',
      icon: <FaUserFriends />,
      gradient: 'from-accent to-accent-light',
      description: 'Exclusive features for registered society residents',
      totalPages: 6,
      features: ['Dashboard Overview', 'Visitor Management', 'Bill Payments', 'Complaint System', 'Amenity Booking', 'Community Notices'],
      pages: [
        { name: 'Dashboard', icon: <FaChartLine />, description: 'Personalized resident overview with quick stats and notifications' },
        { name: 'Visitor Pass', icon: <FaKey />, description: 'Generate QR-based gate passes for visitors with expiry time' },
        { name: 'Maintenance Bills', icon: <FaClipboardList />, description: 'View and pay monthly maintenance bills online securely' },
        { name: 'Complaints', icon: <FaBell />, description: 'Raise and track complaints with real-time status updates' },
        { name: 'Amenity Booking', icon: <FaCalendarCheck />, description: 'Book community facilities like clubhouse, gym, and pool' },
        { name: 'Notices', icon: <FaBuilding />, description: 'View community announcements and important updates' },
      ]
    },
    {
      category: 'Admin Features',
      icon: <FaUserShield />,
      gradient: 'from-purple-400 to-pink-400',
      description: 'Powerful tools for society administrators and committee members',
      totalPages: 5,
      features: ['Admin Dashboard', 'Resident Management', 'Billing Engine', 'Complaint Routing', 'Security Management'],
      pages: [
        { name: 'Admin Dashboard', icon: <FaChartLine />, description: 'Comprehensive admin overview with analytics and reports' },
        { name: 'Resident Management', icon: <FaUsers />, description: 'Manage resident profiles, family details, and contact information' },
        { name: 'Billing Engine', icon: <FaDatabase />, description: 'Generate, manage, and track maintenance bills automatically' },
        { name: 'Complaint Routing', icon: <FaCog />, description: 'Assign complaints to appropriate departments and track resolution' },
        { name: 'Security Logs', icon: <FaLock />, description: 'View and audit all security gate logs and access records' },
      ]
    },
    {
      category: 'Security Features',
      icon: <FaShieldAlt />,
      gradient: 'from-green-400 to-emerald-400',
      description: 'Dedicated tools for security guards and gate management',
      totalPages: 3,
      features: ['Guard Dashboard', 'Visitor Entry Log', 'Pass Verification', 'Emergency Alerts'],
      pages: [
        { name: 'Guard Dashboard', icon: <FaDesktop />, description: 'Real-time security overview with visitor statistics' },
        { name: 'Visitor Entry', icon: <FaMobile />, description: 'Quick log visitor entries with photo and purpose details' },
        { name: 'Pass Verification', icon: <FaKey />, description: 'Scan and verify QR codes for authorized visitors' },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Complete <span className="gradient-text">Site Map</span>
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto text-lg">
          Explore all the features and pages available in SmartSociety. 
          Navigate through different sections designed for residents, admins, and security personnel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6 lg:gap-6">
        {sitemapData.map((section, index) => (
          <div
            key={index}
            ref={(el) => sectionRefs.current[index] = el}
            data-index={index}
            className={`
              transform transition-all duration-700 h-full
              ${isVisible[index] ? 'translate-x-0 opacity-100 rotate-y-0' : 'translate-x-20 opacity-0 rotate-y-90'}
            `}
            style={{ 
              transitionDelay: `${index * 150}ms`,
              perspective: '1000px'
            }}
          >
            <div 
              className="glass-card p-6 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 h-full flex flex-col cursor-default"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => toggleSection(index)}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${section.gradient} opacity-0 group-hover:opacity-5 transition-all duration-700 blur-2xl`}></div>
              
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${section.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}></div>

              <div className="flex items-center gap-3 mb-3 relative">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0
                  bg-gradient-to-r ${section.gradient} 
                  transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500
                  shadow-lg shadow-accent/20
                `}>
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300 truncate">
                    {section.category}
                  </h2>
                  <p className="text-xs text-text-muted/70 truncate">
                    {section.totalPages} pages • {section.features.length} features
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-text-muted group-hover:bg-accent/10 group-hover:text-accent transition-all duration-300 flex items-center gap-1">
                    <FaInfoCircle className="text-[10px]" />
                    {section.pages.length} items
                  </span>
                </div>
              </div>

              <p className="text-text-muted text-sm mb-3 pl-1 border-l-2 border-accent/30 pl-3">
                {section.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {section.features.slice(0, 4).map((feature, idx) => (
                  <span key={idx} className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-text-muted/80 flex items-center gap-1">
                    <FaCheckCircle className="text-accent text-[8px]" />
                    {feature}
                  </span>
                ))}
                {section.features.length > 4 && (
                  <span className="text-[10px] bg-accent/10 px-2 py-1 rounded-full text-accent">
                    +{section.features.length - 4} more
                  </span>
                )}
              </div>

              <ul className="space-y-1.5 relative flex-1">
                {section.pages.map((page, idx) => (
                  <li key={idx}>
                    <div
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl 
                        transition-all duration-300 group/item cursor-default
                        hover:bg-white/5 hover:pl-4
                        ${hoveredCard === index ? 'hover:bg-accent/5' : ''}
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0
                        bg-white/5 group-hover/item:bg-accent/20 
                        transition-all duration-300
                        group-hover/item:scale-110
                      `}>
                        <span className="text-accent">{page.icon}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span className="text-white group-hover/item:text-accent transition-colors duration-300 font-medium text-sm block">
                          {page.name}
                        </span>
                        <p className="text-text-muted text-xs group-hover/item:text-white/60 transition-colors duration-300 truncate">
                          {page.description}
                        </p>
                      </div>
                      
                      <div className="text-accent/30 group-hover/item:text-accent transition-all duration-300 transform group-hover/item:translate-x-1 flex-shrink-0">
                        <FaArrowRight className="text-sm" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 flex-shrink-0">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${section.gradient} 
                        transition-all duration-300
                        ${hoveredCard === index ? 'scale-150 opacity-100' : 'opacity-30'}
                      `}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
                <div className="text-[10px] text-text-muted/50 flex items-center gap-2">
                  <FaClock className="text-accent/50" />
                  <span>Click to {expandedSection === index ? 'collapse' : 'expand'}</span>
                </div>
              </div>

              {expandedSection === index && (
                <div className="mt-3 pt-3 border-t border-white/10 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="flex items-center gap-1 text-accent text-xs">
                        <FaFileAlt className="text-[10px]" />
                        <span className="font-medium">Total Pages</span>
                      </div>
                      <span className="text-white text-sm font-bold">{section.totalPages}</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="flex items-center gap-1 text-accent text-xs">
                        <FaTasks className="text-[10px]" />
                        <span className="font-medium">Features</span>
                      </div>
                      <span className="text-white text-sm font-bold">{section.features.length}</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 col-span-2">
                      <div className="flex items-center gap-1 text-accent text-xs">
                        <FaSearch className="text-[10px]" />
                        <span className="font-medium">Quick Access</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {section.pages.slice(0, 3).map((page, idx) => (
                          <span key={idx} className="text-[9px] bg-accent/10 px-2 py-0.5 rounded text-accent/80">
                            {page.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 glass-card text-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-center gap-3">
            <FaMapMarkerAlt className="text-accent text-xl" />
            <div className="text-left">
              <p className="text-white text-sm font-medium">Total Pages</p>
              <p className="text-text-muted text-xs">16+ pages across all sections</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <FaRocket className="text-accent text-xl" />
            <div className="text-left">
              <p className="text-white text-sm font-medium">Features</p>
              <p className="text-text-muted text-xs">20+ features for community living</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <FaShieldAlt className="text-accent text-xl" />
            <div className="text-left">
              <p className="text-white text-sm font-medium">Security</p>
              <p className="text-text-muted text-xs">Role-based access control</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap justify-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1"><FaEnvelope className="text-accent" /> support@smartsociety.com</span>
          <span className="flex items-center gap-1"><FaPhone className="text-accent" /> +1 234 567 8900</span>
          <span className="flex items-center gap-1"><FaQuestionCircle className="text-accent" /> Help Center</span>
          <span className="flex items-center gap-1"><FaExclamationTriangle className="text-accent" /> Report Issue</span>
        </div>
      </div>
    </div>
  );
};

export default SitemapGrid;