import React, { useState, useRef, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  lazy?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'https://via.placeholder.com/400x400?text=Loading...',
  lazy = true,
  priority = false,
  sizes = '100vw',
  quality = 75,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate optimized image URL (you can integrate with a service like Cloudinary)
  const getOptimizedSrc = (originalSrc: string) => {
    // For now, return original src
    // In production, you might want to use a service like:
    // - Cloudinary: `https://res.cloudinary.com/your-cloud/image/fetch/w_auto,f_auto,q_${quality}/${originalSrc}`
    // - ImageKit: `https://ik.imagekit.io/your-id/tr:w-auto,q-${quality}/${originalSrc}`
    return originalSrc;
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <LoadingSpinner size="medium" />
        </div>
      )}

      {/* Error placeholder */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm">Image not available</div>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={hasError ? placeholder : getOptimizedSrc(src)}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
        />
      )}
    </div>
  );
};

export default OptimizedImage;

