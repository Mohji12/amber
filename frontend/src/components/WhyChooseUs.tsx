import React from 'react';
import { Award, Globe, Users, TrendingUp } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const WhyChooseUs = () => {
  const certifications = [
    { name: 'APEDA', description: 'Agricultural Products Export Development Authority' },
    { name: 'FSSAI', description: 'Food Safety and Standards Authority of India' },
    { name: 'GST', description: 'Goods and Services Tax Registration' },
    { name: 'IEC', description: 'Import Export Code' },
    { name: 'Spice Board', description: 'Ministry of Commerce & Industry' },
    { name: 'ISO', description: 'International Organization for Standardization' },
  ];

  const stats = [
    { icon: Globe, value: '25+', label: 'Countries Served' },
    { icon: Users, value: '500+', label: 'Happy Clients' },
    { icon: TrendingUp, value: '10K+', label: 'Tons Exported' },
    { icon: Award, value: '15+', label: 'Certifications' },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp" className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Amber Global</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                With over a decade of experience in international trade, Amber Global has established itself as a trusted partner for premium agricultural exports from India to global markets.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our commitment to quality, compliance, and customer satisfaction has made us a preferred choice for importers worldwide. We specialize in sourcing, processing, and exporting the finest spices, pulses, dry fruits, and agro-products.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <AnimatedSection key={index} delay={index * 200} className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <IconComponent size={24} className="text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>

          {/* Right Content - Certifications */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Our Certifications & Licenses</h3>
            <div className="grid gap-4">
              {certifications.map((cert, index) => (
                <AnimatedSection key={index} delay={index * 150}>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-green-100 hover:border-green-200 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Award size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                        <p className="text-sm text-gray-600">{cert.description}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhyChooseUs;