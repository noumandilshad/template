import { ContainerModule, interfaces } from 'inversify';
import { AuthController } from './routes/AuthController';
import { RegisterService } from './services/RegisterService';
import { TokenService } from './services/TokenService';
import { PasswordService } from './services/PasswordService';
import { AuthRouter } from './routes/AuthRouter';
import { authTypes } from './authTypes';

export const authContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<AuthController>(authTypes.AuthController).to(AuthController);
  bind<RegisterService>(authTypes.RegisterService).to(RegisterService);
  bind<TokenService>(authTypes.TokenService).to(TokenService);
  bind<AuthRouter>(authTypes.AuthRouter).to(AuthRouter);
  bind<PasswordService>(authTypes.PasswordService).to(PasswordService);
});
