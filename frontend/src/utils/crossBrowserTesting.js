// Cross-browser testing utilities and compatibility checks

/**
 * Browser feature detection and compatibility utilities
 */
export const browserSupport = {
  // CSS Features
  supportsGrid: () => {
    return CSS.supports('display', 'grid');
  },

  supportsFlexbox: () => {
    return CSS.supports('display', 'flex');
  },

  supportsCustomProperties: () => {
    return CSS.supports('color', 'var(--test)');
  },

  supportsBackdropFilter: () => {
    return CSS.supports('backdrop-filter', 'blur(10px)') || 
           CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
  },

  supportsClipPath: () => {
    return CSS.supports('clip-path', 'circle(50%)');
  },

  // JavaScript Features
  supportsIntersectionObserver: () => {
    return 'IntersectionObserver' in window;
  },

  supportsResizeObserver: () => {
    return 'ResizeObserver' in window;
  },

  supportsWebP: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('webp') > -1;
  },

  supportsAvif: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('avif') > -1;
  },

  supportsWebGL: () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
               (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  },

  // Touch and Input
  supportsTouchEvents: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  supportsPointerEvents: () => {
    return 'onpointerdown' in window;
  },

  // Storage
  supportsLocalStorage: () => {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  supportsSessionStorage: () => {
    try {
      const test = 'test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Network
  supportsServiceWorker: () => {
    return 'serviceWorker' in navigator;
  },

  supportsFetch: () => {
    return 'fetch' in window;
  }
};

/**
 * Browser identification (use sparingly, prefer feature detection)
 */
export const browserInfo = {
  getUserAgent: () => navigator.userAgent,

  isChrome: () => {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  },

  isFirefox: () => {
    return /Firefox/.test(navigator.userAgent);
  },

  isSafari: () => {
    return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
  },

  isEdge: () => {
    return /Edg/.test(navigator.userAgent);
  },

  isIE: () => {
    return /MSIE|Trident/.test(navigator.userAgent);
  },

  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  isIOS: () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  isAndroid: () => {
    return /Android/.test(navigator.userAgent);
  },

  getVersion: () => {
    const ua = navigator.userAgent;
    let version = 'Unknown';

    if (browserInfo.isChrome()) {
      const match = ua.match(/Chrome\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (browserInfo.isFirefox()) {
      const match = ua.match(/Firefox\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (browserInfo.isSafari()) {
      const match = ua.match(/Version\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (browserInfo.isEdge()) {
      const match = ua.match(/Edg\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    }

    return version;
  }
};

/**
 * Polyfill loader for missing features
 */
export const polyfillLoader = {
  async loadIntersectionObserver() {
    if (!browserSupport.supportsIntersectionObserver()) {
      await import('intersection-observer');
    }
  },

  async loadResizeObserver() {
    if (!browserSupport.supportsResizeObserver()) {
      const { default: ResizeObserver } = await import('resize-observer-polyfill');
      window.ResizeObserver = ResizeObserver;
    }
  },

  async loadFetch() {
    if (!browserSupport.supportsFetch()) {
      await import('whatwg-fetch');
    }
  },

  async loadAll() {
    await Promise.all([
      this.loadIntersectionObserver(),
      this.loadResizeObserver(),
      this.loadFetch()
    ]);
  }
};

/**
 * CSS fallbacks and progressive enhancement
 */
export const cssEnhancements = {
  // Add CSS classes based on feature support
  addFeatureClasses: () => {
    const html = document.documentElement;
    
    // Grid support
    if (browserSupport.supportsGrid()) {
      html.classList.add('supports-grid');
    } else {
      html.classList.add('no-grid');
    }

    // Flexbox support
    if (browserSupport.supportsFlexbox()) {
      html.classList.add('supports-flexbox');
    } else {
      html.classList.add('no-flexbox');
    }

    // Custom properties support
    if (browserSupport.supportsCustomProperties()) {
      html.classList.add('supports-custom-properties');
    } else {
      html.classList.add('no-custom-properties');
    }

    // Backdrop filter support
    if (browserSupport.supportsBackdropFilter()) {
      html.classList.add('supports-backdrop-filter');
    } else {
      html.classList.add('no-backdrop-filter');
    }

    // Touch support
    if (browserSupport.supportsTouchEvents()) {
      html.classList.add('touch');
    } else {
      html.classList.add('no-touch');
    }
  },

  // Generate fallback CSS
  generateFallbackCSS: () => {
    const fallbacks = [];

    // Backdrop filter fallback
    if (!browserSupport.supportsBackdropFilter()) {
      fallbacks.push(`
        .backdrop-blur-lg {
          background-color: rgba(255, 255, 255, 0.9) !important;
        }
      `);
    }

    // Grid fallback
    if (!browserSupport.supportsGrid()) {
      fallbacks.push(`
        .grid {
          display: flex;
          flex-wrap: wrap;
        }
        .grid > * {
          flex: 1;
          min-width: 200px;
        }
      `);
    }

    // Custom properties fallback
    if (!browserSupport.supportsCustomProperties()) {
      fallbacks.push(`
        .bg-gradient-to-r.from-\\[\\#00E5A0\\].to-\\[\\#00C4CC\\] {
          background: linear-gradient(to right, #00E5A0, #00C4CC);
        }
      `);
    }

    if (fallbacks.length > 0) {
      const style = document.createElement('style');
      style.textContent = fallbacks.join('\n');
      document.head.appendChild(style);
    }
  }
};

/**
 * Performance testing across browsers
 */
export const performanceTesting = {
  // Measure rendering performance
  measureRenderTime: (componentName, renderFn) => {
    const start = performance.now();
    const result = renderFn();
    const end = performance.now();
    
    const renderTime = end - start;
    
    // Log performance data with browser info
    console.log(`${componentName} render time:`, {
      time: `${renderTime.toFixed(2)}ms`,
      browser: `${browserInfo.isChrome() ? 'Chrome' : browserInfo.isFirefox() ? 'Firefox' : browserInfo.isSafari() ? 'Safari' : 'Other'} ${browserInfo.getVersion()}`,
      mobile: browserInfo.isMobile()
    });
    
    return result;
  },

  // Test animation performance
  testAnimationPerformance: () => {
    const testElement = document.createElement('div');
    testElement.style.cssText = `
      position: fixed;
      top: -100px;
      left: -100px;
      width: 100px;
      height: 100px;
      background: red;
      transition: transform 1s;
    `;
    document.body.appendChild(testElement);

    const start = performance.now();
    let frameCount = 0;

    const animate = () => {
      frameCount++;
      testElement.style.transform = `translateX(${frameCount}px)`;
      
      if (frameCount < 60) {
        requestAnimationFrame(animate);
      } else {
        const end = performance.now();
        const fps = 60000 / (end - start);
        
        console.log('Animation performance:', {
          fps: fps.toFixed(2),
          browser: browserInfo.getUserAgent(),
          mobile: browserInfo.isMobile()
        });
        
        document.body.removeChild(testElement);
      }
    };

    requestAnimationFrame(animate);
  },

  // Memory usage testing
  testMemoryUsage: () => {
    if (performance.memory) {
      const memory = performance.memory;
      console.log('Memory usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
        browser: browserInfo.getUserAgent()
      });
    }
  }
};

/**
 * Automated cross-browser testing utilities
 */
export const automatedTesting = {
  // Run feature detection tests
  runFeatureTests: () => {
    const results = {};
    
    Object.keys(browserSupport).forEach(feature => {
      results[feature] = browserSupport[feature]();
    });
    
    console.log('Browser feature support:', results);
    return results;
  },

  // Test critical functionality
  testCriticalFeatures: () => {
    const critical = [
      'supportsFlexbox',
      'supportsCustomProperties',
      'supportsLocalStorage',
      'supportsFetch'
    ];
    
    const failures = critical.filter(feature => !browserSupport[feature]());
    
    if (failures.length > 0) {
      console.warn('Critical features not supported:', failures);
      return false;
    }
    
    return true;
  },

  // Generate compatibility report
  generateCompatibilityReport: () => {
    const report = {
      browser: {
        name: browserInfo.isChrome() ? 'Chrome' : 
              browserInfo.isFirefox() ? 'Firefox' : 
              browserInfo.isSafari() ? 'Safari' : 
              browserInfo.isEdge() ? 'Edge' : 'Unknown',
        version: browserInfo.getVersion(),
        mobile: browserInfo.isMobile(),
        userAgent: browserInfo.getUserAgent()
      },
      features: {},
      performance: {},
      recommendations: []
    };

    // Test all features
    Object.keys(browserSupport).forEach(feature => {
      report.features[feature] = browserSupport[feature]();
    });

    // Performance tests
    if (performance.memory) {
      report.performance.memory = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
      };
    }

    // Generate recommendations
    if (!report.features.supportsBackdropFilter) {
      report.recommendations.push('Consider using solid backgrounds instead of backdrop-filter');
    }
    
    if (!report.features.supportsGrid) {
      report.recommendations.push('Use flexbox fallbacks for grid layouts');
    }
    
    if (report.browser.mobile) {
      report.recommendations.push('Optimize touch interactions and reduce animations');
    }

    return report;
  }
};

/**
 * Initialize cross-browser compatibility
 */
export const initializeCrossBrowserSupport = async () => {
  // Load necessary polyfills
  await polyfillLoader.loadAll();
  
  // Add feature detection classes
  cssEnhancements.addFeatureClasses();
  
  // Generate fallback CSS
  cssEnhancements.generateFallbackCSS();
  
  // Run compatibility tests in development
  if (process.env.NODE_ENV === 'development') {
    automatedTesting.runFeatureTests();
    const report = automatedTesting.generateCompatibilityReport();
    console.log('Browser compatibility report:', report);
  }
};