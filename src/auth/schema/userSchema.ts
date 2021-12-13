import { Schema } from 'mongoose';

export const userSchema = new Schema({
  email: {
    type: 'String',
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: 'String',
    required: true,
    trim: true,
  },
  firstName: {
    type: 'String',
    required: true,
    trim: true,
  },
  lastName: {
    type: 'String',
    required: true,
    trim: true,
  },
});
