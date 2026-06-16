import { ParseMealTextInput, ParsedMealRaw } from "./mealParserTypes";

export interface mealParserAI {
  parseMealText(input: ParseMealTextInput): Promise<ParsedMealRaw>;
}
