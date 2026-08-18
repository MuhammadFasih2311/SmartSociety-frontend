import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
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

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-r from-accent/10 to-accent-light/10 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-light/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className={`
        relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center
        transform transition-all duration-1000
        ${isVisible ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 rotate-12'}
      `}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Join{' '}
          <span className="gradient-text">SmartSociety</span>?
        </h2>
        <p className="text-text-muted text-lg mb-8 max-w-2xl mx-auto">
          Experience the future of community living today
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register" className="btn-primary group relative overflow-hidden">
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500"></span>
            <span className="relative">Register Now</span>
          </Link>
          <Link to="/sitemap" className="btn-secondary group relative overflow-hidden">
            <span className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-500"></span>
            <span className="relative">View Sitemap</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;