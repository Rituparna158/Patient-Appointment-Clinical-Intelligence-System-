import jwt from 'jsonwebtoken';
const JWT_SCRET = process.env.JWT_SECRET || 'dev-secret';

const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SCRET, { expiresIn: '1h' });
};
export { generateToken };
