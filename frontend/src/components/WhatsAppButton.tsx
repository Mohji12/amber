import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import WhatsAppQuestionnaire from './WhatsAppQuestionnaire';
import { openWhatsApp } from '../utils/whatsapp';
import { createEnquiry } from '../api';
import type { QuestionnaireAnswers } from './WhatsAppQuestionnaire';

const WhatsAppButton: React.FC = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const handleClick = () => {
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = async (answers: QuestionnaireAnswers) => {
    setShowQuestionnaire(false);

    // Basic enquiry payload for admin when using floating WhatsApp button
    const enquiryData = {
      name: answers.name || null,
      email: answers.email || null,
      contact_number: answers.phone || null,
      company_name: answers.company || null,
      required_amount: answers.quantity ? parseInt(answers.quantity, 10) : null,
      any_query: answers.additionalRequirements || null,
      product_interest: answers.specificProduct || null,
      destination_country: answers.destinationCountry || null
    };

    try {
      await createEnquiry(enquiryData);
      
      // Fire GTM event for Google Ads conversion tracking
      trackQuoteSuccess({
        form_type: 'whatsapp',
        source: 'whatsapp',
      });
    } catch (error) {
      console.error('Error creating WhatsApp enquiry from floating button:', error);
    }

    openWhatsApp(answers);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-110 animate-bounce-slow"
        aria-label="Contact us on WhatsApp"
        title="Contact us on WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="sr-only">Contact us on WhatsApp</span>
      </button>
      
      <WhatsAppQuestionnaire
        isOpen={showQuestionnaire}
        onClose={() => setShowQuestionnaire(false)}
        onComplete={handleQuestionnaireComplete}
      />
    </>
  );
};

export default WhatsAppButton;

