import { z } from "zod";

export const createParticipantSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Participant name is required")
      .max(30, "Participant name is too long")
      .regex(/^[A-Za-z]/, "Participant name must start with a letter"),
    ownerId: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateParticipantSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Participant name is required")
      .max(30, "Participant name is too long")
      .regex(/^[A-Za-z]/, "Participant name must start with a letter"),
    ownerId: z.string().optional(),
  }),
  params: z.object({
    participantId: z.string().min(1, "Participant id is required"),
  }),
  query: z.object({}).optional(),
});

export const deleteParticipantSchema = z.object({
  body: z
    .object({
      ownerId: z.string().optional(),
    })
    .optional(),
  params: z.object({
    participantId: z.string().min(1, "Participant id is required"),
  }),
  query: z.object({}).optional(),
});
