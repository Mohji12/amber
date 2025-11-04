import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { staticBlogs, StaticBlog } from '../data/staticBlogs';

const BlogsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const blogsPerPage = 6;
  const navigate = useNavigate();

  // Get unique categories from static blogs
  const categories = ['all', ...Array.from(new Set(staticBlogs.map(blog => blog.category)))];

  // Use only static blogs
  const allBlogs = staticBlogs.map(blog => ({
    ...blog,
    id: `static-${blog.id}`,
    type: 'static',
    title: blog.title,
    content: blog.excerpt,
    created_at: blog.publishedDate,
    author: blog.author
  }));

  const filteredBlogs = allBlogs.filter(blog => {
    const matchesSearch = (blog.title || '').toLowerCase().includes(search.toLowerCase()) ||
                         (blog.content || blog.excerpt || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const paginatedBlogs = filteredBlogs.slice((page - 1) * blogsPerPage, page * blogsPerPage);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);


  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-emerald-700 mb-4">Amber Global Blogs</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover insights, trends, and expert knowledge about global trade, agriculture, and sustainable business practices.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center items-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search blogs..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              aria-label="Search blogs"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
            aria-label="Filter by category"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {allBlogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Blogs Found</h2>
            <p className="text-gray-600">Check back later for new content!</p>
          </div>
        ) : (
          <>
            {/* Blog Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {paginatedBlogs.map((blog, idx) => (
                <article 
                  key={blog.id || idx} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => {
                    navigate(`/blogs/${blog.slug}`);
                  }}
                  aria-label="Blog post"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white">
                    <div className="flex items-center text-emerald-100 text-sm mb-3">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : ''}
                      <span className="mx-2">•</span>
                      <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs">
                        Featured
                      </span>
                    </div>
                    <h2 className="text-xl font-bold leading-tight group-hover:text-emerald-100 transition-colors duration-200">
                      {blog.heading || blog.title}
                    </h2>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {blog.content || blog.excerpt}
                    </p>
                    
                    {/* Author Info */}
                    {blog.author && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {blog.author}
                        <span className="mx-2">•</span>
                        <span className="text-emerald-600 font-medium">{blog.readTime}</span>
                      </div>
                    )}

                    {/* Read More Button */}
                    <button
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold group-hover:translate-x-1 transition-all duration-200"
                      aria-label={`Read more about ${blog.heading || blog.title}`}
                    >
                      Read More
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="Previous page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                      page === i + 1 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="Next page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogsPage; 