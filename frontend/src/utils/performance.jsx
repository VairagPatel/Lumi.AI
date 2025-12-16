// Performance optimization utilities

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import React from 'react';

/**
 * Debounce hook for performance optimization
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

/**
 * Throttle hook for performance optimization
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled function
 */
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

/**
 * Intersection Observer hook for lazy loading
 * @param {Object} options - Intersection Observer options
 * @returns {Array} - [ref, isIntersecting]
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [options]);
  
  return [ref, isIntersecting];
};

/**
 * Memoized component wrapper for expensive renders
 */
export const withMemo = (Component, areEqual) => {
  return React.memo(Component, areEqual);
};

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  // Measure component render time
  measureRender: (componentName, renderFn) => {
    const start = performance.now();
    const result = renderFn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time: ${end - start}ms`);
    }
    
    return result;
  },
  
  // Measure function execution time
  measureFunction: (functionName, fn) => {
    return (...args) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${functionName} execution time: ${end - start}ms`);
      }
      
      return result;
    };
  },
  
  // Report Core Web Vitals
  reportWebVitals: (metric) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(metric);
    }
    
    // In production, send to analytics
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics
      // gtag('event', metric.name, {
      //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      //   event_label: metric.id,
      //   non_interaction: true,
      // });
    }
  }
};

/**
 * Image optimization utilities
 */
export const imageOptimization = {
  // Lazy load images
  LazyImage: ({ src, alt, className, ...props }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [imageRef, isIntersecting] = useIntersectionObserver({
      threshold: 0.1,
      rootMargin: '50px'
    });
    
    useEffect(() => {
      if (isIntersecting && src) {
        setImageSrc(src);
      }
    }, [isIntersecting, src]);
    
    return (
      <img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        className={className}
        loading="lazy"
        {...props}
      />
    );
  },
  
  // Preload critical images
  preloadImage: (src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }
};

/**
 * Animation performance utilities
 */
export const animationOptimization = {
  // Use transform instead of changing layout properties
  optimizedTransform: {
    translateX: (value) => ({ transform: `translateX(${value}px)` }),
    translateY: (value) => ({ transform: `translateY(${value}px)` }),
    scale: (value) => ({ transform: `scale(${value})` }),
    rotate: (value) => ({ transform: `rotate(${value}deg)` })
  },
  
  // Reduce motion for users who prefer it
  respectsReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  // Optimized animation variants for Framer Motion
  getOptimizedVariants: (baseVariants) => {
    const reducedMotion = animationOptimization.respectsReducedMotion();
    
    if (reducedMotion) {
      // Return variants with no animation
      return Object.keys(baseVariants).reduce((acc, key) => {
        acc[key] = { ...baseVariants[key], transition: { duration: 0 } };
        return acc;
      }, {});
    }
    
    return baseVariants;
  }
};

/**
 * Bundle size optimization utilities
 */
export const bundleOptimization = {
  // Dynamic import wrapper
  lazyImport: (importFn) => {
    return React.lazy(importFn);
  },
  
  // Code splitting helper
  createAsyncComponent: (importFn, fallback = null) => {
    const Component = React.lazy(importFn);
    
    return (props) => (
      <React.Suspense fallback={fallback}>
        <Component {...props} />
      </React.Suspense>
    );
  }
};

/**
 * Memory optimization utilities
 */
export const memoryOptimization = {
  // Cleanup event listeners
  useEventListener: (eventName, handler, element = window) => {
    const savedHandler = useRef();
    
    useEffect(() => {
      savedHandler.current = handler;
    }, [handler]);
    
    useEffect(() => {
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;
      
      const eventListener = (event) => savedHandler.current(event);
      element.addEventListener(eventName, eventListener);
      
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    }, [eventName, element]);
  },
  
  // Cleanup timeouts and intervals
  useTimeout: (callback, delay) => {
    const timeoutRef = useRef(null);
    const savedCallback = useRef(callback);
    
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
    
    useEffect(() => {
      const tick = () => savedCallback.current();
      
      if (delay !== null) {
        timeoutRef.current = setTimeout(tick, delay);
        return () => clearTimeout(timeoutRef.current);
      }
    }, [delay]);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }
};

/**
 * Cross-browser compatibility utilities
 */
export const browserCompatibility = {
  // Feature detection
  supportsWebP: () => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('webp') > -1;
  },
  
  supportsIntersectionObserver: () => {
    return 'IntersectionObserver' in window;
  },
  
  supportsCustomProperties: () => {
    return window.CSS && CSS.supports('color', 'var(--fake-var)');
  },
  
  // Polyfill loader
  loadPolyfills: async () => {
    // Modern browsers support these APIs natively
    // If polyfills are needed, install them separately:
    // npm install intersection-observer resize-observer-polyfill
    console.log('Polyfill loading skipped - using native browser APIs');
  },
  
  // Browser detection (use sparingly)
  getBrowserInfo: () => {
    const ua = navigator.userAgent;
    const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor);
    const isFirefox = /Firefox/.test(ua);
    const isSafari = /Safari/.test(ua) && /Apple Computer/.test(navigator.vendor);
    const isEdge = /Edg/.test(ua);
    
    return { isChrome, isFirefox, isSafari, isEdge };
  }
};

/**
 * Performance budget monitoring
 */
export const performanceBudget = {
  // Monitor bundle size
  checkBundleSize: () => {
    if (process.env.NODE_ENV === 'development') {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      let totalSize = 0;
      
      scripts.forEach(script => {
        fetch(script.src, { method: 'HEAD' })
          .then(response => {
            const size = response.headers.get('content-length');
            if (size) {
              totalSize += parseInt(size);
              console.log(`Bundle size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
            }
          })
          .catch(() => {
            // Ignore errors for external scripts
          });
      });
    }
  },
  
  // Monitor memory usage
  checkMemoryUsage: () => {
    if (performance.memory) {
      const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
      
      console.log({
        used: `${(usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        total: `${(totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
      });
    }
  }
};