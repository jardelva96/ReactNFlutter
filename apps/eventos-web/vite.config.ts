// vite.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'], // um único setup
    css: true,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    sequence: { concurrent: false },
  },
});
