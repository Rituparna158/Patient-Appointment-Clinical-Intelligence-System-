import pino from 'pino';

const LOG_LEVEL = process.env.LOG_LEVEL;

if (!LOG_LEVEL) {
  throw new Error('LOG_LEVEL is not defined in environment varoable');
}

export const logger = pino({
  level: LOG_LEVEL,
});
