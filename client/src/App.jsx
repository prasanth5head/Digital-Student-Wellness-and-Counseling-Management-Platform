import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import PWAUpdatePrompt from './components/common/PWAUpdatePrompt';
import SEOManager from './components/common/SEOManager';

const GOOGLE_CLIENT_ID = '484622016527-9a06emp9u0bn7k5t4mn3071460hjj6r9.apps.googleusercontent.com';

export function App() {
  // Add Google Search Console verification meta tag if configured
  useEffect(() => {
    const verificationCode = import.meta.env.VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION;
    if (verificationCode && verificationCode.trim()) {
      let metaTag = document.querySelector('meta[name="google-site-verification"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = 'google-site-verification';
        document.head.appendChild(metaTag);
      }
      metaTag.content = verificationCode;
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <BrowserRouter>
                <SEOManager>
                  <AppRoutes />
                </SEOManager>
                {/* PWA: Shows "Update Available" toast when a new service worker is ready */}
                <PWAUpdatePrompt />
              </BrowserRouter>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
