import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name : "DK downloader",
        short_name: "Downloader",
        theme_color: "#020c1b",
        background_color: "#173d77",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
        },
        {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
        }
        ]
    },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'documents',
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'script',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'scripts',
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'style',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'styles',
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ['lucide-react', '@radix-ui/react-slot', 'class-variance-authority']
  },
})