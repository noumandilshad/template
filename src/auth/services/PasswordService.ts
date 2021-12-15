import { compare, genSalt, hash } from 'bcrypt';
import { injectable } from 'inversify';

const SALT_ROUNDS = 10;
@injectable()
export class PasswordService {
  public async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(SALT_ROUNDS);
    return hash(password, salt);
  }

  public async checkPasswordMatches(hashedPwd: string, plainTextPwd: string):
    Promise<boolean> {
    return compare(plainTextPwd, hashedPwd);
  }
}
