import { injectable } from 'inversify';
import { Document, InsertOneResult } from 'mongodb';
import { collections } from '../../common/MongoDbConnection';
import { RefreshToken } from '../models/RefreshToken';

@injectable()
export class RefreshTokenRepository {
  public async create(refreshToken: RefreshToken): Promise<InsertOneResult<Document>> {
    return collections.refreshTokens!.insertOne(refreshToken);
  }
}
