import React from 'react';
import { useParams } from 'react-router-dom';
import HowToSourceBasmatiRice from '../pages/blogs/HowToSourceBasmatiRice';
import BasmatiRiceExportBusiness from '../pages/blogs/BasmatiRiceExportBusiness';
import ExportOrganicGingerPowder from '../pages/blogs/ExportOrganicGingerPowder';
import GingerPowderSourcingGuide from '../pages/blogs/GingerPowderSourcingGuide';
import HowToSourceIndianSpices from '../pages/blogs/HowToSourceIndianSpices';
import OrganicSpiceExportBusiness from '../pages/blogs/OrganicSpiceExportBusiness';
import PrivateLabelingBasmatiRice from '../pages/blogs/PrivateLabelingBasmatiRice';
import PrivateLabelingGingerPowder from '../pages/blogs/PrivateLabelingGingerPowder';

const BlogRouter: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Route to specific blog components based on slug
  switch (slug) {
    case 'how-to-source-basmati-rice':
      return <HowToSourceBasmatiRice />;
    case 'basmati-rice-export-business':
      return <BasmatiRiceExportBusiness />;
    case 'export-organic-ginger-powder':
      return <ExportOrganicGingerPowder />;
    case 'ginger-powder-sourcing-guide':
      return <GingerPowderSourcingGuide />;
    case 'organic-spice-export-business':
      return <OrganicSpiceExportBusiness />;
    case 'private-labeling-basmati-rice':
      return <PrivateLabelingBasmatiRice />;
    case 'how-to-source-indian-spices':
      return <HowToSourceIndianSpices />;
    case 'private-labeling-ginger-powder':
      return <PrivateLabelingGingerPowder />;
    
    default:
      // Fallback to StaticBlogDetailPage for blogs not yet converted to individual components
      const StaticBlogDetailPage = React.lazy(() => import('../pages/StaticBlogDetailPage'));
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <StaticBlogDetailPage />
        </React.Suspense>
      );
  }
};

export default BlogRouter;
