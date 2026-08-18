import React, { useEffect, useRef, useState } from 'react';
import { 
  FaSwimmingPool, FaDumbbell, FaParking, 
  FaTshirt, FaUtensils, FaWifi 
} from 'react-icons/fa';

const AmenitiesSection = () => {
  const [isVisible, setIsVisible] = useState({});
  const amenityRefs = useRef([]);

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

    amenityRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const amenities = [
    { icon: <FaSwimmingPool />, name: 'Swimming Pool', color: 'from-cyan-400 to-blue-400' },
    { icon: <FaDumbbell />, name: 'Gymnasium', color: 'from-red-400 to-orange-400' },
    { icon: <FaParking />, name: 'Parking', color: 'from-green-400 to-emerald-400' },
    { icon: <FaTshirt />, name: 'Laundry', color: 'from-purple-400 to-violet-400' },
    { icon: <FaUtensils />, name: 'Community Kitchen', color: 'from-yellow-400 to-orange-400' },
    { icon: <FaWifi />, name: 'Wi-Fi Lounge', color: 'from-indigo-400 to-blue-400' }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our{' '}
            <span className="gradient-text">Amenities</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            World-class facilities for our residents
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              ref={(el) => amenityRefs.current[index] = el}
              data-index={index}
              className={`
                glass-card p-6 text-center hover:border-accent/50 transition-all duration-500 
                hover:transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-accent/10 
                group cursor-default relative overflow-hidden
                transform transition-all duration-700
                ${isVisible[index] ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-45'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${amenity.color} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>
              <div className="absolute -inset-1 bg-accent/0 group-hover:bg-accent/5 rounded-2xl blur-xl transition-all duration-500"></div>
              <div className="text-3xl text-accent mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative">
                {amenity.icon}
              </div>
              <p className="text-sm font-medium group-hover:text-accent transition-colors duration-300 relative">
                {amenity.name}
              </p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-accent to-accent-light group-hover:w-3/4 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;