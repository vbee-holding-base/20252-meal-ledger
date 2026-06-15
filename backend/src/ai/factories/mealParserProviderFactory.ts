import { GeminiMealParserProvider } from "../providers/GeminiMealParserProvider";

export const createMealParserProvider = () => {
  return new GeminiMealParserProvider();
};