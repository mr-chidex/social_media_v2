import { Request } from 'express';

import { User } from '../entities/User';

export interface UserDoc {
  id?: string;
  username: string;
  email: string;
  password: string;
  profilePic?: { url: string; id: string };
  coverPic?: { url: string; id: string };
  isAdmin?: boolean;
  followers?: [];
  following?: [];
}

export interface PostDoc {
  content: string;
  image?: { url: string; id: string };
  likes: [];
  user: string;
}

export interface Image {
  url: string;
  id: string;
}

export interface IRequest extends Request {
  user?: { id: string; isAdmin: boolean };
}

export type UserDocument = UserDoc & User;
