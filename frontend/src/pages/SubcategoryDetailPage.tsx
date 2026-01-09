import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubcategory, getProductsBySubcategory, getSubcategories, getCategories } from '../api';
import { Link } from 'react-router-dom';
import PopupForm from '../components/PopupForm';
import Breadcrumb from '../components/Breadcrumb';
import CompleteSEO from '../components/SEO/CompleteSEO';
import { useSEO } from '../hooks/useSEO';
import { findSubcategoryBySlug, extractIdFromSlug, createProductSlug } from '../utils/slug';
import { generateQuoteUrl, trackQuoteClick, getTrackingParamsFromUrl } from '../utils/quoteTracking';

const SubcategoryDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [subcategory, setSubcategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, get all subcategories to find by slug
        const allSubcategories = await getSubcategories();
        const foundSubcategory = slug ? findSubcategoryBySlug(allSubcategories, slug) : null;
        
        if (!foundSubcategory) {
          setLoading(false);
          return;
        }
        
        setSubcategory(foundSubcategory);
        
        // Fetch parent category
        if (foundSubcategory.category_id) {
          try {
            const categories = await getCategories();
            const parentCategory = Array.isArray(categories) 
              ? categories.find((c: any) => c.id === foundSubcategory.category_id)
              : null;
            setCategory(parentCategory);
          } catch (error) {
            console.error('Error fetching category:', error);
          }
        }
        
        // Fetch SEO data using the subcategory ID
        const subcategoryId = foundSubcategory.id;
        
        // Fetch products for this subcategory
        try {
          const prodsData = await getProductsBySubcategory(subcategoryId);
          setProducts(Array.isArray(prodsData) ? prodsData : []);
        } catch (error) {
          // If the specific subcategory endpoint fails, try fallback to all products
          try {
            const { getProducts } = await import('../api');
            const allProducts = await getProducts();
            const filteredProducts = Array.isArray(allProducts) 
              ? allProducts.filter((p: any) => {
                  const productSubcategoryId = typeof p.subcategory_id === 'string' 
                    ? parseInt(p.subcategory_id) 
                    : p.subcategory_id;
                  return productSubcategoryId === subcategoryId;
                })
              : [];
            setProducts(filteredProducts);
          } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
          }
        }
        
        // Track subcategory view for analytics
        trackSubcategoryView(foundSubcategory.id);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);
  
  // Fetch SEO data using the SEO hook (use subcategory ID once found)
  const { seoData, loading: seoLoading } = useSEO('subcategory', subcategory?.id);

  // Track subcategory view for analytics
  const trackSubcategoryView = (subcategoryId: number) => {
    const currentTime = new Date().toISOString();
    
    // Track page view
    const pageViews = JSON.parse(localStorage.getItem('pageViews') || '{}');
    const currentPage = window.location.pathname;
    pageViews[currentPage] = (pageViews[currentPage] || 0) + 1;
    localStorage.setItem('pageViews', JSON.stringify(pageViews));
    
    // Track subcategory engagement
    const subcategoryViews = JSON.parse(localStorage.getItem('subcategoryViews') || '{}');
    if (!subcategoryViews[subcategoryId]) {
      subcategoryViews[subcategoryId] = [];
    }
    
    subcategoryViews[subcategoryId].push({
      timestamp: currentTime,
      page_url: window.location.href,
      user_agent: navigator.userAgent
    });
    
    localStorage.setItem('subcategoryViews', JSON.stringify(subcategoryViews));
  };

  if (loading || seoLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-500 mb-4"></div>
          <p className="text-gray-600 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!subcategory) {
    return (
      <div className="text-center text-gray-500 py-20">
        <h2 className="text-2xl font-semibold mb-2">Subcategory Not Found</h2>
        <p className="text-gray-400">The subcategory you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <CompleteSEO seoData={seoData}>
      
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 pt-32 pb-6 sm:pt-28 lg:pt-28 lg:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products/' },
            { label: subcategory.category_name || category?.name || 'Category', href: `/products/?category=${subcategory.category_id || category?.id || ''}` },
            { label: subcategory.name, current: true }
          ]}
        />
        
        {/* Parent Category & Navigation Links */}
        {(category || subcategory.category_name) && (
          <div className="mb-6 px-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-gray-600 text-sm">Browse:</span>
                {category && (
                  <Link
                    to={`/products/?category=${category.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors duration-200 text-sm font-medium border border-emerald-200"
                  >
                    All {category.name} Products
                  </Link>
                )}
                <Link
                  to="/products/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium border border-gray-200"
                >
                  All Products
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium border border-gray-200"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="text-center mb-12 px-2 sm:px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 break-words leading-tight">
            {seoData?.headings?.h1 || subcategory.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            {seoData?.content?.hero_tagline || subcategory.description}
          </p>
          {seoData?.content?.short_intro && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {seoData.content.short_intro}
            </p>
          )}
        </div>
        
        {/* SEO-generated long description */}
        {seoData?.content?.long_description && (
          <div className="max-w-4xl mx-auto mb-8 px-4">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {seoData.content.long_description}
              </p>
            </div>
          </div>
        )}
        
        {/* SEO-generated bullet features */}
        {seoData?.content?.bullet_features && seoData.content.bullet_features.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8 px-4">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {seoData.headings?.h2_sections?.[0] || 'Key Features'}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {seoData.content.bullet_features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* FAQ Section - SEO Generated */}
        {seoData?.faq && seoData.faq.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8 px-4">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {seoData.faq.map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products in Single Column Layout */}
        {products.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {products.map((product) => (
              <DetailedProductCard 
                key={product.id} 
                product={product} 
                navigate={navigate}
                subcategory={subcategory}
                onQuote={() => {
                  const trackingParams = getTrackingParamsFromUrl();
                  trackQuoteClick({
                    product: product.name,
                    subcategory: subcategory?.name,
                    category: product.category_name,
                    source: 'subcategory_detail',
                    ...trackingParams
                  });
                  navigate(generateQuoteUrl({
                    product: product.name,
                    subcategory: subcategory?.name,
                    category: product.category_name,
                    source: 'subcategory_detail',
                    ...trackingParams
                  }));
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg mb-4">No products available in this subcategory</div>
            <p className="text-gray-500">Please check back later or contact us for custom requirements.</p>
          </div>
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
          subcategory: subcategory?.name,
          category: selectedProduct.category_name
        } : undefined}
      />
      </div>
    </CompleteSEO>
  );
}

function DetailedProductCard({ product, onQuote, navigate, subcategory }: { product: any, onQuote: () => void, navigate: (path: string) => void, subcategory?: any }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl lg:rounded-3xl shadow-lg lg:shadow-xl hover:shadow-xl lg:hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Left Side - Image Section */}
        <div className="flex-shrink-0">
          <div className="relative">
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 z-10 rounded-2xl">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-500 mb-2"></div>
                  <p className="text-gray-500 text-xs">Loading image...</p>
                </div>
              </div>
            )}
            <img
              src={product.image_url || 'https://via.placeholder.com/400x400?text=Product'}
              alt={`${product.name} - Premium export quality ${product.category_name} with ${product.grade || 'Premium'} grade`}
              className={`w-48 h-48 lg:w-56 lg:h-56 object-cover rounded-2xl shadow-lg transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
            />
            {product.is_featured && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                Featured
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.details || 'Premium quality product with excellent specifications.'}
            </p>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-xl border border-emerald-100">
              <p className="text-sm text-gray-500 mb-1">Grade</p>
              <p className="font-semibold text-gray-900">{product.grade || 'Premium'}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100">
              <p className="text-sm text-gray-500 mb-1">MOQ</p>
              <p className="font-semibold text-gray-900">{product.moq || '100 KG'}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-100">
              <p className="text-sm text-gray-500 mb-1">Origin</p>
              <p className="font-semibold text-gray-900">{product.origin || 'India'}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-xl border border-orange-100">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className="font-semibold text-gray-900">{product.status || 'In Stock'}</p>
            </div>
          </div>

          {/* Product Highlights */}
          {product.highlights && (
            <div>
              <h4 className="text-sm lg:text-base font-semibold text-gray-900 mb-2">Highlights</h4>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-100">
                <p className="text-gray-700 text-sm leading-relaxed">{product.highlights}</p>
              </div>
            </div>
          )}

          {/* Private Label Options */}
          {product.private_label_options && (
            <div>
              <h4 className="text-sm lg:text-base font-semibold text-gray-900 mb-2">Private Label Options</h4>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                <p className="text-gray-700 text-sm leading-relaxed">{product.private_label_options}</p>
              </div>
            </div>
          )}

          {/* Use Cases */}
          {product.use_cases && (
            <div>
              <h4 className="text-sm lg:text-base font-semibold text-gray-900 mb-2">Use Cases</h4>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                <p className="text-gray-700 text-sm leading-relaxed">{product.use_cases}</p>
              </div>
            </div>
          )}

                      {/* Technical Specifications */}
            {product.specs && typeof product.specs === 'object' && Object.keys(product.specs).length > 0 && (
              <div>
                <h4 className="text-sm lg:text-base font-semibold text-gray-900 mb-2">Technical Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="bg-gradient-to-r from-gray-50 to-slate-50 p-3 rounded-lg border border-gray-100">
                      <span className="font-semibold text-gray-800 capitalize text-sm">{key.replace(/_/g, ' ')}:</span>
                      <p className="text-gray-700 text-sm mt-1">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Certifications */}
          {product.certifications && (
            <div>
              <h4 className="text-sm lg:text-base font-semibold text-gray-900 mb-2">Certifications</h4>
              <div className="grid grid-cols-2 gap-3">
                {typeof product.certifications === 'string' && product.certifications.split(',').map((cert: string, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-lg border border-emerald-100">
                    <p className="text-emerald-700 text-sm font-medium text-center">{cert.trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {product.additional_info && (
            <div>
              <h4 className="text-sm lg:text-base font-semibold text-gray-900 mb-2">Additional Information</h4>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                <p className="text-gray-700 text-sm leading-relaxed">{product.additional_info}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
              onClick={onQuote}
              aria-label={`Get Quote for ${product.name}`}
            >
              Get Quote
            </button>
            <button
              className="flex-1 bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
              onClick={() => navigate(`/products/${createProductSlug(product.name, product.id)}`)}
              aria-label={`View Details for ${product.name}`}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubcategoryDetailPage; 