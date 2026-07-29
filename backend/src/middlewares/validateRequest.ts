import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ValidationError } from "../config/errors";

export const validateRequest =
  (schema: z.ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");

      throw new ValidationError(message);
    }

    next();
  };
