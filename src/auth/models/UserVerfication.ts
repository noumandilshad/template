import {
  Entity, ObjectID, ObjectIdColumn, Column,
} from 'typeorm';

@Entity()
export class UserVerification {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public verificationCode: string;

  @Column()
  public expiresAt: number;

  @Column()
  public userId: string;

  @Column({ default: false })
  public isUsed: boolean;

  constructor(
    id: ObjectID,
    verificationCode: string,
    expiresAt: number,
    userId: string,
    isUsed: boolean,
  ) {
    this.verificationCode = verificationCode;
    this.expiresAt = expiresAt;
    this.userId = userId;
    this.isUsed = isUsed;
    this.id = id;
  }
}
