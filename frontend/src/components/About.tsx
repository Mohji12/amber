import React from 'react';
import { Award, Globe, Users, TrendingUp, CheckCircle, Package, Shield, Truck } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import apeda from '../assets/apeda.png';
import fssai from '../assets/fssai.png';
import gst from '../assets/gst.png';
import iec from '../assets/iec.png';
import spiceboard from '../assets/spiceboard.png';
import iso from '../assets/iso.png';

const certImages = [apeda, fssai, gst, iec, spiceboard, iso];

const About = () => {
  const stats = [
    { icon: Globe, value: '13+', label: 'Specialized Categories' },
    { icon: Users, value: 'Global', label: 'Worldwide Operations' },
    { icon: TrendingUp, value: '100%', label: 'Export Compliant' },
    { icon: Award, value: 'Trust', label: 'Quality Excellence' },
  ];

  const features = [
    'Fully export-compliant products with certified specs',
    'Private label-ready packaging for global white-label brands',
    'Procurement from verified clusters across India',
    'End-to-end documentation, logistics, and inspection',
    'Consistent support for retailers, importers, and distributors'
  ];

  const promises = [
    'Export-ready.',
    'Market-relevant.',
    'Business-building.'
  ];

  return (
    <>
      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Amber Global</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                At Amber Global, we don't just export products — we export trust, quality, and brand-worthy excellence.
              </p>
            </div>

            <AnimatedSection animation="fadeInLeft" delay={200} className="bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Based in India and operating worldwide, Amber Global is a new-age merchant export company delivering a curated portfolio of high-demand Indian goods across 13+ specialized categories — from spices and superfoods to FMCG, agro-tech, leather, and wellness essentials.
              </p>
              
              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Modern Model:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Package className="text-green-600 w-5 h-5" />
                    <span className="text-gray-700">To the manufacturer, we are the buyer.</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Truck className="text-green-600 w-5 h-5" />
                    <span className="text-gray-700">To the importer, we are the supplier.</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-4 text-sm">
                  This keeps your sourcing discreet, direct, and professionally managed at every level.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeInRight" delay={400} className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="text-green-600 mr-3" />
                What We Deliver:
              </h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="text-green-600 w-5 h-5 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={600} className="bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Whether it's Grade A cardamom, premium W180 cashews, 1121 basmati rice, or pharma-grade nutraceutical extracts — we handle it with quiet precision and global intent.
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                <p className="text-gray-700 mb-4">
                  Our clients span North America, Europe, MENA, and Southeast Asia, and every product we send out carries a promise:
                </p>
                <div className="flex flex-wrap gap-4">
                  {promises.map((promise, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                      <CheckCircle className="text-green-600 w-4 h-4" />
                      <span className="text-gray-700 font-medium">{promise}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={800} className="text-center">
              <p className="text-xl font-semibold text-gray-900 italic">
                At Amber Global, we don't just follow trade lanes — we build them.
              </p>
            </AnimatedSection>

            {/* Stats */}
            <AnimatedSection animation="fadeInUp" delay={1000} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <IconComponent size={24} className="text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </AnimatedSection>
          </AnimatedSection>
        </div>
      </section>

      {/* Certifications Section - Carousel */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Our Certifications & Licenses</h3>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={200} className="overflow-hidden relative">
            <div className="flex animate-marquee-tight" style={{ minWidth: '200%' }}>
              {[...Array(3)].flatMap(() => certImages).map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="Certification"
                  className="h-24 w-40 object-contain rounded shadow-md bg-white border border-green-100 mx-2 hover:shadow-lg transition-shadow duration-300"
                  draggable="false"
                />
              ))}
            </div>
          </AnimatedSection>
        </div>
        <style>{`
          @keyframes marquee-tight {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          .animate-marquee-tight {
            animation: marquee-tight 20s linear infinite;
          }
        `}</style>
      </section>
    </>
  );
};

export default About;