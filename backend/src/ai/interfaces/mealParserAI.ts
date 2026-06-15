import {
    ParseMealTextInput,
    ParsedMealRaw,
} from "../types/mealParserTypes";

export interface mealParserAI{
    parseMealText(input: ParseMealTextInput): Promise<ParsedMealRaw>;
}