/**
 * Meta Tag Injector Utility
 * Fetches and injects server-rendered meta tags before React hydration
 * Improves SEO by ensuring meta tags are visible in initial HTML
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nlq4zcho6j.execute-api.ap-south-1.amazonaws.com';

/**
 * Fetch meta tags from backend API
 */
async function fetchMetaTags(path: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/seo/meta-tags?path=${encodeURIComponent(path)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch meta tags for ${path}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    return html;
  } catch (error) {
    console.warn(`Error fetching meta tags for ${path}:`, error);
    return null;
  }
}

/**
 * Inject meta tags into document head
 */
function injectMetaTags(html: string): void {
  // Create a temporary container to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Extract all elements (title, meta, link, script)
  const elements = Array.from(tempDiv.querySelectorAll('title, meta, link[rel="canonical"], script[type="application/ld+json"]'));

  elements.forEach((element) => {
    const tagName = element.tagName.toLowerCase();

    if (tagName === 'title') {
      // Update or create title tag
      let titleTag = document.querySelector('title');
      if (!titleTag) {
        titleTag = document.createElement('title');
        document.head.appendChild(titleTag);
      }
      titleTag.textContent = element.textContent || '';
    } else if (tagName === 'meta') {
      // Handle meta tags
      const meta = element as HTMLMetaElement;
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      const content = meta.getAttribute('content');

      if (name && content) {
        // Remove existing meta tag if present
        const existing = document.querySelector(
          meta.getAttribute('property')
            ? `meta[property="${name}"]`
            : `meta[name="${name}"]`
        );
        if (existing) {
          existing.remove();
        }

        // Create and append new meta tag
        const newMeta = document.createElement('meta');
        if (meta.getAttribute('property')) {
          newMeta.setAttribute('property', name);
        } else {
          newMeta.setAttribute('name', name);
        }
        newMeta.setAttribute('content', content);
        document.head.appendChild(newMeta);
      }
    } else if (tagName === 'link' && element.getAttribute('rel') === 'canonical') {
      // Handle canonical link
      const href = element.getAttribute('href');
      if (href) {
        // Remove existing canonical if present
        const existing = document.querySelector('link[rel="canonical"]');
        if (existing) {
          existing.remove();
        }

        // Create and append canonical link
        const canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', href);
        document.head.appendChild(canonical);
      }
    } else if (tagName === 'script' && element.getAttribute('type') === 'application/ld+json') {
      // Handle JSON-LD structured data
      const scriptContent = element.textContent;
      if (scriptContent) {
        // Remove existing JSON-LD scripts with same content (optional - can keep multiple)
        // For now, we'll just append it
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.textContent = scriptContent;
        document.head.appendChild(script);
      }
    }
  });
}

/**
 * Initialize meta tag injection on page load
 * Should be called before React hydration
 */
export async function injectMetaTagsOnLoad(): Promise<void> {
  // Only run on client side
  if (typeof window === 'undefined') {
    return;
  }

  // Get current path
  const path = window.location.pathname + window.location.search;

  // Fetch and inject meta tags
  const html = await fetchMetaTags(path);
  if (html) {
    injectMetaTags(html);
  }
}

/**
 * Inject meta tags for a specific path (for client-side navigation)
 */
export async function injectMetaTagsForPath(path: string): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  const html = await fetchMetaTags(path);
  if (html) {
    injectMetaTags(html);
  }
}
