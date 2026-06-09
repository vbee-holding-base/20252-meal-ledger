export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNAUTHORISED = "UNAUTHORISED",
  NOT_FOUND = "NOT_FOUND",
  DUPLICATE = "DUPLICATE",
  SERVER_ERROR = "SERVER_ERROR",
  EXTERNAL_ERROR = "EXTERNAL_ERROR",
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;

  constructor(statusCode: number, errorCode: ErrorCode, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = errorCode;
  }

  toJSON() {
    return { errorCode: this.code, message: this.message };
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, ErrorCode.VALIDATION_ERROR, message);
  }
}

export class UnauthorisedError extends ApiError {
  constructor(message: string) {
    super(401, ErrorCode.UNAUTHORISED, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(404, ErrorCode.NOT_FOUND, message);
  }
}

export class DuplicateError extends ApiError {
  constructor(message: string) {
    super(409, ErrorCode.DUPLICATE, message);
  }
}

export class ServerError extends ApiError {
  constructor(message: string) {
    super(500, ErrorCode.SERVER_ERROR, message);
  }
}

export class ExternalError extends ApiError {
  constructor(message: string) {
    super(502, ErrorCode.EXTERNAL_ERROR, message);
  }
}

export default ApiError;
