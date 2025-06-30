import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-900/60 backdrop-blur-md rounded-lg shadow-2xl p-6 border border-white/10 transition-all duration-300 hover:border-brand-accent/50 hover:shadow-2xl hover:shadow-brand-accent/20 ${className}`}>
      {children}
    </div>
  );
};

export default Card;