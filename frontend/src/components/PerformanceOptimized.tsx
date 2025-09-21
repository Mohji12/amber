import React, { memo, useMemo, useCallback } from 'react';
import { Package, Leaf, Award, Truck } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import LoadingSpinner from './LoadingSpinner';

// Memoized Subcategory Card for better performance
interface SubcategoryCardProps {
  subcategory: any;
  categoryName: string;
  searchResult?: any;
  onViewDetails: (id: number) => void;
}

export const MemoizedSubcategoryCard = memo<SubcategoryCardProps>(({ 
  subcategory, 
  categoryName, 
  searchResult,
  onViewDetails 
}) => {
  const handleViewDetails = useCallback(() => {
    onViewDetails(subcategory.id);
  }, [onViewDetails, subcategory.id]);

  const displayName = useMemo(() => {
    let name = subcategory.name
      .replace(/^Coffee\s*-\s*Indian\s*Specialty\s*Grades\s*\(Arabica\s*&\s*Robusta\)/i, 'Coffee')
      .replace(/^Olive\s*Oil\s*-\s*Extra\s*Virgin\s*\(Gourmet\s*White-Label\s*Range\)/i, 'Olive Oil')
      .replace(/^green\s*chili/i, 'Green Chili')
      .replace(/^chili/i, 'Chili')
      .replace(/^Arabica\s*Coffee\s*\(Single\s*Estate\s*-\s*Premium\s*Export\)/i, 'Arabica Coffee');
    
    if (name.length > 25) {
      name = name.substring(0, 22) + '...';
    }
    
    return name;
  }, [subcategory.name]);

  return (
    <div
      className="group bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-800 hover:scale-105 border border-white/50 cursor-pointer relative overflow-hidden flex flex-col h-full min-h-[320px] sm:min-h-[400px]"
      onClick={handleViewDetails}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') handleViewDetails(); }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-800 rounded-2xl sm:rounded-3xl" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="aspect-square mb-4 sm:mb-6 overflow-hidden rounded-xl sm:rounded-2xl relative bg-gradient-to-br from-green-50 to-emerald-50">
          <OptimizedImage
            src={subcategory.image_url || 'https://via.placeholder.com/400x400?text=Category'}
            alt={subcategory.name}
            className="w-full h-full"
            lazy={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl" />
        </div>

        <div className="flex flex-col flex-grow">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-green-700 transition-colors line-clamp-2">
            {searchResult ? (
              <span dangerouslySetInnerHTML={{ __html: searchResult.highlightedText }} />
            ) : (
              displayName
            )}
          </h3>
          
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
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 sm:py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
              View Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

MemoizedSubcategoryCard.displayName = 'MemoizedSubcategoryCard';

// Memoized Product Card
interface ProductCardProps {
  product: any;
  onQuote: (product: any) => void;
  onDetails: (id: number) => void;
}

export const MemoizedProductCard = memo<ProductCardProps>(({ product, onQuote, onDetails }) => {
  const handleQuote = useCallback(() => {
    onQuote(product);
  }, [onQuote, product]);

  const handleDetails = useCallback(() => {
    onDetails(product.id);
  }, [onDetails, product.id]);

  return (
    <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-800 hover:scale-105 border border-white/50 cursor-pointer relative overflow-hidden flex flex-row h-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-800 rounded-3xl" />
      
      <div className="relative z-10 flex flex-row w-full">
        <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 mr-4 sm:mr-6 overflow-hidden rounded-xl relative bg-gradient-to-br from-green-50 to-emerald-50">
          <OptimizedImage
            src={product.image_url || 'https://via.placeholder.com/400x400?text=Product'}
            alt={product.name}
            className="w-full h-full"
            lazy={true}
            sizes="(max-width: 640px) 128px, 160px"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between min-h-[128px] sm:min-h-[160px]">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
              {product.name}
            </h3>
            
            {product.details && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                {product.details.length > 120 
                  ? product.details.substring(0, 117) + '...' 
                  : product.details}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
              onClick={handleQuote}
            >
              Get Quote
            </button>
            <button
              className="flex-1 bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
              onClick={handleDetails}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

MemoizedProductCard.displayName = 'MemoizedProductCard';

// Memoized Loading Spinner
export const MemoizedLoadingSpinner = memo<{ size?: 'small' | 'medium' | 'large' }>(({ size = 'medium' }) => {
  return <LoadingSpinner size={size} />;
});

MemoizedLoadingSpinner.displayName = 'MemoizedLoadingSpinner';

// Memoized Icon Components
export const MemoizedPackageIcon = memo(() => <Package size={16} className="sm:w-5 sm:h-5" />);
export const MemoizedLeafIcon = memo(() => <Leaf size={16} className="sm:w-5 sm:h-5" />);
export const MemoizedAwardIcon = memo(() => <Award size={16} className="sm:w-5 sm:h-5" />);
export const MemoizedTruckIcon = memo(() => <Truck size={16} className="sm:w-5 sm:h-5" />);

MemoizedPackageIcon.displayName = 'MemoizedPackageIcon';
MemoizedLeafIcon.displayName = 'MemoizedLeafIcon';
MemoizedAwardIcon.displayName = 'MemoizedAwardIcon';
MemoizedTruckIcon.displayName = 'MemoizedTruckIcon';

