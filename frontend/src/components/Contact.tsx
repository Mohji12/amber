import React from 'react';
import { Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from './AnimatedSection';
import InteractiveButton from './InteractiveButton';
import { generateQuoteUrl, trackQuoteClick, getTrackingParamsFromUrl } from '../utils/quoteTracking';

const Contact = () => {
  const navigate = useNavigate();

  const handleGetQuote = () => {
    const trackingParams = getTrackingParamsFromUrl();
    trackQuoteClick({
      source: 'homepage_contact',
      ...trackingParams
    });
    navigate(generateQuoteUrl({
      source: 'homepage_contact',
      ...trackingParams
    }));
  };


  const contactDetails = [
    {
      icon: Mail,
      title: 'Email',
      value: 'amberglobaltrade1@gmail.com',
      href: 'mailto:amberglobaltrade1@gmail.com',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Bengaluru, Karnataka, India',
      href: '#',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon - Sat: 9:00 AM - 6:00 PM IST',
      href: '#',
      color: 'from-orange-400 to-red-500'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <AnimatedSection animation="fadeInLeft" className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-xl text-gray-600">
                Ready to start your export journey? Contact us for personalized quotes and expert guidance.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              {contactDetails.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <AnimatedSection 
                    key={index}
                    delay={index * 150}
                    className="group"
                  >
                    <div className="glass rounded-2xl p-6 hover-lift hover-glow border border-white/50 group-hover:border-green-200/50 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            {contact.title}
                          </h3>
                          {contact.href !== '#' ? (
                            <a 
                              href={contact.href}
                              className="text-gray-600 hover:text-green-600 transition-colors"
                              target={contact.href.startsWith('http') ? '_blank' : undefined}
                              rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              {contact.value}
                            </a>
                          ) : (
                            <p className="text-gray-600">{contact.value}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>

            {/* Additional Info */}
            <AnimatedSection delay={600} className="glass rounded-2xl p-6 border border-green-200/50">
              <h3 className="font-semibold text-gray-900 mb-3">Why Choose Our Quote Service?</h3>
              <ul className="space-y-2">
                {[
                  'Free consultation and quote',
                  'Response within 24 hours',
                  'Competitive pricing',
                  'Custom packaging solutions',
                  'Complete documentation support'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    {/* The CheckCircle icon was here and has been removed to fix the error */}
                    <span className="text-green-500 mr-2 flex-shrink-0">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </AnimatedSection>

          {/* Get Quote Button */}
          <AnimatedSection animation="fadeInRight" delay={300}>
            <div className="glass rounded-2xl p-8 border border-white/50 hover:border-green-200/50 transition-all duration-300 flex flex-col items-center justify-center min-h-[400px]">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get a Quote</h3>
              <p className="text-gray-600 mb-8 text-center max-w-md">
                Ready to get started? Click the button below to fill out our quote form and receive a personalized quote for your export needs.
              </p>
              <InteractiveButton
                onClick={handleGetQuote}
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="group relative overflow-hidden"
              >
                <span className="relative z-10">Get Your Quote</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </InteractiveButton>
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 mb-2">What you'll get:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Personalized pricing</li>
                  <li>✓ MOQ information</li>
                  <li>✓ Delivery estimates</li>
                  <li>✓ Expert consultation</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

    </section>
  );
};

export default Contact;