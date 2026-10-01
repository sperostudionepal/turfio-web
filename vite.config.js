import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

function installHostRobots(server) {
  server.middlewares.use((req, res, next) => {
    const hostname = (req.headers.host || '').split(':')[0];
    const staffHost = ['partner.localhost', 'superadmin.localhost', 'partner.turfio.com', 'superadmin.turfio.com'].includes(hostname);
    if (staffHost) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    if (req.url?.split('?')[0] === '/robots.txt' && staffHost) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('User-agent: *\nDisallow: /\n');
      return;
    }
    next();
  });
}

export default defineConfig({
  resolve: {
    // Ensure hooks/context always resolve through one React runtime, including HMR.
    dedupe: ['react', 'react-dom'],
  },
  build: { manifest: true },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['localhost', 'turfio.localhost', 'partner.localhost', 'superadmin.localhost'],
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    {
      name: 'host-robots',
      configureServer(server) { installHostRobots(server); },
      configurePreviewServer(server) { installHostRobots(server); },
    },
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      gif: { optimizationLevel: 3 },
      svg: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: true },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
})