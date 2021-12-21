import { ObjectId } from 'mongodb';

export class User {
  constructor(
    public email: string,
    public password: string,
    public phone?: string,
    public _id?: ObjectId,
  ) {}
}
