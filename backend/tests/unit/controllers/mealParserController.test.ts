import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseMealText } from "../../../src/controllers/mealParserController";
import { getAllParticipantByOwnerId } from "../../../src/repo/participantRepo";
import { getRestaurantsByOwnerId } from "../../../src/repo/restaurantRepo";
import { createMealParserProvider } from "../../../src/ai/factories/aiProviderFactory";
import { UnauthorisedError } from "../../../src/config/errors";

vi.mock("../../../src/repo/participantRepo", () => ({
  getAllParticipantByOwnerId: vi.fn(),
}));

vi.mock("../../../src/repo/restaurantRepo", () => ({
  getRestaurantsByOwnerId: vi.fn(),
}));

vi.mock("../../../src/ai/factories/aiProviderFactory", () => ({
  createMealParserProvider: vi.fn(),
}));

vi.mock("../../../src/config/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

const mockResponse = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockReturnValue(res);

  return res;
};

describe("mealParserController.parseMealText", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return parsed meal result", async () => {
    const req = {
      user: { id: "owner-1" },
      body: { text: " Bun Cha 100000, An 50000, Binh 50000 " },
    } as any;

    const res = mockResponse() as any;

    vi.mocked(getAllParticipantByOwnerId).mockResolvedValue([
      {
        _id: { toString: () => "participant-1" },
        name: "An",
        status: "active",
      },
      {
        _id: { toString: () => "participant-2" },
        name: "Binh",
        status: "active",
      },
      {
        _id: { toString: () => "participant-3" },
        name: "Cuong",
        status: "inactive",
      },
    ] as any);

    vi.mocked(getRestaurantsByOwnerId).mockResolvedValue([
      {
        _id: { toString: () => "restaurant-1" },
        name: "Bun Cha",
        address: "Ha Noi",
      },
    ] as any);

    vi.mocked(createMealParserProvider).mockReturnValue({
      parseMealText: vi.fn().mockResolvedValue({
        restaurantName: "Bun Cha",
        date: "2026-08-12",
        totalAmount: 100000,
        entries: [
          { personName: "An", amount: 50000 },
          { personName: "Binh", amount: 50000 },
        ],
        notes: [],
      }),
    } as any);

    await parseMealText(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        restaurantName: "Bun Cha",
        restaurantId: "restaurant-1",
        date: "2026-08-12",
        totalAmount: 100000,
        entries: [
          {
            personName: "An",
            participantId: "participant-1",
            amount: 50000,
            rawText: "",
            issues: [],
          },
          {
            personName: "Binh",
            participantId: "participant-2",
            amount: 50000,
            rawText: "",
            issues: [],
          },
        ],
        issues: [],
      },
      context: {
        participants: [
          { id: "participant-1", name: "An" },
          { id: "participant-2", name: "Binh" },
        ],
        restaurants: [
          {
            id: "restaurant-1",
            name: "Bun Cha",
            address: "Ha Noi",
          },
        ],
      },
    });
  });

  it("should throw UnauthorisedError when user is missing", async () => {
    const req = {
      body: { text: "An 50000" },
    } as any;

    const res = mockResponse() as any;

    await expect(parseMealText(req, res)).rejects.toBeInstanceOf(
      UnauthorisedError,
    );
  });

  it("should throw ServerError when AI provider fails", async () => {
    const req = {
      user: { id: "owner-1" },
      body: { text: "An 50000" },
    } as any;

    const res = mockResponse() as any;

    vi.mocked(getAllParticipantByOwnerId).mockResolvedValue([]);
    vi.mocked(getRestaurantsByOwnerId).mockResolvedValue([]);

    vi.mocked(createMealParserProvider).mockReturnValue({
      parseMealText: vi.fn().mockRejectedValue(new Error("AI failed")),
    } as any);

    await expect(parseMealText(req, res)).rejects.toMatchObject({
      statusCode: 500,
      message: "Could not parse meal text.",
    });
  });

  it("should throw error when participant repo fails", async () => {
    const req = {
      user: { id: "owner-1" },
      body: { text: "An 50000" },
    } as any;

    const res = mockResponse() as any;

    vi.mocked(getAllParticipantByOwnerId).mockRejectedValue(
      new Error("Mongo failed"),
    );

    vi.mocked(getRestaurantsByOwnerId).mockResolvedValue([]);

    await expect(parseMealText(req, res)).rejects.toThrow("Mongo failed");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
