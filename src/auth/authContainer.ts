import { ContainerModule, interfaces } from 'inversify';
import { getRepository, Repository } from 'typeorm';
import { AuthController } from './routes/AuthController';
import { RegisterService } from './services/RegisterService';
import { TokenService } from './services/TokenService';
import { PasswordService } from './services/PasswordService';
import { AuthRouter } from './routes/AuthRouter';
import { authTypes } from './authTypes';
import { env } from '../common/env';
import { RefreshToken } from './models/RefreshToken';

export const authContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<AuthController>(authTypes.AuthController).to(AuthController);
  bind<RegisterService>(authTypes.RegisterService).to(RegisterService);
  bind<TokenService>(authTypes.TokenService).to(TokenService);
  bind<AuthRouter>(authTypes.AuthRouter).to(AuthRouter);
  bind<PasswordService>(authTypes.PasswordService).to(PasswordService);
  bind<Repository<RefreshToken>>(authTypes.RefreshTokenRepository).toConstantValue(getRepository(RefreshToken));
  bind<string>(authTypes.JwtSecret).toConstantValue(env.JWT_PRIVATE_KEY);
  bind<number>(authTypes.JwtAccessTokenExpiration).toConstantValue(env.JWT_ACCESS_TOKEN_EXPIRATION);
  bind<number>(authTypes.JwtRefreshTokenExpiration).toConstantValue(env.JWT_REFRESH_TOKEN_EXPIRATION);
});
