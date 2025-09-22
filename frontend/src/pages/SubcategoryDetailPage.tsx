import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getSubcategory, getProductsBySubcategory } from '../api';
import PopupForm from '../components/PopupForm';
import Breadcrumb from '../components/Breadcrumb';

const SubcategoryDetailPage = () => {
  const { id } = useParams();
  const [subcategory, setSubcategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subcategoryId = parseInt(id!);
        const [subData, prodsData] = await Promise.all([
          getSubcategory(subcategoryId),
          getProductsBySubcategory(subcategoryId)
        ]);
        
        setSubcategory(subData);
        setProducts(Array.isArray(prodsData) ? prodsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // If the specific subcategory endpoint fails, try fallback to all products
        try {
          const { getProducts } = await import('../api');
          const allProducts = await getProducts();
          const subcategoryId = parseInt(id!);
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
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
      // Track subcategory view for analytics
      trackSubcategoryView();
    }
  }, [id]);

  // Track subcategory view for analytics
  const trackSubcategoryView = () => {
    const currentTime = new Date().toISOString();
    
    // Track page view
    const pageViews = JSON.parse(localStorage.getItem('pageViews') || '{}');
    const currentPage = window.location.pathname;
    pageViews[currentPage] = (pageViews[currentPage] || 0) + 1;
    localStorage.setItem('pageViews', JSON.stringify(pageViews));
    
    // Track subcategory engagement
    const subcategoryViews = JSON.parse(localStorage.getItem('subcategoryViews') || '{}');
    if (!subcategoryViews[id!]) {
      subcategoryViews[id!] = [];
    }
    
    subcategoryViews[id!].push({
      timestamp: currentTime,
      page_url: window.location.href,
      user_agent: navigator.userAgent
    });
    
    localStorage.setItem('subcategoryViews', JSON.stringify(subcategoryViews));
  };

  if (loading) {
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

  // Generate SEO data based on subcategory
  const seoTitle = `${subcategory.name} - Premium Export Products | Amber Global Trade`;
  const seoDescription = `Explore premium ${subcategory.name} products for export. ${subcategory.description || 'High-quality agricultural products'} with FSSAI certification, APEDA registration, and full compliance.`;
  const seoKeywords = `${subcategory.name}, ${subcategory.category_name}, export products, FSSAI certified, APEDA registered, premium quality, agricultural export, India export`;

  return (
    <div>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta name="author" content="Amber Global Trade" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://amberglobaltrade.com/subcategories/${id}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://amberglobaltrade.com/subcategories/${id}`} />
        <meta property="og:image" content={subcategory.image_url || 'https://amberglobaltrade.com/assets/subcategory-default.jpg'} />
        <meta property="og:site_name" content="Amber Global Trade" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={subcategory.image_url || 'https://amberglobaltrade.com/assets/subcategory-default.jpg'} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": subcategory.name,
            "description": subcategory.description || `Premium ${subcategory.name} products for export`,
            "url": `https://amberglobaltrade.com/subcategories/${id}`,
            "mainEntity": {
              "@type": "ItemList",
              "name": subcategory.name,
              "description": subcategory.description,
              "numberOfItems": products.length
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 pt-32 pb-6 sm:pt-28 lg:pt-28 lg:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={[
            { label: 'Products', href: '/products' },
            { label: subcategory.category_name, href: `/products?category=${subcategory.category_id}` },
            { label: subcategory.name, current: true }
          ]}
        />
        
        {/* Header */}
        <div className="text-center mb-12 px-2 sm:px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 break-words leading-tight">
            {subcategory.name}
          </h1>
          {subcategory.description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subcategory.description}
            </p>
          )}
        </div>

        {/* Products in Single Column Layout */}
        {products.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {products.map((product) => (
              <DetailedProductCard 
                key={product.id} 
                product={product} 
                onQuote={() => {
                  setSelectedProduct(product);
                  setIsQuoteOpen(true);
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
    </div>
  );
}

function DetailedProductCard({ product, onQuote }: { product: any, onQuote: () => void }) {
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
              aria-label={`View details for ${product.name}`}
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