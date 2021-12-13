import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Undefined environment variable - ${key}`);
  }
  return value;
};

export const env = {
  NODE_ENV: getEnv('NODE_ENV'),
  LOG_LEVEL: getEnv('LOG_LEVEL', 'INFO'),
  PORT: getEnv('PORT', '3000'),
  MONGODB_URL: getEnv('MONGODB_URL'),
};
