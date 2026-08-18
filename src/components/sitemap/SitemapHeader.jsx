import React, { useEffect, useRef, useState } from 'react';
import { FaSitemap } from 'react-icons/fa';

const SitemapHeader = () => {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef(null);

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

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={headerRef}
      className={`
        text-center mb-16
        transform transition-all duration-1000
        ${isVisible ? 'translate-y-0 opacity-100 scale-100 rotate-0' : 'translate-y-12 opacity-0 scale-50 rotate-6'}
      `}
    >
      <div className="relative inline-block">
        <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-accent-light/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-accent to-accent-light mb-4 shadow-2xl shadow-accent/30 group hover:scale-110 transition-transform duration-500">
          <FaSitemap className="text-4xl text-primary group-hover:rotate-180 transition-transform duration-700" />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Site{' '}
        <span className="gradient-text hover:brightness-150 transition-all duration-500">Map</span>
      </h1>
      
      <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto">
        Complete navigation structure of{' '}
        <span className="text-accent font-semibold">SmartSociety</span> web application
      </p>

      <div className="flex justify-center mt-6">
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default SitemapHeader;