import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Globe, Award, Truck, Shield } from 'lucide-react';
import logo from '../assets/IMG_20250714_151848.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Get a Quote', href: '#contact' },
    { name: 'Products', href: '#products' },
    { name: 'About Us', href: '#about' },
    { name: 'How We Work', href: '#howwework' },
    { name: 'Contact', href: '#contact' },
  ];

  const productCategories = [
    'Premium Spices',
    'Export Pulses',
    'Dry Fruits',
    'Fresh Fruits',
    'Agro Products',
  ];

  const certifications = [
    'APEDA Certified',
    'FSSAI Licensed',
    'ISO Compliant',
    'GST Registered',
    'IEC Certified',
    'Spice Board',
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-4">
                <img src={logo} alt="Amber Global Logo" className="h-12 w-auto mr-3 rounded-lg shadow-sm object-contain" />
                <h3 className="text-2xl font-bold text-white">Amber Global</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Your trusted partner in premium agricultural exports from India to global markets. 
                Quality, compliance, and customer satisfaction are our core values.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Bengaluru, Karnataka, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-green-400 flex-shrink-0" />
                <span className="text-gray-300">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-green-400 flex-shrink-0" />
                <span className="text-gray-300">amberglobaltrade1@gmail.com</span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/917978801622"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={20} />
              <span>Connect on WhatsApp</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Our Products</h4>
            <ul className="space-y-3">
              {productCategories.map((product, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">{product}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Certifications</h4>
            <div className="grid grid-cols-1 gap-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Award size={16} className="text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Globe size={20} className="text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Global Reach</h5>
                <p className="text-xs text-gray-400">25+ Countries</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Quality Assured</h5>
                <p className="text-xs text-gray-400">100% Compliance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Truck size={20} className="text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Fast Delivery</h5>
                <p className="text-xs text-gray-400">Worldwide Shipping</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white">24/7 Support</h5>
                <p className="text-xs text-gray-400">Expert Assistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Amber Global Export-Import Platform. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Export Terms</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;