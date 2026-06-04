import { defineConfig, devices } from '@playwright/test'

/**
 * mock 모드 (기본): npm run dev → MSW browser worker 활성, CI-safe
 * real 모드: npm run build && npm run preview → MSW 비활성, 실제 백엔드 필요
 *
 * 실행:
 *   npx playwright test                      # mock 모드
 *   PLAYWRIGHT_API=real npx playwright test  # real API 모드
 */
const USE_REAL_API = process.env.PLAYWRIGHT_API === 'real'

const DEV_URL = 'http://localhost:5173'
const PREVIEW_URL = 'http://localhost:4173'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: USE_REAL_API ? PREVIEW_URL : DEV_URL,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: USE_REAL_API
    ? {
        command: 'npm run build && npm run preview',
        url: PREVIEW_URL,
        reuseExistingServer: !process.env.CI,
      }
    : {
        command: 'npm run dev',
        url: DEV_URL,
        reuseExistingServer: !process.env.CI,
      },
})
