import { z } from "zod";

export const createRestaurantSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Restaurant name is required")
      .max(30, "Restaurant name is too long")
      .regex(/^[A-Za-z]/, "Restaurant name must start with a letter"),
    address: z.string().trim().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateRestaurantSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Restaurant name is required")
      .max(30, "Restaurant name is too long")
      .regex(/^[A-Za-z]/, "Restaurant name must start with a letter"),
    address: z.string().trim().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Restaurant id is required"),
  }),
  query: z.object({}).optional(),
});

export const deleteRestaurantSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1, "Restaurant id is required"),
  }),
  query: z.object({}).optional(),
});
