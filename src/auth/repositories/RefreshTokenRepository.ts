import { injectable } from 'inversify';
import { Document, InsertOneResult } from 'mongodb';
import { collections } from '../../common/MongoDbConnection';
import { RefreshToken } from '../models/RefreshToken';

@injectable()
export class RefreshTokenRepository {
  public async findByToken(token: string): Promise<RefreshToken | undefined> {
    return (await collections.refreshTokens!.findOne({ token })) as unknown as RefreshToken;
  }

  public async create(refreshToken: RefreshToken): Promise<InsertOneResult<Document>> {
    return collections.refreshTokens!.insertOne(refreshToken);
  }
}
