import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SitemapHeader = lazy(() => import('../components/sitemap/SitemapHeader'));
const SitemapGrid = lazy(() => import('../components/sitemap/SitemapGrid'));
const SiteStructureDiagram = lazy(() => import('../components/sitemap/SiteStructureDiagram'));
const TechStackSection = lazy(() => import('../components/sitemap/TechStackSection'));

const Sitemap = () => {
  return (
    <div className="min-h-screen bg-primary pt-24 pb-16 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingSpinner />}>
          <SitemapHeader />
          <SitemapGrid />
          <SiteStructureDiagram />
          <TechStackSection />
          
          <div className="mt-12 text-center">
            <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
              <span className="w-1 h-1 bg-accent rounded-full"></span>
              Complete site map for SmartSociety v1.0
              <span className="w-1 h-1 bg-accent rounded-full"></span>
            </p>
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default Sitemap;