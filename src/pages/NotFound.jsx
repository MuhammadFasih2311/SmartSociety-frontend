import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaSearch, FaFrown, FaLightbulb, FaRocket } from 'react-icons/fa';

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingIndex, setFloatingIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setFloatingIndex(prev => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  const floatingMessages = [
    '🚀 Oops! Wrong turn?',
    '🔍 Let\'s find your way!',
    '✨ Don\'t worry, we\'ve got you!'
  ];

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full filter blur-3xl"></div>
        
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent/20 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 5}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className={`
        relative max-w-3xl mx-auto text-center
        transform transition-all duration-1000
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90'}
      `}>

        <div className="relative inline-block mb-6">
          <div className="absolute -inset-8 bg-gradient-to-r from-accent/20 to-accent-light/20 rounded-full blur-2xl animate-pulse"></div>
          
          <div className="relative">
            <div className="text-8xl sm:text-9xl md:text-[10rem] font-extrabold leading-none">
              <span className="gradient-text inline-block hover:scale-110 transition-transform duration-500">4</span>
              <span className="gradient-text inline-block hover:scale-110 transition-transform duration-500" style={{ animationDelay: '0.2s' }}>0</span>
              <span className="gradient-text inline-block hover:scale-110 transition-transform duration-500" style={{ animationDelay: '0.4s' }}>4</span>
            </div>
            
            <div className="absolute -top-8 -right-8 sm:-top-12 sm:-right-12 text-4xl sm:text-6xl animate-bounce">
              <FaFrown className="text-accent/30" />
            </div>

            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-gradient-accent px-3 py-1.5 rounded-full shadow-glow animate-float">
              <span className="text-primary font-bold text-xs sm:text-sm flex items-center gap-1">
                <FaRocket className="text-xs" />
                Lost?
              </span>
            </div>
          </div>
        </div>

        <div className="h-12 mb-4">
          <p className="text-accent/70 text-lg sm:text-xl font-medium transition-all duration-500 animate-pulse">
            {floatingMessages[floatingIndex]}
          </p>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-text-muted text-base sm:text-lg md:text-xl mb-8 max-w-lg mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            to="/" 
            className="btn-primary inline-flex items-center gap-2 group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500"></span>
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300 relative" />
            <span className="relative">Back to Home</span>
          </Link>
          <Link 
            to="/sitemap" 
            className="btn-secondary group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-500"></span>
            <span className="relative flex items-center gap-2">
              <FaSearch />
              View Sitemap
            </span>
          </Link>
        </div>

        <div className="mt-12 text-text-muted/30 text-sm flex items-center justify-center gap-2">
          <span className="w-1 h-1 bg-accent rounded-full"></span>
          <span className='text-gray-400'>404 - Page not found</span>
          <span className="w-1 h-1 bg-accent rounded-full"></span>
          <span className='text-gray-400'>Don't worry, even astronauts get lost sometimes!</span>
          <span className="sm:hidden">🚀</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;