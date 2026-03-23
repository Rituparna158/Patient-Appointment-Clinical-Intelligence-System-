// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { HTTP_STATUS } from '@repo/shared-constants';
// import { JwtPayload } from "@repo/shared-types"

// export interface JwtPayload {
//   id: string;
//   email: string;
//   roles: string[];
//   //userId: string;
// }

// export const authenticate = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token =
//     (req.cookies?.accessToken as string | undefined) ||
//     req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res
//       .status(HTTP_STATUS.UNAUTHORIZED)
//       .json({ message: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     ) as JwtPayload;

//     req.user = {
//       userId: decoded.id,
//       email: decoded.email,
//       roles: decoded.roles,
//     };

//     next();
//   } catch {
//     return res
//       .status(HTTP_STATUS.UNAUTHORIZED)
//       .json({ message: 'Invalid token' });
//   }
// };
