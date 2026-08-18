import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, FaUsers, FaBuilding, FaStar, 
  FaShieldAlt, FaArrowRight, FaCheckCircle, 
  FaRocket, FaInfinity, FaCalendarCheck, 
  FaBell
} from 'react-icons/fa';

const sliderImages = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1920&h=1080&fit=crop'
];

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '500+', label: 'Happy Residents', icon: <FaUsers /> },
    { value: '200+', label: 'Families', icon: <FaHome /> },
    { value: '50+', label: 'Amenities', icon: <FaBuilding /> },
    { value: '99%', label: 'Satisfaction', icon: <FaStar /> }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-screen overflow-hidden"
      style={{ 
        marginTop: '-4rem',
        paddingTop: '4rem'
      }}
    >
      <div className="absolute inset-0 w-full h-full">
        {sliderImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            <img 
              src={img} 
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/70 z-10"></div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index 
                ? 'w-10 h-2 bg-accent' 
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${5 + Math.random() * 8}s`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`
            }}
          />
        ))}
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`
            transform transition-all duration-1000
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
          `}>
            <div className="inline-flex items-center px-4 py-2 bg-accent/20 rounded-full border border-accent/30 mb-6 group hover:bg-accent/30 transition-all duration-500 backdrop-blur-sm">
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span className="text-accent text-sm font-medium">Smart Society Management</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 text-white">
              Welcome to{' '}
              <span className="gradient-text">SmartSociety</span>
            </h1>
            
            <p className="text-white/95 text-lg md:text-xl mb-8 max-w-lg leading-relaxed drop-shadow-lg">
              The complete digital solution for modern housing societies. 
              Secure, smart, and seamless community living.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="btn-primary inline-flex items-center gap-2 group px-6 py-3 text-base md:px-8 md:py-4 md:text-lg shadow-lg shadow-accent/20 hover:shadow-accent/40">
                Get Started
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link to="/sitemap" className="btn-secondary group px-6 py-3 text-base md:px-8 md:py-4 md:text-lg backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20">
                View Sitemap
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`
                    group hover:transform hover:-translate-y-1 transition-all duration-300
                    transform transition-all duration-700
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                  `}
                  style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                >
                  <div className="flex items-center gap-2 text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                    {stat.icon}
                    {stat.value}
                  </div>
                  <div className="text-white/80 text-xs md:text-sm group-hover:text-accent transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`
            grid grid-cols-1 sm:grid-cols-2 gap-4
            transform transition-all duration-1000 delay-300
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
          `}>
            <div className="glass-card p-5 md:p-6 hover:border-accent/40 transition-all duration-300 group backdrop-blur-sm bg-black/30 border-white/10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent text-lg md:text-xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <FaShieldAlt />
              </div>
              <h3 className="text-white font-semibold text-sm md:text-base mb-1 md:mb-2">Secure Access</h3>
              <p className="text-text-muted text-xs md:text-sm">QR-based visitor verification</p>
            </div>
            <div className="glass-card p-5 md:p-6 hover:border-accent/40 transition-all duration-300 group backdrop-blur-sm bg-black/30 border-white/10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-success/20 flex items-center justify-center text-success text-lg md:text-xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <FaCheckCircle />
              </div>
              <h3 className="text-white font-semibold text-sm md:text-base mb-1 md:mb-2">Easy Payments</h3>
              <p className="text-text-muted text-xs md:text-sm">Maintenance bills made simple</p>
            </div>
            <div className="glass-card p-5 md:p-6 hover:border-accent/40 transition-all duration-300 group backdrop-blur-sm bg-black/30 border-white/10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-warning/20 flex items-center justify-center text-warning text-lg md:text-xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <FaCalendarCheck />
              </div>
              <h3 className="text-white font-semibold text-sm md:text-base mb-1 md:mb-2">Book Amenities</h3>
              <p className="text-text-muted text-xs md:text-sm">Pool, gym & more</p>
            </div>
            <div className="glass-card p-5 md:p-6 hover:border-accent/40 transition-all duration-300 group backdrop-blur-sm bg-black/30 border-white/10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-400/20 flex items-center justify-center text-purple-400 text-lg md:text-xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <FaBell />
              </div>
              <h3 className="text-white font-semibold text-sm md:text-base mb-1 md:mb-2">Real-time Alerts</h3>
              <p className="text-text-muted text-xs md:text-sm">Stay informed always</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/30 animate-bounce group cursor-pointer z-30 pointer-events-auto">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group-hover:border-accent/50 transition-all duration-300">
          <div className="w-1 h-2 bg-white/30 rounded-full mt-2 group-hover:bg-accent group-hover:h-3 transition-all duration-300 animate-[scrollDown_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;