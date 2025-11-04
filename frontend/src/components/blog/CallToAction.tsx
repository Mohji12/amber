import React, { useState } from 'react';
import QuoteForm from '../QuoteForm';

interface CallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  variant?: 'default' | 'minimal';
}

const CallToAction: React.FC<CallToActionProps> = ({
  title = "Ready to Start Your Import Journey?",
  description = "Get a personalized quote for your Basmati rice or spice requirements. Our experts are here to help you source the best quality products.",
  buttonText = "Get Free Quote",
  variant = 'default'
}) => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  if (variant === 'minimal') {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => setShowQuoteForm(true)}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-semibold"
          >
            {buttonText}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
        </div>
        
        {showQuoteForm && (
          <QuoteForm
            isOpen={showQuoteForm}
            onClose={() => setShowQuoteForm(false)}
            productInterest="General Inquiry"
          />
        )}
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 md:p-12 text-white my-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {title}
        </h2>
        <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => setShowQuoteForm(true)}
            className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-colors duration-200 flex items-center"
          >
            {buttonText}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-emerald-100 text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Free Consultation
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Quality Guaranteed
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Fast Delivery
          </div>
        </div>
      </div>
      
      {showQuoteForm && (
        <QuoteForm
          isOpen={showQuoteForm}
          onClose={() => setShowQuoteForm(false)}
          productInterest="General Inquiry"
        />
      )}
    </section>
  );
};

export default CallToAction;
