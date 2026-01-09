/**
 * TrailingSlashRedirect Component
 * Enforces trailing slashes on all routes except homepage for SEO consistency
 */
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TrailingSlashRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname, search, hash } = location;
    
    // Homepage should not have trailing slash
    if (pathname === '/') {
      return;
    }
    
    // Check if pathname needs trailing slash
    // Exclude file extensions and API routes
    const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname);
    const isApiRoute = pathname.startsWith('/api/');
    const isSitemap = pathname === '/sitemap.xml';
    const isRobots = pathname === '/robots.txt';
    
    // Don't add trailing slash to files, API routes, sitemap, or robots.txt
    if (hasFileExtension || isApiRoute || isSitemap || isRobots) {
      return;
    }
    
    // If pathname doesn't end with slash, redirect to add it
    if (!pathname.endsWith('/')) {
      const newPath = `${pathname}/${search}${hash}`;
      navigate(newPath, { replace: true });
    }
  }, [location, navigate]);

  return <>{children}</>;
};

export default TrailingSlashRedirect;
