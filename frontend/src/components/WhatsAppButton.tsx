import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import WhatsAppQuestionnaire from './WhatsAppQuestionnaire';
import { openWhatsApp } from '../utils/whatsapp';
import type { QuestionnaireAnswers } from './WhatsAppQuestionnaire';

const WhatsAppButton: React.FC = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const handleClick = () => {
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = (answers: QuestionnaireAnswers) => {
    setShowQuestionnaire(false);
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

