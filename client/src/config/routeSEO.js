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
    title: 'AuraWell | Digital Student Wellness & Counseling Platform',
    description: 'AuraWell provides students with digital wellness assessments, counseling support, wellness resources, appointments and personalized wellbeing guidance.',
    canonical: '/',
    robots: 'index, follow',
    ogTitle: 'AuraWell - Student Wellness Platform',
    ogDescription: 'Confidential mental health assessments and counseling support for students.',
    ogUrl: '/',
    ogType: 'website',
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
  const config = routeSEOConfig[pathname];

  if (config) {
    return config;
  }

  // Default SEO for unknown routes
  return {
    title: 'AuraWell - Digital Student Wellness Platform',
    robots: 'noindex, nofollow',
  };
};

export default routeSEOConfig;
