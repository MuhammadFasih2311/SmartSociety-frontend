import React, { useEffect, useRef, useState } from 'react';
import { FaUsers, FaBuilding, FaCalendarCheck, FaStar, FaShieldAlt, FaMoneyBillWave } from 'react-icons/fa';

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: <FaUsers className="text-4xl" />,
      value: '500+',
      label: 'Happy Residents',
      gradient: 'from-accent to-orange-400'
    },
    {
      icon: <FaBuilding className="text-4xl" />,
      value: '200+',
      label: 'Families',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      icon: <FaCalendarCheck className="text-4xl" />,
      value: '50+',
      label: 'Amenities',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      icon: <FaStar className="text-4xl" />,
      value: '99%',
      label: 'Satisfaction Rate',
      gradient: 'from-yellow-400 to-orange-400'
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      value: '100%',
      label: 'Secure Access',
      gradient: 'from-green-400 to-emerald-400'
    },
    {
      icon: <FaMoneyBillWave className="text-4xl" />,
      value: '1M+',
      label: 'Transactions Processed',
      gradient: 'from-indigo-400 to-blue-400'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-secondary/50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Impact in{' '}
            <span className="gradient-text">Numbers</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            The numbers that speak for themselves
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`
                glass-card p-6 text-center group hover:-translate-y-2 transition-all duration-500
                hover:shadow-2xl hover:shadow-accent/10
                transform transition-all duration-700
                ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
              `}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`text-4xl bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-white group-hover:text-accent transition-colors duration-300">
                {stat.value}
              </p>
              <p className="text-text-muted text-xs group-hover:text-white/80 transition-colors duration-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;