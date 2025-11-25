
import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, AlertTriangle } from 'lucide-react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: string; // e.g., "16/9", "1/1"
  containerClassName?: string;
}

const SmartImage: React.FC<SmartImageProps> = ({ src, alt, className, containerClassName, aspectRatio, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Logic: Lazy Load with Intersection Observer
  // Only fetch image bytes when user is scrolling near it.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); 
        }
      },
      { rootMargin: '400px' } // Preload significantly earlier for seamless feel
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-[#111827] ${containerClassName || ''} ${className}`} 
      style={aspectRatio ? { aspectRatio } : {}}
    >
      {/* 1. Premium Shimmer Loading State (Visible until loaded) */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute inset-0 bg-[#1e293b]"></div>
            <div className="animate-shimmer"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <ImageIcon className="w-8 h-8 text-white" />
            </div>
        </div>
      )}
      
      {/* 2. Error State (Graceful fallback) */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0f172a] text-gray-500 flex-col p-4 text-center border border-white/5">
          <AlertTriangle className="mb-2 w-6 h-6 opacity-50 text-rose-500" />
          <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">Image Lost</span>
        </div>
      )}

      {/* 3. Actual Image (Scale & Blur-up effect) */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-700 ease-out will-change-transform ${isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-xl'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          loading="lazy" 
          {...props}
        />
      )}
    </div>
  );
};

export default SmartImage;
