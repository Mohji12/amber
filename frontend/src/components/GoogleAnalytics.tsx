import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Google Analytics Page View Tracker
 * 
 * This component automatically tracks page views for all routes in the React SPA.
 * It sends page_view events to Google Analytics whenever the route changes.
 * 
 * The Google Analytics tag (gtag.js) is already loaded in index.html,
 * this component ensures all route changes are tracked.
 */
const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Ensure gtag is available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // Track page view with current path
      (window as any).gtag('config', 'AW-17856522569', {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, [location]);

  // This component doesn't render anything
  return null;
};

export default GoogleAnalytics;

