import React, { useState } from 'react';
import { X, MessageCircle, ArrowRight, Check } from 'lucide-react';

interface WhatsAppQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: QuestionnaireAnswers) => void;
}

export interface QuestionnaireAnswers {
  quotationType: string;
  productCategory: string;
  specificProduct: string;
  quantity: string;
  destinationCountry: string;
  certifications: string[];
  packaging: string;
  additionalRequirements: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

const WhatsAppQuestionnaire: React.FC<WhatsAppQuestionnaireProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({
    certifications: [],
    packaging: ''
  });

  const quotationTypes = [
    { value: 'bulk-order', label: 'Bulk Order', description: 'Large quantity export order' },
    { value: 'sample', label: 'Sample Request', description: 'Request product samples for testing' },
    { value: 'private-labeling', label: 'Private Labeling', description: 'Custom branding and packaging' },
    { value: 'regular-order', label: 'Regular Order', description: 'Standard export order' },
    { value: 'custom-requirement', label: 'Custom Requirement', description: 'Special or customized products' }
  ];

  const productCategories = [
    { value: 'basmati-rice', label: 'Basmati Rice', products: ['Premium Basmati Rice', 'Organic Basmati Rice', 'Aged Basmati Rice', 'Brown Basmati Rice'] },
    { value: 'spices', label: 'Spices', products: ['Ginger Powder', 'Turmeric Powder', 'Chili Powder', 'Cumin Seeds', 'Coriander Seeds', 'Cardamom', 'Black Pepper', 'Other Spices'] },
    { value: 'dry-fruits', label: 'Dry Fruits', products: ['Almonds', 'Cashews', 'Raisins', 'Dates', 'Apricots', 'Other Dry Fruits'] },
    { value: 'pulses', label: 'Pulses', products: ['Lentils', 'Chickpeas', 'Black Gram', 'Green Gram', 'Other Pulses'] },
    { value: 'other', label: 'Other Products', products: ['Other Agricultural Products'] }
  ];

  const certifications = [
    'FSSAI Certified',
    'APEDA Registered',
    'ISO Certified',
    'Organic Certified',
    'HACCP Certified',
    'Halal Certified',
    'Kosher Certified'
  ];

  const packagingOptions = [
    'Standard Export Packaging',
    'Custom Packaging',
    'Bulk Packaging (Jute Bags)',
    'Retail Ready Packaging',
    'Private Label Packaging',
    'Vacuum Packed'
  ];

  const destinationCountries = [
    'USA', 'UAE', 'UK', 'Canada', 'Australia', 'Singapore', 'Malaysia', 
    'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'EU Countries', 
    'Other Country'
  ];

  const handleAnswer = (field: keyof QuestionnaireAnswers, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCertificationToggle = (cert: string) => {
    setAnswers(prev => {
      const current = prev.certifications || [];
      const updated = current.includes(cert)
        ? current.filter(c => c !== cert)
        : [...current, cert];
      return { ...prev, certifications: updated };
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete questionnaire
      onComplete(answers as QuestionnaireAnswers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!answers.quotationType;
      case 1: return !!answers.productCategory;
      case 2: return !!answers.specificProduct;
      case 3: return !!answers.quantity;
      case 4: return !!answers.destinationCountry;
      case 5: return true; // Certifications optional
      case 6: return true; // Packaging optional
      case 7: return true; // Additional requirements optional
      case 8: return !!answers.name && !!answers.email && !!answers.phone;
      default: return false;
    }
  };

  const steps = [
    {
      title: 'What type of quotation do you need?',
      content: (
        <div className="space-y-3">
          {quotationTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleAnswer('quotationType', type.value)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                answers.quotationType === type.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </div>
                {answers.quotationType === type.value && (
                  <Check className="text-green-500" size={20} />
                )}
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'Which product category are you interested in?',
      content: (
        <div className="space-y-3">
          {productCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleAnswer('productCategory', category.value)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                answers.productCategory === category.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">{category.label}</div>
                {answers.productCategory === category.value && (
                  <Check className="text-green-500" size={20} />
                )}
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'What specific product are you looking for?',
      content: (
        <div className="space-y-3">
          {answers.productCategory && productCategories.find(c => c.value === answers.productCategory)?.products.map((product) => (
            <button
              key={product}
              onClick={() => handleAnswer('specificProduct', product)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                answers.specificProduct === product
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">{product}</div>
                {answers.specificProduct === product && (
                  <Check className="text-green-500" size={20} />
                )}
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'What quantity do you need?',
      content: (
        <div className="space-y-4">
          <input
            type="text"
            value={answers.quantity || ''}
            onChange={(e) => handleAnswer('quantity', e.target.value)}
            placeholder="e.g., 1000 KG, 50 MT, 100 bags"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
          />
          <div className="text-sm text-gray-600">
            <p className="font-semibold mb-2">Common quantities:</p>
            <div className="flex flex-wrap gap-2">
              {['100 KG', '500 KG', '1000 KG', '5 MT', '10 MT', '20 MT', 'Custom'].map(qty => (
                <button
                  key={qty}
                  onClick={() => handleAnswer('quantity', qty)}
                  className="px-3 py-1 bg-gray-100 hover:bg-green-100 rounded-lg text-sm transition-colors"
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'What is your destination country?',
      content: (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {destinationCountries.map((country) => (
            <button
              key={country}
              onClick={() => handleAnswer('destinationCountry', country)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                answers.destinationCountry === country
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">{country}</div>
                {answers.destinationCountry === country && (
                  <Check className="text-green-500" size={20} />
                )}
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'What certifications do you require? (Optional)',
      content: (
        <div className="space-y-3">
          {certifications.map((cert) => (
            <button
              key={cert}
              onClick={() => handleCertificationToggle(cert)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                answers.certifications?.includes(cert)
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">{cert}</div>
                {answers.certifications?.includes(cert) && (
                  <Check className="text-green-500" size={20} />
                )}
              </div>
            </button>
          ))}
          <p className="text-sm text-gray-500 mt-4">Select all that apply</p>
        </div>
      )
    },
    {
      title: 'What packaging option do you prefer? (Optional)',
      content: (
        <div className="space-y-3">
          {packagingOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer('packaging', option)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                answers.packaging === option
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">{option}</div>
                {answers.packaging === option && (
                  <Check className="text-green-500" size={20} />
                )}
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'Any additional requirements or special instructions?',
      content: (
        <div>
          <textarea
            value={answers.additionalRequirements || ''}
            onChange={(e) => handleAnswer('additionalRequirements', e.target.value)}
            placeholder="e.g., Specific grade, quality standards, delivery timeline, payment terms, etc."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none"
          />
        </div>
      )
    },
    {
      title: 'Your Contact Information',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={answers.name || ''}
              onChange={(e) => handleAnswer('name', e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              value={answers.email || ''}
              onChange={(e) => handleAnswer('email', e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone/WhatsApp Number *</label>
            <input
              type="tel"
              value={answers.phone || ''}
              onChange={(e) => handleAnswer('phone', e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name (Optional)</label>
            <input
              type="text"
              value={answers.company || ''}
              onChange={(e) => handleAnswer('company', e.target.value)}
              placeholder="Your company name"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">WhatsApp Quote Request</h3>
              <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Content */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">{steps[currentStep].title}</h4>
          {steps[currentStep].content}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <MessageCircle size={20} />
                Open WhatsApp
              </>
            ) : (
              <>
                Next
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppQuestionnaire;









