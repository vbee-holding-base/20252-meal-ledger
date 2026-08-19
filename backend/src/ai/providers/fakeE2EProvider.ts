import { mealParserAI } from "../interfaces/mealParserAI";
import {
  ParseMealTextInput,
  ParsedMealRaw,
} from "../interfaces/mealParserTypes";

export class FakeE2EMealParserProvider implements mealParserAI {
  async parseMealText(_input: ParseMealTextInput): Promise<ParsedMealRaw> {
    return {
      restaurantName: "Bun Cha Ha Noi",
      date: "2026-08-18T00:00:00.000Z",
      totalAmount: 90000,
      entries: [
        {
          personName: "Minh",
          amount: 45000,
          rawText: "Minh ăn bún chả 45k",
        },
        {
          personName: "Khanh",
          amount: 45000,
          rawText: "Khánh ăn bún chả 45k",
        },
      ],
      notes: [],
    };
  }
}
