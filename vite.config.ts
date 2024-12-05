import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8000,
  },
  preview: {
    port: 8000,
  },
});
