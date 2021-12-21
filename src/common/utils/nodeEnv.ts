import { getEnv } from '../env';

export const isNodeEnvDev = (): boolean => getEnv('NODE_ENV') === 'development';
export const isNodeEnvTest = (): boolean => getEnv('NODE_ENV') === 'test';
