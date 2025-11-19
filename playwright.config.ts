import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'tests/e2e',
    use: {
        headless: true,
        screenshot: {
            mode: 'on-first-failure',
            fullPage: true,
        }
    },
});
