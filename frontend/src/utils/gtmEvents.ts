/**
 * Google Tag Manager Event Utilities
 * All tracking events go through GTM dataLayer
 */

/**
 * Fire quote_success event for Google Ads conversion tracking
 * @param source - Source identifier (e.g., 'quote_page', 'popup_form', 'contact_page')
 */
export function fireQuoteSuccess(source: string): void {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'quote_success',
      source
    });
  }
}

