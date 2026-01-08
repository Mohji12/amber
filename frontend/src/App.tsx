import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Location } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { preloadCriticalData } from './utils/apiCache';
import { initPerformanceMonitoring } from './utils/performance';
// Performance tests are disabled by default - enable via VITE_ENABLE_PERFORMANCE_TESTS=true
// import './utils/performanceTest';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import HowWeWork from './components/HowWeWork';

import Contact from './components/Contact';
import Footer from './components/Footer';
import PopupManager from './components/PopupManager';
import FAQ from './components/FAQ';
import CompleteSEO from './components/SEO/CompleteSEO';
import { useSEO } from './hooks/useSEO';
import WhatsAppButton from './components/WhatsAppButton';
// Use lazy loading for better performance
import {
  LazyProductsPage,
  LazyLoginPage,
  LazySignupPage,
  LazyProfilePage,
  LazyProfileBusiness,
  LazyProfileQuotation,
  LazyProfileOrders,
  LazyBlogsPage,
  LazyAdminPage,
  LazyAdminDashboard,
  LazyAdminProducts,
  LazyAdminCategories,
  LazyAdminSubcategories,
  LazyAdminBlogs,
  LazyAdminAnalytics,
  LazyAdminEnquiries,
  LazyProductDetailPage,
  LazySubcategoryDetailPage,
  LazyContactPage,
  LazyQuotePage
} from './components/LazyRoutes';
import AdminLayout from './components/AdminLayout';
import BlogRouter from './components/BlogRouter';
import About from './components/About';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { LazyOtpTestPage } from './components/LazyRoutes';
import NotFoundPage from './pages/NotFoundPage';
import GoogleAnalytics from './components/GoogleAnalytics';

// Constants
const SCROLL_DELAY_MS = 300; // Delay before scrolling to allow DOM to render
const MAX_SESSIONS_STORED = 50; // Maximum number of sessions to keep in localStorage
const SESSION_CLEANUP_DAYS = 7; // Clean up sessions older than 7 days

// TypeScript interfaces
interface LocationState {
  scrollTo?: string;
}

interface AppUsageData {
  [date: string]: {
    visits: number;
    lastVisit: string;
  };
}

interface SessionData {
  session_id: string;
  start_time: string;
  page_url: string;
  user_agent: string;
}

// Helper function for safe localStorage operations
const safeLocalStorageGet = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Failed to read from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const safeLocalStorageSet = (key: string, value: unknown): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to write to localStorage key "${key}":`, error);
    return false;
  }
};

// Clean up old sessions to prevent memory leak
const cleanupOldSessions = (sessions: SessionData[]): SessionData[] => {
  const now = Date.now();
  const cutoffTime = now - (SESSION_CLEANUP_DAYS * 24 * 60 * 60 * 1000);
  
  return sessions
    .filter(session => {
      const sessionTime = new Date(session.start_time).getTime();
      return sessionTime > cutoffTime;
    })
    .slice(-MAX_SESSIONS_STORED); // Keep only the most recent N sessions
};

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function HomeWithScroll() {
  const location = useLocation() as Location<LocationState>;
  const { seoData, loading, error } = useSEO('homepage');
  
  React.useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.scrollTo) {
      const el = document.getElementById(state.scrollTo);
      if (el) {
        const timeoutId = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, SCROLL_DELAY_MS);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [location]);
  
  // Show loading state while SEO data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading..." />
      </div>
    );
  }
  
  // Show error state if SEO fetch failed, but still render content
  if (error) {
    console.warn('Failed to load SEO data:', error);
  }
  
  return (
    <CompleteSEO seoData={seoData}>
      <Hero />
      <Products isHome={true} />
      <HowWeWork />
      <About />
      <FAQ />
      <Contact />
    </CompleteSEO>
  );
}

function App() {
  // Combined initialization and tracking effect
  useEffect(() => {
    // Preload critical data and initialize performance monitoring
    preloadCriticalData();
    initPerformanceMonitoring();

    // Global tracking for user engagement with error handling and cleanup
    const trackGlobalEngagement = () => {
      try {
        const currentTime = new Date().toISOString();
        const currentDate = new Date().toDateString();
        
        // Track overall app usage with error handling
        const appUsage = safeLocalStorageGet<AppUsageData>('appUsage', {});
        
        if (!appUsage[currentDate]) {
          appUsage[currentDate] = {
            visits: 0,
            lastVisit: currentTime
          };
        }
        
        appUsage[currentDate].visits += 1;
        appUsage[currentDate].lastVisit = currentTime;
        safeLocalStorageSet('appUsage', appUsage);
        
        // Track session start with cleanup to prevent memory leak
        const sessionId = `session_${Date.now()}`;
        const sessionData: SessionData = {
          session_id: sessionId,
          start_time: currentTime,
          page_url: window.location.href,
          user_agent: navigator.userAgent
        };
        
        const activeSessions = safeLocalStorageGet<SessionData[]>('activeSessions', []);
        activeSessions.push(sessionData);
        
        // Clean up old sessions to prevent localStorage from growing indefinitely
        const cleanedSessions = cleanupOldSessions(activeSessions);
        safeLocalStorageSet('activeSessions', cleanedSessions);
      } catch (error) {
        console.warn('Failed to track user engagement:', error);
      }
    };
    
    trackGlobalEngagement();
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <ErrorBoundary>
          <ScrollToTop />
          <GoogleAnalytics />
          <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeWithScroll />} />
            <Route path="/products" element={<LazyProductsPage />} />
            <Route path="/products/:slug" element={<LazyProductDetailPage />} />
            <Route path="/subcategories/:slug" element={<LazySubcategoryDetailPage />} />
            <Route path="/blogs" element={<LazyBlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogRouter />} />
            <Route path="/contact" element={<LazyContactPage />} />
            <Route path="/quote" element={<LazyQuotePage />} />
            <Route path="/login" element={<LazyLoginPage />} />
            <Route path="/signup" element={<LazySignupPage />} />
            <Route path="/otp-test" element={<LazyOtpTestPage />} />
            
            {/* Admin Routes - Protected */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<LazyAdminPage />} />
              <Route path="dashboard" element={<LazyAdminDashboard />} />
              <Route path="products" element={<LazyAdminProducts />} />
              <Route path="categories" element={<LazyAdminCategories />} />
              <Route path="subcategories" element={<LazyAdminSubcategories />} />
              <Route path="blogs" element={<LazyAdminBlogs />} />
              <Route path="analytics" element={<LazyAdminAnalytics />} />
              <Route path="enquiries" element={<LazyAdminEnquiries />} />
            </Route>
            
            {/* Profile Routes - Protected */}
            <Route path="/profile/*" element={<LazyProfilePage />}>
              <Route index element={<Navigate to="business" replace />} />
              <Route path="business" element={<LazyProfileBusiness />} />
              <Route path="quotation" element={<LazyProfileQuotation />} />
              <Route path="orders" element={<LazyProfileOrders />} />
            </Route>
            
            {/* 404 Catch-all Route - Must be last */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
          <PopupManager />
          <WhatsAppButton />
        </div>
        </ErrorBoundary>
      </Router>
    </HelmetProvider>
  );
}

export default App;