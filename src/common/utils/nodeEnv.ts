import { env } from '../env';

export const isNodeEnvDev = (): boolean => env.NODE_ENV === 'development';
export const isNodeEnvTest = (): boolean => env.NODE_ENV === 'test';
