import React, { useState, useEffect } from 'react';
import { Package, Leaf, Award, Truck, Search, TrendingUp, Crown, Heart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import PopupForm from './PopupForm';
import LoadingSpinner from './LoadingSpinner';
import ProductDetailPage from '../pages/ProductDetailPage';
import { getSubcategories, getCategories, getProducts } from '../api';
import AnimatedSection from './AnimatedSection';
import SmartSearch from './SmartSearch';
import { SearchResult } from '../utils/smartSearch';
import { MemoizedSubcategoryCard } from './PerformanceOptimized';

// Product image mapping for manual image handling
const PRODUCT_IMAGE_MAPPING = {
  'Beetroot Powder': 'https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New+folder/Dehydrated+Foods/Beetroot+Powder.jpg',
  // Add more products as needed
};

// Function to get the appropriate image URL for a product
const getProductImage = (product: any) => {
  // Check if we have a manual mapping for this product
  if (PRODUCT_IMAGE_MAPPING[product.name as keyof typeof PRODUCT_IMAGE_MAPPING]) {
    return PRODUCT_IMAGE_MAPPING[product.name as keyof typeof PRODUCT_IMAGE_MAPPING];
  }
  // Fallback to database image_url or default image
  return product.image_url || product.image || 'https://via.placeholder.com/400x400?text=Product';
};

function ProductQuickViewModal({ product, isOpen, onClose, onQuote }: { product: any, isOpen: boolean, onClose: () => void, onQuote: () => void }) {
  if (!isOpen || !product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" tabIndex={-1} aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative flex flex-col md:flex-row gap-8" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" aria-label="Close product details">&times;</button>
        <img src={getProductImage(product)} alt={product.name} className="w-64 h-64 object-cover rounded-xl shadow" />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-emerald-800 mb-2">{product.name}</h2>
            <div className="text-gray-600 mb-2">{product.details}</div>
            <div className="text-sm text-gray-500 mb-2">Grade: {product.grade}</div>
            <div className="text-sm text-gray-500 mb-2">Origin: {product.origin}</div>
            <div className="text-sm text-gray-500 mb-2">MOQ: {product.moq}</div>
            <div className="text-sm text-gray-500 mb-2">Status: {product.status || 'In Stock'}</div>
            
            {/* Product Highlights */}
            {product.highlights && (
              <div className="mb-3">
                <div className="text-sm text-gray-500 font-medium mb-1">Highlights:</div>
                <div className="text-sm text-gray-700 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                  {product.highlights}
                </div>
              </div>
            )}

            {/* Private Label Options */}
            {product.private_label_options && (
              <div className="mb-3">
                <div className="text-sm text-gray-500 font-medium mb-1">Private Label Options:</div>
                <div className="text-sm text-gray-700 bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                  {product.private_label_options}
                </div>
              </div>
            )}

            {/* Use Cases */}
            {product.use_cases && (
              <div className="mb-3">
                <div className="text-sm text-gray-500 font-medium mb-1">Use Cases:</div>
                <div className="text-sm text-gray-700 bg-green-50 p-2 rounded border-l-4 border-green-400">
                  {product.use_cases}
                </div>
              </div>
            )}

            {/* Technical Specifications */}
            {product.specs && typeof product.specs === 'object' && Object.keys(product.specs).length > 0 && (
              <div className="mb-3">
                <div className="text-sm text-gray-500 font-medium mb-1">Technical Specifications:</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="text-xs bg-gray-50 p-2 rounded">
                      <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {product.certifications && (
              <div className="mb-3">
                <div className="text-sm text-gray-500 font-medium mb-1">Certifications:</div>
                <div className="grid grid-cols-2 gap-2">
                  {typeof product.certifications === 'string' && product.certifications.split(',').map((cert: string, index: number) => (
                    <div key={index} className="bg-gradient-to-r from-emerald-50 to-green-50 p-2 rounded border border-emerald-100">
                      <p className="text-emerald-700 text-xs font-medium text-center">{cert.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            {product.additional_info && (
              <div className="mb-3">
                <div className="text-sm text-gray-500 font-medium mb-1">Additional Information:</div>
                <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                  {product.additional_info}
                </div>
              </div>
            )}
          </div>
          <button
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow transition-all"
            onClick={onQuote}
            aria-label={`Get Quote for ${product.name}`}
          >
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
}

const Products = ({ 
  isHome = false, 
  initialProducts, 
  initialCategory, 
  pageTitle, 
  pageDescription,
  showProducts: propShowProducts
}: {
  isHome?: boolean;
  initialProducts?: any[];
  initialCategory?: string;
  pageTitle?: string;
  pageDescription?: string;
  showProducts?: boolean;
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<SearchResult<any>[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Always show subcategories first (natural flow: Categories → Subcategories → Products)
  const showProducts = false; // Always show subcategories, not products

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // console.log('🔄 Products: useEffect triggered');
      // console.log('🔄 Products: showProducts:', showProducts);
      // console.log('🔄 Products: propShowProducts:', propShowProducts);
      // console.log('🔄 Products: isHome:', isHome);
      // console.log('🔄 Products: condition result:', showProducts || propShowProducts);
      
      try {
        if (showProducts || propShowProducts) {
          // If initialProducts is provided, use those and fetch categories
          if (initialProducts) {
            setProducts(initialProducts);
          } else {
            // Fetch products from API when no initialProducts provided
            const prods = await getProducts();
            setProducts(Array.isArray(prods) ? prods : []);
          }
          const cats = await getCategories();
          setCategories(Array.isArray(cats) ? cats : []);
        } else {
          // Otherwise, fetch subcategories and categories
          const [subs, cats] = await Promise.all([
            getSubcategories(),
            getCategories()
          ]);
          setSubcategories(Array.isArray(subs) ? subs : []);
          setCategories(Array.isArray(cats) ? cats : []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setSubcategories([]);
        setProducts([]);
        setCategories([]);
      }
      setLoading(false);
    };
    fetchData();
    // Track products page view for analytics
    trackProductsPageView();
  }, [initialProducts, showProducts, propShowProducts]);

  // Track products page view for analytics
  const trackProductsPageView = () => {
    const currentTime = new Date().toISOString();
    
    // Track page view
    const pageViews = JSON.parse(localStorage.getItem('pageViews') || '{}');
    const currentPage = window.location.pathname;
    pageViews[currentPage] = (pageViews[currentPage] || 0) + 1;
    localStorage.setItem('pageViews', JSON.stringify(pageViews));
    
    // Track products page engagement
    const productsPageViews = JSON.parse(localStorage.getItem('productsPageViews') || '[]');
    productsPageViews.push({
      timestamp: currentTime,
      page_url: window.location.href,
      user_agent: navigator.userAgent
    });
    
    localStorage.setItem('productsPageViews', JSON.stringify(productsPageViews));
  };

  // Group subcategories by category
  const groupedSubcategories: { [key: string]: any[] } = {};
  subcategories.forEach(subcategory => {
    const catId = subcategory.category_id || 'uncategorized';
    if (!groupedSubcategories[catId]) groupedSubcategories[catId] = [];
    groupedSubcategories[catId].push(subcategory);
  });

  // Group products by category
  const groupedProducts: { [key: string]: any[] } = {};
  products.forEach(product => {
    const catId = product.category_id || 'uncategorized';
    if (!groupedProducts[catId]) groupedProducts[catId] = [];
    groupedProducts[catId].push(product);
  });

  // Filter by search - use smart search results if available
  const filteredSubcategories = (catSubcategories: any[]) => {
    if (isSearching && searchResults.length > 0) {
      // Use smart search results
      const resultIds = new Set(searchResults.map(r => r.item.id));
      return catSubcategories.filter(subcategory => resultIds.has(subcategory.id));
    }
    
    // Fallback to basic filtering
    return catSubcategories.filter(subcategory =>
      subcategory.name.toLowerCase().includes(search.toLowerCase()) ||
      (subcategory.description || '').toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredProducts = (catProducts: any[]) =>
    catProducts.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.details || '').toLowerCase().includes(search.toLowerCase())
    );

  // Prioritize wellness subcategories, then shuffle others
  function prioritizeWellnessSubcategories(array: any[]) {
    const arr = [...array];
    
    // Find wellness subcategories (assuming category_id 7 is wellness)
    const wellnessSubcategories = arr.filter(sub => sub.category_id === 7);
    const otherSubcategories = arr.filter(sub => sub.category_id !== 7);
    
    // Shuffle the non-wellness subcategories
    for (let i = otherSubcategories.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherSubcategories[i], otherSubcategories[j]] = [otherSubcategories[j], otherSubcategories[i]];
    }
    
    // Return wellness subcategories first, then others
    return [...wellnessSubcategories, ...otherSubcategories];
  }

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-3xl animate-float top-1/4 left-1/4" />
        <div className="absolute w-64 h-64 bg-gradient-to-r from-emerald-200/15 to-green-200/15 rounded-full blur-2xl animate-float bottom-1/4 right-1/4" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimatedSection animation="fadeInUp" className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 break-words leading-tight">
            {pageTitle || "Product Categories"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {pageDescription || "Browse our product categories to find what you're looking for."}
          </p>
        </AnimatedSection>

        {/* Smart Search Bar */}
        <AnimatedSection animation="fadeInUp" delay={200} className="flex justify-center mb-8 sm:mb-12">
          <div className="w-full max-w-2xl px-4 sm:px-0">
            <SmartSearch
              items={subcategories}
              searchFields={['name', 'description']}
              onResults={(results) => {
                setSearchResults(results);
                setIsSearching(results.length > 0);
              }}
              onClear={() => {
                setSearchResults([]);
                setIsSearching(false);
                setSearch('');
              }}
              placeholder="Search for categories, subcategories, or descriptions..."
              showSuggestions={true}
              showHistory={true}
              showAdvancedFilters={false}
              maxSuggestions={5}
              threshold={0.3}
              className="w-full"
            />
          </div>
        </AnimatedSection>



        {/* Search Results Indicator */}
        {isSearching && searchResults.length > 0 && (
          <AnimatedSection animation="fadeInUp" delay={300} className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <Search className="h-4 w-4 mr-2" />
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for your search
            </div>
          </AnimatedSection>
        )}

        {/* Enhanced Category Pills */}
        <AnimatedSection animation="fadeInUp" delay={400} className="mb-12 sm:mb-16">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-3 sm:gap-4">
            <button
              key="all"
              onClick={() => setActiveCategory('all')}
              className={`flex items-center justify-center space-x-2 sm:space-x-3 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-green-50 border-2 border-green-200 hover:border-green-300 shadow-lg hover:shadow-xl'
              }`}
            >
              <Package size={16} className="sm:w-5 sm:h-5" />
              <span className="truncate">All Categories</span>
            </button>
            {categories
              .sort((a: any, b: any) => {
                // Put Wellness & Medicinals first, then others
                if (a.name.toLowerCase() === 'wellness & medicinals') return -1;
                if (b.name.toLowerCase() === 'wellness & medicinals') return 1;
                return 0;
              })
              .map((category: any, index: number) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center justify-center space-x-2 sm:space-x-3 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-green-50 border-2 border-green-200 hover:border-green-300 shadow-lg hover:shadow-xl'
                }`}
              >
                <Award size={16} className="sm:w-5 sm:h-5" />
                <span className="truncate">{category.name}</span>
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Content Grid */}
        {loading ? (
          <AnimatedSection animation="fadeInUp" delay={600}>
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <LoadingSpinner size="large" />
                <p className="mt-4 text-gray-600">Loading premium subcategories...</p>
              </div>
            </div>
          </AnimatedSection>
        ) : (
          <>
    
            {activeCategory === 'all' ? (
              <>
                                  {/* Show subcategories in grid layout (natural flow: Categories → Subcategories → Products) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12">
                    {prioritizeWellnessSubcategories(filteredSubcategories(subcategories))
                      .slice(0, isHome ? 8 : subcategories.length)
                      .map((subcategory, index) => (
                        <AnimatedSection 
                          key={subcategory.id} 
                          animation={index % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'} 
                          delay={index * 50}
                        >
                          <MemoizedSubcategoryCard
                            subcategory={subcategory}
                            categoryName={categories.find(cat => cat.id === subcategory.category_id)?.name || 'Uncategorized'}
                            searchResult={searchResults.find(r => r.item.id === subcategory.id)}
                            onViewDetails={(id) => navigate(`/subcategories/${id}`)}
                          />
                        </AnimatedSection>
                      ))}
                  </div>
                
                {/* Empty state message */}
                {subcategories.length === 0 && (
                  <AnimatedSection animation="fadeInUp" className="text-center col-span-full py-16">
                    <div className="text-gray-400 text-lg">No subcategories available at the moment.</div>
                    <p className="text-gray-500 mt-2">Please check back later or contact us for custom requirements.</p>
                  </AnimatedSection>
                )}
                {isHome && (
                  <AnimatedSection animation="fadeInUp" delay={400} className="flex justify-center mt-12">
                    <Link to="/products" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-10 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-xl">
                      Explore All Categories
                    </Link>
                  </AnimatedSection>
                )}
              </>
            ) : (
              <div className="mb-12">
                <AnimatedSection animation="fadeInUp" className="mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    {categories.find((cat: any) => cat.id === activeCategory)?.name || 'Category'} Subcategories
                  </h3>
                </AnimatedSection>
                {/* Show filtered subcategories in grid layout (natural flow: Categories → Subcategories → Products) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {filteredSubcategories(groupedSubcategories[activeCategory] || []).map((subcategory, index) => (
                    <AnimatedSection 
                      key={subcategory.id} 
                      animation={index % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'} 
                      delay={index * 50}
                    >
                      <MemoizedSubcategoryCard
                        subcategory={subcategory}
                        categoryName={categories.find(cat => cat.id === subcategory.category_id)?.name || 'Uncategorized'}
                        searchResult={searchResults.find(r => r.item.id === subcategory.id)}
                        onViewDetails={(id) => navigate(`/subcategories/${id}`)}
                      />
                    </AnimatedSection>
                  ))}
                  {(!groupedSubcategories[activeCategory] || filteredSubcategories(groupedSubcategories[activeCategory]).length === 0) && (
                    <AnimatedSection animation="fadeInUp" className="text-center col-span-full py-16">
                      <div className="text-gray-400 text-lg">No subcategories found in this category.</div>
                      <p className="text-gray-500 mt-2">Try selecting a different category or search for something else.</p>
                    </AnimatedSection>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <PopupForm 
        isVisible={isQuoteOpen} 
        onClose={() => {
          setIsQuoteOpen(false);
          setSelectedProduct(null);
        }} 
        onSubmit={() => {
          setIsQuoteOpen(false);
          setSelectedProduct(null);
        }}
        productInfo={selectedProduct ? {
          name: selectedProduct.name,
          subcategory: selectedProduct.subcategory_name,
          category: selectedProduct.category_name
        } : undefined}
      />
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onQuote={() => { 
          setSelectedProduct(quickViewProduct);
          setIsQuickViewOpen(false); 
          setIsQuoteOpen(true); 
        }}
      />
    </section>
  );
};

function ProductCard({ product, onQuote, onDetails }: { product: any, onQuote: () => void, onDetails: () => void }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-800 hover:scale-105 border border-white/50 cursor-pointer relative overflow-hidden flex flex-row h-auto"
      aria-label="Product card"
      onClick={onDetails}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') onDetails(); }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-800 rounded-3xl" />
      
      <div className="relative z-10 flex flex-row w-full gap-6">
        <div className="w-48 h-48 flex-shrink-0 overflow-hidden rounded-2xl relative bg-gradient-to-br from-green-50 to-emerald-50">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-2xl">
              <LoadingSpinner size="medium" />
            </div>
          )}
          <img
            src={getProductImage(product)}
            alt={`${product.name} - Premium export quality ${product.category_name} with ${product.grade || 'Premium'} grade`}
            className={`w-full h-full object-cover transition-all duration-800 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            aria-label={`${product.name} product image`}
          />
          {/* Overlay on image hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        </div>

        <div className="flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors">
            {product.name}
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center bg-green-50 p-3 rounded-xl">
              <div className="text-sm text-gray-600 font-medium mb-1">Grade</div>
              <div className="font-bold text-green-700 text-sm">{product.grade}</div>
            </div>
            <div className="text-center bg-yellow-50 p-3 rounded-xl">
              <div className="text-sm text-gray-600 font-medium mb-1">MOQ</div>
              <div className="font-bold text-emerald-700 text-sm">{product.moq}</div>
            </div>
            <div className="text-center bg-pink-50 p-3 rounded-xl">
              <div className="text-sm text-gray-600 font-medium mb-1">Origin</div>
              <div className="font-bold text-gray-800 text-sm">{product.origin}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {product.certifications && typeof product.certifications === 'string' && product.certifications.split(',').map((cert: string) => (
              <span key={cert.trim()} className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
                {cert.trim()}
              </span>
            ))}
          </div>

          <div className="flex gap-3 mt-auto">
            {/* View Details button is hidden since product description is already visible in this detailed card view */}
            <button 
              className="w-full bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 font-semibold py-3 px-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg" 
              onClick={e => { e.stopPropagation(); onQuote(); }} 
              aria-label={`Get Quote for ${product.name}`}
            >
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubcategoryCard({ subcategory, categoryName, searchResult }: { subcategory: any, categoryName: string, searchResult?: SearchResult<any> }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/subcategories/${subcategory.id}`);
  };

  // Helper function to get badge styling
  const getBadgeInfo = (badgeType: string | undefined) => {
    switch (badgeType) {
      case 'best_seller':
        return {
          text: 'Best Seller',
          icon: TrendingUp,
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-700',
          iconColor: 'text-orange-600',
          borderColor: 'border-orange-200'
        };
      case 'premium':
        return {
          text: 'Premium',
          icon: Crown,
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-700',
          iconColor: 'text-purple-600',
          borderColor: 'border-purple-200'
        };
      case 'most_favorite':
        return {
          text: 'Most Favorite',
          icon: Heart,
          bgColor: 'bg-pink-100',
          textColor: 'text-pink-700',
          iconColor: 'text-pink-600',
          borderColor: 'border-pink-200'
        };
      default:
        return null;
    }
  };

  // Create a shorter, more product-focused display name
  const getDisplayName = (name: string) => {
    // Remove common prefixes and make it more product-focused
    let displayName = name
      .replace(/^Coffee\s*-\s*Indian\s*Specialty\s*Grades\s*\(Arabica\s*&\s*Robusta\)/i, 'Coffee')
      .replace(/^Olive\s*Oil\s*-\s*Extra\s*Virgin\s*\(Gourmet\s*White-Label\s*Range\)/i, 'Olive Oil')
      .replace(/^green\s*chili/i, 'Green Chili')
      .replace(/^chili/i, 'Chili')
      .replace(/^Arabica\s*Coffee\s*\(Single\s*Estate\s*-\s*Premium\s*Export\)/i, 'Arabica Coffee');
    
    // If the name is still too long, truncate it
    if (displayName.length > 25) {
      displayName = displayName.substring(0, 22) + '...';
    }
    
    return displayName;
  };

  return (
    <div
      className="group bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-800 hover:scale-105 border border-white/50 cursor-pointer relative overflow-hidden flex flex-col h-full min-h-[320px] sm:min-h-[400px]"
      aria-label="Subcategory card"
      onClick={handleViewDetails}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') handleViewDetails(); }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-800 rounded-2xl sm:rounded-3xl" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="aspect-square mb-4 sm:mb-6 overflow-hidden rounded-xl sm:rounded-2xl relative bg-gradient-to-br from-green-50 to-emerald-50">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl sm:rounded-2xl">
              <LoadingSpinner size="medium" />
            </div>
          )}
          <img
            src={subcategory.image_url || 'https://via.placeholder.com/400x400?text=Category'}
            alt={`${subcategory.name} - Premium export quality ${subcategory.category_name} products`}
            className={`w-full h-full object-cover transition-all duration-800 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            aria-label={`${subcategory.name} products`}
          />
          {/* Overlay on image hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl" />
        </div>

        <div className="flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors flex-1">
              {searchResult ? (
                <span dangerouslySetInnerHTML={{ __html: searchResult.highlightedText }} />
              ) : (
                getDisplayName(subcategory.name)
              )}
            </h3>
            {subcategory.badge_type && getBadgeInfo(subcategory.badge_type) && (() => {
              const badgeInfo = getBadgeInfo(subcategory.badge_type)!;
              const IconComponent = badgeInfo.icon;
              return (
                <div className={`ml-2 flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badgeInfo.bgColor} ${badgeInfo.textColor} ${badgeInfo.borderColor}`}>
                  <IconComponent className={`w-3 h-3 ${badgeInfo.iconColor}`} />
                  <span className="hidden sm:inline">{badgeInfo.text}</span>
                </div>
              );
            })()}
          </div>
          
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-grow">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-600 font-medium">Category:</span>
              <span className="font-bold text-green-700 bg-green-100 px-2 sm:px-3 py-1 rounded-full text-xs">
                {categoryName}
              </span>
            </div>
            {subcategory.description && (
              <div className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {subcategory.description.length > 100 
                  ? subcategory.description.substring(0, 97) + '...' 
                  : subcategory.description}
              </div>
            )}
          </div>

          <div className="mt-auto">
            <button
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
              onClick={e => { e.stopPropagation(); handleViewDetails(); }}
              aria-label={`View products in ${getDisplayName(subcategory.name)}`}
            >
              View Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Products;