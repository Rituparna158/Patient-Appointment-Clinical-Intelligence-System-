import { redis } from '../config/redis';

const saveRefreshToken = async (userId: string, token: string) => {
  await redis.set(`refresh:${userId}`, token, 'EX', 7 * 24 * 60 * 60);
};

const getRefreshToken = async (userId: string): Promise<string | null> => {
  return redis.get(`refresh:${userId}`);
};
const deleteRefreshToken = async (userId: string) => {
  await redis.del(`refresh:${userId}`);
};
export { saveRefreshToken, getRefreshToken, deleteRefreshToken };
