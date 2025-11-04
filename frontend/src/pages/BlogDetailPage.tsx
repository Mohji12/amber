import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { getBlog } from '../api';

const BlogDetailPage: React.FC = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          setError('Blog ID is required');
          return;
        }
        
        // Fetch the specific blog by ID
        const blogData = await getBlog(id);
        setBlog(blogData);
        
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 py-12 px-4 pt-28">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" color="green" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 py-12 px-4 pt-28">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="mb-8 inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
            aria-label="Back to blogs"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </button>
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h2>
            <p className="text-gray-600">{error || 'The blog you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 py-12 px-4 pt-28">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200 group"
          aria-label="Back to blogs"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blogs
        </button>

        {/* Main Blog Content */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-12 text-white">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center text-emerald-100 text-sm mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : ''}
                {blog.author && (
                  <>
                    <span className="mx-2">•</span>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {blog.author}
                  </>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                {blog.title}
              </h1>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-12">
            <div className="max-w-3xl mx-auto">
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.75'
                }}
              >
                {blog.content.split('\n').map((paragraph: string, index: number) => {
                  if (paragraph.trim() === '') {
                    return <div key={index} className="h-6"></div>;
                  }
                  
                  // Check if it's a heading (starts with **)
                  if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                    const headingText = paragraph.trim().replace(/\*\*/g, '');
                    return (
                      <h2 key={index} className="text-2xl font-bold text-emerald-800 mt-8 mb-4 pb-2 border-b-2 border-emerald-200">
                        {headingText}
                      </h2>
                    );
                  }
                  
                  // Check if it's a subheading (starts with single *)
                  if (paragraph.trim().startsWith('*') && paragraph.trim().endsWith('*') && !paragraph.trim().startsWith('**')) {
                    const subheadingText = paragraph.trim().replace(/\*/g, '');
                    return (
                      <h3 key={index} className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                        {subheadingText}
                      </h3>
                    );
                  }
                  
                  // Check if it's a bullet point
                  if (paragraph.trim().startsWith('- ')) {
                    const bulletText = paragraph.trim().substring(2);
                    return (
                      <div key={index} className="flex items-start mb-2">
                        <span className="text-emerald-500 mr-3 mt-2">•</span>
                        <span>{bulletText}</span>
                      </div>
                    );
                  }
                  
                  // Regular paragraph
                  return (
                    <p key={index} className="mb-6">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-gray-50 px-8 py-8 border-t border-gray-200">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">
                    {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : ''}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Blogs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailPage; 