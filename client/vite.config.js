import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'manifest.json'],
      manifest: {
        name: 'AuraWell - Digital Student Wellness Platform',
        short_name: 'AuraWell',
        description: 'A comprehensive digital mental health, wellness assessment, and counseling management platform for higher education institutions.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0d9488',
        orientation: 'portrait-primary',
        scope: '/',
        lang: 'en',
        categories: ['health', 'education', 'lifestyle'],
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Take Assessment',
            short_name: 'Assessment',
            description: 'Start a new wellness assessment',
            url: '/student/assessment',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'My Appointments',
            short_name: 'Appointments',
            description: 'View your counseling appointments',
            url: '/student/appointments',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        // Cache all static assets for offline support
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff2,woff}'],
        runtimeCaching: [
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache API responses (network-first for fresh data)
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  define: {
    global: 'window',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
