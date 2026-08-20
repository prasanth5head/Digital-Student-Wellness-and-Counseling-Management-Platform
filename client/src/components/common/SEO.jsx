import { useEffect } from 'react';

/**
 * SEO Component - Manages dynamic SEO metadata for pages
 * Updates document title, meta tags, canonical URLs, and OG metadata
 * Designed for React Router SPA with proper meta tag management
 *
 * Usage:
 * <SEO
 *   title="Page Title"
 *   description="Page description"
 *   canonical="/page"
 *   robots="index, follow"
 *   ogTitle="OG Title"
 *   ogDescription="OG Description"
 *   ogUrl="/page"
 *   ogType="website"
 *   ogImage="https://domain.com/image.png"
 *   twitterCard="summary_large_image"
 * />
 */
const SEO = ({
  title,
  description,
  canonical,
  robots = 'index, follow',
  ogTitle,
  ogDescription,
  ogUrl,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  children,
}) => {
  const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || 'https://digital-student-wellness-and-counseling-y104.onrender.com';

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Helper function to update or create meta tag
    const updateMetaTag = (name, attribute, value) => {
      if (!value) return;

      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', value);
    };

    // Update standard meta tags
    if (description) {
      updateMetaTag('description', 'name', description);
    }

    if (robots) {
      const robotsTags = document.querySelectorAll('meta[name="robots"]');
      robotsTags.forEach((tag, index) => {
        if (index > 0) tag.remove();
      });
      updateMetaTag('robots', 'name', robots);
    }

    // Update canonical URL
    if (canonical) {
      const canonicalUrl = `${siteUrl}${canonical}`;
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', canonicalUrl);
    }

    // Update Open Graph tags
    if (ogTitle) {
      updateMetaTag('og:title', 'property', ogTitle);
    }

    if (ogDescription) {
      updateMetaTag('og:description', 'property', ogDescription);
    }

    if (ogUrl) {
      const ogUrlFull = `${siteUrl}${ogUrl}`;
      updateMetaTag('og:url', 'property', ogUrlFull);
    }

    if (ogType) {
      updateMetaTag('og:type', 'property', ogType);
    }

    if (ogImage) {
      updateMetaTag('og:image', 'property', ogImage);
    }

    // Update Twitter Card tags
    if (twitterCard) {
      updateMetaTag('twitter:card', 'name', twitterCard);
    }

    // Cleanup: Reset meta tags when component unmounts
    return () => {
      // Note: We intentionally do NOT remove tags on unmount
      // This allows SEO metadata to persist until next page SEO update
      // which is important for SPA routing
    };
  }, [title, description, canonical, robots, ogTitle, ogDescription, ogUrl, ogType, ogImage, twitterCard, siteUrl]);

  return children || null;
};

export default SEO;
