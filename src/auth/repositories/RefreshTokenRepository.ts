import { plainToInstance } from 'class-transformer';
import { injectable } from 'inversify';
import { Document, InsertOneResult, ObjectId } from 'mongodb';
import { collections } from '../../common/MongoDbConnection';
import { RefreshToken } from '../models/RefreshToken';

@injectable()
export class RefreshTokenRepository {
  public async revoke(id: ObjectId): Promise<RefreshToken> {
    return (await collections.refreshTokens!.findOneAndUpdate(
      { _id: id },
      { $set: { revoked: true } },
    )) as unknown as RefreshToken;
  }

  public async findByToken(token: string): Promise<RefreshToken | undefined> {
    return (await collections.refreshTokens!.findOne({ token })) as unknown as RefreshToken;
  }

  public async create(refreshToken: RefreshToken): Promise<InsertOneResult<Document>> {
    return collections.refreshTokens!.insertOne(refreshToken);
  }
}
