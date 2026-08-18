import React, { useEffect, useRef, useState } from 'react';
import { FaUserPlus, FaCheckCircle, FaRocket, FaArrowRight } from 'react-icons/fa';

const HowItWorksSection = () => {
  const [isVisible, setIsVisible] = useState({});
  const stepRefs = useRef([]);

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

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: '01',
      icon: <FaUserPlus className="text-3xl" />,
      title: 'Sign Up',
      description: 'Create your account in minutes and join the community',
      gradient: 'from-accent to-orange-400'
    },
    {
      number: '02',
      icon: <FaCheckCircle className="text-3xl" />,
      title: 'Set Up Profile',
      description: 'Complete your profile and add family members',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      number: '03',
      icon: <FaRocket className="text-3xl" />,
      title: 'Explore & Enjoy',
      description: 'Access all features - payments, bookings, and more',
      gradient: 'from-purple-400 to-pink-400'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-secondary/20 to-primary"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It{' '}
            <span className="gradient-text">Works</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Get started with SmartSociety in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent/50 to-accent hidden md:block"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => stepRefs.current[index] = el}
              data-index={index}
              className={`
                glass-card p-8 text-center relative group hover:-translate-y-2 transition-all duration-500
                hover:shadow-2xl hover:shadow-accent/10
                transform transition-all duration-700
                ${isVisible[index] ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
              `}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-700`}></div>
              
              <div className="relative">
                <div className="text-5xl font-bold text-accent/20 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white text-2xl mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-text-muted text-sm group-hover:text-white/80 transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;