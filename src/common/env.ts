import dotenv from 'dotenv';

dotenv.config();

type EnvKey =
  'NODE_ENV' |
  'LOG_LEVEL' |
  'PORT' |
  'MONGO_DB_HOST' |
  'MONGO_DB_PORT' |
  'MONGO_DB_USERNAME' |
  'MONGO_DB_PASSWORD' |
  'MONGO_DB_DATABASE' |
  'JWT_PRIVATE_KEY' |
  'JWT_ACCESS_TOKEN_EXPIRATION' |
  'JWT_REFRESH_TOKEN_EXPIRATION' |
  'VERIFICATION_CODE_EXPIRATION';

export const getEnv = (key: EnvKey, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Undefined environment variable - ${key}`);
  }
  return value;
};

// export const env = {
//   NODE_ENV: getEnv('NODE_ENV'),
//   LOG_LEVEL: getEnv('LOG_LEVEL', true, 'INFO'),
//   PORT: getEnv('PORT', true, '3000'),
//   MONGO_DB_HOST: getEnv('MONGO_DB_HOST'),
//   MONGO_DB_PORT: parseInt(getEnv('MONGO_DB_PORT', false, '0')!, 10),
//   MONGO_DB_USERNAME: getEnv('MONGO_DB_USERNAME'),
//   MONGO_DB_PASSWORD: getEnv('MONGO_DB_PASSWORD'),
//   MONGO_DB_DATABASE: getEnv('MONGO_DB_DATABASE'),
//   JWT_PRIVATE_KEY: Buffer.from(getEnv('JWT_PRIVATE_KEY', true), 'base64').toString(),
//   JWT_ACCESS_TOKEN_EXPIRATION: parseInt(getEnv('JWT_ACCESS_TOKEN_EXPIRATION', true), 10),
//   JWT_REFRESH_TOKEN_EXPIRATION: parseInt(getEnv('JWT_REFRESH_TOKEN_EXPIRATION', true), 10),
// };
