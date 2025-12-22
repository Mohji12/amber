import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  LazySubcategoryDetailPage
} from './components/LazyRoutes';
import AdminLayout from './components/AdminLayout';
import BlogRouter from './components/BlogRouter';
import ContactPage from './pages/ContactPage';
import OtpTestPage from './pages/OtpTestPage';
import About from './components/About';
import AdminRoute from './components/AdminRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function HomeWithScroll() {
  const location = useLocation();
  const { seoData } = useSEO('homepage');
  
  React.useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 300); // wait for DOM
      }
    }
  }, [location]);
  
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
  // Preload critical data on app start
  useEffect(() => {
    preloadCriticalData();
    initPerformanceMonitoring();
  }, []);

  // Global tracking for user engagement
  React.useEffect(() => {
    const trackGlobalEngagement = () => {
      const currentTime = new Date().toISOString();
      
      // Track overall app usage
      const appUsage = JSON.parse(localStorage.getItem('appUsage') || '{}');
      const currentDate = new Date().toDateString();
      
      if (!appUsage[currentDate]) {
        appUsage[currentDate] = {
          visits: 0,
          lastVisit: currentTime
        };
      }
      
      appUsage[currentDate].visits += 1;
      appUsage[currentDate].lastVisit = currentTime;
      localStorage.setItem('appUsage', JSON.stringify(appUsage));
      
      // Track session start
      const sessionId = `session_${Date.now()}`;
      const sessionData = {
        session_id: sessionId,
        start_time: currentTime,
        page_url: window.location.href,
        user_agent: navigator.userAgent
      };
      
      const activeSessions = JSON.parse(localStorage.getItem('activeSessions') || '[]');
      activeSessions.push(sessionData);
      localStorage.setItem('activeSessions', JSON.stringify(activeSessions));
    };
    
    trackGlobalEngagement();
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<HomeWithScroll />} />
          <Route path="/products" element={<LazyProductsPage />} />
          <Route path="/products/:id" element={<LazyProductDetailPage />} />
          <Route path="/subcategories/:id" element={<LazySubcategoryDetailPage />} />
          <Route path="/blogs" element={<LazyBlogsPage />} />
          <Route path="/blogs/:slug" element={<BlogRouter />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LazyLoginPage />} />
          <Route path="/signup" element={<LazySignupPage />} />
          <Route path="/otp-test" element={<OtpTestPage />} />
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
          <Route path="/profile/*" element={<LazyProfilePage />}>
            <Route index element={<Navigate to="business" replace />} />
            <Route path="business" element={<LazyProfileBusiness />} />
            <Route path="quotation" element={<LazyProfileQuotation />} />
            <Route path="orders" element={<LazyProfileOrders />} />
          </Route>
        </Routes>
        <Footer />
        <PopupManager />
        <WhatsAppButton />
      </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;