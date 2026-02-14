import { HTTP_STATUS } from '../constants/http-status';

class AppError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
export { AppError };
