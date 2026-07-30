import {
  generateRefreshToken,
  regenerateAccessToken,
  revokeRefreshToken,
} from "../../../src/services/authService";
import { redisClient } from "../../../src/config/redis";
import jwt from "jsonwebtoken";

// Mock redisClient
jest.mock("../../../src/config/redis", () => ({
  redisClient: {
    isOpen: true,
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
}));

describe("authService Refresh Token with Redis", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      JWT_SECRET: "test_jwt_secret",
      JWT_REFRESH_SECRET: "test_jwt_refresh_secret",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("generateRefreshToken", () => {
    it("should generate a JWT refresh token and store it in Redis", async () => {
      const ownerId = "owner123";
      const token = await generateRefreshToken(ownerId);

      expect(typeof token).toBe("string");
      const decoded = jwt.verify(token, "test_jwt_refresh_secret") as {
        id: string;
      };
      expect(decoded.id).toBe(ownerId);

      expect(redisClient.set).toHaveBeenCalledWith(
        `refresh_token:${ownerId}`,
        token,
        { EX: 7 * 24 * 60 * 60 },
      );
    });
  });

  describe("regenerateAccessToken", () => {
    it("should generate a new access token when valid refresh token is in Redis", async () => {
      const ownerId = "owner123";
      const token = jwt.sign({ id: ownerId }, "test_jwt_refresh_secret", {
        expiresIn: "7d",
      });

      (redisClient.get as jest.Mock).mockResolvedValue(token);

      const newAccessToken = await regenerateAccessToken(token);

      expect(typeof newAccessToken).toBe("string");
      const decoded = jwt.verify(newAccessToken, "test_jwt_secret") as {
        id: string;
      };
      expect(decoded.id).toBe(ownerId);
      expect(redisClient.get).toHaveBeenCalledWith(`refresh_token:${ownerId}`);
    });

    it("should throw UnauthorisedError if token in Redis does not match", async () => {
      const ownerId = "owner123";
      const token = jwt.sign({ id: ownerId }, "test_jwt_refresh_secret", {
        expiresIn: "7d",
      });

      (redisClient.get as jest.Mock).mockResolvedValue("different_token");

      await expect(regenerateAccessToken(token)).rejects.toThrow(
        "invalid refresh token",
      );
    });

    it("should throw UnauthorisedError if refresh token is not found in Redis", async () => {
      const ownerId = "owner123";
      const token = jwt.sign({ id: ownerId }, "test_jwt_refresh_secret", {
        expiresIn: "7d",
      });

      (redisClient.get as jest.Mock).mockResolvedValue(null);

      await expect(regenerateAccessToken(token)).rejects.toThrow(
        "invalid refresh token",
      );
    });
  });

  describe("revokeRefreshToken", () => {
    it("should delete refresh token from Redis by userId", async () => {
      const ownerId = "owner123";
      await revokeRefreshToken(ownerId);

      expect(redisClient.del).toHaveBeenCalledWith(`refresh_token:${ownerId}`);
    });

    it("should decode token and delete refresh token from Redis if userId is omitted", async () => {
      const ownerId = "owner123";
      const token = jwt.sign({ id: ownerId }, "test_jwt_refresh_secret", {
        expiresIn: "7d",
      });

      await revokeRefreshToken(undefined, token);

      expect(redisClient.del).toHaveBeenCalledWith(`refresh_token:${ownerId}`);
    });
  });
});
