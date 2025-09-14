import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-gray-600 mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      <Link 
        to="/" 
        className="flex items-center hover:text-emerald-600 transition-colors duration-200"
        aria-label="Home"
      >
        <Home size={16} className="mr-1" />
        Home
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="text-gray-400" />
          {item.href && !item.current ? (
            <Link 
              to={item.href} 
              className="hover:text-emerald-600 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={`${item.current ? 'text-gray-800 font-medium' : 'text-gray-600'}`}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
