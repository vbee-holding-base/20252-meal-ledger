import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../config/errors";

function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new NotFoundError("route not found"));
}

export default notFoundHandler;
