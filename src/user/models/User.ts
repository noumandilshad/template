import {
  Column, Entity, ObjectID, ObjectIdColumn,
} from 'typeorm';

@Entity()
export class User {
  @Column({ unique: true })
  public email: string

  @Column()
  public password: string;

  @Column({ unique: true })
  public phone?: string;

  @ObjectIdColumn()
  public id?: ObjectID

  constructor(
    email: string,
    password: string,
    phone?: string,
    id?: ObjectID,
  ) {
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.id = id;
  }
}
