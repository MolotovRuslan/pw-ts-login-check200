import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
  },
  timeout: 20000,
});
