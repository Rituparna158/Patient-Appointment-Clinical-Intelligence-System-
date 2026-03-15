import { JwtPayload } from 'jsonwebtoken';
import { JWTPayload } from './auth.types';
import { PaginationQuery, TableQueryOptions } from './dashboard.types';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      validateQuery: PaginationQuery & TableQueryOptions;
      email: string;
      roles: string[];
    }
  }
}

export {};
