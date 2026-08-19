// tests/e2e/helpers/apiMocks.ts
import type { Page } from "@playwright/test";

export async function mockAuthenticatedUser(page: Page) {
  await page.route("**/api/v1/auth/refresh", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ access_token: "test-access-token" }),
    });
  });
}
//mock /auth/refresh endpoint to return a successful response with a test access token
