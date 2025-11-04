import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../api';
import LoadingSpinner from './LoadingSpinner';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts().then(data => {
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <p className="text-lg text-gray-600 mt-2">Handpicked for quality and excellence</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img src={product.image_url} alt={product.name} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600">Grade: {product.grade}</p>
                <Link to={`/products/${product.id}`} className="text-green-600 hover:underline mt-4 inline-block">View Details</Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/products" className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 