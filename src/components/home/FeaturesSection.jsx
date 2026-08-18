import React, { useEffect, useRef, useState } from 'react';
import { FaShieldAlt, FaClipboardList, FaCalendarCheck, FaBell } from 'react-icons/fa';

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState({});
  const featureRefs = useRef([]);

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

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Secure Gate Management',
      description: 'QR-based visitor passes with real-time verification for enhanced security',
      gradient: 'from-accent to-accent-light'
    },
    {
      icon: <FaClipboardList className="text-4xl" />,
      title: 'Maintenance Made Easy',
      description: 'Track bills, make payments, and view history all in one place',
      gradient: 'from-success to-blue-400'
    },
    {
      icon: <FaCalendarCheck className="text-4xl" />,
      title: 'Facility Booking',
      description: 'Book clubhouse, swimming pool, and sports courts instantly',
      gradient: 'from-warning to-orange-400'
    },
    {
      icon: <FaBell className="text-4xl" />,
      title: 'Smart Notifications',
      description: 'Real-time alerts for visitors, bills, complaints, and community updates',
      gradient: 'from-purple-400 to-pink-400'
    }
  ];

  return (
    <section className="py-20 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose{' '}
            <span className="gradient-text">SmartSociety</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Everything you need for modern community living
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => featureRefs.current[index] = el}
              data-index={index}
              className={`
                glass-card-hover p-8 relative overflow-hidden group
                transform transition-all duration-700
                ${isVisible[index] ? 'translate-x-0 opacity-100 rotate-y-0' : 'translate-x-20 opacity-0 rotate-y-90'}
                hover:-translate-y-3
              `}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                perspective: '1000px'
              }}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-700`}></div>
              
              <div className="relative">
                <div className={`absolute -inset-4 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-full blur-2xl transition-all duration-700`}></div>
                <div className="text-accent mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-text-muted group-hover:text-white/80 transition-colors duration-300">
                {feature.description}
              </p>
              
              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} w-0 group-hover:w-full transition-all duration-700`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;