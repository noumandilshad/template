import { ContainerModule, interfaces } from 'inversify';
import { UserRepository } from './repositories/UserRepository';
import { UserService } from './services/UserService';
import { userTypes } from './userTypes';


export const userContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<UserRepository>(userTypes.UserRepository).to(UserRepository);
  bind<UserService>(userTypes.UserService).to(UserService);
});
