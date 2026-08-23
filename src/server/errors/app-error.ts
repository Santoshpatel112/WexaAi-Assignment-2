// ============================================
// Custom Application Errors
// ============================================

export type ErrorCode =
  | "DATABASE_UNAVAILABLE"
  | "DATABASE_QUERY_ERROR"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "GRAPH_QUERY_ERROR"
  | "INTERNAL_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(code: ErrorCode, message: string, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
    // Maintains proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super("DATABASE_QUERY_ERROR", message, 503);
    this.name = "DatabaseError";
  }
}

export class DatabaseUnavailableError extends AppError {
  constructor(message = "Unable to connect to graph database") {
    super("DATABASE_UNAVAILABLE", message, 503);
    this.name = "DatabaseUnavailableError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      "NOT_FOUND",
      id ? `${resource} with id '${id}' not found` : `${resource} not found`,
      404
    );
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message, 400);
    this.name = "ValidationError";
  }
}

export class GraphQueryError extends AppError {
  constructor(message = "Graph query failed") {
    super("GRAPH_QUERY_ERROR", message, 500);
    this.name = "GraphQueryError";
  }
}

// ============================================
// Error → HTTP Response mapping
// ============================================

export function toApiError(error: unknown): { code: string; message: string; statusCode: number } {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  // Neo4j service unavailable
  if (error instanceof Error) {
    if (
      error.message.includes("Connection") ||
      error.message.includes("ServiceUnavailable") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return {
        code: "DATABASE_UNAVAILABLE",
        message: "Unable to connect to graph database",
        statusCode: 503,
      };
    }
    // Sanitize — never expose raw internal errors to clients
    return {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
      statusCode: 500,
    };
  }

  return {
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred",
    statusCode: 500,
  };
}
