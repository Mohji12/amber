import React, { useState, useEffect } from 'react';
import { Package, Leaf, Award, Truck, Search, TrendingUp, Crown, Heart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { getSubcategories, getCategories } from '../api';

const Subcategories = ({ isHome = false }: { isHome?: boolean }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [subs, cats] = await Promise.all([
          getSubcategories(),
          getCategories()
        ]);
        setSubcategories(Array.isArray(subs) ? subs : []);
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
        setSubcategories([]);
        setCategories([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Group subcategories by category
  const groupedSubcategories: { [key: string]: any[] } = {};
  subcategories.forEach(subcategory => {
    const catId = subcategory.category_id || 'uncategorized';
    if (!groupedSubcategories[catId]) groupedSubcategories[catId] = [];
    groupedSubcategories[catId].push(subcategory);
  });

  // Filter by search
  const filteredSubcategories = (catSubcategories: any[]) =>
    catSubcategories.filter(subcategory =>
      subcategory.name.toLowerCase().includes(search.toLowerCase()) ||
      (subcategory.description || '').toLowerCase().includes(search.toLowerCase())
    );

  // Shuffle subcategories for random display
  function shuffleArray(array: any[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return (
    <section id="subcategories" className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-3xl animate-float top-1/4 left-1/4" />
        <div className="absolute w-64 h-64 bg-gradient-to-r from-emerald-200/15 to-green-200/15 rounded-full blur-2xl animate-float bottom-1/4 right-1/4" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Our Product Categories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our specialized product categories, each offering premium quality items sourced from the finest farms across India
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); }}
              placeholder="Search for subcategories or descriptions..."
              className="w-full px-6 py-4 pl-12 rounded-2xl border-2 border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all bg-white/80 backdrop-blur-sm shadow-lg"
              aria-label="Search subcategories"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search size={20} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Enhanced Category Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            key="all"
            onClick={() => setActiveCategory('all')}
            className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-green-50 border-2 border-green-200 hover:border-green-300 shadow-lg hover:shadow-xl'
            }`}
          >
            <Package size={20} />
            <span>All Categories</span>
          </button>
          {categories.map((category: any) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-green-50 border-2 border-green-200 hover:border-green-300 shadow-lg hover:shadow-xl'
              }`}
            >
              <Award size={20} />
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Subcategories Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <LoadingSpinner size="lg" color="green" />
              <p className="mt-4 text-gray-600">Loading product categories...</p>
            </div>
          </div>
        ) : (
          <>
            {activeCategory === 'all' ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                  {shuffleArray(subcategories)
                    .filter(subcategory =>
                      subcategory.name.toLowerCase().includes(search.toLowerCase()) ||
                      (subcategory.description || '').toLowerCase().includes(search.toLowerCase())
                    )
                    .slice(0, isHome ? 8 : subcategories.length)
                    .map(subcategory => (
                      <SubcategoryCard
                        key={subcategory.id}
                        subcategory={subcategory}
                        categoryName={categories.find(cat => cat.id === subcategory.category_id)?.name || 'Uncategorized'}
                      />
                    ))}
                  {subcategories.length === 0 && (
                    <div className="text-center col-span-full py-16">
                      <div className="text-gray-400 text-lg">No subcategories available at the moment.</div>
                      <p className="text-gray-500 mt-2">Please check back later or contact us for custom requirements.</p>
                    </div>
                  )}
                </div>
                {isHome && (
                  <div className="flex justify-center mt-12">
                    <Link to="/products" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-10 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-xl">
                      Explore All Categories
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {categories.find((cat: any) => cat.id === activeCategory)?.name || 'Category'} Subcategories
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredSubcategories(groupedSubcategories[activeCategory] || []).map((subcategory) => (
                    <SubcategoryCard
                      key={subcategory.id}
                      subcategory={subcategory}
                      categoryName={categories.find(cat => cat.id === subcategory.category_id)?.name || 'Uncategorized'}
                    />
                  ))}
                  {(!groupedSubcategories[activeCategory] || filteredSubcategories(groupedSubcategories[activeCategory]).length === 0) && (
                    <div className="text-center col-span-full py-16">
                      <div className="text-gray-400 text-lg">No subcategories found in this category.</div>
                      <p className="text-gray-500 mt-2">Try selecting a different category or search for something else.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

function SubcategoryCard({ subcategory, categoryName }: { subcategory: any, categoryName: string }) {
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

  return (
    <div
      className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/50 cursor-pointer relative overflow-hidden"
      aria-label="Subcategory card"
      onClick={handleViewDetails}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') handleViewDetails(); }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      
      <div className="relative z-10">
        <div className="aspect-square mb-6 overflow-hidden rounded-2xl relative bg-gradient-to-br from-green-50 to-emerald-50">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-2xl">
              <LoadingSpinner size="md" color="green" />
            </div>
          )}
          <img
            src={subcategory.image_url || 'https://via.placeholder.com/400x400?text=Category'}
            alt={subcategory.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            aria-label="Subcategory image"
          />
          {/* Overlay on image hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        </div>

        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors flex-1">{subcategory.name}</h3>
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
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Category:</span>
            <span className="font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">{categoryName}</span>
          </div>
          {subcategory.description && (
            <div className="text-sm text-gray-600 line-clamp-3">
              {subcategory.description}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 font-semibold py-3 px-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg"
            onClick={e => { e.stopPropagation(); handleViewDetails(); }}
            aria-label={`View products in ${subcategory.name}`}
          >
            View Products
          </button>
        </div>
      </div>
    </div>
  );
}

export default Subcategories; 