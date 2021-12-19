import { ObjectId } from 'mongodb';
import { User } from '../models/User';

export class UserDto {
  constructor(
    public email: string,
    public id: ObjectId,
    public phone?: string,
  ) { }

  public static fromUser(user: User): UserDto {
    return new UserDto(
      user.email,
      user.id!,
      user.phone,
    );
  }
}
