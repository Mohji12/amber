// Smart Search Utility for AMBER Global Trade
// Provides advanced search capabilities with fuzzy matching, relevance scoring, and suggestions

export interface SearchResult<T> {
  item: T;
  score: number;
  matches: string[];
  highlightedText: string;
}

export interface SearchOptions {
  fields: string[];
  threshold?: number;
  limit?: number;
  includeSynonyms?: boolean;
  caseSensitive?: boolean;
}

// Product synonyms and related terms
const PRODUCT_SYNONYMS: Record<string, string[]> = {
  'onion': ['bulb', 'allium', 'vegetable', 'fresh produce'],
  'onions': ['bulbs', 'alliums', 'vegetables', 'fresh produce'],
  'spice': ['seasoning', 'condiment', 'flavoring', 'herb'],
  'spices': ['seasonings', 'condiments', 'flavorings', 'herbs'],
  'powder': ['ground', 'dried', 'processed'],
  'powders': ['ground', 'dried', 'processed'],
  'fresh': ['raw', 'natural', 'organic', 'unprocessed'],
  'dried': ['dehydrated', 'preserved', 'processed'],
  'organic': ['natural', 'eco-friendly', 'sustainable'],
  'export': ['international', 'global', 'overseas', 'foreign'],
  'import': ['international', 'global', 'overseas', 'foreign'],
  'trade': ['commerce', 'business', 'exchange', 'trading'],
  'agriculture': ['farming', 'cultivation', 'crop', 'produce'],
  'food': ['edible', 'consumable', 'nutrition', 'sustenance'],
  'quality': ['premium', 'grade', 'standard', 'excellence'],
  'certified': ['verified', 'approved', 'validated', 'accredited'],
  'fssai': ['food safety', 'regulatory', 'certification'],
  'apeda': ['agricultural', 'export', 'development', 'authority'],
  'iso': ['international', 'standard', 'organization', 'certification'],
  'gst': ['goods', 'services', 'tax', 'indirect tax'],
  'iec': ['import', 'export', 'code', 'registration']
};

// Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Calculate fuzzy match score
function calculateFuzzyScore(query: string, text: string): number {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    const position = textLower.indexOf(queryLower);
    const lengthRatio = queryLower.length / textLower.length;
    return 1.0 + (1 - position / textLower.length) * 0.5 + lengthRatio * 0.3;
  }
  
  // Fuzzy match using Levenshtein distance
  const distance = levenshteinDistance(queryLower, textLower);
  const maxLength = Math.max(queryLower.length, textLower.length);
  const similarity = 1 - (distance / maxLength);
  
  // Only return score if similarity is above threshold
  return similarity > 0.6 ? similarity * 0.8 : 0;
}

// Check for synonym matches
function checkSynonyms(query: string, text: string): number {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  for (const [key, synonyms] of Object.entries(PRODUCT_SYNONYMS)) {
    if (queryLower.includes(key)) {
      for (const synonym of synonyms) {
        if (textLower.includes(synonym)) {
          return 0.7; // Good score for synonym match
        }
      }
    }
  }
  
  return 0;
}

// Highlight matching text
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

// Main smart search function
export function smartSearch<T>(
  items: T[],
  query: string,
  options: SearchOptions
): SearchResult<T>[] {
  if (!query.trim()) return [];
  
  const {
    fields,
    threshold = 0.3,
    limit = 50,
    includeSynonyms = true,
    caseSensitive = false
  } = options;
  
  const queryLower = query.toLowerCase();
  const results: SearchResult<T>[] = [];
  
  for (const item of items) {
    let bestScore = 0;
    const matches: string[] = [];
    let bestMatchText = '';
    
    for (const field of fields) {
      const fieldValue = (item as any)[field];
      if (!fieldValue) continue;
      
      const text = caseSensitive ? fieldValue : fieldValue.toString().toLowerCase();
      const originalText = fieldValue.toString();
      
      // Exact match
      const exactScore = text.includes(queryLower) ? 1.0 : 0;
      
      // Fuzzy match
      const fuzzyScore = calculateFuzzyScore(query, originalText);
      
      // Synonym match
      const synonymScore = includeSynonyms ? checkSynonyms(query, originalText) : 0;
      
      const fieldScore = Math.max(exactScore, fuzzyScore, synonymScore);
      
      if (fieldScore > bestScore) {
        bestScore = fieldScore;
        bestMatchText = originalText;
      }
      
      if (fieldScore > threshold) {
        matches.push(field);
      }
    }
    
    if (bestScore > threshold) {
      results.push({
        item,
        score: bestScore,
        matches,
        highlightedText: highlightText(bestMatchText, query)
      });
    }
  }
  
  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);
  
  return results.slice(0, limit);
}

// Generate search suggestions
export function generateSuggestions(
  items: any[],
  query: string,
  fields: string[],
  maxSuggestions: number = 5
): string[] {
  if (!query.trim() || query.length < 2) return [];
  
  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();
  
  for (const item of items) {
    for (const field of fields) {
      const fieldValue = (item as any)[field];
      if (!fieldValue) continue;
      
      const text = fieldValue.toString().toLowerCase();
      
      // Find words that start with the query
      const words = text.split(/\s+/);
      for (const word of words) {
        if (word.startsWith(queryLower) && word.length > query.length) {
          suggestions.add(word);
        }
      }
      
      // Find partial matches
      if (text.includes(queryLower) && text.length > query.length) {
        const index = text.indexOf(queryLower);
        const start = Math.max(0, index - 10);
        const end = Math.min(text.length, index + query.length + 20);
        const suggestion = text.substring(start, end).trim();
        if (suggestion.length > query.length) {
          suggestions.add(suggestion);
        }
      }
    }
  }
  
  return Array.from(suggestions).slice(0, maxSuggestions);
}

// Search history management
export class SearchHistory {
  private static readonly STORAGE_KEY = 'amber_search_history';
  private static readonly MAX_HISTORY = 10;
  
  static add(query: string): void {
    if (!query.trim()) return;
    
    const history = this.getHistory();
    const filteredHistory = history.filter(item => item !== query);
    filteredHistory.unshift(query);
    
    const limitedHistory = filteredHistory.slice(0, this.MAX_HISTORY);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedHistory));
  }
  
  static getHistory(): string[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  
  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Advanced search filters
export interface AdvancedFilters {
  category?: string;
  subcategory?: string;
  priceRange?: { min: number; max: number };
  status?: string;
  dateRange?: { start: Date; end: Date };
  tags?: string[];
}

export function applyAdvancedFilters<T>(
  items: T[],
  filters: AdvancedFilters
): T[] {
  return items.filter(item => {
    const itemAny = item as any;
    
    if (filters.category && itemAny.category_id?.toString() !== filters.category) {
      return false;
    }
    
    if (filters.subcategory && itemAny.subcategory_id?.toString() !== filters.subcategory) {
      return false;
    }
    
    if (filters.priceRange) {
      const price = parseFloat(itemAny.price || itemAny.amount || 0);
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false;
      }
    }
    
    if (filters.status && itemAny.status !== filters.status) {
      return false;
    }
    
    if (filters.dateRange) {
      const itemDate = new Date(itemAny.created_at || itemAny.date || 0);
      if (itemDate < filters.dateRange.start || itemDate > filters.dateRange.end) {
        return false;
      }
    }
    
    if (filters.tags && filters.tags.length > 0) {
      const itemTags = (itemAny.tags || '').toLowerCase();
      const hasMatchingTag = filters.tags.some(tag => 
        itemTags.includes(tag.toLowerCase())
      );
      if (!hasMatchingTag) {
        return false;
      }
    }
    
    return true;
  });
}
