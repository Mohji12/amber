import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, Send, MessageCircle, ArrowLeft } from 'lucide-react';
import InteractiveButton from '../components/InteractiveButton';
import FeedbackToast from '../components/FeedbackToast';
import LoadingSpinner from '../components/LoadingSpinner';
import { createEnquiry } from '../api';
import { openWhatsApp } from '../utils/whatsapp';
import WhatsAppQuestionnaire from '../components/WhatsAppQuestionnaire';
import type { QuestionnaireAnswers } from '../components/WhatsAppQuestionnaire';
import CompleteSEO from '../components/SEO/CompleteSEO';
import { useCustomSEO } from '../hooks/useSEO';
import { SEORequest } from '../api';
import { SEOData } from '../utils/seo';
import { trackQuoteSuccess } from '../utils/gtmTracking';

const QuotePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract product information from URL parameters
  const productName = searchParams.get('product') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const category = searchParams.get('category') || '';
  const source = searchParams.get('source') || 'direct'; // For ad tracking
  const utmSource = searchParams.get('utm_source') || '';
  const utmMedium = searchParams.get('utm_medium') || '';
  const utmCampaign = searchParams.get('utm_campaign') || '';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    company: '',
    about_you: '',
    amount: '',
    message: '',
    product_interest: productName || '',
    destination_country: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [errors, setErrors] = useState<any>({});
  const [showWhatsAppQuestionnaire, setShowWhatsAppQuestionnaire] = useState(false);

  // Track quote page view for analytics
  useEffect(() => {
    // Track the quote page view with source information
    const trackingData = {
      source,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      product: productName,
      subcategory,
      category,
      timestamp: new Date().toISOString()
    };
    
    // Store in localStorage for analytics
    try {
      const quoteViews = JSON.parse(localStorage.getItem('quote_views') || '[]');
      quoteViews.push(trackingData);
      // Keep only last 50 views
      if (quoteViews.length > 50) {
        quoteViews.shift();
      }
      localStorage.setItem('quote_views', JSON.stringify(quoteViews));
    } catch (error) {
      console.error('Error tracking quote view:', error);
    }

    // Note: Tracking is handled via GTM dataLayer
  }, [source, utmSource, utmMedium, utmCampaign, productName, subcategory, category]);

  // Auto-fill product interest
  useEffect(() => {
    if (productName) {
      const productInterest = subcategory 
        ? `${productName} (${subcategory})`
        : productName;
      
      setFormData(prev => ({
        ...prev,
        product_interest: productInterest
      }));
    }
  }, [productName, subcategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(formData.contact)) {
      newErrors.contact = 'Please enter a valid contact number';
    }
    
    if (!formData.product_interest.trim()) {
      newErrors.product_interest = 'Product interest is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Build enquiry payload in the exact shape that the backend expects
  const buildEnquiryPayload = () => ({
    name: formData.name,
    email: formData.email,
    contact_number: formData.contact,
    required_amount: parseInt(formData.amount || '0', 10),
    product_interest: formData.product_interest || productName || '',
    destination_country: formData.destination_country || null,
    any_query: formData.message || null,
    about_you: formData.about_you || null
  });

  // Main "Send Quote Request" button
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToastMessage('Please fill in all required fields correctly.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await createEnquiry(buildEnquiryPayload());

      // Fire GTM event for Google Ads conversion tracking
      trackQuoteSuccess({
        form_type: 'quote_page',
        product: productName,
        source: source,
        page: '/quote',
      });

      setToastMessage('Quote request sent successfully! We\'ll get back to you soon.');
      setToastType('success');
      setShowToast(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        contact: '',
        company: '',
        about_you: '',
        amount: '',
        message: '',
        product_interest: productName || '',
        destination_country: ''
      });
      
      // Redirect after success
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error submitting quote:', error);
      setToastMessage(error?.message || 'Failed to send quote request. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // When user clicks "Contact via WhatsApp", we also create an enquiry first,
  // then open the WhatsApp questionnaire.
  const handleContactViaWhatsAppClick = async () => {
    if (!validateForm()) {
      setToastMessage('Please fill in all required fields correctly before continuing to WhatsApp.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await createEnquiry(buildEnquiryPayload());
      
      // Fire GTM event for Google Ads conversion tracking
      trackQuoteSuccess({
        form_type: 'whatsapp',
        product: productName,
        source: source,
        page: '/quote',
      });
      
      setShowWhatsAppQuestionnaire(true);
    } catch (error: any) {
      console.error('Error creating enquiry before WhatsApp:', error);
      setToastMessage(error?.message || 'Failed to create enquiry. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // When WhatsApp questionnaire is completed, we ONLY open WhatsApp.
  // Enquiry has already been created when the user clicked "Contact via WhatsApp".
  const handleWhatsAppSubmit = (answers: QuestionnaireAnswers) => {
    // Merge questionnaire answers with base form data
    const mergedContact = {
      name: answers.name || formData.name,
      email: answers.email || formData.email,
      phone: answers.phone || formData.contact,
      company: answers.company || formData.company,
      product_interest: answers.specificProduct || formData.product_interest || productName || '',
      destination_country: answers.destinationCountry || formData.destination_country,
      amount: answers.quantity || formData.amount,
      message: answers.additionalRequirements || formData.message
    };

    // Open WhatsApp chat with full details (form + questionnaire)
    openWhatsApp({
      name: mergedContact.name,
      email: mergedContact.email,
      contact: mergedContact.phone,
      company: mergedContact.company,
      product_interest: mergedContact.product_interest,
      amount: mergedContact.amount,
      destination_country: mergedContact.destination_country,
      message: mergedContact.message,
      quotationType: answers.quotationType,
      productCategory: answers.productCategory,
      specificProduct: answers.specificProduct,
      certifications: answers.certifications,
      packaging: answers.packaging,
      additionalRequirements: answers.additionalRequirements
    });

    setShowWhatsAppQuestionnaire(false);
  };

  // SEO Configuration
  const seoRequest: SEORequest = {
    url: '/quote',
    page_type: 'static',
    primary_keyword: 'Get Quote Export Products',
    secondary_keywords: [
      'export quote request',
      'B2B trade quotation',
      'agricultural export pricing',
      'bulk export inquiry'
    ],
    short_description: 'Get a personalized quote for premium export products. Request pricing, MOQ, and delivery information for your export requirements.'
  };

  const { seoData } = useCustomSEO(seoRequest);

  const fallbackSeoData: SEOData = {
    url: typeof window !== 'undefined' ? window.location.href : '/quote',
    meta: {
      title: 'Get Quote - Amber Global Trade',
      description: 'Get a personalized quote for premium export products. Request pricing, MOQ, and delivery information for your export requirements.',
      keywords: 'export quote, B2B trade, agricultural export, bulk pricing'
    },
    canonical: {
      url: typeof window !== 'undefined' ? `${window.location.origin}/quote` : '/quote'
    },
    headings: {
      h1: 'Get a Quote',
      h2_sections: [],
      h3_subsections: []
    },
    content: {
      hero_tagline: 'Request Your Custom Quote',
      short_intro: 'Fill out the form below and our export specialists will get back to you with competitive pricing and delivery options.',
      long_description: '',
      bullet_features: []
    },
    product_data: {},
    faq: [],
    images: [],
    internal_links: [],
    schema: {},
    social_meta: {},
    technical_notes: {}
  };

  const currentSeoData = seoData || fallbackSeoData;

  return (
    <CompleteSEO seoData={currentSeoData}>
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get a Quote</h1>
            <p className="text-lg text-gray-600">
              {productName 
                ? `Request a quote for ${productName}`
                : 'Fill out the form below and our export specialists will get back to you with competitive pricing and delivery options.'
              }
            </p>
          </div>

          {/* Quote Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Contact */}
              <div>
                <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                    errors.contact ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1 234 567 8900"
                />
                {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact}</p>}
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Your company name"
                />
              </div>

              {/* About You */}
              <div>
                <label htmlFor="about_you" className="block text-sm font-semibold text-gray-700 mb-2">
                  About You
                </label>
                <select
                  id="about_you"
                  name="about_you"
                  value={formData.about_you}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                >
                  <option value="">Select an option</option>
                  <option value="proprietor">Proprietor</option>
                  <option value="distributor">Distributor</option>
                  <option value="agent">Agent</option>
                  <option value="importer">Importer</option>
                  <option value="exporter">Exporter</option>
                </select>
              </div>

              {/* Product Interest */}
              <div>
                <label htmlFor="product_interest" className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Interest <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="product_interest"
                  name="product_interest"
                  value={formData.product_interest}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                    errors.product_interest ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Basmati Rice, Spices, etc."
                />
                {errors.product_interest && <p className="mt-1 text-sm text-red-500">{errors.product_interest}</p>}
              </div>

              {/* Destination Country */}
              <div>
                <label htmlFor="destination_country" className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination Country
                </label>
                <input
                  type="text"
                  id="destination_country"
                  name="destination_country"
                  value={formData.destination_country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Country where you want to import"
                />
              </div>

              {/* Amount/Quantity */}
              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity / Amount
                </label>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="e.g., 1000 KG, 10 containers"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                  placeholder="Tell us more about your requirements..."
                />
              </div>

              {/* Submit Button */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  aria-label="Send Quote Request"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Quote Request</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleContactViaWhatsAppClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  aria-label="Contact via WhatsApp"
                >
                  <MessageCircle size={20} />
                  Contact via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>

        <FeedbackToast
          message={toastMessage}
          type={toastType}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
        
        <WhatsAppQuestionnaire
          isOpen={showWhatsAppQuestionnaire}
          onClose={() => setShowWhatsAppQuestionnaire(false)}
          onComplete={handleWhatsAppSubmit}
        />
      </div>
    </CompleteSEO>
  );
};

export default QuotePage;

