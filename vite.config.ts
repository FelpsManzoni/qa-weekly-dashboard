import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    pool: 'forks',
    maxWorkers: 2,
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
        'src/components/WeekForm/WeekForm.tsx',
        'src/components/ProjectForm/ProjectForm.tsx',
        'src/components/IssueMetricForm/IssueMetricForm.tsx',
        'src/components/TestCaseDistributionForm/TestCaseDistributionForm.tsx',
        'src/components/ReleaseForm/ReleaseForm.tsx',
        'src/components/NoteForm/NoteForm.tsx'
      ]
    }
  }
});
