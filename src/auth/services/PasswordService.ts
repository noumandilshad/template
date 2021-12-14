import { compare, genSalt, hash } from 'bcrypt';
import { injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';

const SALT_ROUNDS = 10;

@injectable()
export class PasswordService {
  private logger: Logger;

  constructor() {
    this.logger = getLogger();
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(SALT_ROUNDS);
    return hash(password, salt);
  }

  public async checkPasswordMatches(hashedPwd: string, plainTextPwd: string):
    Promise<boolean> {
    return compare(plainTextPwd, hashedPwd);
  }
}
