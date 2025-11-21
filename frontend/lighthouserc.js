module.exports = {
  ci: {
    collect: {
      // URL to audit
      url: ['http://localhost:3000', 'http://localhost:3000/login', 'http://localhost:3000/products/1'],
      
      // Number of runs per URL
      numberOfRuns: 3,
      
      // Collect settings
      settings: {
        preset: 'desktop',
        // Chrome flags
        chromeFlags: '--no-sandbox --disable-gpu',
      },
    },
    
    upload: {
      target: 'temporary-public-storage',
    },
    
    assert: {
      // Minimum scores (0-1 scale, multiply by 100 for percentage)
      assertions: {
        // Performance
        'categories:performance': ['error', { minScore: 0.9 }],
        
        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.9 }],
        
        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.9 }],
        
        // SEO
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Specific metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // PWA is optional
        'categories:pwa': 'off',
      },
    },
  },
}
