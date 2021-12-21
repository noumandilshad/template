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
  DB_CONN_STRING: getEnv('DB_CONN_STRING'),
  DB_NAME: getEnv('DB_NAME'),
  JWT_PRIVATE_KEY: Buffer.from(getEnv('JWT_PRIVATE_KEY'), 'base64').toString(),
  JWT_ACCESS_TOKEN_EXPIRATION: parseInt(getEnv('JWT_ACCESS_TOKEN_EXPIRATION'), 10),
  JWT_REFRESH_TOKEN_EXPIRATION: parseInt(getEnv('JWT_REFRESH_TOKEN_EXPIRATION'), 10),
};
