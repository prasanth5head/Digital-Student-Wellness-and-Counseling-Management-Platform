import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEOConfig } from '../../config/routeSEO';
import { trackPageView } from '../../utils/analytics';

/**
 * SEO Manager - Handles route-based SEO metadata updates
 * Automatically updates meta tags when route changes
 * Also tracks page views for GA4
 */
const SEOManager = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Get SEO config for current route
    const seoConfig = getSEOConfig(location.pathname);

    // Update title
    if (seoConfig.title) {
      document.title = seoConfig.title;
    }

    // Update meta description
    if (seoConfig.description) {
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.setAttribute('name', 'description');
        document.head.appendChild(descTag);
      }
      descTag.setAttribute('content', seoConfig.description);
    } else {
      // Use default description if not specified
      let descTag = document.querySelector('meta[name="description"]');
      if (descTag) {
        descTag.setAttribute('content', 'AuraWell - Digital Student Wellness & Counseling Management Platform');
      }
    }

    // Update robots
    if (seoConfig.robots) {
      let robotsTag = document.querySelector('meta[name="robots"]');
      if (!robotsTag) {
        robotsTag = document.createElement('meta');
        robotsTag.setAttribute('name', 'robots');
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute('content', seoConfig.robots);
    }

    // Update canonical URL
    if (seoConfig.canonical) {
      const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || 'https://digital-student-wellness-and-counseling-y104.onrender.com';
      const canonicalUrl = `${siteUrl}${seoConfig.canonical}`;
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', canonicalUrl);
    }

    // Update Open Graph tags
    if (seoConfig.ogTitle) {
      let ogTitleTag = document.querySelector('meta[property="og:title"]');
      if (!ogTitleTag) {
        ogTitleTag = document.createElement('meta');
        ogTitleTag.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitleTag);
      }
      ogTitleTag.setAttribute('content', seoConfig.ogTitle);
    }

    if (seoConfig.ogDescription) {
      let ogDescTag = document.querySelector('meta[property="og:description"]');
      if (!ogDescTag) {
        ogDescTag = document.createElement('meta');
        ogDescTag.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescTag);
      }
      ogDescTag.setAttribute('content', seoConfig.ogDescription);
    }

    if (seoConfig.ogUrl) {
      const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || 'https://digital-student-wellness-and-counseling-y104.onrender.com';
      const ogUrlFull = `${siteUrl}${seoConfig.ogUrl}`;
      let ogUrlTag = document.querySelector('meta[property="og:url"]');
      if (!ogUrlTag) {
        ogUrlTag = document.createElement('meta');
        ogUrlTag.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrlTag);
      }
      ogUrlTag.setAttribute('content', ogUrlFull);
    }

    // Track page view for GA4
    // Only track if GA4 is available
    if (typeof window !== 'undefined' && window.gtag) {
      // Let GA4 automatically track page views, but we can also manually track
      // This ensures SPA route changes are tracked
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: seoConfig.title || document.title,
      });
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
};

export default SEOManager;
