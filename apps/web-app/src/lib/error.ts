export type ErrorType = 'api' | 'network' | 'unknown';

export class AppError extends Error {
  statusCode?: number;
  type: ErrorType;

  constructor(
    message: string,
    statusCode?: number,
    type: ErrorType = 'unknown'
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.type = type;
  }
}
