import { Router } from 'express';

export interface BaseRouter {
   getConfiguredRouter(): Router;
}
