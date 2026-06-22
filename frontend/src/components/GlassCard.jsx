import React from 'react';

export default function GlassCard({ children, className = '', hoverLift = true }) {
  return (
    <div 
      className={`glass rounded-premium shadow-premium p-6 transition-all duration-300 ${
        hoverLift ? 'hover:shadow-premium-hover hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
