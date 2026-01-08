import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, Award, Truck, Star, Scale, Calendar, Tag } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
// PopupForm removed - using /quote route instead
import Breadcrumb from '../components/Breadcrumb';
import CompleteSEO from '../components/SEO/CompleteSEO';
import InternalLinks from '../components/SEO/InternalLinks';
import { useSEO } from '../hooks/useSEO';
import { getProducts, trackProductView } from '../api';
import { findProductBySlug, createSubcategorySlug } from '../utils/slug';
import { generateQuoteUrl, trackQuoteClick, getTrackingParamsFromUrl } from '../utils/quoteTracking';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Removed isQuoteOpen - using /quote route instead
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts() as any[];
        const found = slug ? findProductBySlug(products, slug) : null;
        setProduct(found);
        
        // Track product view for real-time analytics
        if (found && found.id) {
          trackProductView(found.id);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);
  
  // Fetch SEO data using the SEO hook (use product ID once found)
  const { seoData, loading: seoLoading } = useSEO('product', product?.id);

  if (loading || seoLoading) return <div className="flex justify-center items-center min-h-[200px]"><LoadingSpinner size="large" /></div>;
  if (!product) return <div className="text-center text-gray-500">Product not found.</div>;

  return (
    <CompleteSEO seoData={seoData}>
      
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 pt-24 pb-6 lg:pt-28 lg:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={[
            { label: 'Products', href: '/products' },
            { label: product.category_name || 'Category', href: `/products?category=${product.category_id || ''}` },
            { label: product.subcategory_name || 'Subcategory', href: `/subcategories/${createSubcategorySlug(product.subcategory_name || '', product.subcategory_id)}` },
            { label: product.name || 'Product', current: true }
          ]}
        />

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="large" />
          </div>
        ) : !product ? (
          <div className="text-center text-gray-500 py-20">
            <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
            <p className="text-gray-400">The product you're looking for doesn't exist.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl overflow-hidden">
            {/* Main Product Section */}
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
              {/* Product Image */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 lg:p-6 flex items-center justify-center">
                <div className="relative">
                  <img 
                    src={product.image_url || 'https://images.pexels.com/photos/4198939/pexels-photo-4198939.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                    alt={seoData?.images?.[0]?.alt_text || `${product.name} - Premium export quality ${product.category_name} with ${product.grade || 'Premium'} grade from ${product.origin || 'India'}`} 
                    className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px] object-cover rounded-lg lg:rounded-xl shadow-lg lg:shadow-2xl"
                    loading="lazy"
                  />
                  {product.is_featured && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-bold shadow-lg">
                      Featured
                    </div>
                  )}
                </div>
              </div>

              {/* Product Information */}
              <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 break-words leading-tight">
                    {seoData?.headings?.h1 || product.name}
                  </h1>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    {seoData?.content?.short_intro || product.description || 'Premium quality product sourced from the finest locations.'}
                  </p>
                </div>

                {/* Key Information Cards */}
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-2 lg:p-3 rounded-lg lg:rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <Award className="text-emerald-600" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Grade</p>
                        <p className="font-semibold text-gray-900 text-xs lg:text-sm">{product.grade || 'Premium'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 lg:p-3 rounded-lg lg:rounded-xl border border-blue-100">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <Package className="text-blue-600" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">MOQ</p>
                        <p className="font-semibold text-gray-900 text-xs lg:text-sm">{product.moq || '100 KG'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-2 lg:p-3 rounded-lg lg:rounded-xl border border-purple-100">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <MapPin className="text-purple-600" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Origin</p>
                        <p className="font-semibold text-gray-900 text-xs lg:text-sm">{product.origin || 'India'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-2 lg:p-3 rounded-lg lg:rounded-xl border border-orange-100">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <Truck className="text-orange-600" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Availability</p>
                        <p className="font-semibold text-gray-900 text-xs lg:text-sm">{product.status || 'In Stock'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                {product.certifications && typeof product.certifications === 'string' && product.certifications.trim() && (
                  <div>
                    <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Star className="text-yellow-500" size={16} />
                      Certifications & Standards
                    </h3>
                    <div className="flex flex-wrap gap-1 lg:gap-2">
                      {product.certifications.split(',').map((cert: string) => (
                        <span key={cert.trim()} className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 lg:px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                          {cert.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEO Internal Links - Above Fold */}
                {seoData?.internal_links && seoData.internal_links.length > 0 && (
                  <div className="pt-2">
                    <InternalLinks 
                      links={seoData.internal_links} 
                      placement="above-fold"
                      className="mb-4"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 pt-2">
                  <button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm lg:text-base"
                    onClick={() => {
                      const trackingParams = getTrackingParamsFromUrl();
                      trackQuoteClick({
                        product: product.name,
                        subcategory: product.subcategory_name,
                        category: product.category_name,
                        source: 'product_detail',
                        ...trackingParams
                      });
                      navigate(generateQuoteUrl({
                        product: product.name,
                        subcategory: product.subcategory_name,
                        category: product.category_name,
                        source: 'product_detail',
                        ...trackingParams
                      }));
                    }}
                    aria-label={`Get Quote for ${product.name}`}
                  >
                    <Scale className="size-4" />
                    Get Quote
                  </button>
                </div>
              </div>
            </div>

            {/* SEO-Generated Long Description */}
            {seoData?.content?.long_description && (
              <div className="border-t border-gray-100 p-4 lg:p-6">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
                  {seoData.headings?.h2_sections?.[0] || 'About This Product'}
                </h2>
                <div className="prose prose-emerald max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm lg:text-base">
                    {seoData.content.long_description}
                  </p>
                </div>
              </div>
            )}

            {/* SEO-Generated Bullet Features */}
            {seoData?.content?.bullet_features && seoData.content.bullet_features.length > 0 && (
              <div className="border-t border-gray-100 p-4 lg:p-6 bg-gradient-to-r from-emerald-50 to-green-50">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
                  {seoData.headings?.h2_sections?.[1] || 'Key Features'}
                </h2>
                <ul className="space-y-2 lg:space-y-3">
                  {seoData.content.bullet_features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 lg:gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700 text-sm lg:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* SEO Internal Links - Mid Content */}
                {seoData?.internal_links && seoData.internal_links.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-emerald-200">
                    <InternalLinks 
                      links={seoData.internal_links} 
                      placement="mid-content"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Product Specifications */}
            <div className="border-t border-gray-100 p-4 lg:p-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2 lg:gap-3">
                <Tag className="text-emerald-600" size={20} />
                {seoData?.headings?.h2_sections?.[2] || 'Product Specifications'}
              </h2>
               
              {/* Product Highlights */}
              {product.highlights && (
                <div className="mb-4 lg:mb-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3 flex items-center gap-2">
                    <Star className="text-yellow-500" size={18} />
                    Product Highlights
                  </h3>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 lg:p-4 rounded-lg lg:rounded-xl border border-yellow-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{product.highlights}</p>
                  </div>
                </div>
              )}

              {/* Private Label Options */}
              {product.private_label_options && (
                <div className="mb-4 lg:mb-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3 flex items-center gap-2">
                    <Package className="text-blue-500" size={18} />
                    Private Label Options
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 lg:p-4 rounded-lg lg:rounded-xl border border-blue-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{product.private_label_options}</p>
                  </div>
                </div>
              )}

              {/* Use Cases */}
              {product.use_cases && (
                <div className="mb-4 lg:mb-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3 flex items-center gap-2">
                    <Truck className="text-green-500" size={18} />
                    Applications & Use Cases
                  </h3>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 lg:p-4 rounded-lg lg:rounded-xl border border-green-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{product.use_cases}</p>
                  </div>
                </div>
              )}

              {/* Technical Specifications */}
              {product.specs && typeof product.specs === 'object' && Object.keys(product.specs).length > 0 && (
                <div className="mb-4 lg:mb-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3 flex items-center gap-2">
                    <Scale className="text-purple-500" size={18} />
                    Technical Specifications
                  </h3>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 lg:p-4 rounded-lg lg:rounded-xl border border-purple-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="bg-white p-2 lg:p-3 rounded-lg border border-purple-200">
                          <p className="text-xs text-gray-500 font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                          <p className="text-gray-900 font-semibold text-sm">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                              )}
             </div>

            {/* SEO-Generated FAQ Section */}
            {seoData?.faq && seoData.faq.length > 0 && (
              <div className="border-t border-gray-100 p-4 lg:p-6">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                  {seoData.headings?.h2_sections?.[3] || 'Frequently Asked Questions'}
                </h2>
                <div className="space-y-4">
                  {seoData.faq.map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4 lg:p-5 shadow-sm">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* SEO Internal Links - FAQ Section */}
                {seoData?.internal_links && seoData.internal_links.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <InternalLinks 
                      links={seoData.internal_links} 
                      placement="faq"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Why Choose This Product */}
            <div className="border-t border-gray-100 p-6 lg:p-8 bg-gradient-to-r from-emerald-50 to-green-50">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3">
                <Star className="text-yellow-500" size={24} />
                {seoData?.headings?.h2_sections?.[4] || 'Why Choose This Product?'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div className="flex items-start gap-2 lg:gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
                    <Award className="text-emerald-600" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">Premium Quality</h4>
                    <p className="text-gray-600 text-sm lg:text-base">Sourced from the finest locations with strict quality control measures.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                    <Package className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">Reliable Supply</h4>
                    <p className="text-gray-600 text-sm lg:text-base">Consistent availability with flexible MOQ options for all business needs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                    <MapPin className="text-purple-600" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">Authentic Origin</h4>
                    <p className="text-gray-600 text-sm lg:text-base">Products sourced directly from their native regions ensuring authenticity.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
                    <Calendar className="text-orange-600" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">Fresh Stock</h4>
                    <p className="text-gray-600 text-sm lg:text-base">Regularly updated inventory with the latest harvest and production batches.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </CompleteSEO>
  );
};

export default ProductDetailPage; 
