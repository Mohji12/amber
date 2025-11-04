import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs?: FAQItem[];
  className?: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: "What certifications does Amber Global Trade have?",
    answer: "We are FSSAI certified, APEDA registered, ISO compliant, and have all necessary export licenses. Our products meet international quality standards for global export."
  },
  {
    question: "What is the minimum order quantity (MOQ) for your products?",
    answer: "Our MOQ varies by product, typically starting from 100 KG for most agricultural products. We offer flexible quantities to meet both small and large-scale export requirements."
  },
  {
    question: "Which countries do you export to?",
    answer: "We export to 25+ countries worldwide including the Middle East, North America, Europe, and Asia. Our products are shipped globally with full compliance documentation."
  },
  {
    question: "How do you ensure product quality?",
    answer: "We maintain strict quality control through lab testing, proper storage facilities, and regular quality audits. All products undergo rigorous testing before export to ensure premium quality."
  },
  {
    question: "What is your lead time for orders?",
    answer: "Our standard lead time is 7-14 days for most products, depending on quantity and destination. We provide detailed timelines during the quotation process."
  },
  {
    question: "Do you provide private labeling services?",
    answer: "Yes, we offer comprehensive private labeling services including custom packaging, branding, and labeling to help you build your own brand without owning manufacturing facilities."
  },
  {
    question: "What payment terms do you accept?",
    answer: "We accept various payment methods including bank transfers, letters of credit (LC), and other secure payment options. Terms are discussed during the quotation process."
  },
  {
    question: "Do you provide export documentation?",
    answer: "Yes, we handle all export documentation including certificates of origin, phytosanitary certificates, commercial invoices, and all required compliance documents."
  }
];

const FAQ: React.FC<FAQProps> = ({ faqs = defaultFAQs, className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-16 bg-gradient-to-br from-gray-50 to-emerald-50 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get answers to common questions about our agricultural export services and products.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="text-emerald-600 flex-shrink-0" size={20} />
                ) : (
                  <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                )}
              </button>
              
              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-6 pb-4 text-gray-600 leading-relaxed"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;


