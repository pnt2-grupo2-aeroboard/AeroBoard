import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const pwaOptions = {
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg'],
  manifest: {
    name: 'AeroBoard',
    short_name: 'AeroBoard',
    description: 'Tablero de arribos y partidas de Aeroparque y Ezeiza',
    theme_color: '#1d4ed8',
    background_color: '#f8fafc',
    display: 'standalone',
    orientation: 'portrait',
    icons: [
      { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  devOptions: { enabled: true },
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), VitePWA(pwaOptions)],
  server: {
    port: 8080,
  },
  test: {
    environment: 'jsdom',
  },
})