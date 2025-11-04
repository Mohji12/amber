// Sitemap generator for SEO
export const generateSitemap = () => {
  const baseUrl = 'https://amberglobaltrade.com';
  const currentDate = new Date().toISOString();
  
  const staticPages = [
    {
      url: '/',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/products',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      url: '/blogs',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      url: '/contact',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    }
  ];

  // Blog pages (static blogs)
  const blogPages = [
    '/blogs/basmati-rice-export-business',
    '/blogs/how-to-source-basmati-rice',
    '/blogs/private-labeling-basmati-rice',
    '/blogs/organic-spice-export-business',
    '/blogs/private-labeling-spices',
    '/blogs/how-to-source-indian-spices',
    '/blogs/ginger-powder-sourcing-guide',
    '/blogs/private-labeling-ginger-powder',
    '/blogs/export-organic-ginger-powder'
  ].map(slug => ({
    url: slug,
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.6'
  }));

  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Function to generate and download sitemap
export const downloadSitemap = () => {
  const sitemap = generateSitemap();
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


