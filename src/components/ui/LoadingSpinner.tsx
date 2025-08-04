import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex justify-center items-center min-h-[200px] ${className}`}>
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} border-4 border-royal-200 border-t-royal-500 rounded-full animate-spin`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-infinity-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}