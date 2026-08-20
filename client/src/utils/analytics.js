/**
 * Analytics Utility - GA4 Event Tracking
 * Provides a centralized, privacy-conscious interface for tracking user events
 *
 * SECURITY: Never send personally identifiable information or sensitive counseling data
 * Allowed: anonymous event names, timestamps, general categories
 * Forbidden: student names, emails, assessment answers, counseling details, risk information
 */

/**
 * Initialize GA4 if not already initialized
 * GA4 script is already in index.html, this ensures gtag is available
 */
export const initializeGA4 = () => {
  if (typeof window === 'undefined') return;

  // GA4 gtag should already be loaded from index.html
  if (!window.gtag) {
    console.warn('GA4 gtag not available. Check if Google Analytics script is loaded.');
  }
};

/**
 * Track a page view event
 * Called automatically by GA4, but can be used for SPA route changes
 * @param {string} path - Page path (e.g., '/wellness-resources')
 * @param {string} title - Page title (e.g., 'Wellness Resources')
 */
export const trackPageView = (path, title) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
  });
};

/**
 * Track a custom event
 * @param {string} eventName - Event name (snake_case)
 * @param {object} parameters - Event parameters (no sensitive data)
 *
 * Safe Event Examples:
 * trackEvent('assessment_started', { assessment_type: 'wellness' })
 * trackEvent('assessment_completed', { assessment_type: 'wellness', duration_seconds: 300 })
 * trackEvent('counseling_request_submitted', { request_type: 'scheduled' })
 * trackEvent('appointment_booked', { appointment_type: 'in-person' })
 * trackEvent('appointment_completed', { duration_minutes: 45 })
 * trackEvent('wellness_resource_view', { resource_category: 'stress-management' })
 * trackEvent('resource_downloaded', { resource_type: 'pdf' })
 * trackEvent('feedback_submitted', { feedback_type: 'resource_quality' })
 * trackEvent('chat_message_sent', {}) - no parameters to avoid content tracking
 *
 * FORBIDDEN:
 * - student name, email, phone
 * - student ID or user ID
 * - counseling notes or content
 * - assessment answers
 * - mental health diagnosis
 * - risk level
 * - any personal information
 */
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Validate that parameters don't contain sensitive data
  const forbiddenKeys = [
    'student_name',
    'email',
    'phone',
    'student_id',
    'user_id',
    'counseling_notes',
    'assessment_answers',
    'diagnosis',
    'risk_level',
    'personal_info',
    'password',
    'token',
  ];

  const paramsLower = JSON.stringify(parameters).toLowerCase();
  for (const key of forbiddenKeys) {
    if (paramsLower.includes(key)) {
      console.warn(`⚠️ Analytics: Attempted to track sensitive parameter. Event not sent: ${eventName}`);
      return;
    }
  }

  window.gtag('event', eventName, parameters);
};

/**
 * Track an exception/error
 * @param {string} description - Error description (no sensitive data)
 * @param {boolean} fatal - Whether the error is fatal
 */
export const trackException = (description, fatal = false) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'exception', {
    description: description,
    fatal: fatal,
  });
};

/**
 * Set user properties (anonymous, non-PII only)
 * @param {object} properties - User properties
 *
 * Safe Examples:
 * setUserProperties({ role: 'student' })
 * setUserProperties({ user_type: 'counselor' })
 *
 * FORBIDDEN:
 * - Sending actual user IDs
 * - Sending names or emails
 * - Sending identification information
 */
export const setUserProperties = (properties = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Only allow specific safe properties
  const safeProperties = {};

  if (properties.role) {
    // Normalize role: ROLE_STUDENT → student, ROLE_COUNSELOR → counselor, etc.
    const roleMap = {
      ROLE_STUDENT: 'student',
      ROLE_COUNSELOR: 'counselor',
      ROLE_ADMIN: 'admin',
    };
    safeProperties.user_role = roleMap[properties.role] || 'unknown';
  }

  if (properties.user_type) {
    safeProperties.user_type = properties.user_type;
  }

  if (Object.keys(safeProperties).length > 0) {
    window.gtag('set', { user_properties: safeProperties });
  }
};

/**
 * Wellness Assessment Events
 */
export const analytics = {
  // Assessment events
  assessmentStarted: (assessmentType = 'wellness') => {
    trackEvent('assessment_started', { assessment_type: assessmentType });
  },

  assessmentCompleted: (assessmentType = 'wellness', durationSeconds = null) => {
    const params = { assessment_type: assessmentType };
    if (durationSeconds) params.duration_seconds = durationSeconds;
    trackEvent('assessment_completed', params);
  },

  // Counseling events
  counselingRequestSubmitted: (requestType = 'scheduled') => {
    trackEvent('counseling_request_submitted', { request_type: requestType });
  },

  // Appointment events
  appointmentBooked: (appointmentType = 'in-person') => {
    trackEvent('appointment_booked', { appointment_type: appointmentType });
  },

  appointmentCompleted: (durationMinutes = null) => {
    const params = {};
    if (durationMinutes) params.duration_minutes = durationMinutes;
    trackEvent('appointment_completed', params);
  },

  appointmentCancelled: () => {
    trackEvent('appointment_cancelled', {});
  },

  // Resource events
  wellnessResourceView: (resourceCategory = 'general') => {
    trackEvent('wellness_resource_view', { resource_category: resourceCategory });
  },

  resourceDownloaded: (resourceType = 'pdf') => {
    trackEvent('resource_downloaded', { resource_type: resourceType });
  },

  // Engagement events
  feedbackSubmitted: (feedbackType = 'general') => {
    trackEvent('feedback_submitted', { feedback_type: feedbackType });
  },

  chatMessageSent: () => {
    // Track message sent without any parameters to avoid content tracking
    trackEvent('chat_message_sent', {});
  },

  // General events
  userSignUp: (method = 'email') => {
    trackEvent('sign_up', { method: method });
  },

  userSignIn: (method = 'email') => {
    trackEvent('login', { method: method });
  },

  userSignOut: () => {
    trackEvent('logout', {});
  },

  // Page view for SPA
  pageView: (path, title) => {
    trackPageView(path, title);
  },
};

export default analytics;
