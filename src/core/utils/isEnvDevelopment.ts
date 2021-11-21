import { env } from '../env';

export const isEnvDevelopment = (): boolean => env.NODE_ENV === 'development';
