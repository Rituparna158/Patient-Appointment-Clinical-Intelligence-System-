import crypto from 'crypto';

export const generateTempPassword = (): string => {
  return crypto.randomBytes(4).toString('hex');
};
