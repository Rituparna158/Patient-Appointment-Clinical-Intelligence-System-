import { AppError } from './error';

export function handleApiError(error: unknown): never {
  if (error instanceof AppError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new AppError(error.message, undefined, 'unknown');
  }

  throw new AppError('Something went wrong', undefined, 'unknown');
}
