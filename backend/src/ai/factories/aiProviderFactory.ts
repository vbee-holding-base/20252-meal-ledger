import { GeminiMealParserProvider } from "../providers/geminiProvider";

export const createMealParserProvider = () => {
  const provider = process.env.AI_PROVIDER || "gemini";

  switch (provider) {
    case "gemini":
      return new GeminiMealParserProvider();
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
};
