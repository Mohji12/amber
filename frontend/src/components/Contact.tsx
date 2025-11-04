import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import FeedbackToast from './FeedbackToast';
import LoadingSpinner from './LoadingSpinner';
import { createEnquiry } from '../api'; // Import the API function

const Contact = () => {
  const [formData, setFormData] = useState({
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
    // Live validation for each field
    if (e.target.name === 'productInterest') {
      if (!e.target.value) setErrors((prev: any) => ({ ...prev, productInterest: 'Product interest is required.' }));
      else setErrors((prev: any) => { const { productInterest, ...rest } = prev; return rest; });
    }
    if (e.target.name === 'quantityRequired') {
      if (!e.target.value) setErrors((prev: any) => ({ ...prev, quantityRequired: 'Quantity is required.' }));
      else setErrors((prev: any) => { const { quantityRequired, ...rest } = prev; return rest; });
    }
    if (e.target.name === 'destinationCountry') {
      if (!e.target.value) setErrors((prev: any) => ({ ...prev, destinationCountry: 'Destination is required.' }));
      else setErrors((prev: any) => { const { destinationCountry, ...rest } = prev; return rest; });
    }
    if (e.target.name === 'whatsappNumber') {
      if (!validatePhone(e.target.value)) setErrors((prev: any) => ({ ...prev, whatsappNumber: 'Invalid phone number.' }));
      else setErrors((prev: any) => { const { whatsappNumber, ...rest } = prev; return rest; });
    }
    if (e.target.name === 'email') {
      if (!validateEmail(e.target.value)) setErrors((prev: any) => ({ ...prev, email: 'Invalid email format.' }));
      else setErrors((prev: any) => { const { email, ...rest } = prev; return rest; });
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
      // Map frontend state to backend model, handle optional and numeric fields
      const enquiryData = {
        name: 'Contact Page Enquiry', // Or add a name field to the form
        email: formData.email,
        contact_number: formData.whatsappNumber,
        required_amount: parseInt(formData.quantityRequired, 10),
        product_interest: formData.productInterest,
        destination_country: formData.destinationCountry,
        any_query: formData.additionalRequirements || null,
      };

      const res = await createEnquiry(enquiryData);

      if (res && !res.detail) {
        setToastMessage('Your quote request has been sent successfully!');
        setToastType('success');
        setShowToast(true);
        // Reset form
        setFormData({
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

          {/* Quote Form */}
          <AnimatedSection animation="fadeInRight" delay={300}>
            <div className="glass rounded-2xl p-8 border border-white/50 hover:border-green-200/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get a Quote</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="productInterest" className="block text-sm font-medium text-gray-700 mb-2">Product Interest *</label>
                    <select
                      id="productInterest"
                      name="productInterest"
                      value={formData.productInterest}
                      onChange={handleChange}
                      className={`w-full p-3 bg-gray-50 rounded-lg border ${errors.productInterest ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                    >
                      <option value="">Select Product</option>
                      <option value="Spices">Spices</option>
                      <option value="Rice">Rice</option>
                      <option value="Pulses">Pulses</option>
                      <option value="Dry Fruits">Dry Fruits</option>
                      <option value="Perishables">Perishables</option>
                      <option value="Gourmet">Gourmet</option>
                    </select>
                    {errors.productInterest && <p className="text-red-500 text-xs mt-1">{errors.productInterest}</p>}
                  </div>
                  <div>
                    <label htmlFor="quantityRequired" className="block text-sm font-medium text-gray-700 mb-2">Quantity Required *</label>
                    <input
                      type="text"
                      id="quantityRequired"
                      name="quantityRequired"
                      value={formData.quantityRequired}
                      onChange={handleChange}
                      placeholder="e.g., 1000 KG"
                      className={`w-full p-3 bg-gray-50 rounded-lg border ${errors.quantityRequired ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                    />
                    {errors.quantityRequired && <p className="text-red-500 text-xs mt-1">{errors.quantityRequired}</p>}
                  </div>
                  <div>
                    <label htmlFor="destinationCountry" className="block text-sm font-medium text-gray-700 mb-2">Destination Country *</label>
                    <input
                      type="text"
                      id="destinationCountry"
                      name="destinationCountry"
                      value={formData.destinationCountry}
                      onChange={handleChange}
                      placeholder="e.g., USA"
                      className={`w-full p-3 bg-gray-50 rounded-lg border ${errors.destinationCountry ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                    />
                    {errors.destinationCountry && <p className="text-red-500 text-xs mt-1">{errors.destinationCountry}</p>}
                  </div>
                  <div>
                    <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number *</label>
                    <input
                      type="text"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      className={`w-full p-3 bg-gray-50 rounded-lg border ${errors.whatsappNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                    />
                    {errors.whatsappNumber && <p className="text-red-500 text-xs mt-1">{errors.whatsappNumber}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`w-full p-3 bg-gray-50 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-700 mb-2">Additional Requirements</label>
                    <textarea
                      id="additionalRequirements"
                      name="additionalRequirements"
                      rows={4}
                      value={formData.additionalRequirements}
                      onChange={handleChange}
                      placeholder="Tell us about your specific requirements, packaging needs, or any other details..."
                      className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    ></textarea>
                  </div>
                </div>
                <div className="text-center mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <LoadingSpinner /> : <><Send size={20} className="mr-3" /> Send Quote Request</>}
                  </button>
                </div>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <FeedbackToast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </section>
  );
};

export default Contact;