export class Token {
  public get refreshToken(): string {
    return this._refreshToken;
  }

  public get accessToken(): string {
    return this._accessToken;
  }

  constructor(private _accessToken: string, private _refreshToken: string) { }
}
