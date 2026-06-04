import type {
  MealParserParticipantContext,
  MealParserRestaurantContext,
  ParsedMealDraft,
} from "../services/aiMealParserService";

export interface ValidatedMealParseResult {
  draft: ParsedMealDraft;
  warnings: string[];
  isValid: boolean;
}

const normalizeText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

const isPositiveAmount = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

export const validateParsedMealDraft = ({
  draft,
  participants,
  restaurants,
}: {
  draft: ParsedMealDraft;
  participants: MealParserParticipantContext[];
  restaurants: MealParserRestaurantContext[];
}): ValidatedMealParseResult => {
  const warnings = Array.isArray(draft.notes) ? [...draft.notes] : [];

  if (!draft.date || Number.isNaN(Date.parse(draft.date))) {
    warnings.push("Date is missing or not a valid ISO date.");
  }

  if (draft.totalAmount !== null && !isPositiveAmount(draft.totalAmount)) {
    warnings.push("Total amount must be a positive number or null.");
  }

  if (!Array.isArray(draft.participants) || draft.participants.length === 0) {
    warnings.push("No participants were parsed from the text.");
  }

  const participantNames = new Set(
    participants.map((participant) => normalizeText(participant.name)),
  );

  for (const participant of draft.participants ?? []) {
    if (!participant.name || typeof participant.name !== "string") {
      warnings.push("A parsed participant is missing a name.");
      continue;
    }

    if (!isPositiveAmount(participant.amount)) {
      warnings.push(`Amount for "${participant.name}" is invalid.`);
    }

    if (!participantNames.has(normalizeText(participant.name))) {
      warnings.push(`Participant "${participant.name}" is not configured.`);
    }
  }

  if (draft.restaurantName) {
    const restaurantNames = new Set(
      restaurants.map((restaurant) => normalizeText(restaurant.name)),
    );

    if (!restaurantNames.has(normalizeText(draft.restaurantName))) {
      warnings.push(`Restaurant "${draft.restaurantName}" is not configured.`);
    }
  }

  const participantsTotal = (draft.participants ?? []).reduce(
    (sum, participant) =>
      isPositiveAmount(participant.amount) ? sum + participant.amount : sum,
    0,
  );

  if (
    draft.totalAmount !== null &&
    isPositiveAmount(draft.totalAmount) &&
    participantsTotal !== draft.totalAmount
  ) {
    warnings.push(
      `Total amount ${draft.totalAmount} does not match participants total ${participantsTotal}.`,
    );
  }

  return {
    draft,
    warnings,
    isValid: warnings.length === 0,
  };
};