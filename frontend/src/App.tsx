import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { preloadCriticalData } from './utils/apiCache';
import { initPerformanceMonitoring } from './utils/performance';
import './utils/performanceTest'; // Auto-run performance tests in development
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import HowWeWork from './components/HowWeWork';

import Contact from './components/Contact';
import Footer from './components/Footer';
import PopupManager from './components/PopupManager';
import FAQ from './components/FAQ';
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
    <>
      <Helmet>
        <title>Amber Global Trade - Premium Agricultural Export Company | Basmati Rice, Spices & Dry Fruits</title>
        <meta name="description" content="Leading agricultural export company specializing in premium Basmati rice, organic spices, dry fruits, and pulses. FSSAI certified, APEDA registered with global compliance. Get competitive quotes for your export needs." />
        <meta name="keywords" content="agricultural export, Basmati rice export, organic spices, dry fruits, pulses, FSSAI certified, APEDA registered, India export, premium quality, global compliance, export consultation" />
        <meta name="author" content="Amber Global Trade" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://amberglobaltrade.com" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Amber Global Trade - Premium Agricultural Export Company | Basmati Rice, Spices & Dry Fruits" />
        <meta property="og:description" content="Leading agricultural export company specializing in premium Basmati rice, organic spices, dry fruits, and pulses. FSSAI certified, APEDA registered with global compliance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amberglobaltrade.com" />
        <meta property="og:image" content="https://amberglobaltrade.com/assets/og-homepage.jpg" />
        <meta property="og:site_name" content="Amber Global Trade" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Amber Global Trade - Premium Agricultural Export Company" />
        <meta name="twitter:description" content="Leading agricultural export company specializing in premium Basmati rice, organic spices, dry fruits, and pulses." />
        <meta name="twitter:image" content="https://amberglobaltrade.com/assets/og-homepage.jpg" />
        <meta name="twitter:site" content="@AmberGlobal" />
        
        {/* JSON-LD Structured Data for Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Amber Global Trade",
            "alternateName": "Amber Global Export-Import Platform",
            "url": "https://amberglobaltrade.com",
            "logo": "https://amberglobaltrade.com/assets/logo.png",
            "description": "Leading agricultural export company specializing in premium Basmati rice, organic spices, dry fruits, and pulses with full compliance certification.",
            "foundingDate": "2020",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Bengaluru",
              "addressRegion": "Karnataka",
              "addressCountry": "India"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-7978801622",
              "contactType": "customer service",
              "email": "amberglobaltrade1@gmail.com",
              "availableLanguage": "English"
            },
            "sameAs": [
              "https://wa.me/917978801622"
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Agricultural Export Products",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Basmati Rice"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Organic Spices"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Dry Fruits"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Pulses"
                  }
                }
              ]
            }
          })}
        </script>
        
        {/* FAQ Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What certifications does Amber Global Trade have?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We are FSSAI certified, APEDA registered, ISO compliant, and have all necessary export licenses. Our products meet international quality standards for global export."
                }
              },
              {
                "@type": "Question",
                "name": "What is the minimum order quantity (MOQ) for your products?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our MOQ varies by product, typically starting from 100 KG for most agricultural products. We offer flexible quantities to meet both small and large-scale export requirements."
                }
              },
              {
                "@type": "Question",
                "name": "Which countries do you export to?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We export to 25+ countries worldwide including the Middle East, North America, Europe, and Asia. Our products are shipped globally with full compliance documentation."
                }
              },
              {
                "@type": "Question",
                "name": "How do you ensure product quality?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We maintain strict quality control through lab testing, proper storage facilities, and regular quality audits. All products undergo rigorous testing before export to ensure premium quality."
                }
              },
              {
                "@type": "Question",
                "name": "Do you provide private labeling services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we offer comprehensive private labeling services including custom packaging, branding, and labeling to help you build your own brand without owning manufacturing facilities."
                }
              }
            ]
          })}
        </script>
      </Helmet>
      
      <Hero />
      <Products isHome={true} />
      <HowWeWork />
      <About />
      <FAQ />
      <Contact />
    </>
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
      </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;