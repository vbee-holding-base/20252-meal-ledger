import { Request, Response, NextFunction } from "express";
import ApiError, { ErrorCode } from "../config/errors";
import { logger } from "../config/logger";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const error =
    err instanceof ApiError
      ? err.toJSON()
      : { errorCode: ErrorCode.SERVER_ERROR, message: err.message };
  return res
    .status(statusCode)
    .json(error)
    .on("finish", () =>
      logger.error(
        {
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          ip: req.ip,
        },
        "HTTP error",
      ),
    );
};

export default errorHandler;
