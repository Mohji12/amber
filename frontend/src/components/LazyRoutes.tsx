import { lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Lazy load components for better performance
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const SubcategoryDetailPage = lazy(() => import('../pages/SubcategoryDetailPage'));
const BlogsPage = lazy(() => import('../pages/BlogsPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));
const OtpTestPage = lazy(() => import('../pages/OtpTestPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

// Admin pages
const AdminPage = lazy(() => import('../pages/AdminPage'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const AdminProducts = lazy(() => import('../pages/AdminProducts'));
const AdminCategories = lazy(() => import('../pages/AdminCategories'));
const AdminSubcategories = lazy(() => import('../pages/AdminSubcategories'));
const AdminBlogs = lazy(() => import('../pages/AdminBlogs'));
const AdminAnalytics = lazy(() => import('../pages/AdminAnalytics'));
const AdminEnquiries = lazy(() => import('../pages/AdminEnquiries'));

// Profile sub-pages
const ProfileBusiness = lazy(() => import('../pages/profile/ProfileBusiness'));
const ProfileQuotation = lazy(() => import('../pages/profile/ProfileQuotation'));
const ProfileOrders = lazy(() => import('../pages/profile/ProfileOrders'));

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="text-center">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-gray-600">Loading page...</p>
    </div>
  </div>
);

// Higher-order component for lazy loading with error boundary
const withLazyLoading = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
};

// Export lazy-loaded components
export const LazyProductsPage = withLazyLoading(ProductsPage);
export const LazyProductDetailPage = withLazyLoading(ProductDetailPage);
export const LazySubcategoryDetailPage = withLazyLoading(SubcategoryDetailPage);
export const LazyBlogsPage = withLazyLoading(BlogsPage);
export const LazyContactPage = withLazyLoading(ContactPage);
export const LazyLoginPage = withLazyLoading(LoginPage);
export const LazySignupPage = withLazyLoading(SignupPage);
export const LazyOtpTestPage = withLazyLoading(OtpTestPage);
export const LazyProfilePage = withLazyLoading(ProfilePage);

// Admin lazy components
export const LazyAdminPage = withLazyLoading(AdminPage);
export const LazyAdminDashboard = withLazyLoading(AdminDashboard);
export const LazyAdminProducts = withLazyLoading(AdminProducts);
export const LazyAdminCategories = withLazyLoading(AdminCategories);
export const LazyAdminSubcategories = withLazyLoading(AdminSubcategories);
export const LazyAdminBlogs = withLazyLoading(AdminBlogs);
export const LazyAdminAnalytics = withLazyLoading(AdminAnalytics);
export const LazyAdminEnquiries = withLazyLoading(AdminEnquiries);

// Profile lazy components
export const LazyProfileBusiness = withLazyLoading(ProfileBusiness);
export const LazyProfileQuotation = withLazyLoading(ProfileQuotation);
export const LazyProfileOrders = withLazyLoading(ProfileOrders);
