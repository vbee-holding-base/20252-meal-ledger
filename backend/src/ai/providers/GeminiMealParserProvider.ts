import { mealParserAI } from "../interfaces/mealParserAI";
import {
  ParseMealTextInput,
  ParsedMealRaw,
} from "../types/mealParserTypes";
import { buildPrompt } from "../prompts/mealPromptBuilder";
import { rawMealParseSchema } from "../schemas/mealParserSchema";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";

export class GeminiMealParserProvider implements mealParserAI {
  async parseMealText(input: ParseMealTextInput): Promise<ParsedMealRaw> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

    const response = await fetch(
      `${GEMINI_API_URL}/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: buildPrompt(input),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: rawMealParseSchema,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini request failed: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof responseText !== "string" || responseText.trim() === "") {
      throw new Error("Gemini response did not contain parseable text");
    }

    try {
      return JSON.parse(responseText) as ParsedMealRaw;
    } catch {
      throw new Error("Gemini response was not valid JSON");
    }
  }
}