import { z } from "zod";

export const parseMealTextRequestSchema = z.object({
  body: z.object({
    text: z
      .string()
      .trim()
      .min(1, "Text is required")
      .max(300, "Text is too long"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
