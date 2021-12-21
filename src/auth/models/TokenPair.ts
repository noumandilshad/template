import { RefreshToken } from './RefreshToken';

export class TokenPair {
  constructor(public accessToken: string, public refreshToken: RefreshToken) { }
}
