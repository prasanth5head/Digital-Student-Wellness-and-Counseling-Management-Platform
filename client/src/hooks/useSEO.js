import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to apply SEO metadata based on current route
 * Used in page components to set page-specific SEO
 */
export const useSEO = (seoConfig) => {
  const location = useLocation();

  useEffect(() => {
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

    // Update canonical
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

    // Update OG tags
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
  }, [location.pathname, seoConfig]);
};

export default useSEO;
