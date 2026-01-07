/**
 * Push events to Google Tag Manager dataLayer
 */
export function pushToDataLayer(event: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event,
      ...data,
    });
  }
}

/**
 * Quote / Enquiry successful submission
 */
export function trackQuoteSuccess(meta?: {
  source?: string;
  form_type?: string;
  product?: string;
  page?: string;
}) {
  pushToDataLayer('quote_success', {
    source: meta?.source || 'website',
    form_type: meta?.form_type || 'unknown',
    product: meta?.product || null,
    page: meta?.page || window.location.pathname,
  });
}


