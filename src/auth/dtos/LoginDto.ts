import { Trim } from 'class-sanitizer';
import {
  IsNotEmpty,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @Trim()
  username: string;

  @IsNotEmpty()
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
