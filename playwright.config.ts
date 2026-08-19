/*import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e", // test directory
  timeout: 30_000, //maximum time for 1 test to run
  expect: {
    timeout: 5_000, // timeout for assertions
  },
  fullyParallel: true, // allow tests to be ran in parallel
  retries: process.env.CI ? 2 : 0, // times to retry a failed test
  reporter: process.env.CI ? [["html"], ["github"]] : [["list"], ["html"]], // reports for test results
  //local vs CI
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry", // trace for first retry of a failed test
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command:
      "npm run dev --workspace frontend -- --host 127.0.0.1 --port 5173 --strictPort", //command for playwright to start the server
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // maximum time for frontend to start
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});*/
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["html"], ["github"]] : [["list"], ["html"]],
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: [
    {
      command: "npm run dev --workspace backend",
      url: "http://127.0.0.1:3001",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        NODE_ENV: "e2e",
        PORT: "3001",
        FRONTEND_URL: "http://127.0.0.1:5173",
        MONGODB_URI: "mongodb://127.0.0.1:27017/meal-ledger-e2e",
        REDIS_URL: "redis://127.0.0.1:6379",
        JWT_SECRET: "e2e_jwt_secret",
        JWT_REFRESH_SECRET: "e2e_refresh_secret",
        AI_PROVIDER: "fake-e2e",
      },
    },
    {
      command:
        "npm run dev --workspace frontend -- --host 127.0.0.1 --port 5173 --strictPort",
      url: "http://127.0.0.1:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        VITE_API_BASE_URL: "http://127.0.0.1:3001/api/v1",
      },
    },
  ],
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
