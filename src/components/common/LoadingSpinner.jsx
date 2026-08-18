import React from 'react';
import { FaBuilding } from 'react-icons/fa';

const LoadingSpinner = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-primary">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="absolute -inset-8 bg-gradient-to-r from-accent/20 to-accent-light/20 rounded-full blur-2xl animate-pulse"></div>
          
          <div className="relative inline-block">
            <div className="absolute -inset-3 rounded-full border-4 border-accent/20 animate-spin"></div>
            <div className="absolute -inset-3 rounded-full border-4 border-transparent border-t-accent animate-spin" style={{ animationDuration: '1.5s' }}></div>
            
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accent to-accent-light flex items-center justify-center relative z-10 animate-pulse">
              <FaBuilding className="text-primary text-3xl animate-bounce" />
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold gradient-text mb-2">
          Loading SmartSociety
        </h3>

        <div className="flex justify-center gap-1 mt-2">
          <span className="inline-block w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="inline-block w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="inline-block w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;