import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import react from '@vitejs/plugin-react-swc';
import EnvironmentPlugin from 'vite-plugin-environment';
import HostQrCode from 'vite-host-qrcode/vite';
import path from 'path';

// List of problematic environment variables
const problematicEnvVars = [
  'CommonProgramFiles(x86)',
  'ProgramFiles(x86)',
  'IntelliJ IDEA Community Edition',
  'IntelliJ IDEA',
];

// Remove the problematic environment variables
problematicEnvVars.forEach((varName) => {
  delete process.env[varName];
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode !== 'production';

  return {
    plugins: [
      react(),
      EnvironmentPlugin('all'),
      HostQrCode({
        filter: (ip) => ip.startsWith('http://192.168'),
      }),
      checker({
        typescript: true,
      }),
    ],
    css: {
      devSourcemap: isDev,
    },
    optimizeDeps: {
      include: ['react'],
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    esbuild: {
      sourcemap: isDev,
    },
    server: {
      port: 8000,
    },
    preview: {
      port: 8000,
    },
  };
});
