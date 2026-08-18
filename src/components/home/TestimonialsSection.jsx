import React, { useEffect, useRef, useState } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const TestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState({});
  const testimonialRefs = useRef([]);

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

    testimonialRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: 'Hamza Hassan',
      flat: 'A-101',
      content: 'SmartSociety has transformed how we manage our community. The visitor management system is brilliant!',
      rating: 5
    },
    {
      name: 'Fatima Kaiser',
      flat: 'B-205',
      content: 'Paying maintenance bills and booking amenities has never been easier. Highly recommended!',
      rating: 5
    },
    {
      name: 'Yasir Habeeb',
      flat: 'C-302',
      content: 'The security features give us peace of mind. Love the QR code system for visitors!',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What{' '}
            <span className="gradient-text">Residents Say</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Real stories from our community members
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={(el) => testimonialRefs.current[index] = el}
              data-index={index}
              className={`
                glass-card p-8 relative group hover:-translate-y-2 transition-all duration-500 
                hover:shadow-2xl hover:shadow-accent/10
                transform transition-all duration-700
                ${isVisible[index] 
                  ? index % 2 === 0 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-0 opacity-100'
                  : index % 2 === 0 
                    ? '-translate-x-20 opacity-0' 
                    : 'translate-x-20 opacity-0'
                }
              `}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <FaQuoteLeft className="text-accent/20 text-4xl absolute top-4 right-4 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex text-accent mb-4 group-hover:scale-105 transition-transform duration-300">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="group-hover:animate-pulse" />
                ))}
              </div>
              <p className="text-text-muted mb-4 group-hover:text-white/80 transition-colors duration-300">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-bold text-white group-hover:text-accent transition-colors duration-300">
                  {testimonial.name}
                </p>
                <p className="text-text-muted text-sm">Flat {testimonial.flat}</p>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;