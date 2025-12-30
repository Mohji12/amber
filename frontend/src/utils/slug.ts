/**
 * Slug utility functions for SEO-friendly URLs
 */

/**
 * Convert a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function createSlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique slug for a product
 * Includes product name and optionally ID for uniqueness
 * @param name - Product name
 * @param id - Optional product ID to ensure uniqueness
 * @returns A unique slug
 */
export function createProductSlug(name: string, id?: number): string {
  if (!name || typeof name !== 'string') {
    return id ? `product-${id}` : 'product';
  }
  const baseSlug = createSlug(name);
  // If ID is provided, append it to ensure uniqueness
  // Format: product-name-123
  return id ? `${baseSlug}-${id}` : baseSlug;
}

/**
 * Extract product ID from a slug if it exists
 * @param slug - The slug (e.g., "basmati-rice-premium-123")
 * @returns The product ID if found, null otherwise
 */
export function extractIdFromSlug(slug: string): number | null {
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  const id = parseInt(lastPart, 10);
  return !isNaN(id) && id > 0 ? id : null;
}

/**
 * Find product by slug
 * @param products - Array of products
 * @param slug - The slug to search for
 * @returns The matching product or null
 */
export function findProductBySlug(products: any[], slug: string): any | null {
  if (!products || !Array.isArray(products) || !slug) {
    return null;
  }
  
  // First try to extract ID from slug and find by ID
  const id = extractIdFromSlug(slug);
  if (id) {
    const productById = products.find(p => p.id === id);
    if (productById) return productById;
  }
  
  // Then try to match by slug
  return products.find(product => {
    if (!product || !product.name) return false;
    const productSlug = createProductSlug(product.name, product.id);
    return productSlug === slug || createSlug(product.name) === slug;
  }) || null;
}

/**
 * Generate a unique slug for a subcategory
 * Includes subcategory name and optionally ID for uniqueness
 * @param name - Subcategory name
 * @param id - Optional subcategory ID to ensure uniqueness
 * @returns A unique slug
 */
export function createSubcategorySlug(name: string, id?: number): string {
  if (!name || typeof name !== 'string') {
    return id ? `subcategory-${id}` : 'subcategory';
  }
  const baseSlug = createSlug(name);
  // If ID is provided, append it to ensure uniqueness
  // Format: subcategory-name-123
  return id ? `${baseSlug}-${id}` : baseSlug;
}

/**
 * Find subcategory by slug
 * @param subcategories - Array of subcategories
 * @param slug - The slug to search for
 * @returns The matching subcategory or null
 */
export function findSubcategoryBySlug(subcategories: any[], slug: string): any | null {
  if (!subcategories || !Array.isArray(subcategories) || !slug) {
    return null;
  }
  
  // First try to extract ID from slug and find by ID
  const id = extractIdFromSlug(slug);
  if (id) {
    const subcategoryById = subcategories.find(s => s.id === id);
    if (subcategoryById) return subcategoryById;
  }
  
  // Then try to match by slug
  return subcategories.find(subcategory => {
    if (!subcategory || !subcategory.name) return false;
    const subcategorySlug = createSubcategorySlug(subcategory.name, subcategory.id);
    return subcategorySlug === slug || createSlug(subcategory.name) === slug;
  }) || null;
}

