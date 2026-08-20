# Google Analytics 4 (GA4) Event Tracking Guide

## Overview

AuraWell includes a comprehensive GA4 event tracking system that allows developers to track meaningful user interactions without exposing sensitive student data.

## Files

- **`src/utils/analytics.js`** - Main analytics utility with reusable functions
- **`src/components/common/SEOManager.jsx`** - Handles automatic page view tracking for SPA routes
- **`index.html`** - GA4 script initialization (G-WQMFHF6T55)

## Usage

### Basic Import

```javascript
import analytics from '../utils/analytics';
```

### Tracking Page Views

Page views are automatically tracked when routes change via `SEOManager`. However, you can manually track a specific page view:

```javascript
import { trackPageView } from '../utils/analytics';

trackPageView('/wellness-resources', 'Student Wellness Resources');
```

### Tracking Custom Events

Use the convenience functions on the `analytics` object:

```javascript
import analytics from '../utils/analytics';

// Assessment events
analytics.assessmentStarted('wellness');
analytics.assessmentCompleted('wellness', 300); // 300 seconds duration

// Counseling events
analytics.counselingRequestSubmitted('scheduled');

// Appointment events
analytics.appointmentBooked('in-person');
analytics.appointmentCompleted(45); // 45 minutes duration
analytics.appointmentCancelled();

// Resource events
analytics.wellnessResourceView('stress-management');
analytics.resourceDownloaded('pdf');

// Engagement events
analytics.feedbackSubmitted('resource_quality');
analytics.chatMessageSent();

// Auth events
analytics.userSignUp('email');
analytics.userSignIn('google');
analytics.userSignOut();
```

### Tracking Custom Events (Advanced)

For custom events not covered by convenience functions:

```javascript
import { trackEvent } from '../utils/analytics';

trackEvent('custom_event_name', {
  category: 'student_wellness',
  value: 100,
});
```

## Allowed Parameters

Only **non-sensitive, non-personal information** can be tracked:

✅ **ALLOWED:**
- Event names
- Resource categories (e.g., 'stress-management', 'sleep-wellness')
- Appointment types (e.g., 'in-person', 'virtual')
- Assessment types (e.g., 'wellness')
- Duration metrics
- Feedback types
- Sign-in methods

❌ **FORBIDDEN:**
- Student names
- Email addresses
- Phone numbers
- Student IDs
- Counselor names
- Assessment answers
- Counseling notes or content
- Mental health diagnoses
- Risk levels
- Personal information
- Medical information
- JWT tokens
- Passwords

## Examples

### Student Assessment Flow

```javascript
// pages/student/AssessmentWizard.jsx
import analytics from '../../utils/analytics';

const startAssessment = () => {
  analytics.assessmentStarted('wellness');
  // ... start assessment
};

const completeAssessment = () => {
  const duration = calculateDuration(); // seconds
  analytics.assessmentCompleted('wellness', duration);
  // ... show results
};
```

### Appointment Booking

```javascript
// pages/student/StudentAppointments.jsx
import analytics from '../../utils/analytics';

const bookAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/appointment/book', appointmentData);
    analytics.appointmentBooked(appointmentData.mode); // 'in-person' or 'virtual'
    // ... show confirmation
  } catch (error) {
    console.error('Failed to book appointment', error);
  }
};
```

### Resource Download

```javascript
// components/common/ResourceCard.jsx
import analytics from '../../utils/analytics';

const handleDownload = () => {
  analytics.resourceDownloaded('pdf');
  // ... perform download
};
```

## Environment Configuration

GA4 Measurement ID is configured in `.env`:

```
VITE_GA_MEASUREMENT_ID=G-WQMFHF6T55
```

This is already set in `index.html`. To change:

1. Get new Measurement ID from Google Analytics
2. Update `index.html` gtag initialization
3. Update `.env` variables

## Privacy & Compliance

This implementation:
- ✅ Does NOT send personally identifiable information
- ✅ Does NOT send sensitive counseling data
- ✅ Does NOT send student assessment answers
- ✅ Does NOT send mental health information
- ✅ Complies with FERPA and student privacy regulations
- ✅ Allows Google Analytics to track legitimate business metrics
- ✅ Protects student confidentiality

## Testing

To verify GA4 tracking:

1. Open browser DevTools → Network tab
2. Filter by "google-analytics" or "googletagmanager"
3. Perform an action (e.g., complete assessment)
4. Check that event is sent without sensitive parameters

## Monitoring

Google Analytics Dashboard:
1. Go to Google Analytics console
2. Navigate to Reports → Realtime
3. Perform actions on AuraWell
4. Watch events appear in real-time

## Adding New Events

To add a new event:

1. Update `src/utils/analytics.js` - add convenience function
2. Add documentation here
3. Update GA4 event tracking settings in Google Analytics console (if needed)
4. Test in development environment
5. Deploy to production

Example:

```javascript
// In src/utils/analytics.js
announcementViewed: (announcementType = 'general') => {
  trackEvent('announcement_viewed', { 
    announcement_type: announcementType 
  });
},
```

Then use:

```javascript
import analytics from '../utils/analytics';

analytics.announcementViewed('wellness_tip');
```

## Debugging

If GA4 is not tracking:

1. Check that gtag is loaded: `window.gtag` should exist
2. Check that VITE_GA_MEASUREMENT_ID is set
3. Check browser console for errors
4. Verify event is valid (no forbidden parameters)
5. Check Google Analytics real-time reports
6. Wait 24-48 hours for analytics dashboard to update

## Production Checklist

- ✅ GA4 script loaded in index.html
- ✅ VITE_GA_MEASUREMENT_ID set in environment
- ✅ analytics.js imported and used in relevant components
- ✅ No sensitive data in events or parameters
- ✅ Page view tracking enabled via SEOManager
- ✅ Custom events implemented for key user actions
- ✅ Test events verified in GA4 real-time report
- ✅ Privacy policy includes GA4 usage information
