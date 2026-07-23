import { Request, Response, NextFunction } from "express";
import ApiError, { ErrorCode } from "../config/errors";

const errorHandler = (
  err: Error,
  _req: Request,
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
    .on("finish", () => {});
};

export default errorHandler;
