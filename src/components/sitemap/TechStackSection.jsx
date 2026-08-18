import React, { useEffect, useRef, useState } from 'react';
import { 
  FaCode, FaServer, FaDatabase, FaCloud, FaRocket 
} from 'react-icons/fa';
import { SiReact } from 'react-icons/si';

const TechStackSection = () => {
  const [isVisible, setIsVisible] = useState({});
  const techRefs = useRef([]);

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

    techRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const techStack = [
    { icon: <SiReact className="text-3xl" />, name: 'React 19', color: 'text-cyan-400' },
    { icon: <FaCode className="text-3xl" />, name: 'Tailwind CSS', color: 'text-blue-400' },
    { icon: <FaServer className="text-3xl" />, name: 'Node.js', color: 'text-green-400' },
    { icon: <FaDatabase className="text-3xl" />, name: 'MongoDB', color: 'text-emerald-400' },
    { icon: <FaCloud className="text-3xl" />, name: 'Cloud Ready', color: 'text-purple-400' },
    { icon: <FaRocket className="text-3xl" />, name: 'Fast Performance', color: 'text-accent' },
  ];

  return (
    <div className="mt-16 glass-card p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500">
      <div className="relative">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Technology{' '}
          <span className="gradient-text">Stack</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStack.map((tech, index) => (
            <div
              key={index}
              ref={(el) => techRefs.current[index] = el}
              data-index={index}
              className={`
                bg-primary-light/30 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-center
                hover:border-accent/50 transition-all duration-500
                hover:-translate-y-2 hover:shadow-xl hover:shadow-accent/10
                group/item relative overflow-hidden
                transform transition-all duration-700
                ${isVisible[index] ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-45'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-accent/0 group-hover/item:bg-accent/5 transition-all duration-500"></div>
              <div className={`${tech.color} group-hover/item:scale-110 transition-transform duration-500 relative`}>
                {tech.icon}
              </div>
              <p className="text-sm text-white/70 group-hover/item:text-white transition-colors duration-300 mt-2 relative">
                {tech.name}
              </p>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-accent-light group-hover/item:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackSection;