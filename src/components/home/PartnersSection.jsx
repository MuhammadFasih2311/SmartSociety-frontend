import React, { useEffect, useRef, useState } from 'react';
import { FaBuilding, FaHome, FaCity, FaHotel, FaUserFriends, FaShieldAlt, FaTree, FaSwimmingPool } from 'react-icons/fa';

const PartnersSection = () => {
  const [isVisible, setIsVisible] = useState({});
  const partnerRefs = useRef([]);

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

    partnerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const partners = [
    { 
      icon: <FaBuilding className="w-12 h-12" />, 
      name: 'Real Estate Group', 
      gradient: 'from-accent to-orange-400' 
    },
    { 
      icon: <FaHome className="w-12 h-12" />, 
      name: 'Property Solutions', 
      gradient: 'from-blue-400 to-cyan-400' 
    },
    { 
      icon: <FaCity className="w-12 h-12" />, 
      name: 'Urban Living', 
      gradient: 'from-purple-400 to-pink-400' 
    },
    { 
      icon: <FaHotel className="w-12 h-12" />, 
      name: 'Luxury Estates', 
      gradient: 'from-green-400 to-emerald-400' 
    },
    { 
      icon: <FaUserFriends className="w-12 h-12" />, 
      name: 'Community First', 
      gradient: 'from-yellow-400 to-orange-400' 
    },
    { 
      icon: <FaShieldAlt className="w-12 h-12" />, 
      name: 'Secure Living', 
      gradient: 'from-indigo-400 to-blue-400' 
    },
    { 
      icon: <FaTree className="w-12 h-12" />, 
      name: 'Green Spaces', 
      gradient: 'from-green-400 to-lime-400' 
    },
    { 
      icon: <FaSwimmingPool className="w-12 h-12" />, 
      name: 'Luxury Amenities', 
      gradient: 'from-cyan-400 to-blue-400' 
    }
  ];

  return (
    <section className="py-20 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by{' '}
            <span className="gradient-text">Leading Communities</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Join 500+ communities already using SmartSociety
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              ref={(el) => partnerRefs.current[index] = el}
              data-index={index}
              className={`
                glass-card p-6 text-center group hover:border-accent/30 transition-all duration-500
                hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10
                transform transition-all duration-700
                ${isVisible[index] ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
              `}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`inline-block p-4 rounded-2xl bg-gradient-to-r ${partner.gradient} bg-opacity-20 mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <div className="text-white text-4xl">
                  {partner.icon}
                </div>
              </div>
              <p className="text-white text-sm font-medium group-hover:text-accent transition-colors duration-300">
                {partner.name}
              </p>
              <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${partner.gradient} w-0 group-hover:w-full transition-all duration-700`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;