import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Users, Sparkles, Globe, Award, Truck, Shield } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import InteractiveButton from './InteractiveButton';
import agri1 from '../assets/agri1.mp4';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Parallax effect for background elements
  const parallaxOffset = scrollY * 0.5;

  return (
    <section ref={heroRef} className="pt-24 pb-16 min-h-screen flex items-center relative overflow-hidden hero-no-shadow">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://jgi-menteetrackers.s3.ap-south-1.amazonaws.com/agri1.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-green-200/30 to-emerald-200/30 rounded-full blur-3xl animate-float"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
            transform: `translateY(${parallaxOffset * 0.3}px)`,
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-emerald-200/20 to-green-200/20 rounded-full blur-2xl animate-float"
          style={{
            right: `${mousePosition.x * 0.01}px`,
            bottom: `${mousePosition.y * 0.01}px`,
            animationDelay: '1s',
            transform: `translateY(${parallaxOffset * 0.2}px)`,
          }}
        />
        {/* Additional floating elements */}
        <div 
          className="absolute w-32 h-32 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-full blur-xl animate-float"
          style={{
            left: '20%',
            top: '30%',
            animationDelay: '2s',
            transform: `translateY(${parallaxOffset * 0.1}px)`,
          }}
        />
        <div 
          className="absolute w-48 h-48 bg-gradient-to-r from-blue-200/15 to-purple-200/15 rounded-full blur-2xl animate-float"
          style={{
            right: '15%',
            top: '60%',
            animationDelay: '3s',
            transform: `translateY(${parallaxOffset * 0.4}px)`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex justify-center">
        <div className="w-full flex flex-col items-center text-center">
          {/* Enhanced Left Content with staggered animations */}
          <AnimatedSection animation="fadeInLeft" className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight relative">
                <span className="block animate-fade-in-up hover:scale-105 transition-transform duration-300">
                  Amber Global Trade
                </span>
                <span className="block text-emerald-300 animate-fade-in-up text-2xl md:text-3xl hover:text-emerald-200 transition-colors duration-300" style={{ animationDelay: '0.2s' }}>
                  Premium Agricultural Export Company
                </span>
                <span className="block animate-fade-in-up text-xl md:text-2xl text-white hover:text-gray-100 transition-colors duration-300" style={{ animationDelay: '0.4s' }}>
                  Basmati Rice, Organic Spices & Dry Fruits
                </span>
              </h1>
              
              <p className="text-xl text-emerald-200 leading-relaxed max-w-2xl mx-auto animate-fade-in-up hover:text-emerald-100 transition-colors duration-300" style={{ animationDelay: '0.6s' }}>
                Exporter of premium spices, pulses, dry fruits, and agro-products with global presence and compliance excellence. Your trusted partner in international trade.
              </p>
            </div>

            {/* Enhanced CTA Buttons with hover effects */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <InteractiveButton
                onClick={scrollToContact}
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="group relative overflow-hidden"
              >
                <span className="relative z-10">Get a Quote</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </InteractiveButton>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Hero;
