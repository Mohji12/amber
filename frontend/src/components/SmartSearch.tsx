import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, Filter, ChevronDown } from 'lucide-react';
import { smartSearch, generateSuggestions, SearchHistory, SearchResult, AdvancedFilters } from '../utils/smartSearch';

interface SmartSearchProps<T> {
  items: T[];
  searchFields: string[];
  onResults: (results: SearchResult<T>[]) => void;
  onClear: () => void;
  placeholder?: string;
  showAdvancedFilters?: boolean;
  showSuggestions?: boolean;
  showHistory?: boolean;
  className?: string;
  maxSuggestions?: number;
  threshold?: number;
}

function SmartSearch<T>({
  items,
  searchFields,
  onResults,
  onClear,
  placeholder = "Search...",
  showAdvancedFilters = false,
  showSuggestions = true,
  showHistory = true,
  className = "",
  maxSuggestions = 5,
  threshold = 0.3
}: SmartSearchProps<T>) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilters>({});
  const [searchHistory] = useState<string[]>(SearchHistory.getHistory());
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      onResults([]);
      return;
    }

    const results = smartSearch(items, searchQuery, {
      fields: searchFields,
      threshold,
      limit: 50,
      includeSynonyms: true
    });

    onResults(results);
  }, [items, searchFields, threshold, onResults]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Debounce search
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
    
    // Generate suggestions
    if (showSuggestions && value.length >= 2) {
      const newSuggestions = generateSuggestions(items, value, searchFields, maxSuggestions);
      setSuggestions(newSuggestions);
      setShowSuggestionsList(true);
    } else {
      setSuggestions([]);
      setShowSuggestionsList(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestionsList(false);
    performSearch(suggestion);
    SearchHistory.add(suggestion);
  };

  // Handle history click
  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    setShowSuggestionsList(false);
    performSearch(historyItem);
  };

  // Handle clear
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestionsList(false);
    onClear();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestionsList(false);
    } else if (e.key === 'Enter' && query.trim()) {
      setShowSuggestionsList(false);
      performSearch(query);
      SearchHistory.add(query);
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestionsList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 || searchHistory.length > 0) {
              setShowSuggestionsList(true);
            }
          }}
          placeholder={placeholder}
          className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-lg text-sm sm:text-base"
          aria-label="Smart search"
        />
        
        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-12 flex items-center pr-2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {/* Advanced Filters Toggle */}
        {showAdvancedFilters && (
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            aria-label="Toggle advanced filters"
          >
            <Filter className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestionsList && (suggestions.length > 0 || searchHistory.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto"
        >
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          {/* Search History */}
          {showHistory && searchHistory.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Recent Searches
              </div>
              {searchHistory.slice(0, 5).map((historyItem, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(historyItem)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                >
                  <Clock className="h-3 w-3 mr-2 text-gray-400" />
                  {historyItem}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showAdvanced && showAdvancedFilters && (
        <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">Advanced Filters</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Categories</option>
                {/* Add your categories here */}
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setFilters({})}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowAdvanced(false)}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartSearch;
