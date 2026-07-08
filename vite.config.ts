import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    pool: 'forks',
    maxWorkers: 2,
    // The server package has its own vitest config (node env); don't pull it into the frontend run.
    exclude: [...configDefaults.exclude, 'server/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'tests/**',
        'scripts/**',
        'sidi-design-system/**',
        'src/main.tsx',
        'src/types/**',
        'src/vite-env.d.ts'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
