import { GeminiMealParserProvider } from "../providers/geminiProvider";
import { FakeE2EMealParserProvider } from "../providers/fakeE2EProvider";

export const createMealParserProvider = () => {
  const provider = process.env.AI_PROVIDER || "gemini";

  switch (provider) {
    case "fake-e2e":
      return new FakeE2EMealParserProvider();
    case "gemini":
      return new GeminiMealParserProvider();
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
};
