import React, { useEffect, useRef, useState } from 'react';
import { Search, FlaskConical, Package, Plane, FileCheck, Truck } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const HowWeWork = () => {
  const [activeStep, setActiveStep] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-step') || '0');
            setActiveStep(index);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-50px 0px'
      }
    );

    const steps = document.querySelectorAll('[data-step]');
    steps.forEach((step) => observer.observe(step));

    return () => {
      steps.forEach((step) => observer.unobserve(step));
    };
  }, []);

  const processes = [
    {
      icon: Search,
      title: 'Sourcing',
      description: 'Direct sourcing from certified farms and suppliers across India',
      details: ['Farm visits', 'Quality assessment', 'Supplier verification'],
      video: 'https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/sourcing.mp4',
    },
    {
      icon: FlaskConical,
      title: 'Sampling',
      description: 'Professional sampling and lab testing for quality assurance',
      details: ['Lab testing', 'Quality reports', 'Sample approval'],
      video: 'https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/sampling.mp4',
    },
    {
      icon: Package,
      title: 'Packaging',
      description: 'Custom packaging solutions meeting international standards',
      details: ['Custom branding', 'Export packaging', 'Quality sealing'],
      video: 'https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/packing.mp4',
    },
    {
      icon: FileCheck,
      title: 'Documentation',
      description: 'Complete export documentation and compliance handling',
      details: ['Export permits', 'Phytosanitary certificates', 'COA reports'],
      video: 'https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/documentation.mp4',
    },
    {
      icon: Plane,
      title: 'Export',
      description: 'Efficient logistics and shipping to global destinations',
      details: ['Sea freight', 'Air cargo', 'Cold chain'],
      video: 'https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/export.mp4',
    },
    {
      icon: Truck,
      title: 'Tracking',
      description: 'Real-time shipment tracking and delivery updates',
      details: ['Live tracking', 'Status updates', 'Delivery confirmation'],
      video: 'https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/tracking.mp4',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection animation="fadeInUp" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Work</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process ensures quality, compliance, and timely delivery from farm to your doorstep
          </p>
        </AnimatedSection>

        {/* Process Timeline */}
        <div className="relative" ref={timelineRef}>
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200">
            {/* Animated timeline line */}
            <div 
              className="absolute top-0 left-0 w-full bg-green-500 transition-all duration-1000 ease-out"
              style={{ height: `${((activeStep + 1) / processes.length) * 100}%` }}
            />
          </div>

          <div className="space-y-12">
            {processes.map((process, index) => {
              const IconComponent = process.icon;
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={index} 
                  data-step={index}
                  className={`relative flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Timeline Node */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg z-10 transition-all duration-500">
                    {index <= activeStep && (
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping" />
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`w-full lg:w-5/12 ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}> 
                    <AnimatedSection 
                      animation={isEven ? 'fadeInLeft' : 'fadeInRight'} 
                      delay={index * 200}
                      className="h-full"
                    >
                      <div className="relative rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-green-200 transform hover:scale-105 overflow-hidden"> 
                        {process.video && (
                          <>
                            <video
                              className="absolute inset-0 w-full h-full object-cover z-0"
                              src={process.video}
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="auto"
                              style={{ pointerEvents: 'none' }}
                            />
                            <div className="absolute inset-0 bg-black/50 z-10" />
                          </>
                        )}
                        <div className="flex items-start space-x-4 relative z-20"> 
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 bg-white/20 hover:bg-white/30"> 
                            <IconComponent size={24} className="text-white transition-all duration-300" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-3 text-white">{process.title}</h3>
                            <p className="text-white/90 mb-4">{process.description}</p>
                            <ul className="space-y-2">
                              {process.details.map((detail, i) => (
                                <li key={i} className="flex items-center text-sm text-white">
                                  <div className="w-2 h-2 rounded-full mr-3 bg-green-300"></div>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  </div>

                  {/* Step Number */}
                  <div className={`hidden lg:block w-2/12 text-center ${isEven ? 'order-last' : 'order-first'}`}>
                    <AnimatedSection 
                      animation="scaleIn" 
                      delay={index * 200 + 300}
                      className="relative"
                    >
                      <div className={`text-6xl font-bold transition-all duration-500 ${index <= activeStep ? 'text-green-500' : 'text-green-100'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      {index <= activeStep && (
                        <div className="absolute inset-0 text-6xl font-bold text-green-200 animate-pulse">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                      )}
                    </AnimatedSection>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Features */}
        <AnimatedSection animation="fadeInUp" delay={800} className="mt-20">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-green-50 rounded-2xl p-6 text-center hover:bg-green-100 transition-all duration-300 transform hover:scale-105">
              <h4 className="font-semibold text-gray-900 mb-2">Custom Documentation</h4>
              <p className="text-sm text-gray-600">Tailored export documents for each destination</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 text-center hover:bg-green-100 transition-all duration-300 transform hover:scale-105">
              <h4 className="font-semibold text-gray-900 mb-2">Compliance Assurance</h4>
              <p className="text-sm text-gray-600">100% compliance with international standards</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 text-center hover:bg-green-100 transition-all duration-300 transform hover:scale-105">
              <h4 className="font-semibold text-gray-900 mb-2">White Label Solutions</h4>
              <p className="text-sm text-gray-600">Custom branding and packaging options</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 text-center hover:bg-green-100 transition-all duration-300 transform hover:scale-105">
              <h4 className="font-semibold text-gray-900 mb-2">Dispatch Tracking</h4>
              <p className="text-sm text-gray-600">Real-time tracking from warehouse to destination</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HowWeWork;
