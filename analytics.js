// Privacy-focused analytics implementation for .NET Tools
// This file handles user analytics while respecting privacy

// Analytics configuration
const ANALYTICS_CONFIG = {
    // Replace with your actual Google Analytics 4 Measurement ID
    GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Change this to your actual ID
    
    // Privacy settings
    RESPECT_DNT: true, // Respect Do Not Track header
    ANONYMIZE_IP: true,
    DISABLE_ADVERTISING: true,
    
    // Event tracking
    TRACK_TOOL_USAGE: true,
    TRACK_PERFORMANCE: true,
    TRACK_ERRORS: true
};

// Check if analytics should be loaded
function shouldLoadAnalytics() {
    // Respect Do Not Track header
    if (ANALYTICS_CONFIG.RESPECT_DNT && navigator.doNotTrack === '1') {
        console.log('Analytics disabled: Do Not Track enabled');
        return false;
    }
    
    // Check if user has opted out (you can implement this)
    if (localStorage.getItem('analytics-opt-out') === 'true') {
        console.log('Analytics disabled: User opted out');
        return false;
    }
    
    return true;
}

// Initialize analytics
function initializeAnalytics() {
    if (!shouldLoadAnalytics()) {
        return;
    }
    
    // Load Google Analytics 4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    
    // Configure GA4 with privacy settings
    gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
        anonymize_ip: ANALYTICS_CONFIG.ANONYMIZE_IP,
        allow_google_signals: !ANALYTICS_CONFIG.DISABLE_ADVERTISING,
        allow_ad_personalization_signals: !ANALYTICS_CONFIG.DISABLE_ADVERTISING,
        cookie_flags: 'secure;samesite=lax'
    });
    
    // Make gtag available globally
    window.gtag = gtag;
    
    console.log('Analytics initialized with privacy settings');
}

// Track tool usage
function trackToolUsage(toolName, action = 'use') {
    if (!ANALYTICS_CONFIG.TRACK_TOOL_USAGE || !window.gtag) return;
    
    window.gtag('event', 'tool_usage', {
        tool_name: toolName,
        action: action,
        event_category: 'Tools',
        event_label: toolName
    });
}

// Track performance metrics
function trackPerformance() {
    if (!ANALYTICS_CONFIG.TRACK_PERFORMANCE || !window.gtag) return;
    
    // Track page load performance
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                window.gtag('event', 'page_load_time', {
                    value: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                    event_category: 'Performance'
                });
            }
        }, 1000);
    });
}

// Track JavaScript errors
function trackErrors() {
    if (!ANALYTICS_CONFIG.TRACK_ERRORS || !window.gtag) return;
    
    window.addEventListener('error', (event) => {
        window.gtag('event', 'javascript_error', {
            error_message: event.message,
            error_filename: event.filename,
            error_line: event.lineno,
            event_category: 'Errors'
        });
    });
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        window.gtag('event', 'unhandled_promise_rejection', {
            error_message: event.reason?.message || 'Unknown error',
            event_category: 'Errors'
        });
    });
}

// Track custom events
function trackEvent(eventName, parameters = {}) {
    if (!window.gtag) return;
    
    window.gtag('event', eventName, {
        event_category: 'Custom',
        ...parameters
    });
}

// Privacy functions
function optOutOfAnalytics() {
    localStorage.setItem('analytics-opt-out', 'true');
    
    // Disable GA4 if it's loaded
    if (window.gtag) {
        window.gtag('consent', 'update', {
            analytics_storage: 'denied'
        });
    }
    
    console.log('User opted out of analytics');
}

function optInToAnalytics() {
    localStorage.removeItem('analytics-opt-out');
    
    // Enable GA4 if it's loaded
    if (window.gtag) {
        window.gtag('consent', 'update', {
            analytics_storage: 'granted'
        });
    }
    
    // Reinitialize analytics if needed
    if (!window.gtag) {
        initializeAnalytics();
    }
    
    console.log('User opted in to analytics');
}

// Tool-specific tracking functions
const ToolAnalytics = {
    trackJsonToCsharp: () => trackToolUsage('JSON to C# Generator'),
    trackEntityGenerator: () => trackToolUsage('C# Entity Generator'),
    trackConnectionString: () => trackToolUsage('Connection String Builder'),
    trackGuidGenerator: () => trackToolUsage('GUID Generator'),
    trackCaseConverter: () => trackToolUsage('Case Converter'),
    trackDateTimeConverter: () => trackToolUsage('DateTime Converter'),
    trackBase64Converter: () => trackToolUsage('Base64 Converter'),
    trackColorConverter: () => trackToolUsage('Color Converter'),
    trackTextAnalytics: () => trackToolUsage('Text Analytics'),
    trackLoremGenerator: () => trackToolUsage('Lorem Ipsum Generator'),
    trackJsonFormatter: () => trackToolUsage('JSON Formatter'),
    trackRegexTester: () => trackToolUsage('Regex Tester'),
    trackPasswordGenerator: () => trackToolUsage('Password Generator'),
    trackHashGenerator: () => trackToolUsage('Hash Generator'),
    trackJwtDecoder: () => trackToolUsage('JWT Decoder'),
    trackQrGenerator: () => trackToolUsage('QR Code Generator'),
    trackUnitConverter: () => trackToolUsage('Unit Converter'),
    trackDateCalculator: () => trackToolUsage('Date Calculator'),
    trackRandomDataGenerator: () => trackToolUsage('Random Data Generator'),
    trackNumberBaseConverter: () => trackToolUsage('Number Base Converter'),
    trackTypeConverter: () => trackToolUsage('C# Type Converter'),
    trackLinqBuilder: () => trackToolUsage('LINQ Query Builder'),
    trackExtensionMethod: () => trackToolUsage('Extension Method Generator'),
    trackAsyncPattern: () => trackToolUsage('Async/Await Pattern Generator')
};

// Initialize analytics when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeAnalytics();
        trackPerformance();
        trackErrors();
    });
} else {
    initializeAnalytics();
    trackPerformance();
    trackErrors();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        trackToolUsage,
        trackEvent,
        optOutOfAnalytics,
        optInToAnalytics,
        ToolAnalytics
    };
} else {
    // Make available globally
    window.AnalyticsUtils = {
        trackToolUsage,
        trackEvent,
        optOutOfAnalytics,
        optInToAnalytics,
        ToolAnalytics
    };
}