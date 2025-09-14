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
  showBackendStatus = true 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'connecting' | 'connected' | 'slow' | 'error'>('connecting');
  const [connectionTime, setConnectionTime] = useState(0);

  useEffect(() => {
    const unsubscribe = onLoadingStateChange(setIsLoading);
    
    // Check backend status
    if (showBackendStatus) {
      checkBackendStatus();
    }

    return unsubscribe;
  }, [showBackendStatus]);

  const checkBackendStatus = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch('/api/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        const time = Date.now() - startTime;
        setConnectionTime(time);
        
        if (time < 1000) {
          setBackendStatus('connected');
        } else if (time < 3000) {
          setBackendStatus('slow');
        } else {
          setBackendStatus('slow');
        }
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      setBackendStatus('error');
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-4 h-4';
      case 'large': return 'w-12 h-12';
      default: return 'w-8 h-8';
    }
  };

  const getBackendStatusMessage = () => {
    switch (backendStatus) {
      case 'connecting':
        return 'Connecting to server...';
      case 'connected':
        return `Connected (${connectionTime}ms)`;
      case 'slow':
        return `Slow connection (${connectionTime}ms) - Please wait`;
      case 'error':
        return 'Connection failed - Retrying...';
      default:
        return '';
    }
  };

  const getBackendStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return 'text-green-600';
      case 'slow': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  if (!isLoading && !showBackendStatus) return null;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Main Spinner */}
      <div className={`${getSizeClasses()} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mb-4`}></div>
      
      {/* Loading Message */}
      <p className="text-gray-600 text-sm mb-2">{message}</p>
      
      {/* Backend Status */}
      {showBackendStatus && (
        <div className="text-center">
          <p className={`text-xs ${getBackendStatusColor()} font-medium`}>
            {getBackendStatusMessage()}
          </p>
          
          {/* Progress Bar for Slow Connections */}
          {backendStatus === 'slow' && (
            <div className="w-32 h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
          )}
          
          {/* Retry Button for Errors */}
          {backendStatus === 'error' && (
            <button
              onClick={checkBackendStatus}
              className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry Connection
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;