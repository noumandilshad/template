import { Application as ExpressApplication } from 'express';

export interface AppInterface {
  getConfiguredApp(): ExpressApplication;
}
