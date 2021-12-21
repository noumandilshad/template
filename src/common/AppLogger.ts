import log4js, { Logger } from 'log4js';
import { getEnv } from './env';

const AppLogger = log4js.getLogger();

AppLogger.level = getEnv('LOG_LEVEL');
AppLogger.info(`Started AppLogger with level: ${AppLogger.level}`);

export const getLogger = (): Logger => AppLogger;
