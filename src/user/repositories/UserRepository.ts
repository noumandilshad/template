import { injectable } from 'inversify';
import { Document, InsertOneResult, ObjectId } from 'mongodb';
import { collections } from '../../common/MongoDbConnection';
import { User } from '../models/User';

@injectable()
export class UserRepository {
  public async findById(id: ObjectId): Promise<User | undefined> {
    return (await collections.users!.findOne(id)) as unknown as User;
  }

  public async findByPhoneNumber(phone: string): Promise<User | undefined> {
    return (await collections.users!.findOne({ phone })) as unknown as User;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return (await collections.users!.findOne({ email })) as unknown as User;
  }

  public async create(user: User): Promise<InsertOneResult<Document>> {
    return collections.users!.insertOne(user);
  }
}
