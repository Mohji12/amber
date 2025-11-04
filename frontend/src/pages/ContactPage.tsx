import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Globe, Award, Users, Truck } from 'lucide-react';
import FeedbackToast from '../components/FeedbackToast';
import LoadingSpinner from '../components/LoadingSpinner';
import { createEnquiry } from '../api';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    productInterest: '',
    quantityRequired: '',
    destinationCountry: '',
    whatsappNumber: '',
    email: '',
    additionalRequirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [errors, setErrors] = useState<any>({});

  const validateEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };
  const validatePhone = (phone: string) => {
    return /^\+?\d{7,15}$/.test(phone);
  };
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.productInterest) newErrors.productInterest = 'Product interest is required.';
    if (!formData.quantityRequired) newErrors.quantityRequired = 'Quantity is required.';
    if (!formData.destinationCountry) newErrors.destinationCountry = 'Destination is required.';
    if (!formData.whatsappNumber) newErrors.whatsappNumber = 'WhatsApp number is required.';
    else if (!validatePhone(formData.whatsappNumber)) newErrors.whatsappNumber = 'Invalid phone number.';
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setToastMessage('Please fill all required fields correctly.');
      setToastType('error');
      setShowToast(true);
      return;
    }
    setIsSubmitting(true);

    try {
      const enquiryData = {
        name: formData.name,
        email: formData.email,
        contact_number: formData.whatsappNumber,
        required_amount: parseInt(formData.quantityRequired, 10),
        product_interest: formData.productInterest,
        destination_country: formData.destinationCountry,
        any_query: formData.additionalRequirements || null,
      };

      const res = await createEnquiry(enquiryData);

      if (res && !res.detail) {
        setToastMessage('Your quote request has been sent successfully! We will contact you within 24 hours.');
        setToastType('success');
        setShowToast(true);
        // Reset form
        setFormData({
          name: '',
          company: '',
          productInterest: '',
          quantityRequired: '',
          destinationCountry: '',
          whatsappNumber: '',
          email: '',
          additionalRequirements: ''
        });
      } else {
        setToastMessage(res.detail?.[0]?.msg || 'Submission failed. Please try again.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('An unexpected error occurred. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactDetails = [
    
    {
      icon: Mail,
      title: 'Email',
      value: 'amberglobaltrade1@gmail.com',
      href: 'mailto:amberglobaltrade1@gmail.com',
      color: 'from-blue-400 to-indigo-500',
      description: 'Detailed inquiries and documentation'
    },
    {
      icon: MapPin,
      title: 'Headquarters',
      value: 'Bengaluru, Karnataka, India',
      href: '#',
      color: 'from-purple-400 to-pink-500',
      description: 'Main office and operations center'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon - Sat: 9:00 AM - 6:00 PM IST',
      href: '#',
      color: 'from-orange-400 to-red-500',
      description: 'Indian Standard Time'
    }
  ];

  const services = [
    {
      icon: Globe,
      title: 'Global Export',
      description: 'Export to 50+ countries worldwide with full compliance support'
    },
    {
      icon: Award,
      title: 'Quality Certified',
      description: 'ISO, HACCP, FSSAI, and organic certifications for premium products'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Dedicated export specialists with 10+ years of experience'
    },
    {
      icon: Truck,
      title: 'Logistics Support',
      description: 'End-to-end logistics and documentation assistance'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - Get Expert Export Guidance | Amber Global Trade</title>
        <meta name="description" content="Contact Amber Global Trade for expert export guidance, competitive quotes, and comprehensive support for your international trade needs. Get in touch today!" />
        <meta name="keywords" content="contact export consultant, international trade support, export guidance India, trade consultation, export quotes" />
        <meta name="author" content="Amber Global Trade" />
        <meta name="robots" content="index, follow" />
        
        {/* Local Business Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Amber Global Trade",
            "description": "Premium agricultural export company specializing in Basmati rice, organic spices, dry fruits, and pulses with full compliance certification.",
            "url": "https://amberglobaltrade.com",
            "telephone": "+91-7978801622",
            "email": "amberglobaltrade1@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Bengaluru",
              "addressRegion": "Karnataka",
              "addressCountry": "India"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "12.9716",
              "longitude": "77.5946"
            },
            "openingHours": "Mo-Sa 09:00-18:00",
            "priceRange": "$$",
            "serviceArea": {
              "@type": "Country",
              "name": "Global"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Agricultural Export Products",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Basmati Rice Export"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Organic Spices Export"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Dry Fruits Export"
                  }
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Get Expert Export Guidance
              </h1>
              <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto">
                Ready to start your export journey? Our team of experts is here to help you succeed in global markets with personalized quotes and comprehensive support.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8 order-2 lg:order-1">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-lg text-gray-600">
                  Whether you're a first-time exporter or looking to expand your business, we're here to provide expert guidance and support every step of the way.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactDetails.map((contact, index) => {
                  const IconComponent = contact.icon;
                  return (
                    <div key={index} className="group">
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 hover:border-emerald-200 transition-all duration-300 h-full">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className={`w-16 h-16 bg-gradient-to-r ${contact.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent size={28} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2 text-lg">
                              {contact.title}
                            </h3>
                            {contact.href !== '#' ? (
                              <a 
                                href={contact.href}
                                className="text-gray-600 hover:text-emerald-600 transition-colors block mb-2 font-medium"
                                target={contact.href.startsWith('http') ? '_blank' : undefined}
                                rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                              >
                                {contact.value}
                              </a>
                            ) : (
                              <p className="text-gray-600 mb-2 font-medium">{contact.value}</p>
                            )}
                            <p className="text-sm text-gray-500">{contact.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Why Choose Us */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 shadow-lg border border-emerald-200">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Why Choose Amber Global Trade?</h3>
                  <p className="text-gray-600 text-lg">We're your trusted partner for successful global exports</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {services.map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-emerald-100">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <IconComponent size={24} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg mb-2">{service.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Quote Form */}
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-2xl p-10 shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Get Your Free Quote</h3>
                  <p className="text-lg text-gray-600">
                    Fill out the form below and our export specialists will provide you with a detailed quote and guidance within 24 hours.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-3">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={`w-full p-4 bg-gray-50 rounded-xl border-2 ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-lg`}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-lg font-semibold text-gray-700 mb-3">Company Name</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your company name"
                        className="w-full p-4 bg-gray-50 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-lg"
                      />
                    </div>
                    <div>
                      <label htmlFor="productInterest" className="block text-lg font-semibold text-gray-700 mb-3">Product Interest *</label>
                      <select
                        id="productInterest"
                        name="productInterest"
                        value={formData.productInterest}
                        onChange={handleChange}
                        className={`w-full p-4 bg-gray-50 rounded-xl border-2 ${errors.productInterest ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-lg`}
                      >
                        <option value="">Select Product</option>
                        <option value="Basmati Rice">Basmati Rice</option>
                        <option value="Organic Ginger Powder">Organic Ginger Powder</option>
                        <option value="Indian Spices">Indian Spices</option>
                        <option value="Pulses">Pulses</option>
                        <option value="Dry Fruits">Dry Fruits</option>
                        <option value="Perishables">Perishables</option>
                        <option value="Gourmet Products">Gourmet Products</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.productInterest && <p className="text-red-500 text-sm mt-2">{errors.productInterest}</p>}
                    </div>
                    <div>
                      <label htmlFor="quantityRequired" className="block text-lg font-semibold text-gray-700 mb-3">Quantity Required *</label>
                      <input
                        type="text"
                        id="quantityRequired"
                        name="quantityRequired"
                        value={formData.quantityRequired}
                        onChange={handleChange}
                        placeholder="e.g., 1000 KG"
                        className={`w-full p-4 bg-gray-50 rounded-xl border-2 ${errors.quantityRequired ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-lg`}
                      />
                      {errors.quantityRequired && <p className="text-red-500 text-sm mt-2">{errors.quantityRequired}</p>}
                    </div>
                    <div>
                      <label htmlFor="destinationCountry" className="block text-lg font-semibold text-gray-700 mb-3">Destination Country *</label>
                      <input
                        type="text"
                        id="destinationCountry"
                        name="destinationCountry"
                        value={formData.destinationCountry}
                        onChange={handleChange}
                        placeholder="e.g., USA, UAE, Canada"
                        className={`w-full p-4 bg-gray-50 rounded-xl border-2 ${errors.destinationCountry ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-lg`}
                      />
                      {errors.destinationCountry && <p className="text-red-500 text-sm mt-2">{errors.destinationCountry}</p>}
                    </div>
                    <div>
                      <label htmlFor="whatsappNumber" className="block text-lg font-semibold text-gray-700 mb-3">WhatsApp Number *</label>
                      <input
                        type="text"
                        id="whatsappNumber"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                        className={`w-full p-4 bg-gray-50 rounded-xl border-2 ${errors.whatsappNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-lg`}
                      />
                      {errors.whatsappNumber && <p className="text-red-500 text-sm mt-2">{errors.whatsappNumber}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-3">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={`w-full p-4 bg-gray-50 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-lg`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="additionalRequirements" className="block text-lg font-semibold text-gray-700 mb-3">Additional Requirements</label>
                      <textarea
                        id="additionalRequirements"
                        name="additionalRequirements"
                        rows={5}
                        value={formData.additionalRequirements}
                        onChange={handleChange}
                        placeholder="Tell us about your specific requirements, packaging needs, certifications, or any other details..."
                        className="w-full p-4 bg-gray-50 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-lg resize-none"
                      ></textarea>
                    </div>
                  </div>
                  <div className="text-center pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center px-12 py-5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl text-xl"
                    >
                      {isSubmitting ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <Send size={24} className="mr-4" />
                          Send Quote Request
                        </>
                      )}
                    </button>
                    <p className="text-lg text-gray-600 mt-4 font-medium">
                      We'll respond within 24 hours with a detailed quote and guidance.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <FeedbackToast
          message={toastMessage}
          type={toastType}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    </>
  );
};

export default ContactPage;

