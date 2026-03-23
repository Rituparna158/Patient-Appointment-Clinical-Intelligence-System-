import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(() => {
  const isAnalyze = process.env.ANALYZE === 'true';
  const shouldOpen = process.env.ANALYZE_OPEN === 'true';

  return {
    plugins: [
      react(),
      ...(isAnalyze
        ? [
            visualizer({
              filename: 'stats.html',
              open: shouldOpen,
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },

    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            charts: ['recharts'],
            motion: ['framer-motion'],
          },
        },
      },
    },
  };
});
