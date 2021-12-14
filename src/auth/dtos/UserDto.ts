import { ObjectId } from 'mongodb';
import { User } from '../models/User';

export class UserDto {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public id: ObjectId,
  ) {}

  public static fromUser(user: User): UserDto {
    return new UserDto(
      user.firstName,
      user.lastName,
      user.email,
      user.id!,
    );
  }
}
