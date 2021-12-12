import { ContainerModule, interfaces } from 'inversify';
import { AuthController } from './controllers/AuthController';
import { AUTH_TYPES } from './authTypes';
import { AuthRouter } from './AuthRouter';

export const authContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<AuthController>(AUTH_TYPES.AuthController).to(AuthController);
  bind<AuthRouter>(AUTH_TYPES.AuthRouter).to(AuthRouter);
});
