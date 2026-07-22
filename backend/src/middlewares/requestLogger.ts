import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
        ip: req.ip,
      },
      "HTTP req",
    );
  });
  next();
};

export default requestLogger;
