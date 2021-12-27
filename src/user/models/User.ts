import {
  Column, Entity, ObjectIdColumn,
  ObjectID,
} from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column({ unique: true })
  public email: string

  @Column()
  public password: string;

  @Column({ unique: true })
  public phone?: string;

  @Column({ enum: ['active', 'pending', 'blocked'], default: 'pending' })
  public status: string;

  constructor(
    id: ObjectID,
    email: string,
    password: string,
    status: string,
    phone?: string,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.status = status;
    this.phone = phone;
  }
}
