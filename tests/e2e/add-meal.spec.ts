import { test, expect } from "@playwright/test";

test("owner can parse and save a meal", async ({ page }) => {
  await page.route("**/api/v1/auth/refresh", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ access_token: "test-access-token" }),
    });
  });

  await page.route("**/api/v1/meals/parse", async (route) => {
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject({
      text: "Minh ăn bún chả 45k\nKhánh ăn bún chả 45k",
    });

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          restaurantName: "Bun Cha Ha Noi",
          restaurantId: "restaurant-1",
          date: "2026-08-18T00:00:00.000Z",
          totalAmount: 90000,
          entries: [
            {
              personName: "Minh",
              participantId: "participant-1",
              amount: 45000,
            },
            {
              personName: "Khanh",
              participantId: "participant-2",
              amount: 45000,
            },
          ],
        },
        context: {
          participants: [
            { id: "participant-1", name: "Minh" },
            { id: "participant-2", name: "Khanh" },
          ],
          restaurants: [{ id: "restaurant-1", name: "Bun Cha Ha Noi" }],
        },
      }),
    });
  });

  await page.route("**/api/v1/meals", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ id: "meal-1" }),
    });
  });

  await page.goto("/add-meal"); // needs authentication

  await expect(
    page.getByRole("heading", { name: "Nhập thông tin" }),
  ).toBeVisible();

  await page
    .locator("textarea")
    .fill("Minh ăn bún chả 45k\nKhánh ăn bún chả 45k");

  await page.getByRole("button", { name: "Phân tích" }).click(); // receive mocked response

  await expect(page).toHaveURL(/\/add-meal-detail$/);
  await expect(page.getByText("Chi tiết bữa ăn")).toBeVisible();

  const inputs = page.locator("input");

  await expect(inputs.nth(0)).toHaveValue("Bun Cha Ha Noi");
  await expect(inputs.nth(1)).toHaveValue("2026-08-18");
  await expect(inputs.nth(2)).toHaveValue(/90[.,]000/);
  await expect(inputs.nth(3)).toHaveValue("Minh");
  await expect(inputs.nth(4)).toHaveValue(/45[.,]000/);
  await expect(inputs.nth(5)).toHaveValue("Khanh");
  await expect(inputs.nth(6)).toHaveValue(/45[.,]000/);

  const saveMealRequest = page.waitForRequest((request) => {
    const url = new URL(request.url());

    return (
      request.method() === "POST" && url.pathname.endsWith("/api/v1/meals")
    );
  });

  await page.getByRole("button", { name: "Lưu thông tin" }).click(); // store response

  const request = await saveMealRequest;

  expect(request.postDataJSON()).toMatchObject({
    restaurant_id: "restaurant-1",
    restaurant_name: "Bun Cha Ha Noi",
    total_amount: 90000,
    participants: [
      { participant_id: "participant-1", amount: 45000 },
      { participant_id: "participant-2", amount: 45000 },
    ],
  });

  await expect(page).toHaveURL("http://127.0.0.1:5173/");
});

test("owner must quick-create missing restaurant and participant before saving meal", async ({
  page,
}) => {
  await page.route("**/api/v1/auth/refresh", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ access_token: "test-access-token" }),
    });
  });

  await page.route("**/api/v1/meals/parse", async (route) => {
    expect(route.request().method()).toBe("POST");

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          restaurantName: "Quan Com Moi",
          restaurantId: null,
          date: "2026-08-18T00:00:00.000Z",
          totalAmount: 50000,
          entries: [
            {
              personName: "Nguoi Moi",
              participantId: null,
              amount: 50000,
            },
          ],
        },
        context: {
          participants: [],
          restaurants: [],
        },
      }),
    });
  });

  await page.route("**/api/v1/restaurants", async (route) => {
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject({
      name: "Quan Com Moi",
    });

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ id: "restaurant-new" }),
    });
  });

  await page.route("**/api/v1/participants", async (route) => {
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject({
      name: "Nguoi Moi",
    });

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ id: "participant-new" }),
    });
  });

  await page.route("**/api/v1/meals", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ id: "meal-edge-1" }),
    });
  });

  await page.goto("/add-meal");

  await page.locator("textarea").fill("Người mới ăn cơm 50k");
  await page.getByRole("button", { name: "Phân tích" }).click();

  await expect(page).toHaveURL(/\/add-meal-detail$/);

  const saveButton = page.getByRole("button", { name: "Lưu thông tin" });
  await expect(saveButton).toBeDisabled();

  await expect(page.getByText("Vui lòng tạo nhanh")).toBeVisible();

  const quickCreateButtons = page.getByRole("button", { name: "Thêm nhanh" });

  await quickCreateButtons.nth(0).click();
  await quickCreateButtons.nth(1).click();

  await expect(saveButton).toBeEnabled();

  const saveMealRequest = page.waitForRequest((request) => {
    const url = new URL(request.url());

    return (
      request.method() === "POST" && url.pathname.endsWith("/api/v1/meals")
    );
  });

  await saveButton.click();

  const request = await saveMealRequest;

  expect(request.postDataJSON()).toMatchObject({
    restaurant_id: "restaurant-new",
    restaurant_name: "Quan Com Moi",
    total_amount: 50000,
    participants: [{ participant_id: "participant-new", amount: 50000 }],
  });

  await expect(page).toHaveURL("http://127.0.0.1:5173/");
});
