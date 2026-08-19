import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import PWAUpdatePrompt from './components/common/PWAUpdatePrompt';

const GOOGLE_CLIENT_ID = '484622016527-9a06emp9u0bn7k5t4mn3071460hjj6r9.apps.googleusercontent.com';

export function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <BrowserRouter>
                <AppRoutes />
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
