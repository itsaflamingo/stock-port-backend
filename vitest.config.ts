import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['vitest/**/*.test.ts'], // or just ['vitest/**']    globals: true,
    environment: 'node',
  },
});
