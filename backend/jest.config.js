/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Chỉ tìm các file có đuôi .test.ts hoặc .spec.ts
  testMatch: ["**/**/*.test.ts"],
  clearMocks: true,
};
