import React from 'react';

export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`glass-card rounded-2xl p-5 sm:p-6 transition-all duration-200 ${
        hover ? 'hover:-translate-y-1 hover:shadow-xl cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
