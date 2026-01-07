import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import CompleteSEO from '../components/SEO/CompleteSEO';
import { useCustomSEO } from '../hooks/useSEO';
import { SEORequest } from '../api';

const NotFoundPage: React.FC = () => {
  // Generate SEO for 404 page
  const seoRequest: SEORequest = {
    url: '/404',
    page_type: 'static',
    primary_keyword: 'Page Not Found',
    secondary_keywords: [
      '404 error',
      'page not found',
      'amber global trade'
    ],
    short_description: 'The page you are looking for could not be found. Return to Amber Global Trade homepage or browse our products and services.'
  };

  const { seoData } = useCustomSEO(seoRequest);
  const navigate = useNavigate();

  return (
    <CompleteSEO seoData={seoData}>
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="inline-block bg-gradient-to-r from-emerald-100 to-green-100 rounded-full p-8 mb-6">
              <div className="text-8xl font-bold text-emerald-600">404</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-emerald-500 hover:text-emerald-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/products"
                className="p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors duration-200 text-gray-700 hover:text-emerald-700"
              >
                Products
              </Link>
              <Link
                to="/blogs"
                className="p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors duration-200 text-gray-700 hover:text-emerald-700"
              >
                Blogs
              </Link>
              <Link
                to="/contact"
                className="p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors duration-200 text-gray-700 hover:text-emerald-700"
              >
                Contact Us
              </Link>
              <Link
                to="/#about"
                className="p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors duration-200 text-gray-700 hover:text-emerald-700"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Search Suggestion */}
          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-emerald-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Looking for something specific?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Try browsing our <Link to="/products" className="text-emerald-600 hover:underline font-medium">products</Link> or{' '}
              <Link to="/blogs" className="text-emerald-600 hover:underline font-medium">blog articles</Link>.
            </p>
            <Link
              to="/contact"
              className="inline-block text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Contact our support team →
            </Link>
          </div>
        </div>
      </div>
    </CompleteSEO>
  );
};

export default NotFoundPage;

