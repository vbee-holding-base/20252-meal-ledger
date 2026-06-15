import { mealParserAI } from "../ai/interfaces/mealParserAI";
import {
    ParseMealTextInput,
    ParsedMealRaw,
} from "../ai/types/mealParserTypes";
export class MealParserService {
  constructor(private readonly aiProvider: mealParserAI) {}

  async parse(
    input: ParseMealTextInput
  ): Promise<ParsedMealRaw> {
    return this.aiProvider.parseMealText(input);
  }
}