import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [
    nodePolyfills(),
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      },
    }),
  ],
  define: {
    __APP_ENV__: process.env.VITE_VERCEL_ENV,
  },
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
    extensions: ['.js', '.jsx', '.json'],
  },
  server: {
    port: 3030,
  },
  preview: {
    port: 3030,
  },
});
