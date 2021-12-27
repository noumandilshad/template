import { ContainerModule, interfaces } from 'inversify';
import { getRepository, Repository } from 'typeorm';
import { authTypes } from '../auth/authTypes';
import { UserVerification } from '../auth/models/UserVerfication';
import { User } from './models/User';
import { UserService } from './services/UserService';
import { userTypes } from './userTypes';

export const userContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<Repository<User>>(userTypes.UserRepository).toConstantValue(getRepository(User));
  bind<Repository<UserVerification>>(authTypes.VerificationRepository).toConstantValue(getRepository(UserVerification));
  bind<UserService>(userTypes.UserService).to(UserService);
});
