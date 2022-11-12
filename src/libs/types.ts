import { Request } from 'express';
import { User } from '../entities/User';

export interface PostDoc {
  content: string;
  postId?: string;
}

export interface Image {
  url: string;
  id: string;
}

export interface IRequest extends Request {
  user?: User;
}
