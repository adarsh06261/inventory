import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...', size = 'lg' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-purple-500/20 rounded-full animate-pulse`}></div>
        
        {/* Inner spinning element */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-purple-600 border-r-pink-600 rounded-full animate-spin`}></div>
        
        {/* Center sparkle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center">
        <p className={`${textSizeClasses[size]} font-medium text-white/90 mb-1`}>
          {text}
        </p>
        <p className="text-sm text-white/60">
          Please wait a moment...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 