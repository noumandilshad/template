import { ObjectId } from 'mongodb';

export class RefreshToken {
  constructor(
    public token: string,
    public expiresAt: number,
    public userId: ObjectId,
    public revoked: boolean,
  ) { }
}
