import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteImagemin({
      // Compress PNG files
      optipng: { optimizationLevel: 5 },
      pngquant: { quality: [0.7, 0.85], speed: 4 },
      // Compress JPG/JPEG files
      mozjpeg: { quality: 80 },
      // Compress SVG files
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: true },
        ],
      },
      // Convert and compress WebP files
      webp: { quality: 80 },
      // Compress GIF files (if any)
      gifsicle: { optimizationLevel: 3 },
    }),
  ],
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
})
