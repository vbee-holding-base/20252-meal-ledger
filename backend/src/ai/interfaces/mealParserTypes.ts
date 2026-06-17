export interface MealParserParticipantContext {
  id: string;
  name: string;
}

export interface MealParserRestaurantContext {
  id: string;
  name: string;
  address: string;
}

export interface ParsedMealRawEntry {
  personName: string;
  amount: number | null;
  rawText?: string;
}

export interface ParsedMealRaw {
  restaurantName: string | null;
  date: string | null;
  totalAmount: number | null;
  entries: ParsedMealRawEntry[];
  notes: string[];
}

export interface ParseMealTextInput {
  text: string;
  now: Date;
  participants: MealParserParticipantContext[];
  restaurants: MealParserRestaurantContext[];
}
