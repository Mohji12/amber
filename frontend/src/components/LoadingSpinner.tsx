import React, { useState, useEffect } from 'react';
import { getLoadingState, onLoadingStateChange } from '../api';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showBackendStatus?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = 'medium',
  showBackendStatus = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onLoadingStateChange(setIsLoading);
    return unsubscribe;
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-4 h-4';
      case 'large': return 'w-12 h-12';
      default: return 'w-8 h-8';
    }
  };

  if (!isLoading && !showBackendStatus) return null;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Main Spinner */}
      <div className={`${getSizeClasses()} animate-spin rounded-full border-2 border-gray-200 border-t-emerald-500 mb-4`}></div>
      
      {/* Loading Message */}
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default LoadingSpinner;