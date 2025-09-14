import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStaticBlogBySlug, getRelatedStaticBlogs, StaticBlog } from '../data/staticBlogs';
import SEOHead from '../components/blog/SEOHead';
import Breadcrumb from '../components/blog/Breadcrumb';
import RelatedBlogs from '../components/blog/RelatedBlogs';
import CallToAction from '../components/blog/CallToAction';

const StaticBlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  if (!slug) {
    navigate('/blogs');
    return null;
  }

  const blog = getStaticBlogBySlug(slug);
  const relatedBlogs = getRelatedStaticBlogs(slug, 3);

  if (!blog) {
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
            <p className="text-gray-600">The blog you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.featuredImage || "/assets/og-default.jpg",
    "author": {
      "@type": "Organization",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Amber Global",
      "logo": {
        "@type": "ImageObject",
        "url": "/assets/logo.png"
      }
    },
    "datePublished": blog.publishedDate,
    "dateModified": blog.publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `/blogs/${blog.slug}`
    }
  };

  const breadcrumbItems = [
    { label: 'Blogs', href: '/blogs' },
    { label: blog.category, href: `/blogs?category=${blog.category.toLowerCase().replace(/\s+/g, '-')}` },
    { label: blog.title }
  ];

  return (
    <>
      <SEOHead
        title={blog.seo.metaTitle}
        description={blog.seo.metaDescription}
        keywords={blog.seo.keywords}
        ogImage={blog.seo.ogImage}
        canonicalUrl={`/blogs/${blog.slug}`}
        structuredData={structuredData}
      />
      
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

          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Main Blog Content */}
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-12 text-white">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center text-emerald-100 text-sm mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {blog.category}
                  <span className="mx-2">•</span>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(blog.publishedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  <span className="mx-2">•</span>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {blog.readTime}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  {blog.title}
                </h1>
                <p className="text-xl text-emerald-100 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
            </div>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="px-8 py-6">
                <img 
                  src={blog.featuredImage} 
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                />
              </div>
            )}

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

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="bg-gray-50 px-8 py-8 border-t border-gray-200">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{blog.author}</p>
                      <p className="text-sm text-gray-500">Published on {new Date(blog.publishedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
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

          {/* Call to Action */}
          <CallToAction />

          {/* Related Blogs */}
          <RelatedBlogs blogs={relatedBlogs} currentSlug={blog.slug} />
        </div>
      </div>
    </>
  );
};

export default StaticBlogDetailPage;
