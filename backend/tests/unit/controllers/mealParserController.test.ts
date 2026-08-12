import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseMealText } from "../../../src/controllers/mealParserController";
import { getAllParticipantByOwnerId } from "../../../src/repo/participantRepo";
import { getRestaurantsByOwnerId } from "../../../src/repo/restaurantRepo";
import { createMealParserProvider } from "../../../src/ai/factories/aiProviderFactory";
import { finalValidatedResult } from "../../../src/validations/mealParserValidator";
import { UnauthorisedError, ServerError } from "../../../src/config/errors";

vi.mock("../../../src/repo/participantRepo", () => ({
  getAllParticipantByOwnerId: vi.fn(),
}));

vi.mock("../../../src/repo/restaurantRepo", () => ({
  getRestaurantsByOwnerId: vi.fn(),
}));

vi.mock("../../../src/ai/factories/aiProviderFactory", () => ({
  createMealParserProvider: vi.fn(),
}));

vi.mock("../../../src/validations/mealParserValidator", () => ({
  finalValidatedResult: vi.fn(),
}));

vi.mock("../../../src/config/logger", () => ({
  logger: {
    error: vi.fn(), //create mock function with mock output vi.fn()
  },
}));

const mockResponse = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockReturnValue(res);

  return res;
}; // create fake response object with status and json methods

describe("mealParserController.parseMealText", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  // happy path test case where everything works as expected, controller should return validated result with context
  it("should parse meal text and return validated result with context", async () => {
    const req = {
      user: { id: "owner-1" },
      body: { text: " Bun cha 100k, An 50k, Binh 50k " },
    } as any;
    //fake request
    const res = mockResponse() as any;

    const participants = [
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
    ];

    const restaurants = [
      {
        _id: { toString: () => "restaurant-1" },
        name: "Bun Cha",
        address: "Ha Noi",
      },
    ];

    const parsed = {
      restaurantName: "Bun Cha",
      date: "2026-08-12",
      totalAmount: 100000,
      entries: [
        { personName: "An", amount: 50000 },
        { personName: "Binh", amount: 50000 },
      ],
      notes: [],
    };

    const validated = {
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
    };

    const provider = {
      parseMealText: vi.fn().mockResolvedValue(parsed),
    };

    vi.mocked(getAllParticipantByOwnerId).mockResolvedValue(
      participants as any,
    ); //mock returns success
    vi.mocked(getRestaurantsByOwnerId).mockResolvedValue(restaurants as any);
    vi.mocked(createMealParserProvider).mockReturnValue(provider as any);
    vi.mocked(finalValidatedResult).mockReturnValue(validated as any);

    await parseMealText(req, res);

    expect(getAllParticipantByOwnerId).toHaveBeenCalledWith("owner-1");
    expect(getRestaurantsByOwnerId).toHaveBeenCalledWith("owner-1");

    expect(provider.parseMealText).toHaveBeenCalledWith({
      text: "Bun cha 100k, An 50k, Binh 50k",
      now: expect.any(Date),
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
    });

    expect(finalValidatedResult).toHaveBeenCalledWith({
      parsed,
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
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: validated,
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
  // edge case test where user is missing in request, controller should throw UnauthorisedError
  it("should throw UnauthorisedError when user is missing", async () => {
    const req = {
      body: { text: "An 50000" },
    } as any;

    const res = mockResponse() as any;

    await expect(parseMealText(req, res)).rejects.toBeInstanceOf(
      UnauthorisedError,
    );
  });
  // edge case test where parsing fails, controller should throw ServerError
  it("should throw ServerError when parsing fails", async () => {
    const req = {
      user: { id: "owner-1" },
      body: { text: "An 50000" },
    } as any;

    const res = mockResponse() as any;

    const provider = {
      parseMealText: vi.fn().mockRejectedValue(new Error("AI failed")), //mock returns failure
    };

    vi.mocked(getAllParticipantByOwnerId).mockResolvedValue([]);
    vi.mocked(getRestaurantsByOwnerId).mockResolvedValue([]);
    vi.mocked(createMealParserProvider).mockReturnValue(provider as any);
    //independent mock output
    await expect(parseMealText(req, res)).rejects.toMatchObject({
      statusCode: 500,
      message: "Could not parse meal text.",
    });
  });
  //edge case test where participant repo fails, controller should throw error
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

  it("should throw error when restaurant repo fails", async () => {
    const req = {
      user: { id: "owner-1" },
      body: { text: "An 50000" },
    } as any;

    const res = mockResponse() as any;

    vi.mocked(getAllParticipantByOwnerId).mockResolvedValue([]);
    vi.mocked(getRestaurantsByOwnerId).mockRejectedValue(
      new Error("Mongo failed"),
    );

    await expect(parseMealText(req, res)).rejects.toThrow("Mongo failed");

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
