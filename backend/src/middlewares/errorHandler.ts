import { Request, Response, NextFunction } from "express";
import ApiError, { ErrorCode } from "../config/errors";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError)
    return res.status(err.statusCode).json(err.toJSON());
  return res
    .status(500)
    .json({ errorCode: ErrorCode.SERVER_ERROR, message: err.message });
};

export default errorHandler;
