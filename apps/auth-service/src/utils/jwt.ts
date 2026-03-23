import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !REFRESH_TOKEN) {
  throw new Error('JWT secretsbare not defined in environmentvariables');
}
const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};
const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_TOKEN, { expiresIn: '7d' });
};
const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN);
};

export { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken };
