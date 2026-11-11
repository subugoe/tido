import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

// Unit tests of pure modules - kept apart from vite.config.js, whose build plugins they do not need
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
