import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import InteractiveButton from './InteractiveButton';
import FeedbackToast from './FeedbackToast';
import LoadingSpinner from './LoadingSpinner';
import { createEnquiry } from '../api';

interface PopupFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  productInfo?: {
    name: string;
    subcategory?: string;
    category?: string;
  };
}

const PopupForm: React.FC<PopupFormProps> = ({ isVisible, onClose, onSubmit, productInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    company: '',
    amount: '',
    message: '',
    product_interest: '',
    destination_country: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [errors, setErrors] = useState<any>({});

  // Auto-fill product interest when productInfo changes
  useEffect(() => {
    if (productInfo) {
      const productInterest = productInfo.subcategory 
        ? `${productInfo.name} (${productInfo.subcategory})`
        : productInfo.name;
      
      setFormData(prev => ({
        ...prev,
        product_interest: productInterest
      }));
    }
  }, [productInfo]);

  const validateEmail = (email: string) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };
  const validateContact = (contact: string) => {
    return /^\+?\d{7,15}$/.test(contact);
  };
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address.';
    if (!formData.contact.trim()) newErrors.contact = 'Contact number is required.';
    else if (!validateContact(formData.contact)) newErrors.contact = 'Invalid contact number.';
    if (!formData.amount.trim()) newErrors.amount = 'Required amount is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      // Prepare data for backend, ensuring correct types and handling optional fields
      const enquiryData = {
        name: formData.name,
        email: formData.email,
        contact_number: formData.contact,
        company_name: formData.company || null,
        required_amount: formData.amount ? parseInt(formData.amount, 10) : null,
        any_query: formData.message || null,
        product_interest: formData.product_interest || null,
        destination_country: formData.destination_country || null,
      };

      const res = await createEnquiry(enquiryData);
      
      if (res && !res.detail) {
        setToastMessage("Thank you! We'll contact you within 24 hours.");
        setToastType('success');
        setShowToast(true);
        onSubmit();
        // Reset form including new fields
        setFormData({
          name: '',
          email: '',
          contact: '',
          company: '',
          amount: '',
          message: '',
          product_interest: '',
          destination_country: ''
        });
      } else {
        setToastMessage(res.detail || 'Failed to send message. Please try again.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Failed to send message. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Live validation for each field
    if (e.target.name === 'name') {
      if (!e.target.value.trim()) setErrors((prev: any) => ({ ...prev, name: 'Name is required.' }));
      else setErrors((prev: any) => { const { name, ...rest } = prev; return rest; });
    }
    if (e.target.name === 'email') {
      if (!validateEmail(e.target.value)) setErrors((prev: any) => ({ ...prev, email: 'Invalid email address.' }));
      else setErrors((prev: any) => { const { email, ...rest } = prev; return rest; });
    }
    if (e.target.name === 'contact') {
      if (!validateContact(e.target.value)) setErrors((prev: any) => ({ ...prev, contact: 'Invalid contact number.' }));
      else setErrors((prev: any) => { const { contact, ...rest } = prev; return rest; });
    }
    if (e.target.name === 'amount') {
      if (!e.target.value.trim()) setErrors((prev: any) => ({ ...prev, amount: 'Required amount is required.' }));
      else setErrors((prev: any) => { const { amount, ...rest } = prev; return rest; });
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="glass rounded-2xl p-8 max-w-md w-full border border-white/50 animate-fade-in-up my-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Get Export Quote</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                aria-label="Name"
                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400' : 'border-gray-200'} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm`}
                placeholder="Your Name"
                required
              />
              {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                aria-label="Email Address"
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm`}
                placeholder="your@email.com"
                required
              />
              {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                aria-label="Contact Number"
                className={`w-full px-4 py-3 rounded-xl border ${errors.contact ? 'border-red-400' : 'border-gray-200'} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm`}
                placeholder="Contact Number"
                required
              />
              {errors.contact && <div className="text-red-500 text-xs mt-1">{errors.contact}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Amount (KG) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                aria-label="Required Amount (KG)"
                className={`w-full px-4 py-3 rounded-xl border ${errors.amount ? 'border-red-400' : 'border-gray-200'} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm`}
                placeholder="Amount in KG"
                required
              />
              {errors.amount && <div className="text-red-500 text-xs mt-1">{errors.amount}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any Query
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                placeholder="Tell us about your export requirements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Interest
              </label>
              <input
                type="text"
                name="product_interest"
                value={formData.product_interest}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., Onions, Spices"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Country
              </label>
              <input
                type="text"
                name="destination_country"
                value={formData.destination_country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., USA, UAE"
              />
            </div>

            <InteractiveButton
              variant="primary"
              size="lg"
              icon={isSubmitting ? undefined : Send}
              disabled={isSubmitting}
              className="w-full"
              aria-label="Send Quote Request"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Sending...</span>
                </>
              ) : (
                'Send Quote Request'
              )}
            </InteractiveButton>
          </form>
        </div>
      </div>

      <FeedbackToast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default PopupForm;