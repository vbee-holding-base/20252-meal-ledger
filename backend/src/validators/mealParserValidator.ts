import {
  MealParserParticipantContext,
  MealParserRestaurantContext,
  ParsedMealRaw,
  ParsedMealRawEntry,
} from "../ai/interfaces/mealParserTypes";

export type MealParseIssueSeverity = "error" | "warning";

export type MealParseIssueCode =
  | "EMPTY_ENTRIES"
  | "UNKNOWN_PARTICIPANT"
  | "UNKNOWN_RESTAURANT"
  | "UNKNOWN_PAYER"
  | "MISSING_AMOUNT"
  | "INVALID_AMOUNT"
  | "TOTAL_MISMATCH"
  | "INVALID_DATE";

export interface IndividualParseIssue {
  severity: MealParseIssueSeverity;
  code: MealParseIssueCode;
  message: string;
  entryIndex?: number;
  value?: unknown;
}

export interface ValidatedMealEntry {
  personName: string;
  participantId: string | null;
  amount: number | null;
  rawText?: string;
  issues: IndividualParseIssue[];
}

export interface FinalValidatedMeal {
  restaurantName: string | null;
  restaurantId: string | null;
  date: string | null;
  payerName: string | null;
  payerId: string | null;
  totalAmount: number | null;
  entries: ValidatedMealEntry[];
  issues: IndividualParseIssue[];
  isValid: boolean;
}

interface ValidateMealParseResultInput {
  parsed: ParsedMealRaw;
  participants: MealParserParticipantContext[];
  restaurants: MealParserRestaurantContext[];
}

const normalizeName = (value: string) => {
  return value.trim().toLowerCase();
};

const findParticipantIdByName = (
  name: string | null,
  participants: MealParserParticipantContext[],
): string | null => {
  if (!name) return null;

  const normalized = normalizeName(name);
  const participant = participants.find(
    (p) => normalizeName(p.name) === normalized,
  );

  return participant ? participant.id : null;
};

const findRestaurantIdByName = (
  name: string | null,
  restaurants: MealParserRestaurantContext[],
): string | null => {
  if (!name) return null;

  const normalized = normalizeName(name);
  const restaurant = restaurants.find(
    (r) => normalizeName(r.name) === normalized,
  );

  return restaurant ? restaurant.id : null;
};

const isValidDate = (value: string | null) => {
  if (!value) return true;

  return !Number.isNaN(new Date(value).getTime());
};

const sumEntryAmounts = (entries: ParsedMealRawEntry[]) => {
  let sum = 0;

  for (const entry of entries) {
    if (typeof entry.amount !== "number" || entry.amount <= 0) {
      continue;
    }

    sum += entry.amount;
  }

  return sum;
};

export const finalValidatedResult = ({
  parsed,
  participants,
  restaurants,
}: ValidateMealParseResultInput): FinalValidatedMeal => {
  const issues: IndividualParseIssue[] = [];

  const restaurantId = findRestaurantIdByName(
    parsed.restaurantName,
    restaurants,
  );

  if (parsed.restaurantName && !restaurantId) {
    issues.push({
      severity: "warning",
      code: "UNKNOWN_RESTAURANT",
      message: `Restaurant "${parsed.restaurantName}" not found in your restaurant list.`,
    });
  }

  const payerId = findParticipantIdByName(parsed.payerName, participants);

  if (parsed.payerName && !payerId) {
    issues.push({
      severity: "warning",
      code: "UNKNOWN_PAYER",
      message: `Payer "${parsed.payerName}" not found in your participant list.`,
    });
  }

  if (!isValidDate(parsed.date)) {
    issues.push({
      severity: "error",
      code: "INVALID_DATE",
      message: `Date "${parsed.date}" is not a valid date format.`,
    });
  }

  if (parsed.entries.length === 0) {
    issues.push({
      severity: "error",
      code: "EMPTY_ENTRIES",
      message: "No meal entries were parsed.",
    });
  }

  const entries = parsed.entries.map((entry, i): ValidatedMealEntry => {
    const entryIssues: IndividualParseIssue[] = [];

    const participantId = findParticipantIdByName(
      entry.personName,
      participants,
    );

    if (!participantId) {
      entryIssues.push({
        severity: "warning",
        code: "UNKNOWN_PARTICIPANT",
        message: `Participant "${entry.personName}" could not be found.`,
        entryIndex: i,
        value: entry.personName,
      });
    }

    if (entry.amount === null) {
      entryIssues.push({
        severity: "error",
        code: "MISSING_AMOUNT",
        message: `Amount is missing for entry "${entry.personName}".`,
        entryIndex: i,
        value: entry.amount,
      });
    } else if (typeof entry.amount !== "number" || entry.amount <= 0) {
      entryIssues.push({
        severity: "error",
        code: "INVALID_AMOUNT",
        message: `Amount for entry "${entry.personName}" must be a positive number.`,
        entryIndex: i,
        value: entry.amount,
      });
    }

    return {
      personName: entry.personName,
      participantId,
      amount: entry.amount,
      rawText: entry.rawText || "",
      issues: entryIssues,
    };
  });

  const entryIssues = entries.flatMap((entry) => entry.issues);
  const allIssues = [...issues, ...entryIssues];

  const totalEntryAmount = sumEntryAmounts(parsed.entries);

  if (parsed.totalAmount !== null && totalEntryAmount !== parsed.totalAmount) {
    allIssues.push({
      severity: "warning",
      code: "TOTAL_MISMATCH",
      message: `Total amount ${parsed.totalAmount} does not match sum of entry amounts ${totalEntryAmount}.`,
      value: {
        totalAmount: parsed.totalAmount,
        totalEntryAmount,
      },
    });
  }

  return {
    restaurantName: parsed.restaurantName,
    restaurantId,
    date: parsed.date,
    payerName: parsed.payerName,
    payerId,
    totalAmount: parsed.totalAmount,
    entries,
    issues: allIssues,
    isValid: !allIssues.some((issue) => issue.severity === "error"),
  };
};
