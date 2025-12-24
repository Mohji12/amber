/**
 * WhatsApp Integration Utilities
 */

// WhatsApp number: 9840563267 (India)
const WHATSAPP_NUMBER = '919840563267'; // Format: country code + number (no + sign for URL)

/**
 * Generate WhatsApp message from form data
 */
export function generateWhatsAppMessage(formData: {
  name?: string;
  email?: string;
  phone?: string;
  contact?: string;
  company?: string;
  aboutYou?: string;
  about_you?: string;
  productInterest?: string;
  product_interest?: string;
  quantity?: string;
  amount?: string;
  destination_country?: string;
  country?: string;
  message?: string;
  // Questionnaire answers
  quotationType?: string;
  productCategory?: string;
  specificProduct?: string;
  certifications?: string[];
  packaging?: string;
  additionalRequirements?: string;
}): string {
  const parts: string[] = [];
  
  parts.push('Hello! I am interested in getting a quote.');
  parts.push('');
  
  // Contact Information
  if (formData.name) {
    parts.push(`👤 Name: ${formData.name}`);
  }
  
  if (formData.company) {
    parts.push(`🏢 Company: ${formData.company}`);
  }

  if (formData.aboutYou || formData.about_you) {
    parts.push(`💼 Role: ${formData.aboutYou || formData.about_you}`);
  }
  
  if (formData.email) {
    parts.push(`📧 Email: ${formData.email}`);
  }
  
  if (formData.phone || formData.contact) {
    parts.push(`📱 Phone: ${formData.phone || formData.contact}`);
  }
  
  parts.push('');
  parts.push('📋 QUOTATION DETAILS:');
  parts.push('━━━━━━━━━━━━━━━━━━━━');
  
  // Quotation Type
  if (formData.quotationType) {
    const typeLabels: Record<string, string> = {
      'bulk-order': 'Bulk Order',
      'sample': 'Sample Request',
      'private-labeling': 'Private Labeling',
      'regular-order': 'Regular Order',
      'custom-requirement': 'Custom Requirement'
    };
    parts.push(`📦 Quotation Type: ${typeLabels[formData.quotationType] || formData.quotationType}`);
  }
  
  // Product Information
  if (formData.productCategory) {
    const categoryLabels: Record<string, string> = {
      'basmati-rice': 'Basmati Rice',
      'spices': 'Spices',
      'dry-fruits': 'Dry Fruits',
      'pulses': 'Pulses',
      'other': 'Other Products'
    };
    parts.push(`🏷️ Product Category: ${categoryLabels[formData.productCategory] || formData.productCategory}`);
  }
  
  if (formData.specificProduct) {
    parts.push(`🛍️ Specific Product: ${formData.specificProduct}`);
  } else if (formData.productInterest || formData.product_interest) {
    parts.push(`🛍️ Product Interest: ${formData.productInterest || formData.product_interest}`);
  }
  
  if (formData.quantity || formData.amount) {
    parts.push(`📊 Quantity Required: ${formData.quantity || formData.amount}`);
  }
  
  if (formData.destination_country || formData.country) {
    parts.push(`🌍 Destination Country: ${formData.destination_country || formData.country}`);
  }
  
  // Certifications
  if (formData.certifications && formData.certifications.length > 0) {
    parts.push(`✅ Required Certifications: ${formData.certifications.join(', ')}`);
  }
  
  // Packaging
  if (formData.packaging) {
    parts.push(`📦 Packaging Preference: ${formData.packaging}`);
  }
  
  // Additional Requirements
  if (formData.additionalRequirements || formData.message) {
    parts.push('');
    parts.push('📝 Additional Requirements:');
    parts.push(formData.additionalRequirements || formData.message || '');
  }
  
  parts.push('');
  parts.push('Thank you! I look forward to your response.');
  
  return parts.join('\n');
}

/**
 * Generate WhatsApp URL with pre-filled message
 */
export function getWhatsAppUrl(message?: string): string {
  const defaultMessage = message || 'Hello! I am interested in getting a quote for your products.';
  const encodedMessage = encodeURIComponent(defaultMessage);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

/**
 * Open WhatsApp with pre-filled message
 */
export function openWhatsApp(formData: {
  name?: string;
  email?: string;
  phone?: string;
  contact?: string;
  company?: string;
  aboutYou?: string;
  about_you?: string;
  productInterest?: string;
  product_interest?: string;
  quantity?: string;
  amount?: string;
  destination_country?: string;
  country?: string;
  message?: string;
  // Questionnaire answers
  quotationType?: string;
  productCategory?: string;
  specificProduct?: string;
  certifications?: string[];
  packaging?: string;
  additionalRequirements?: string;
}): void {
  const message = generateWhatsAppMessage(formData);
  const url = getWhatsAppUrl(message);
  window.open(url, '_blank');
}

