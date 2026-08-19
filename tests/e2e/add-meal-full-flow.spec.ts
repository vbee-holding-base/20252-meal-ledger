import { test, expect } from "@playwright/test";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const mongoUri = "mongodb://127.0.0.1:27017/meal-ledger-e2e";
const jwtSecret = "e2e_jwt_secret";

test("owner can parse and save a meal full flow", async ({ page }) => {
  const connection = await mongoose.connect(mongoUri);
  const db = connection.connection.db;

  if (!db) {
    throw new Error("MongoDB connection was not initialized");
  }

  const ownerId = new mongoose.Types.ObjectId();
  const restaurantId = new mongoose.Types.ObjectId();
  const minhId = new mongoose.Types.ObjectId();
  const khanhId = new mongoose.Types.ObjectId();

  await db.dropDatabase();

  await db.collection("owners").insertOne({
    _id: ownerId,
    googleId: "e2e-google-owner",
    fullName: "E2E Owner",
    email: "e2e-owner@example.com",
    avatar: "",
    isBankLinked: false,
    xid: "e2e-owner-xid",
    bankAccounts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.collection("restaurants").insertOne({
    _id: restaurantId,
    ownerId,
    name: "Bun Cha Ha Noi",
    address: "Ha Noi",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.collection("participants").insertMany([
    {
      _id: minhId,
      ownerId,
      name: "Minh",
      totalDebt: 0,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: khanhId,
      ownerId,
      name: "Khanh",
      totalDebt: 0,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const accessToken = jwt.sign({ id: ownerId.toString() }, jwtSecret);

  await page.route("**/api/v1/auth/refresh", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ access_token: accessToken }),
    });
  });

  await page.goto("/add-meal");

  await expect(
    page.getByRole("heading", { name: "Nhập thông tin" }),
  ).toBeVisible();

  await page
    .locator("textarea")
    .fill("Minh ăn bún chả 45k\nKhánh ăn bún chả 45k");

  await page.getByRole("button", { name: "Phân tích" }).click();

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

  await page.getByRole("button", { name: "Lưu thông tin" }).click();

  await expect(page).toHaveURL("http://127.0.0.1:5173/");

  const meal = await db.collection("meals").findOne({
    ownerId,
    restaurantId,
    restaurantName: "Bun Cha Ha Noi",
    totalAmount: 90000,
  });

  expect(meal).toBeTruthy();

  expect(meal?.participantsInfo).toMatchObject([
    {
      participantId: minhId,
      amount: 45000,
      status: "unpaid",
    },
    {
      participantId: khanhId,
      amount: 45000,
      status: "unpaid",
    },
  ]);

  const minh = await db.collection("participants").findOne({
    _id: minhId,
  });

  const khanh = await db.collection("participants").findOne({
    _id: khanhId,
  });

  expect(minh?.totalDebt).toBe(45000);
  expect(khanh?.totalDebt).toBe(45000);

  await mongoose.disconnect();
});
