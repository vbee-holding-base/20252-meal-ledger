import type {
  MealParserOwnerContext,
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

const isNonNegativeAmount = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

export const validateParsedMealDraft = ({
  draft,
  owner,
  participants,
  restaurants,
}: {
  draft: ParsedMealDraft;
  owner: MealParserOwnerContext;
  participants: MealParserParticipantContext[];
  restaurants: MealParserRestaurantContext[];
}): ValidatedMealParseResult => {
  const warnings = Array.isArray(draft.notes) ? [...draft.notes] : [];

  const ownerNames = new Set(
    [owner.name, ...owner.aliases]
      .filter((name): name is string => Boolean(name))
      .map((name) => normalizeText(name)),
  );

  if (!draft.date || Number.isNaN(Date.parse(draft.date))) {
    warnings.push("Date is missing or not a valid ISO date.");
  }

  if (draft.totalAmount !== null && !isPositiveAmount(draft.totalAmount)) {
    warnings.push("Total amount must be a positive number or null.");
  }

  if (
    draft.ownerShareAmount !== null &&
    !isNonNegativeAmount(draft.ownerShareAmount)
  ) {
    warnings.push("Owner share amount must be a non-negative number or null.");
  }

  if (draft.payerName) {
    const payerLooksLikeOwner = ownerNames.has(normalizeText(draft.payerName));

    if (payerLooksLikeOwner && !draft.payerIsOwner) {
      warnings.push("Payer appears to be owner but payerIsOwner is false.");
    }

    if (!payerLooksLikeOwner && draft.payerIsOwner) {
      warnings.push(
        `Payer "${draft.payerName}" does not match owner "${owner.name}".`,
      );
    }

    if (!payerLooksLikeOwner) {
      warnings.push(
        `Payer "${draft.payerName}" is not the owner. Current system only tracks debts paid by owner.`,
      );
    }
  }

  if (!draft.payerName && !draft.payerIsOwner) {
    warnings.push("Payer is missing and payerIsOwner is false.");
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

    const normalizedParticipantName = normalizeText(participant.name);

    if (!isPositiveAmount(participant.amount)) {
      warnings.push(`Amount for "${participant.name}" is invalid.`);
    }

    if (ownerNames.has(normalizedParticipantName)) {
      warnings.push(
        `Owner "${participant.name}" should not be included as a debtor participant.`,
      );
    }

    if (!participantNames.has(normalizedParticipantName)) {
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

  const ownerShareAmount =
    draft.ownerShareAmount !== null && isNonNegativeAmount(draft.ownerShareAmount)
      ? draft.ownerShareAmount
      : 0;

  if (
    draft.totalAmount !== null &&
    isPositiveAmount(draft.totalAmount) &&
    draft.payerIsOwner
  ) {
    const expectedTotal = participantsTotal + ownerShareAmount;

    if (expectedTotal !== draft.totalAmount) {
      warnings.push(
        `Total amount ${draft.totalAmount} does not match participants total ${participantsTotal} plus owner share ${ownerShareAmount}.`,
      );
    }
  }

  return {
    draft,
    warnings,
    isValid: warnings.length === 0,
  };
};