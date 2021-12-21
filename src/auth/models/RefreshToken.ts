import {
  Entity, ObjectID, ObjectIdColumn, Column,
} from 'typeorm';

@Entity()
export class RefreshToken {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column({ unique: true })
  public token: string;

  @Column()
  public expiresAt: number;

  @Column()
  public userId: string;

  @Column()
  public revoked: boolean;

  constructor(
    id: ObjectID,
    token: string,
    expiresAt: number,
    userId: string,
    revoked: boolean,
  ) {
    this.token = token;
    this.expiresAt = expiresAt;
    this.userId = userId;
    this.revoked = revoked;
    this.id = id;
  }
}
