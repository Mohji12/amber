/**
 * Google Analytics gtag TypeScript declarations
 * 
 * This file provides type definitions for the Google Analytics gtag function
 * that is loaded via the script tag in index.html
 */

interface Window {
  dataLayer: any[];
  gtag: (
    command: 'config' | 'event' | 'set' | 'js',
    targetId: string | Date,
    config?: {
      page_path?: string;
      page_title?: string;
      page_location?: string;
      [key: string]: any;
    }
  ) => void;
}

declare const gtag: Window['gtag'];

