import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Default port for the development server
    open: true, // Automatically opens the app in the browser
  },
  build: {
    outDir: 'dist', // Directory for production build files
    sourcemap: true, // Enable source maps in production
  },
  resolve: {
    alias: {
      '@': '/src', // Alias for easier imports from 'src' folder
    },
  },
});