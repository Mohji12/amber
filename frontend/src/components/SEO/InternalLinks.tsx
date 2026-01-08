/**
 * Internal Links Component
 * Renders SEO-generated internal links with proper placement
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface InternalLink {
  anchor_text: string;
  target_url: string;
  placement_hint: string;
}

interface InternalLinksProps {
  links: InternalLink[];
  placement?: 'above-fold' | 'mid-content' | 'faq' | 'all';
  className?: string;
}

const InternalLinks: React.FC<InternalLinksProps> = ({ 
  links, 
  placement = 'all',
  className = '' 
}) => {
  if (!links || links.length === 0) {
    return null;
  }

  // Filter links based on placement hint
  const filteredLinks = placement === 'all' 
    ? links 
    : links.filter(link => {
        const hint = link.placement_hint.toLowerCase();
        if (placement === 'above-fold') {
          return hint.includes('above') || hint.includes('fold') || hint.includes('top');
        }
        if (placement === 'mid-content') {
          return hint.includes('mid') || hint.includes('content') || hint.includes('middle');
        }
        if (placement === 'faq') {
          return hint.includes('faq') || hint.includes('question');
        }
        return true;
      });

  if (filteredLinks.length === 0) {
    return null;
  }

  // Determine if it's an external link (starts with http) or internal route
  const isExternalLink = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // Determine if it's an anchor link
  const isAnchorLink = (url: string) => {
    return url.startsWith('#');
  };

  return (
    <div className={`internal-links ${className}`}>
      <div className="flex flex-wrap gap-3 lg:gap-4">
        {filteredLinks.map((link, index) => {
          const url = link.target_url;
          
          if (isExternalLink(url)) {
            return (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors duration-200 text-sm lg:text-base font-medium border border-emerald-200"
              >
                {link.anchor_text}
                <ArrowRight size={16} />
              </a>
            );
          }
          
          if (isAnchorLink(url)) {
            return (
              <a
                key={index}
                href={url}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors duration-200 text-sm lg:text-base font-medium border border-emerald-200"
              >
                {link.anchor_text}
                <ArrowRight size={16} />
              </a>
            );
          }
          
          return (
            <Link
              key={index}
              to={url}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors duration-200 text-sm lg:text-base font-medium border border-emerald-200"
            >
              {link.anchor_text}
              <ArrowRight size={16} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default InternalLinks;


