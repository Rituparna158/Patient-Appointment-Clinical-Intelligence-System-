import { JwtPayload } from 'jsonwebtoken';
import { JWTPayload } from './auth.types';
import { PaginationQuery, TableQueryOptions } from './clinical.types';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      validateQuery: PaginationQuery & TableQueryOptions;
    }
  }
}

export {};
