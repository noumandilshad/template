import { ContainerModule, interfaces } from 'inversify';
import { AuthController } from './AuthController';
import { AUTH_TYPES } from './authTypes';
import { AuthRouter } from './AuthRouter';
import { RegisterUserService } from './services/RegisterUserService';

export const authContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<AuthController>(AUTH_TYPES.AuthController).to(AuthController);
  bind<RegisterUserService>(AUTH_TYPES.RegisterUserService).to(RegisterUserService);
  bind<AuthRouter>(AUTH_TYPES.AuthRouter).to(AuthRouter);
});
