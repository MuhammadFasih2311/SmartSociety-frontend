import React, { useEffect, useRef, useState } from 'react';
import { 
  FaRocket, FaUsers, FaShieldAlt, FaMobileAlt,
  FaClock, FaCreditCard, FaHeadset, FaChartLine
} from 'react-icons/fa';

const WhyChooseSection = () => {
  const [isVisible, setIsVisible] = useState({});
  const cardRefs = useRef([]);

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

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const reasons = [
    {
      icon: <FaRocket className="text-3xl" />,
      title: 'Fast & Efficient',
      description: 'Quick responses and streamlined processes for all community services',
      gradient: 'from-accent to-orange-400'
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: 'Secure & Safe',
      description: 'Advanced security protocols to protect your community and data',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      icon: <FaMobileAlt className="text-3xl" />,
      title: 'Mobile Friendly',
      description: 'Access all features seamlessly from any device, anywhere',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: 'Community First',
      description: 'Built for residents, by residents - fostering a strong community spirit',
      gradient: 'from-green-400 to-emerald-400'
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for all your community needs',
      gradient: 'from-yellow-400 to-orange-400'
    },
    {
      icon: <FaCreditCard className="text-3xl" />,
      title: 'Easy Payments',
      description: 'Simple and secure online payment system for maintenance bills',
      gradient: 'from-indigo-400 to-blue-400'
    },
    {
      icon: <FaHeadset className="text-3xl" />,
      title: 'Dedicated Support',
      description: 'Professional team always ready to help you with any issue',
      gradient: 'from-red-400 to-pink-400'
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: 'Smart Analytics',
      description: 'Data-driven insights for better community management decisions',
      gradient: 'from-teal-400 to-cyan-400'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-secondary/20 to-primary"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose{' '}
            <span className="gradient-text">SmartSociety</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Discover the benefits that make us the preferred choice for modern communities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              ref={(el) => cardRefs.current[index] = el}
              data-index={index}
              className={`
                glass-card p-6 relative group hover:-translate-y-2 transition-all duration-500
                hover:shadow-2xl hover:shadow-accent/10
                transform transition-all duration-700
                ${isVisible[index] ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${reason.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-700`}></div>
              
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${reason.gradient} flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {reason.icon}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                {reason.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                {reason.description}
              </p>
              
              <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${reason.gradient} w-0 group-hover:w-full transition-all duration-700`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;