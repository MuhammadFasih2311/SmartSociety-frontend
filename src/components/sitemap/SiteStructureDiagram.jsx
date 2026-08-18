import React, { useEffect, useRef, useState } from 'react';
import { 
  FaBuilding, FaArrowRight, FaGlobe, 
  FaUserFriends, FaUserShield, FaShieldAlt 
} from 'react-icons/fa';

const SiteStructureDiagram = () => {
  const [isVisible, setIsVisible] = useState(false);
  const diagramRef = useRef(null);

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

    if (diagramRef.current) {
      observer.observe(diagramRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const structureItems = [
    { name: 'Public', icon: <FaGlobe />, gradient: 'from-blue-400 to-cyan-400' },
    { name: 'Resident', icon: <FaUserFriends />, gradient: 'from-accent to-accent-light' },
    { name: 'Admin', icon: <FaUserShield />, gradient: 'from-purple-400 to-pink-400' },
    { name: 'Security', icon: <FaShieldAlt />, gradient: 'from-green-400 to-emerald-400' }
  ];

  return (
    <div 
      ref={diagramRef}
      className={`
        mt-16 glass-card p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500
        transform transition-all duration-1000
        ${isVisible ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 rotate-12'}
      `}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-accent/5 to-accent-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"></div>
      
      <div className="relative">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Site Structure{' '}
          <span className="gradient-text">Diagram</span>
        </h2>

        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-accent-light/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-accent to-accent-light px-8 py-4 rounded-full shadow-2xl shadow-accent/30 group-hover:scale-105 transition-transform duration-500">
              <span className="text-primary font-bold text-lg flex items-center gap-3">
                <FaBuilding className="text-xl" />
                SmartSociety
              </span>
            </div>
          </div>

          <div className="text-text-muted/30 animate-bounce">
            <FaArrowRight className="text-2xl rotate-90" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {structureItems.map((item, index) => (
              <div
                key={index}
                className={`
                  bg-primary-light/30 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10
                  hover:border-accent/50 transition-all duration-500
                  hover:-translate-y-2 hover:shadow-xl hover:shadow-accent/10
                  group/item relative overflow-hidden
                  transform transition-all duration-700
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                `}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover/item:opacity-10 transition-opacity duration-500`}></div>
                <div className="flex items-center justify-center gap-2 relative">
                  <span className={`text-xl bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium text-white group-hover/item:text-accent transition-colors duration-300">
                    {item.name}
                  </span>
                </div>
                <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${item.gradient} group-hover/item:w-full transition-all duration-700`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteStructureDiagram;