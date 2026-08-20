/**
 * Route SEO Configuration
 * Maps routes to their SEO metadata (title, description, canonical, etc.)
 * 
 * SECURITY NOTE: No personal or sensitive information should be included
 * All pages with sensitive content use noindex
 */

export const routeSEOConfig = {
  // ==========================================
  // PUBLIC ROUTES - INDEXED
  // ==========================================

  '/': {
    title: 'Digital Student Wellness | Counseling Platform',
    description: 'Digital Student Wellness is a digital platform that provides students with wellness assessments, counseling support, appointments, wellness resources and personalized wellbeing guidance.',
    canonical: '/',
    robots: 'index, follow',
    ogTitle: 'Digital Student Wellness | Counseling Platform',
    ogDescription: 'Digital wellness assessments, counseling support, appointments and wellness resources for students.',
    ogUrl: '/',
    ogType: 'website',
    ogImage: '/icon-512.png',
    twitterCard: 'summary_large_image',
  },

  '/login': {
    title: 'Login | AuraWell - Student Wellness Platform',
    description: 'Sign in to your AuraWell account to access wellness assessments and counseling services.',
    canonical: '/login',
    robots: 'noindex, nofollow',
    ogTitle: 'AuraWell Login',
    ogDescription: 'Sign in to AuraWell.',
    ogUrl: '/login',
  },

  '/register': {
    title: 'Register | AuraWell - Student Wellness Platform',
    description: 'Create a new AuraWell account to access wellness assessments and counseling services.',
    canonical: '/register',
    robots: 'noindex, nofollow',
    ogTitle: 'AuraWell Registration',
    ogDescription: 'Join AuraWell.',
    ogUrl: '/register',
  },

  '/unauthorized': {
    title: 'Unauthorized | AuraWell',
    description: 'You do not have permission to access this page.',
    canonical: '/unauthorized',
    robots: 'noindex, nofollow',
    ogTitle: 'Unauthorized',
    ogDescription: 'Access denied.',
    ogUrl: '/unauthorized',
  },

  // ==========================================
  // PROTECTED ROUTES - NOT INDEXED
  // ==========================================
  // All student, counselor, and admin routes are private and should not be indexed

  // Student routes
  '/student/dashboard': {
    title: 'Dashboard | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/student/assessment': {
    title: 'Wellness Assessment | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/student/assessment/history': {
    title: 'Assessment History | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/student/appointments': {
    title: 'Appointments | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/student/requests': {
    title: 'Counseling Requests | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/student/chat': {
    title: 'Chat | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/student/resources': {
    title: 'Resources | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/student/profile': {
    title: 'Profile | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  // Counselor routes
  '/counselor/dashboard': {
    title: 'Counselor Dashboard | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/counselor/students': {
    title: 'Assigned Students | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/counselor/appointments': {
    title: 'Appointments | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/counselor/requests': {
    title: 'Counseling Requests | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/counselor/chat': {
    title: 'Chat | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/counselor/sessions': {
    title: 'Sessions | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/counselor/profile': {
    title: 'Profile | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  // Admin routes
  '/admin/dashboard': {
    title: 'Admin Dashboard | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/admin/departments': {
    title: 'Department Analytics | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/admin/users': {
    title: 'User Management | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/admin/questions': {
    title: 'Question Management | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/admin/resources': {
    title: 'Resource Management | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/admin/announcements': {
    title: 'Announcements | AuraWell',
    robots: 'noindex, nofollow', // Private
  },

  '/admin/audit-logs': {
    title: 'Audit Logs | AuraWell',
    robots: 'noindex, nofollow', // Private
  },
};

/**
 * Get SEO config for a route
 * Returns sensible defaults if route not found
 */
export const getSEOConfig = (pathname) => {
  const normalizedPath = (pathname || '/').split('?')[0].replace(/\/+$/, '') || '/';
  const config = routeSEOConfig[normalizedPath];

  if (config) {
    return config;
  }

  // Default SEO for unknown routes
  return {
    title: 'Digital Student Wellness | Counseling Platform',
    robots: 'noindex, nofollow',
  };
};

export default routeSEOConfig;
